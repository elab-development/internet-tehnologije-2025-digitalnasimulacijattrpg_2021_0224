'use client'

import { io, Socket } from "socket.io-client"
import { useAuth } from "./AuthProvider"
import { createContext, useContext, useEffect, useState } from "react"


const SocketContext = createContext<Socket | null>(null)


export function SocketManager({children}:{children: React.ReactNode}) {
    const {status, user, logout} = useAuth()
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(()=>{
        if (user && status === 'authenticated') {
            const s = io({
                auth: {
                    uid: user.id
                }
            })
            setSocket(s)
            return () => {
                s.off()
                s.close()
                setSocket(null)
            }
        }

        setSocket(prev => {
            if (prev) {
                prev.off()
                prev.close()
            }
            return null
        })
    }, [user, status])
    
    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

export function useSocket() {
  const socket = useContext(SocketContext)
  if (socket === undefined) throw new Error("useSocket must be used inside SocketProvider")
  return socket
}