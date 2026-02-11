'use client'

import { useEffect, useState } from "react"
import { socket } from "../../socket"
import Player from "@/app/components/Player"

import { useParams } from 'next/navigation'
import { user } from "../../types"
import { useAuth } from "@/app/components/AuthProvider"

export default function Session() {
  const {status, user, logout} = useAuth()
  
  const {sessionID} = useParams()

  const [players, setPlayers] = useState(Array<user>)
  const [playerSent, setPlayerSent] = useState(false)

    useEffect(()=> {
      if (status === 'authenticated' && user && !playerSent) {
        socket.emit("joinCampaign", sessionID)
        socket.emit("player", user)
        setPlayerSent(true)
        socket.on("pisi", (msg) => {
          console.log(msg)
        })
        socket.on("updatePlayers", (players) => {
          setPlayers(players)
          console.log(players)
        })
      }
    })

  console.log(players)
  return (
    <div className="session p-1 border bt-0">
      <div className="players flex flex-col p-1 gap-1">
        {players.map((player)=>(<Player key={player.id} u={player} />))}
      </div>
    </div>
  )
}