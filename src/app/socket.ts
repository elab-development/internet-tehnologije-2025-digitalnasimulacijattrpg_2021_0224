'use client'

import { randomUUID } from "crypto"
import { io } from "socket.io-client"


if (!localStorage.getItem("connectionID")) {
    localStorage.setItem("connectionID", randomUUID())
}

export const connectionID = localStorage.getItem("connectionID")


export const socket = io({
    auth: {
        connectionID: connectionID
    }
})