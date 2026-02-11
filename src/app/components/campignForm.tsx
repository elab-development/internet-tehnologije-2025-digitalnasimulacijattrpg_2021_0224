import { campaign } from "../types";
import { UUID } from "crypto";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

interface campaignProps {
    campaign : campaign | undefined
}

export default function CampignForm({ campaign } : campaignProps) {
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
        
    };
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const {status, user, logout} = useAuth();
    
    const disabled = (campaign != undefined)

    return (
        <form className="flex flex-col w-full max-w-md mx-auto gap-3">
            {/* flex flex-col m-2 w-1/3 items-center */}
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
            <label className="border mt-2">{campaign.dateStart.toString()}</label>
            }
            {!disabled &&
            <button onClick={()=>{user!=null?
                createNewCampagin(title,description,user.id):
                console.log("User je iz nekog razloga null");
            }} className="border mt-2 w-1/2 hover:bg-pink-500">Kreiraj</button>
            }
        </form>
    )
}