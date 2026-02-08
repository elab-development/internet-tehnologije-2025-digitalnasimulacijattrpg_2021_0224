'use client'
import {useState} from 'react'
import Container from '../components/Container'
import './home.css'
import {db} from "@/db";
import {usersTable } from '@/db/schema';//vrlo verovatno mi ne treba
import { campaignsTable } from '@/db/schema'; 
import { charSheetsTable } from '@/db/schema';
import { campaign } from '../types';
import { charSheet } from '../types';
import { UUID } from 'crypto';
import { useAuth } from "../components/AuthProvider";
import { eq } from 'drizzle-orm';



interface ContainerData{
    id:UUID;
    name:string;
    onClick:()=>void;
}
    const {status, user, logout} = useAuth()
    if(!user?.id){
        throw new Error("nema usera");
    }

const rowcs:any[]=await db.select().from(charSheetsTable).where(eq(charSheetsTable.owner, user.id));
const rowcam:any[]=await db.select().from(campaignsTable).where(eq(campaignsTable.gameMaster,user.id));
// rowcam.push(db.select().from()) treba da pokupi campanje u kojima je lik igrac
function Home(){


    const listaKampanja:campaign[]=rowcam.map(row=>{
     return{   
        id : row.id,
        name : row.name,
        description : row.description,
        dateStart : row.dateStart,
        gameMaster : row.gameMaster,
        }
    }
    )
    const listaKaraktera:charSheet[]=rowcs.map(row=>{
        return{
                id : row.id,
                name : row.name,
                str : row.str,
                dex : row.dex,
                will : row.will,
                armor : row.armor,
                hp : row.hp,
                currency : row.currency,
                owner : row.owner, 
        }
    })
    
    const [csList,setCsList]=useState<charSheet[]>(listaKaraktera);
    const [campainList,setCampainList]=useState<campaign[]>(listaKampanja);
   

    //nisam siguran da umem da odradim div levo koji iskoci kada kliknem na lika ili kampanju, takodje baza zajebancija
    function handleCampainOnClick(){
        console.log("kliknuto dugme");
        //radi popup za sammu kampanju koja prikazuje postojecu kampanju
    }
    function handleCsOnClick(){
        console.log("kliknuto dugme za cs");
        //radi popup za samu kampanju koja prikazuje postojeceg karaktera
    }
    function handleAddCs(){
        //prikazuje popup, kupi podatke od popupa i sastavlja stvari u listu
    }
    function handleAddCampain(){
        //radi isto ko i prethodna funkcija
    }
    
    return (

        

        <>
        <div className='glavni'>
            <div className='glavni-layout'>

            <div className="stvarcine">
                <div className="stvari">
                    <h4 className='naslov'>Lista kampanja</h4>
                    
                    {campainList.length===0 ? 
                    (<p className='komentar'>Nema aktivnih kamanja</p>) : 
                    campainList.map((campain)=>(
                    <Container key={campain.id} id={campain.id} name={campain.name} onClick={handleCampainOnClick} />
                    ))
                    }
                    
                </div>
                <button className='btn' onClick={handleAddCampain}>Kreiraj SVOJU kampanju</button>
            </div>

            <div className="stvarcine">        
                <div className='stvari'>
                    <h4 className='naslov'>Lista karaktera</h4>
                    
                    {csList.length===0 ? (<p className='komentar'>Nema karaktera</p>) :
                    csList.map((container)=>(
                        <Container key={container.id} id={container.id} name={container.name} onClick={handleCsOnClick}></Container>
                    ))
                    }
                    
                </div>
                <button className='btn' onClick={handleAddCs}>Kreiraj NOVOG lika</button>
            </div>
            </div>
        </div>
        </>
    );
}
export default Home