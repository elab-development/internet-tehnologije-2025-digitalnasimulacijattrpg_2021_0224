'use client'

import { useEffect } from "react"
import { io } from "socket.io-client"
import { v4 } from "uuid"


if (!localStorage.getItem("connectionID")) {
    localStorage.setItem("connectionID", v4())
}
export const connectionID = localStorage.getItem("connectionID")!
console.log(connectionID)

export const socket = io({
    auth: {
        connectionID: connectionID
    }
})