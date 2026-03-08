import { JSX, useState } from "react";
import { player } from "../../../../server";
import CharSheetDisplay from "./charSheetDisplay";
import Kockice from "../kockice";


interface playerProps {
    p: player,
    dm: boolean,
    btnSkillCheck : (p : player) => void
}


export default function Player({p, dm, btnSkillCheck} : playerProps) {
    const [showCharSheet, setShowCharSheet] = useState<boolean>(false)
    const [showSkillCheck, setShowSkillCheck] = useState<boolean>(false)

    const colorBgOffline = "bg-pink-900"
    const colorTextOffline = "text-pink-950"

    const renderPlayerCharSheet = () => {
        return (
            <><CharSheetDisplay cs={p.charSheet}/>
            {dm && p.online && <button className="border pl-2 pr-2 font-bold
                w-full mt-1 p-2
                hover:text-pink-500
                active:text-transparent"
                onClick={()=>{
                    setShowCharSheet(!showCharSheet)
                    btnSkillCheck(p)
                }}
            >Skill Check!</button>}</>
        )
    }

    const renderSkillCheck = () => {
        return (
            <Kockice />
        )
    }

    return (
        <div className="relative inline-block">
        {showCharSheet && <Popup 
            popupToggle={() => {setShowCharSheet(!showCharSheet)}}
            Content={renderPlayerCharSheet}
        />}
        <div className={`flex flex-col border p-1 gap-1 text-center
            ${ p.online
                ? "bg-black text-white"
                : "bg-pink-900 text-pink-950"
            }`
        }>
            <button className="border pl-2 pr-2 font-bold
            hover:text-pink-500
            active:text-transparent"
            onClick={()=>{setShowCharSheet(!showCharSheet)}}
            >{p.charSheet?.name}</button>
            <p className="border pl-2 pr-2">{p.username}</p>
        </div>
        </div>
    )
}

interface popupProps {
    popupToggle : () => void,
    Content : () => any
}

function Popup({popupToggle, Content} : popupProps) {
    return (
        <div className="popup bg-black
            absolute left-1/2 -translate-x-1/2 bottom-full mb-9
            min-w-40
            p-1 border
        ">
            {<Content />}
            <div className="triangle -z-1
                absolute left-1/2 -translate-x-1/2 -bottom-4
                w-8 h-8 rotate-45
                bg-black
                border-r border-b
            ">
                <p className="absolute inset-0 flex items-center justify-center
                    -rotate-45 translate-y-1 translate-x-1
                    hover:text-pink-500
                    active:text-transparent"
                    onClick={popupToggle}
                >x</p>
            </div>
        </div>
    )
}