import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"
import { UUID } from "node:crypto"
import { db } from "@/db"
import { campaignDocumentsTable, campaignPlayersCharSheetsTable, campaignPlayersTable, campaignsTable, charSheetsTable, documentsTable, notesTable, usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({dev, hostname, port})
const handler = app.getRequestHandler()

// types

enum fileType {
    pdf,
    png,
    jpeg,
}

type player = {
    id : UUID,
    username: string,
    charSheet: charSheet,
    online: boolean,
}

type DM = {
    id : string,
    username: string,
}

type campaign = {
    id : UUID,
    name : string,
    description : string,
    dateStart : Date,
    gameMaster : DM,
    players : Array<player>,
    documents : Array<document>,
}

type document = {
    id : UUID,
    name : string,
    type : fileType,
    filepath : string,
}

type charSheet = {
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

type note = {
    id : UUID,
    content : string,
}

let sessions = new Map<UUID, campaign>()
let players = new Map<string, any>()

app.prepare().then(() => {
    const httpServer = createServer(handler)

    const io = new Server(httpServer)

    io.on("connection", (socket) => {

        // kada se user konektuje gleda se da li je u kampanji ili na homepage-u
        // - ako je na homepage-u salje mu se info o aktivnim kampanjama kojima se moze prikljuciti
        // - ako je u sesiji
        //      - verifikuje se da li sme da joj bude prikljucen
        //      - razmena podataka logika

        console.log(socket.id + " logged in")
        socket.emit("pisi", "dobrodosao")
        socket.on("player", async (user) => {
            console.log("player joined ", user.username)
            if (user === null) {
                return
            }
            if (!players.has(socket.id)) {
                players.set(socket.id, user)
            }
            console.log("player/rooms", socket.id, socket.rooms)
            const room = Array.from(socket.rooms)[0]
            const socketsInRoom = Array.from(await io.in(room).fetchSockets())
            const playersInRoom = socketsInRoom
                .filter(soket => players.has(soket.id))
                .map(soket => players.get(soket.id))
            console.log("players in room", room, ":", playersInRoom)
            io.to(room).emit("updatePlayers", playersInRoom)
            io.to(room).emit("pisi", "test")
        })
        socket.on("startSession", async (campaignID : UUID, dmID : UUID) => {
            if (sessions.has(campaignID)) {
                //handle
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
            socket.join(campaignID)
            // emit page redirect
            socket.emit("redirect")
            io.to(campaignID).emit("update", sessions.get(campaignID))
        })
        socket.on("joinSession", (campaignID : UUID, playerID : UUID) => {
            // proveri da li je kampanja pokrenuta
            // proveri da li igrac sme biti u njoj
            // dodaj ga u sobu
            // state update
            // emit state update


           // if (!sessions.includes(campaign)) {
           //     sessions.push(campaign)
           //     console.log("> New session started.")
           //     console.log("> Active sessions: " + sessions)
           // }
           // socket.join(campaign)
           // console.log("> Player " + socket.id + " joined " + campaign)
           // io.to(campaign).emit("pisi", "dobrodosao u " + campaign)
        })
        socket.on("leaveSession", (campaignID : UUID, playerID : UUID) => {
            // izbaci datog usera iz date sobe
        })
        socket.on("abortSession", (campaignID : UUID, playerID : UUID) => {
            // izbaci sve iz date sobe
            // obrisi datu kampanju iz mape
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