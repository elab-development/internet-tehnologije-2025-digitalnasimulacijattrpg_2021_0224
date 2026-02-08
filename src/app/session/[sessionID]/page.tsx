'use client'

import { useEffect, useState } from "react"
import { socket } from "../../socket"
import Player from "@/app/components/Player"

import { useParams } from 'next/navigation'
import { user } from "@/app/types"
import { useAuth } from "@/app/components/AuthProvider"

export default function Session() {
  const {status, user, logout} = useAuth()
  
  const {sessionID} = useParams()

  const [players, setPlayers] = useState(Array<user>)
  const [playerSent, setPlayerSent] = useState(false)

    useEffect(()=> {
      if (status === 'authenticated' && user && !playerSent) {
        socket.emit("player", user)
        setPlayerSent(true)
        socket.emit("joinCampaign", sessionID)
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
      players.map((player)=>(
        <Player u={player} />
      ))
  )
}