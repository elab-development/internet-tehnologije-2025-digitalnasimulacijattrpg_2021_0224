'use client'
import {useState,useEffect} from 'react'
import Container from '../components/Container'
import './home.css'
import { campaign,charSheet} from '../types';
import { UUID } from 'crypto';
import { useAuth } from "../components/AuthProvider";
import charSheetForm from "../components/charSheetForm";
import CampignForm from '../components/campignForm';
import CharSheetForm from '../components/charSheetForm';
import { useSocket } from '../components/socketManager';
import { campaign as s_campaign } from '../../../server';

function Home(){

    async function fetchCampaigns(userId: string): Promise<campaign[]> {
         const res = await fetch(`/api/campaginS?userId=${userId}`, {
        credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Fetch failed");
        }

        return res.json();
    }
    async function fetchCharacterSheets(userId:string):Promise<charSheet[]>{
        const res=await fetch(`/api/charSheets?userId=${userId}`,{ credentials:"include"});
        if(!res.ok){
            throw new Error("Fetch failed cs");
        }
        return res.json();
    }
    async function fetchJoinedCampaigns(userId: string): Promise<campaign[]>{
        const res=await fetch(`/api/campaginPlayerS?userId=${userId}`,{credentials:"include"});
        if(!res.ok){
            throw new Error("Fetch failed playerCampagin");
        }
        return res.json();
    }

const {status, user, logout} = useAuth()//kfndklfnsfklnds
const socket = useSocket()

useEffect(() => {//regulise uzimanje iz baze za karaktere i kampanje

    if (socket) {
        socket.on("update", (campaign: s_campaign) => {
            console.log(campaign)
        })
        socket.on("redirect", (url) => {
            console.log("redirect")
            window.location.href = url
        })
    }

  if (status === "authenticated" && user?.id) {
    fetchCampaigns(user.id)
      .then(data => {
        setCampainList(data);
      })
      .catch(err => {
      });

      fetchCharacterSheets(user.id)
      .then(sheets=>{
        setCsList(sheets);
      });
      fetchJoinedCampaigns(user.id)
        .then(data => {
        setCampainJoinList(data);
      })
      .catch(err => {
      });
    }
    }, [status, user?.id, socket]);

    const[toggleCampaginForm,setToggleCampaginForm]=useState<boolean>(false);
    const[toggleCharSheetForm,setToggleCharSheetForm]=useState<boolean>(false);
    const [csList,setCsList]=useState<charSheet[]>([]);//lista charSheet
    const [campainList,setCampainList]=useState<campaign[]>([]);//lista kampanja gde je game master
    const [campainJoinList,setCampainJoinList]=useState<campaign[]>([]);//lista kampanja gde je dzoinovan
    const [clickedCharSheet,setClickedCharSheet]=useState<UUID | undefined>(undefined);//KLIKNUT KARAKTER
    const [clickedCampagin,setClickedCampagin]=useState<UUID | undefined>(undefined);//KLIKNUTA KAMPANJA
 
    function handleCampainOnClick(id:UUID){
        setToggleCampaginForm(true);
        setClickedCampagin(id);

    }
    function handleCsOnClick(id:UUID){
        setToggleCharSheetForm(true);
        setClickedCharSheet(id);
    }
    function handleAddCs(){
        setToggleCharSheetForm(true);
        setClickedCharSheet(undefined);
    }
    function handleAddCampain(){
        setToggleCampaginForm(true);
        setClickedCampagin(undefined);
    }
    
    return (
        <>
        <div className='glavni'>
            <div className='glavni-layout'>
            <div className='stvarcine'>
                <div className='stvari'>
                    <h4 className='naslov bg-gray-500 rounded-[95%_/_50%] p-3'>Lista dzoinovanih kampanja</h4>
                    {campainJoinList.length===0 ?
                    (<p className='komentar'>Nema aktivnih kamanja</p>) :
                    campainJoinList.map((container)=>(
                        <Container key={container.id} id={container.id} name={container.name} onClick={()=>{handleCampainOnClick(container.id)}}></Container>
                    ))
                    }
                </div>
                <button className='btn hover:text-pink-500 active:text-transparent'>Nemam pojma neki join idk</button>
            </div>
            <div className="stvarcine">
                <div className="stvari">
                    <h4 className='naslov bg-gray-500 rounded-[95%_/_50%] p-3'>Lista kreiranih kampanja</h4>
                    
                    {campainList.length===0 ? 
                    (<p className='komentar'>Nema aktivnih kamanja</p>) : 
                    campainList.map((campain)=>(
                    <Container key={campain.id} id={campain.id} name={campain.name} onClick={()=>{handleCampainOnClick(campain.id)}} />
                    ))
                    }
                    
                </div>
                <button className='btn hover:text-pink-500 active:text-transparent' onClick={()=>{handleAddCampain()}}>Kreiraj SVOJU kampanju</button>
            </div>

            <div className="stvarcine">        
                <div className='stvari'>
                    <h4 className='naslov bg-gray-500 rounded-[95%_/_50%] p-3'>Lista karaktera</h4>
                    
                    {csList.length===0 ? (<p className='komentar'>Nema karaktera</p>) :
                    csList.map((container)=>(
                        <Container key={container.id} id={container.id} name={container.name} onClick={()=>{handleCsOnClick(container.id)}}></Container>
                    ))
                    }
                    
                </div>
                <button className='btn hover:text-pink-500 active:text-transparent' onClick={()=>handleAddCs()}>Kreiraj NOVOG lika</button>
            </div>
            </div>
              {toggleCampaginForm ? (<div className='forma'>
                <button onClick={()=>{setToggleCampaginForm(false)}} className='btn_forma'>Close</button>
                <CampignForm campaign={
                    campainList.find(cm=>cm.id===clickedCampagin) || campainJoinList.find(cm=>cm.id===clickedCampagin)
                }
                gm={!!campainList.find(cm => cm.id === clickedCampagin)}
                ></CampignForm>
            

        </div>):(<div></div>)}
        {toggleCharSheetForm ? (<div className='forma'>
            <button onClick={()=>{setToggleCharSheetForm(false)}} className='btn_forma'>Close</button>
            <CharSheetForm char={csList.find(cs=>cs.id===clickedCharSheet)
            }></CharSheetForm>
        </div>):(<div></div>)}
        </div>
 
        </>
    );
}
export default Home