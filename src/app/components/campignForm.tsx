import { campaign, charSheet } from "../types";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import {socket} from "../socket"
import CharSheetForm from "./charSheetForm.tsx";
import Container from "./Container.tsx";

interface campaignProps {
    campaign : campaign | undefined,
    gm:boolean,
    invited:boolean,
}

export default function CampignForm({ campaign,gm,invited } : campaignProps) {
    async function createNewCampagin(name:string,description:string,gameMaster:UUID) {
        const res=await fetch("/api/newCampagin",{
            method:"POST",
            headers:{
          "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                gameMaster,
            }),
        });
        if(!res.ok){
            throw new Error("ne rade stvari, prbolem u fetch kod home page");
        }
        
    }
    async function fetchLjudi(){//uzima aktivne igrace iz CP
         const res = await fetch(`/api/playersInCampagin?campaginId=${campaign?.id}`, {
        credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Ne radi fetch, problem pri uzimaju igraca kampanje");
        }

        return res.json();
    }
    async function killPlayer(playerId:UUID){//uklanja igraca sa sesije
        const res=await fetch(`/api/removePlayer?playerId=${playerId}`, {
        credentials: "include",
        method:"DELETE"

        });
        if(!res.ok){
            throw new Error("Neuspesno uklonjen igrac iz kampanje")
        }
    }
    type user={
        id:UUID,
        username:string
    }
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const {status, user, logout} = useAuth();
    const [players,setPlayers]=useState<user[]>([]);
    const [toggleAddChar,setToggleAddChar]=useState<boolean>(false);
    const [invite,setInvite]=useState<boolean>(invited)
    
    const disabled = (campaign != undefined)

    useEffect(()=>{
        if(status==="authenticated"&&user!=null){
        if(disabled){
        fetchLjudi()
      .then(data => {
        setPlayers(data);
      })
      .catch(err => {
      });
        }
    }
    },[invite])

    return (
        <form className="flex flex-col w-full max-w-md mx-auto gap-3">
            <input
                className="w-full border p-2 rounded"
                type="text"
                placeholder="Naziv"
                defaultValue={campaign!=undefined ? campaign.name : ""}
                disabled={disabled}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
                placeholder="Opis"
                className="w-full border p-2 rounded min-h-[200px] resize-none"
                defaultValue={campaign!=undefined ? campaign.description : ""}
                disabled={disabled}
                onChange={(e) => setDescription(e.target.value)}
            />

            {disabled &&
              <label className="border mt-2 items-center" >{new Date(campaign!.dateStart).toLocaleDateString("sr-RS")}</label>
            }
            {!disabled &&
            <button onClick={()=>{user!=null?
                createNewCampagin(title,description,user.id):
                console.log("User je iz nekog razloga null");
            }} className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
            }
            {disabled &&
            <button type="button" onClick={()=>{user!=null?
                gm ? socket.emit("startSession", campaign.id, user.id) :
                invite ? setToggleAddChar(true) : //OVDE IDE POPUP LOGIKA ZA KARAKTERE
                 socket.emit("joinSession", campaign.id, user.id) :
                console.log("user je null iz nekog razloga kliknuto je dugme za sesiju");
            }} className="border mt-2 w-1/2 hover:bg-pink-500">{gm ? "Pokreni Sesiju" : invite ? "Dodaj karaktera" :"Udji u sesiju"}</button>
            }
            {disabled && 
                <div className="flex flex-col w-fit">
                    {players.length===0 ? <p>Kampanja nema igraca</p>:
                    players.map((player)=>(
                        <div
                         key={player.id}>{player.username}
                        {gm && (<button className="border mt-2 w-1/2 hover:bg-pink-500" onClick={()=>{killPlayer(player.id)}}>Zakolji svinje sekirom ga ubij</button>)}
                         </div>
                         
                    ))
                    }
                </div>
            }
            {(disabled && gm) &&
            <button className="border mt-2 w-1/2 hover:bg-pink-500">Dodaj igraca</button>
            // ovde se dodaje igrac
            }
            {toggleAddChar && (<FreeChar onClick={()=>{setToggleAddChar(false);setInvite(false)}}campaginId={campaign} user={user?.id}/>)}

            
        </form>
    )
}

type freeCharProps={
    user:UUID|undefined
    campaginId:campaign|undefined
    onClick: () => void;

}
function FreeChar({user,campaginId,onClick}:freeCharProps){
    

    async function getCharSheets():Promise<charSheet[]>{
        const res = await fetch(`/api/freeCharSheets?userId=${user}`,{
            credentials:"include",
            method:"GET"
        })
        if(!res.ok){
            throw new Error("Neuspesno izvuceni karakteri")
        }
        return res.json()
    }
    async function selectSheet(sheetId:UUID){
        const res=await fetch(`/api/assaignCharSheet`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                campaginid:campaginId?.id,
                playerid:user,
                sheetId:sheetId
            })
        })
    }
    useEffect(()=>{
        getCharSheets()
      .then(sheets=>{
        setSheets(sheets);
      });
    },[])
    const [sheets,setSheets]=useState<charSheet[]>([])
    const [selectedSheet,setSelectedSheet]=useState<charSheet>()
    const [toggle,setToggle]=useState<boolean>(true)    

    useEffect(()=>{
        if(selectedSheet){
            selectSheet(selectedSheet.id)
            setToggle(false);
            onClick();
        }
    },[selectedSheet])
    return(
        <>
        {toggle &&
        <div className="lejautVerovatno">
            <div>
                {sheets.length===0?(<p>Nema slobodnih karaktera</p>):(
                    sheets.map((sheet)=>(
                        <Container key={sheet.id}id={sheet.id} name={sheet.name} onClick={()=>setSelectedSheet(sheet)}></Container>
                    ))
                )}
            </div>

        </div>
        }
        </>
    )
}