import { createServer } from "node:http"
import next from "next"
import { Server, Socket } from "socket.io"
import { db } from "./src/db/index.ts"
import { campaignDocumentsTable, campaignPlayersCharSheetsTable, campaignPlayersTable, campaignsTable, charSheetsTable, documentsTable, notesTable, usersTable } from "./src/db/schema.ts"
import { eq } from "drizzle-orm"

type UUID = `${string}-${string}-${string}-${string}-${string}` | string

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({dev, hostname, port})
const handler = app.getRequestHandler()

// types

//export enum fileType {
//    pdf,
//    png,
//    jpeg,
//}

export type player = {
    id : UUID,
    username: string,
    charSheet: charSheet,
    online: boolean,
}

export type DM = {
    id : string,
    username: string,
}

export type campaign = {
    id : UUID,
    name : string,
    description : string,
    dateStart : Date,
    gameMaster : DM,
    players : Array<player>,
    documents : Array<document>,
}

export type document = {
    id : UUID,
    name : string,
    type : string,
    filepath : string,
}

export type charSheet = {
    id : UUID,
    name : string,
    str : number,
    dex : number,
    will : number,
    armor : number,
    hp : number,
    currency : number,
    notes : Array<note>
}

export type note = {
    id : UUID,
    content : string,
}

let sessions = new Map<UUID, campaign>()
let clients = new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>()
let rooms = new Map<string, Set<string>> // campaignID, connectionID[]
let clientRooms = new Map<string, string> // connectionID, campaignID

app.prepare().then(() => {
    const httpServer = createServer(handler)

    const io = new Server(httpServer)

    io.on("connection", (socket) => {

        const connectionID = socket.handshake.auth.sessionID
        clients.set(connectionID, socket)

        // kada se user konektuje gleda se da li je u kampanji ili na homepage-u
        // - ako je na homepage-u salje mu se info o aktivnim kampanjama kojima se moze prikljuciti
        // - ako je u sesiji
        //      - verifikuje se da li sme da joj bude prikljucen
        //      - razmena podataka logika

        console.log(socket.id + " connected")
        socket.on("startSession", async (campaignID : UUID, dmID : UUID) => {
            console.log("\n\n\n==============================")
            console.log("\t> startSession: campaignID:", campaignID, " dmID: ", dmID)
            if (sessions.has(campaignID)) {
                //handle
                socket.emit("redirect", "sessionGM/"+campaignID)
                return
            }
            const db_campaign: any[] = await db.select()
                .from(campaignsTable)
                .where(eq(campaignsTable.id, campaignID))
            if (db_campaign.length == 0) {
                //handle
                return
            }
            const cmp = db_campaign[0] 
            if (cmp.gameMaster != dmID) {
                //handle
                return
            }
            const db_gm = await db.select()
                .from(usersTable)
                .where(eq(usersTable.id, dmID))
            if (db_gm.length == 0) {
                //handle
                return
            }
            const gm : DM = {
                id : dmID,
                username : db_gm[0].username,
            }
            const db_players: any[] = await db.select()
                .from(campaignPlayersTable)
                .innerJoin(usersTable, eq(campaignPlayersTable.player, usersTable.id))
                .where(eq(campaignPlayersTable.capmaign, campaignID))
            let players: Array<player> = await Promise.all(
                db_players.map(async row => {
                const db_charSheet: any[] = await db.select()
                    .from(campaignPlayersCharSheetsTable)
                    .innerJoin(charSheetsTable, eq(campaignPlayersCharSheetsTable.campaign, campaignID) && eq(campaignPlayersCharSheetsTable.player, row.User.id))
                const cs = db_charSheet[0].CharSheet
                const db_notes: any[] = await db.select()
                    .from(notesTable)
                    .where(eq(notesTable.writtenIn, cs.id))
                let notes: Array<note> = db_notes.map(row => {
                    return {
                        id: row.id,
                        content: row.content,
                    }
                })
                let char_sheet: charSheet = {
                    id: cs.id,
                    name: cs.name,
                    str: cs.str,
                    dex: cs.dex,
                    will: cs.will,
                    armor: cs.armor,
                    hp: cs.hp,
                    currency: cs.currency,
                    notes: notes,
                }
                return {
                    id: row.User.id,
                    username: row.User.username,
                    charSheet: char_sheet,
                    online: false,
                }
            }))

            const db_documents: any[] = await db.select()
                .from(campaignDocumentsTable)
                .innerJoin(documentsTable, eq(campaignDocumentsTable.capmaign, campaignID))
            let documents : Array<document> = db_documents.map(row => {
                return {
                    id: row.Document.id,
                    name: row.Document.name,
                    type: row.Document.type,
                    filepath: row.Document.filepath,
                }
            })

            let campaign : campaign = {
                id : cmp.id,
                name : cmp.name,
                description : cmp.description,
                dateStart : cmp.dateStart!,
                gameMaster : gm,
                players : players,
                documents: documents
            }

            sessions.set(campaignID, campaign)
            addToRoom(campaignID, connectionID)
            socket.emit("redirect", "sessionGM/"+campaignID)
            emitToRoom(campaignID, "update", sessions.get(campaignID))
        })
        socket.on("joinSession", (campaignID : UUID, playerID : UUID) => {
            console.log("\t\t>join")
            if (!sessions.has(campaignID)) {
                console.log("\t\t> nema sesije")
                // handle
                return
            }
            let playerIndex = playerInCampaign(playerID, campaignID)
            console.log("\t\t> " + playerIndex)
            if (playerIndex == -1) {
                // handle
                return
            }
            console.log("\t> Session join request: \n\t\tcampaign: " + sessions.get(campaignID)?.name + "\n\t\tplayer: " + sessions.get(campaignID)?.players.at(playerIndex))
            sessions.get(campaignID)!.players.at(playerIndex)!.online = true
            for (let room in rooms) {
                removePlayerFromSession(playerIndex, room)
                remvoveFromRoom(room, connectionID)
            }
            addToRoom(campaignID, connectionID)
            socket.emit("redirect", "session/"+campaignID)
            emitToRoom(campaignID, "update", sessions.get(campaignID))
            console.log("\t> ", sessions.get(campaignID)?.players.at(playerIndex)?.username, " joined ", sessions.get(campaignID)?.name)
            console.log(sessions)
        })
        socket.on("leaveSession", (campaignID : UUID, playerID : UUID) => {
           // let playerIndex = playerInCampaign(playerID, campaignID)
           // if (playerIndex == -1) {
           //     // handle
           //     return
           // }
           // removePlayerFromSession(playerIndex, campaignID)
           // socket.leave(campaignID)
           // socket.emit("redirect", "/home")
           // emitToRoom(campaignID, "update", sessions.get(campaignID))
        })
        socket.on("abortSession", (campaignID : UUID, gmID : UUID) => {
           // if (sessions.get(campaignID)?.gameMaster.id !== gmID) {
           //     //handle
           //     return
           // }
           // let socketIDs = io.sockets.adapter.rooms.get(campaignID)
           // for (let socketID in socketIDs) {
           //     io.sockets.sockets.get(socketID)?.leave(campaignID)
           //     socket.emit("redirect", "/home")
           // }
           // sessions.delete(campaignID)
           // emitToRoom(campaignID, "update", sessions.get(campaignID))
        })
        socket.on("updateRequest", () => {
            console.log("\t\t> update request")
            clients.get(connectionID)?.emit("update", sessions.get(clientRooms.get(connectionID)!))
        })
    })

    httpServer
        .once("error", (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`Server online na https://${hostname}:${port}`)
        })
})

function playerInCampaign(playerID : UUID, campaignID : UUID) {
    // ja mrzim ovaj kod zasto ne mogu da uradim return kada nadjem ono sto sam trazio
    // ZASTO RETURN LOMI PETLJU UMESTO DA GASI FUNKCIJU OVO JE NAJGORI JEZIK IKADA
    let indeks : number = -1
    sessions.get(campaignID)?.players.forEach((player, index) => {
        console.log("\t\t\t> ",player.id, playerID)
        if (player.id === playerID) {
            indeks = index
        }
    })
    return indeks
}

function removePlayerFromSession(playerIndex : number, campaignID : any) {
    sessions.get(campaignID)!.players.at(playerIndex)!.online = false
}

function emitToRoom(roomID : string, event : string, ...args : any[]) {
    rooms.get(roomID)?.forEach((connectionID) => {
        clients.get(connectionID)?.emit(event, ...args)
    })
}

function addToRoom(roomID : string, connectionID : string) {
    if (!rooms.has(roomID)) {
        rooms.set(roomID, new Set<string>())
    }
    rooms.get(roomID)?.add(connectionID)
    clientRooms.set(connectionID, roomID)
}

function remvoveFromRoom(roomID : string, connectionID : string) {
    rooms.get(roomID)?.delete(connectionID)
    clientRooms.delete(connectionID)
}