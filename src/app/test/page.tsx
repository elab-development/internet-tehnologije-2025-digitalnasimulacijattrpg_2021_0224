'use client'

import CampignForm from "../components/campignForm"
import CharSheetForm from "../components/charSheetForm"
import { socket } from "../socket"
import { campaign, charSheet } from "../types"

export default function Test() {
    const test : charSheet = {
        id : "123e4567-e89b-12d3-a456-426614174000",
        name : "Test Lik",
        str : 5,
        dex : 5,
        will : 10,
        armor : 5,
        hp : 5,
        currency : 11,
        owner : null,
    }
    const testCampaign : campaign = {
        id : "123e4567-e89b-12d3-a456-426614174000",
        name : "amf 015 prezivljavanje",
        description : "bol i patnja pakao i uzas muka i tuga",
        dateStart : new Date,
        gameMaster : null,
    }
    const onClick = () => {
        socket.emit("joinCampaign", "Campaign 1")
    }
    const onClick2 = () => {
        socket.emit("joinCampaign", "Campaign 2")
    }
    socket.on("pisi", (msg) => {
        console.log(msg)
    })
    return (
        <div className="flex flex-row justify-center">
            <CampignForm campaign={testCampaign}/>
            <CharSheetForm char={test}/>
            <button className="hover:text-pink-500 border active:text-transparent" onClick={onClick}>Join Campaign 1</button>
            <button className="hover:text-pink-500 border active:text-transparent" onClick={onClick2}>Join Campaign 2</button>
        </div>
    )
}