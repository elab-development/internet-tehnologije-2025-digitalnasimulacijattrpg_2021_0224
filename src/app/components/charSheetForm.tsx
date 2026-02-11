import { charSheet } from "../types"
import { UUID } from "crypto";
import { use, useState, SubmitEvent } from "react";
import { useAuth } from "./AuthProvider";
import { integer } from "drizzle-orm/gel-core";

interface charSheetProps {
    char : charSheet | undefined
}
interface Poljeprops{
    name:string;
    value:string;
    disabled: boolean;
    onChage: React.ChangeEventHandler<HTMLInputElement>;
}

export default function CharSheetForm({ char } : charSheetProps) {
        async function createNewCharSheet(name:string,str:number,dex:number,will:number,armor:number,hp:number,currency:number,owner:UUID) {
            const res=await fetch("/api/newCharSheet",{
                method:"POST",
                headers:{
              "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    str,
                    dex,
                    will,
                    armor,
                    hp,
                    currency,
                    owner,
                }),
            });
            if(!res.ok){
                throw new Error("ne rade stvari, prbolem u fetch kod home page");
            }
            
        };
            const[name,setName]=useState("");
            const[str,setStr]=useState("");
            const[dex,setDex]=useState("");
            const[will,setWill]=useState("");
            const[armor,setArmor]=useState("");
            const[hp,setHp]=useState("");
            const[currency,setCurrency]=useState("");
            
            const {status, user, logout} = useAuth();
            // const handleSubmit =async (e:SubmitEvent)=>{
            //     e.preventDefault();
            //     const res=await 
            // }
    const disabled = (char != undefined)
    return (
        <form className="flex flex-col m-2 w-1/4 items-center" > 
            {/* handleSubmit */}
            <input 
                type="text"
                placeholder="Ime"
                defaultValue={char!=undefined ? char.name : ""}
                disabled={disabled}
            />
            <div className="flex flex-row iems-center gap-5">
                <div className="flex flex-col">
                    <Polje  name="STR" value={char!=undefined ? char.str.toString() : ""} disabled={disabled} onChage={(e)=>{setStr(e.target.value)}}/>
                    <Polje name="DEX" value={char!=undefined ? char.dex.toString() : ""} disabled={disabled} onChage={(e)=>{setDex(e.target.value)}}/>
                    <Polje name="WILL" value={char!=undefined ? char.will.toString() : ""} disabled={disabled} onChage={(e)=>{setWill(e.target.value)}}/>
                </div>
                <div className="flex flex-col">
                    <Polje name="AR" value={char!=undefined ? char.armor.toString() : ""} disabled={disabled} onChage={(e)=>{setArmor(e.target.value)}}/>
                    <Polje name="HP" value={char!=undefined ? char.hp.toString() : ""} disabled={disabled} onChage={(e)=>{setHp(e.target.value)}}/>
                    <Polje name="CUR" value={char!=undefined ? char.currency.toString() : ""} disabled={disabled} onChage={(e)=>{setCurrency(e.target.value)}}/>
                </div>
            </div>
            {!disabled &&
            <button onClick={()=>{
                if(user!=null){
                console.log(name,str,dex,will,armor,hp,currency,user);
                createNewCharSheet(name,+str,+dex,+will,+armor,+hp,+currency,user.id);
                }else{
                    console.log("user je iz nekog razloga null");

                }
            }} className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
            }
        </form>
    );
}

function Polje({name,value,disabled,onChage}:Poljeprops) {
    return (
        <div className="flex flex-row items-center mt-2 text-right justify-center">
            <p className="flex-2 mr-1">{name}</p>
            <input className="flex-1" defaultValue={value} disabled={disabled} onChange={onChage}></input>
        </div>
    )
}