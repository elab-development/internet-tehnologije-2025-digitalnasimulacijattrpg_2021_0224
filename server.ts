import { createServer } from "node:http"
import next from "next"
import { Server, Socket } from "socket.io"
import { db } from "./src/db/index.ts"
import { campaignDocumentsTable, campaignPlayersCharSheetsTable, campaignPlayersTable, campaignsTable, charSheetsTable, documentsTable, notesTable, usersTable } from "./src/db/schema.ts"
import { and, eq } from "drizzle-orm"

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
    online: boolean
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
// btw ovaj DefaultEventsMap ne moze da se importuje i beskonacno ce davati error u kodu...
// ... kompajlira se bez problema ...
// ... ako se uradi import kompajliranje fejluje jer DefaultEventMap export ne postoji ...
let clients = new Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>()
let rooms = new Map<string, Set<string>> // campaignID, uid[]
let clientRooms = new Map<string, string> // uid, campaignID

app.prepare().then(() => {
    const httpServer = createServer(handler)

    const io = new Server(httpServer)

    io.on("connection", (socket) => {

        const uid = socket.handshake.auth.uid
        console.log("\t> soket konektovan, uid:", uid)
        clients.set(uid, socket)

        // kada se user konektuje gleda se da li je u kampanji ili na homepage-u
        // - ako je na homepage-u salje mu se info o aktivnim kampanjama kojima se moze prikljuciti
        // - ako je u sesiji
        //      - verifikuje se da li sme da joj bude prikljucen
        //      - razmena podataka logika

        socket.on("startSession", async (campaignID : UUID, dmID : UUID) => {
            console.log("\n\n==============================")
            console.log("\t> startSession:\n\t\tcampaignID:", campaignID, "\n\t\tdmID: ", dmID)
            if (sessions.has(campaignID)) {
                //handle
                socket.emit("redirect", "session/"+campaignID)
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
                online : false
            }
            const db_players = await db.select()
                .from(campaignPlayersTable)
                .innerJoin(usersTable, eq(campaignPlayersTable.player, usersTable.id))
                .where(eq(campaignPlayersTable.capmaign, campaignID))
            let players: Array<player> = await Promise.all(
                db_players.map(async row => {
                const db_charSheet: any[] = await db.select()
                    .from(charSheetsTable)
                    .innerJoin(campaignPlayersCharSheetsTable, eq(charSheetsTable.id, campaignPlayersCharSheetsTable.charSheet))
                    .where(
                        and(
                            eq(campaignPlayersCharSheetsTable.campaign, campaignID),
                            eq(campaignPlayersCharSheetsTable.player, row.User.id)
                        )
                    )
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
            addToRoom(campaignID, uid)
            socket.emit("redirect", "session/"+campaignID)
            console.log("==============================")
        })
        socket.on("joinSession", (campaignID : UUID, playerID : UUID) => { // BUG
            console.log("\n\n==============================")
            console.log("\t> joinSession:\n\t\tcampaignID:", campaignID, "\n\t\tplayerID: ", playerID)
            if (!sessions.has(campaignID)) {
                console.log("\t\t\t> kampanja nije aktivna")
                // handle
                return
            }
            let playerIndex = playerInCampaign(playerID, campaignID)
            if (playerIndex == -1) {
                console.log("\t\t\t> igrac nije u kampanji")
                // handle
                return
            }
            addToRoom(campaignID, uid)
            socket.emit("redirect", "session/"+campaignID)
            console.log("==============================")
        })
        socket.on("joinSession2", () => {
            console.log("\n\n==============================")
            console.log("\t> join session 2")
            let campaignID = clientRooms.get(uid)!
            if (sessions.get(campaignID)?.gameMaster.id !== uid) {
                let playerIndex = playerInCampaign(uid, campaignID)
                console.log("\n\t\tcampaign: " + sessions.get(campaignID)?.name + "\n\t\tplayer: " + sessions.get(campaignID)?.players.at(playerIndex)?.username)
                sessions.get(campaignID)!.players.at(playerIndex)!.online = true
                for (let room in rooms) {
                    removePlayerFromSession(playerIndex, room)
                    removeFromRoom(room, uid)
                }
                console.log("\t> ", sessions.get(campaignID)?.players.at(playerIndex)?.username, " joined ", sessions.get(campaignID)?.name)
                console.log("\t> players in session:")
                sessions.get(campaignID)?.players.forEach((player) => {
                    console.log("\t\t", player.username)
                })
            } else {
                sessions.get(campaignID)!.gameMaster.online = true
            }
            emitUpdate(campaignID)
            console.log("==============================")
            console.log("\t\t> update request")
            clients.get(uid)?.emit("update", sessions.get(clientRooms.get(uid)!))
        })
        socket.on("disconnect", () => {
            console.log("\n\n==============================")
            console.log("\t> disconnect", uid)
            if (!clientRooms.has(uid)) {
                // handle
                return
            }
            let sessionID = sessions.get(clientRooms.get(uid)!)?.id
            let gm : DM = sessions.get(sessionID!)?.gameMaster!
            if (gm.id === uid && gm.online) {
                console.log("\t\t> abort session")
                abortSession(sessionID!) // NE RADI
            } else {
                disconnectPlayer(uid)
            }
            console.log("==============================")
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
    let indeks : number = -1
    sessions.get(campaignID)?.players.forEach((player, index) => {
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
    rooms.get(roomID)?.forEach((uid) => {
        clients.get(uid)?.emit(event, ...args)
    })
}

function emitUpdate(roomID : string) {
    const session = sessions.get(roomID)
    console.log("\t> sending state update to", session?.name)
    console.log("\t\tklijenti u sobi", rooms.get(roomID))
    rooms.get(roomID)?.forEach((client) => {
        clients.get(client)?.emit("update", session)
        console.log("\t\tsent to", client)
    })
}

function addToRoom(roomID : string, uid : string) {
    if (!rooms.has(roomID)) {
        rooms.set(roomID, new Set<string>())
    }
    rooms.get(roomID)?.add(uid)
    clientRooms.set(uid, roomID)
    console.log("\t> klijent", uid, "dodat u sobu", roomID)
    console.log("\t\trooms", rooms)
    console.log("\t\tclientRooms")
}

function removeFromRoom(roomID : string, uid : string) {
    rooms.get(roomID)?.delete(uid)
    clientRooms.delete(uid)
}

function disconnectPlayer(uid : string) {
    let campaignID = clientRooms.get(uid)!
    let playerIndex = playerInCampaign(uid, campaignID)
    if (playerIndex == -1) {
        // handle
        return
    }
    if (!sessions.get(campaignID)?.players.at(playerIndex)?.online) {
        return
    }
    removePlayerFromSession(playerIndex, campaignID)
    removeFromRoom(campaignID, uid)
    console.log("player removed", uid)
    emitUpdate(campaignID)
    console.log("==============================")
}

function abortSession(sessionID : string) {
    emitToRoom(sessionID, "redirect", "/home")
    sessions.get(sessionID)?.players.forEach((player) => {
        disconnectPlayer(player.id)
    })
    sessions.delete(sessionID)
}