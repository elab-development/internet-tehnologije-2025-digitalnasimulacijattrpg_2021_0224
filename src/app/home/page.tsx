'use client'
import {useState} from 'react'
import Container from '../components/Container'
import { stdout } from 'process';
import './home.css'

interface ContainerData{
    id:number;
    name:string;
    onClick:()=>void;
}
function Home(){


    //Rosicu seti se da zapravo treba da napravis metodu koja prima listu karaktera i kampanja koje je frajer napravio i da napravis taj tip podataka i njega koristis u useState

    //test deo
    const listaKampaja:ContainerData[]=[{id:1,name:"HRASTOSTITOVE LUDORIJE", onClick:handleCampainOnClick},{id:2,name:"drugi", onClick:handleCampainOnClick},{id:3,name:"treci", onClick:handleCampainOnClick}];

    const [csList,setCsList]=useState<ContainerData[]>(listaKampaja);//izvlaci iz baze ovo je trenutno resenje da se svaki put louduje prazna
    const [campainList,setCampainList]=useState<ContainerData[]>(listaKampaja);//trenutno testiram sa hardkodovanim listama
   

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
                    <h4 className='naslov bg-gray-500 rounded-[95%_/_50%] p-3'>Lista kampanja</h4>
                    
                    {campainList.length===0 ? 
                    (<p className='komentar'>Nema aktivnih kamanja</p>) : 
                    campainList.map((campain)=>(
                    <Container key={campain.id} id={campain.id} name={campain.name} onClick={handleCampainOnClick} />
                    ))
                    }
                    
                </div>
                <button className='btn hover:text-pink-500 active:text-transparent' onClick={handleAddCampain}>Kreiraj SVOJU kampanju</button>
            </div>

            <div className="stvarcine">        
                <div className='stvari'>
                    <h4 className='naslov bg-gray-500 rounded-[95%_/_50%] p-3'>Lista karaktera</h4>
                    
                    {csList.length===0 ? (<p className='komentar'>Nema karaktera</p>) :
                    csList.map((container)=>(
                        <Container key={container.id} id={container.id} name={container.name} onClick={handleCsOnClick}></Container>
                    ))
                    }
                    
                </div>
                <button className='btn hover:text-pink-500 active:text-transparent' onClick={handleAddCs}>Kreiraj NOVOG lika</button>
            </div>
            </div>
        </div>
        </>
    );
}
export default Home