'use client'

import { useEffect, useState } from "react"
import { connectionID, socket } from "../../socket"
import Player from "../../components/Player" 
import { campaign, player } from "../../../../server"
import { useAuth } from "../../components/AuthProvider"
import "./session.css"
import CharSheetForm from "../../components/charSheetForm"

export default function Session() {
  const {status, user, logout} = useAuth()

  const [state, setState] = useState<campaign>()
  const [player, setPlayer] = useState<player>()

    useEffect(()=> {
      if (status === 'authenticated' && user) {
        console.log("use effect")
        socket.emit("updateRequest")
        console.log("update req emitovan")
        socket.on("update", (campaign : campaign) => {
          setState(campaign)
          let p = undefined
          campaign?.players.forEach((player) => {
            console.log(player.id, user.id)
            if (player.id == user.id) {
              p = player
              console.log(p)
              return
            }
          })
          setPlayer(p)
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
      <div className="listaIgraca flex flex-row align-right bg-black" >
        {state?.players.map((player)=>(
          player.id !== user?.id &&<Player p={player}></Player>
        ))}
      </div>
      </div>
      <div className="desno bg-red-500">
        <div className="notes bg-pink-500">Zabeleske</div>
        <div className="karakter bg-black">
          <p className="border p-1 text-center font-bold mb-1">{player?.charSheet.name}</p>
          <div className="flex flex-row justify-evenly gap-1">
            <div className="flex flex-col gap-1 w-1/2">
              <p className="csdata border p-1 w-auto">str {player?.charSheet.str}</p>
              <p className="csdata border p-1 w-auto">dex {player?.charSheet.dex}</p>
              <p className="csdata border p-1 w-auto">will {player?.charSheet.will}</p>
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <p className="csdata border p-1 w-auto">ar {player?.charSheet.armor}</p>
              <p className="csdata border p-1 w-auto">hp {player?.charSheet.hp}</p>
              <p className="csdata border p-1 w-auto">cur {player?.charSheet.currency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}