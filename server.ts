import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({dev, hostname, port})
const handler = app.getRequestHandler()

let sessions : Array<string> = []

app.prepare().then(() => {
    const httpServer = createServer(handler)

    const io = new Server(httpServer)

    io.on("connection", (socket) => {
        console.log(socket.id + " logged in")
        socket.emit("pisi", "dobrodosao")
        socket.on("joinCampaign", (campaign) => {
            socket.rooms.forEach(room => socket.leave(room))
            if (!sessions.includes(campaign)) {
                sessions.push(campaign)
                console.log("> New session started.")
                console.log("> Active sessions: " + sessions)
            }
            socket.emit("pisi", "test")
            socket.join(campaign)
            //console.log(io.sockets.adapter.rooms)
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