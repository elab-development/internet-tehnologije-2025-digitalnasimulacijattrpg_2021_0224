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
import CharSheetForm from '../components/charSheetForm';


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




useEffect(() => {//regulise uzimanje iz baze za karaktere i kampanje
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

    const[toggleCampaginForm,setToggleCampaginForm]=useState<boolean>(false);
    const[toggleCharSheetForm,setToggleCharSheetForm]=useState<boolean>(false);
    const [csList,setCsList]=useState<charSheet[]>([]);//lista charSheet
    const [campainList,setCampainList]=useState<campaign[]>([]);//lista kampanja
    const [clickedCharSheet,setClickedCharSheet]=useState<UUID | undefined>(undefined);//KLIKNUT KARAKTER
    const [clickedCampagin,setClickedCampagin]=useState<UUID | undefined>(undefined);//KLIKNUTA KAMPANJA
   

 
    function handleCampainOnClick(id:UUID){
        console.log("kliknuto dugme");
        //radi popup za sammu kampanju koja prikazuje postojecu kampanju
        setToggleCampaginForm(true);
        setClickedCampagin(id);
    }
    function handleCsOnClick(id:UUID){
        console.log("kliknuto dugme za cs");
        //radi popup za samu kampanju koja prikazuje postojeceg karaktera
        setToggleCharSheetForm(true);
        setClickedCharSheet(id);
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
                    <Container key={campain.id} id={campain.id} name={campain.name} onClick={()=>{handleCampainOnClick(campain.id)}} />
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
                        <Container key={container.id} id={container.id} name={container.name} onClick={()=>{handleCsOnClick(container.id)}}></Container>
                    ))
                    }
                    
                </div>
                <button className='btn' onClick={handleAddCs}>Kreiraj NOVOG lika</button>
            </div>
            </div>
              {toggleCampaginForm ? (<div className='popupCampagin absolute left-20 up-50 bg-white border-1'>
                <button onClick={()=>{setToggleCampaginForm(false)}} className='popupdugme text-right hover:text-pink-500 active:text-transparent'>Close</button>
                <CampignForm campaign={campainList.find(cm=>{cm.id===clickedCampagin;
                return cm;
                })}></CampignForm>
            

        </div>):(<div></div>)}
        {toggleCharSheetForm ? (<div className='popupSheet absolute left-20 up-50 bg-black border-1'>
            <button onClick={()=>{setToggleCharSheetForm(false)}} className='popupdugme text-right hover:text-pink-500 active:text-transparent'>Close</button>
            <CharSheetForm char={csList.find(cs=>{cs.id===clickedCharSheet;
                return cs;
            })}></CharSheetForm>
        </div>):(<div></div>)}
        </div>
 
        </>
    );
}
export default Home