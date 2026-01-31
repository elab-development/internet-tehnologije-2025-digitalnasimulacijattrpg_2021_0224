'use client'

import Image from "next/image";
import { useState } from "react";

export default function Kockice() {

    function rand() {
        return Math.floor(Math.random()*6 + 1)
    } 

    const [value, setValue] = useState(rand());
    const [value2, setValue2] = useState(rand());

    const [diceRolled, setDiceRolled] = useState(false);

    return (
        <div className="flex flex-col items-center m-1">
            {diceRolled && // mrzim ovu sintaksu svim svojim bicem
                <div className="kockice flex flex-row">
                    <Kockica val={value}/>
                    <Kockica val={value2}/>
                    {
                    //ovde se moze prikazati da li je skill chek prosao ili ne kada je u kampanji i DM postavi vrednost
                    }
                </div>
            }
            <button className="border p-1 hover:text-pink-500 active:text-transparent" onClick={()=>{
                setDiceRolled(true);
                setValue(rand())
                setValue2(rand())
            }}>Roll</button>
        </div>
    );

}

function Kockica(props : any) {

    const path : string = "/images/kockica/" + props.val + ".png";
    console.log(path);

    return (
        <Image
            src={path}
            alt="kockica"
            width={50}
            height={50}
            className="p-1"
        />
    );
}