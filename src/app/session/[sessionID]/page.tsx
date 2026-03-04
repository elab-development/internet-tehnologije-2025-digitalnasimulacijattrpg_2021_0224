'use client'

import { useEffect, useState } from "react"
import { socket } from "../../socket"
import Player from "../../components/Player" 

import { useParams } from 'next/navigation'
import { user } from "../../types"
import { useAuth } from "../../components/AuthProvider"
import "./session.css"
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
  //   <div className="session p-1 border bt-0">
  //     <div className="players flex flex-col p-1 gap-1">
  //       {players.map((player)=>(<Player key={player.id} u={player} />))}
  //     </div>
  //   </div>
  // )
      <div className="layout">
      <div className="levaStrana">
        <div className="kampanja bg-blue-500 ">
          <div className="naslov bg-white-500">sad ce da vidimo nesto</div>
        </div>
        <div className="dokument bg-green-500">Dva kostura se dogovarajy djir na motoru</div>
        <div className="listaIgraca bg-yellow-500" >GAMBATE</div>
        </div>
        <div className="sveDesno bg-red-500">
          <div className="notes bg-pink-500">Zabeleske</div>
          <div className="karakter bg-purple-500">Statistike o karakteru, kontam da moze da padne jedan CharSheetForm</div>
        </div>
      </div>
  )
}