'use client'

import { useEffect, useState } from "react"
import { connectionID, socket } from "../../socket"
import Player from "../../components/Player" 
import { campaign } from "../../../../server"
import { useAuth } from "../../components/AuthProvider"
import "./session.css"

export default function Session() {
  const {status, user, logout} = useAuth()

  const [state, setState] = useState<campaign>()

    useEffect(()=> {
      if (status === 'authenticated' && user) {
        console.log("use effect")
        socket.emit("updateRequest")
        console.log("update req emitovan")
        socket.on("update", (campaign) => {
          console.log("campaign", campaign)
          setState(campaign)
          console.log("state", state)
        })
      }
    }, [status, user])

  return (
    <div className="layout">
    <div className="levo">
      <div className="kampanja bg-blue-500 ">
        <div className="naslov bg-white-500">{state?.name}</div>
        <div className="opis">{state?.description}</div>
      </div>
      <div className="dokument bg-green-500">Dva kostura se dogovarajy djir na motoru</div>
      <div className="listaIgraca bg-yellow-500" >GAMBATE</div>
      </div>
      <div className="desno bg-red-500">
        <div className="notes bg-pink-500">Zabeleske</div>
        <div className="karakter bg-purple-500">Statistike o karakteru, kontam da moze da padne jedan CharSheetForm</div>
      </div>
    </div>
  )
}