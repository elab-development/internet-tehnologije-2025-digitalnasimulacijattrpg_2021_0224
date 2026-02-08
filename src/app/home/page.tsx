'use client'
import {useState,useEffect} from 'react'
import Container from '../components/Container'
import './home.css'
import { campaign } from '../types';
import { charSheet } from '../types';
import { UUID } from 'crypto';
import { useAuth } from "../components/AuthProvider";
import charSheetForm from "../components/charSheetForm";
import CampignForm from '../components/campignForm';


interface ContainerData{
    id:UUID;
    name:string;
    onClick:()=>void;
}




function Home(){

    async function fetchCampaigns(userId: string): Promise<campaign[]> {
         const res = await fetch(`/api/campaginS?userId=${userId}`, {
        credentials: "include",
        });
        console.log(res,"ovo je res");

        if (!res.ok) {
            console.log("ne radi u pitanju res.ok",res.status);
            throw new Error("Fetch failed");
        }

        return res.json();
    }
    async function fetchCharacterSheets(userId:string):Promise<charSheet[]>{
        const res=await fetch(`/api/charSheets?userId=${userId}`,{ credentials:"include"});
        console.log(res,"ovo je res za ch");
        if(!res.ok){
            console.log("res nije ok kod cs");
            throw new Error("Fetch failed cs");
        }
        return res.json();
    }
    const {status, user, logout} = useAuth()//kfndklfnsfklnds
     console.log(user,"ovo je user");


    const [csList,setCsList]=useState<charSheet[]>([]);
    const [campainList,setCampainList]=useState<campaign[]>([]);
   

useEffect(() => {
  if (status === "authenticated" && user?.id) {
    fetchCampaigns(user.id)
      .then(data => {
        console.log("STIGLO:", data);
        setCampainList(data);
      })
      .catch(err => {
        console.error("FETCH ERROR:", err);
      });

      fetchCharacterSheets(user.id)
      .then(sheets=>{
        console.log("stigli sheets:",sheets);
        setCsList(sheets);
      })
  }
}, [status, user?.id]);


   

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