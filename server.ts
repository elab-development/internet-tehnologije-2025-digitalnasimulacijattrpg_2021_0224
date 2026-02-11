import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({dev, hostname, port})
const handler = app.getRequestHandler()

let sessions : Array<string> = []
let players = new Map<string, any>()

app.prepare().then(() => {
    const httpServer = createServer(handler)

    const io = new Server(httpServer)

    io.on("connection", (socket) => {
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
        socket.on("joinCampaign", (campaign) => {
            socket.rooms.forEach(room => socket.leave(room))
            if (!sessions.includes(campaign)) {
                sessions.push(campaign)
                console.log("> New session started.")
                console.log("> Active sessions: " + sessions)
            }
            socket.join(campaign)
            console.log("> Player " + socket.id + " joined " + campaign)
            io.to(campaign).emit("pisi", "dobrodosao u " + campaign)
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