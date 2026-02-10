'use client'

import CampignForm from "../components/campignForm"
import CharSheetForm from "../components/charSheetForm"
import { socket } from "../socket"
import { campaign, charSheet, user } from "../types"

const ignjat:user = {
    id:"00000000-0000-0000-0000-000000000001",
    username: "ignjat",
}

const zli4leksa:user = {
    id:"00000000-0000-0000-0000-000000000000",
    username: "zli4leksa",
}

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
        owner : zli4leksa,
    }
    const testCampaign : campaign = {
        id : "123e4567-e89b-12d3-a456-426614174000",
        name : "amf 015 prezivljavanje",
        description : "bol i patnja pakao i uzas muka i tuga",
        dateStart : new Date,
        gameMaster : ignjat,
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