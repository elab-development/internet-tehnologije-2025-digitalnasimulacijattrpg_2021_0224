'use client'

import { useEffect, useState } from "react"
import { useSocket } from "../../components/socketManager"
import Player from "../../components/session/Player" 
import { campaign, player } from "../../../../server"
import { useAuth } from "../../components/AuthProvider"
import CharSheetDisplay from "../../components/session/charSheetDisplay"
import NoteDisplay from "../../components/session/noteDisplay"
import { NavBar } from "../../components/navbar"

export default function Session() {
  const {status, user, logout} = useAuth()
  const socket = useSocket()

  const [state, setState] = useState<campaign>()
  const [player, setPlayer] = useState<player | null>()

  useEffect(()=> {
    if (status === 'authenticated' && user && socket) {
      socket.emit("updateRequest")
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
        if (campaign.gameMaster.id === user.id) {
          p = null
        }
        setPlayer(p)
      })
    }
  }, [status, user, socket])

  return (
    <div className="page flex flex-col h-screen w-screen fixed">
      <NavBar />
      <div className="body flex flex-row h-full border border-t-0">
        <div className="left flex flex-col justify-between w-3/4">
          <div className="campaign bg-black">
            <div className="naslov font-extrabold text-4xl text-center border border-r-0 p-2">{state?.name}</div>
            <div className="opis border border-t-0 border-r-0 p-2 text-justify">{state?.description}</div>
          </div>
          <div className="documents">Dva kostura se dogovarajy djir na motoru</div>
          <div className="players flex flex-row justify-end bg-black gap-1" >
            {state?.players.map((pl)=>(
              pl.id !== user?.id
              && <Player key={pl.id} p={pl} dm={player === null} />
            ))}
          </div>
        </div>
        <div className="right border-l flex flex-col justify-between w-1/4">
          <div className="notes flex flex-col gap-1 bg-black p-1 border">
            <p className="font-bold text-center border">notes</p>
            {player?.charSheet.notes.map((note) => (
              <NoteDisplay key={note.id} n={note}/>
            ))}
            <button className="btnAddNote border font-bold hover:text-pink-500">dodaj belesku</button>
          </div>
          {player !== null
            && <CharSheetDisplay cs={player?.charSheet} />}
        </div>
      </div>
    </div>
  )
}