'use client'

import { placeholder } from "drizzle-orm";
import Kockice from "../components/kockice"
import { useState } from "react";
type ApiResponse = { videoId: string };

export default function About() {

    const [btnbool,setBtnbool]=useState<boolean>(false);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [query, setQuery] = useState<string>("");
    // const videoId="dQw4w9WgXcQ";

    const searchVideo = async () => {
    const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
    const data: ApiResponse = await res.json();
    if (data.videoId) setVideoId(data.videoId);
  };
    return (
        <div className="flex flex-col items-center border">
            <h1 className="naslovAbout">O aplikaciji</h1>
            <p className="aboutIdeja">Jedne pozne večeri decembra meseca 2025.godine kada smo razmišljali o 
                krucijalnim problemima čovekove egzistencije došli smo do zaključka da je čovečanstvu 
                potrebna jos jedna live service aplikacija. Ovo ne bi bila obična live service aplikacija,
                ovo bi bio plod naše muke i bolova sjedinjeno sa primalnom potrebom čoveka za bacanje kockica.
                Zajedničkim snagama prkosimo tišini prisutnoj unutar naših glava, praveći još jedan izgovor da 
                crpimo naše dragoceno vreme u ovom prolaznom postojanju. 
            </p>
            <p className="autori">Autori: <br />  Živković "Zli" Aleksa <br/>
                       Sretenović "Оњг" Ognjen <br/>
                       Rosić "Rosić" Luka 
            </p>
            <Kockice />
           {btnbool? (<iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`}
          allow="autoplay"
          allowFullScreen
          style={{ marginTop: "2rem" }}
        ></iframe>):
        (<></>)}
            <button className="border p-1 hover:text-pink-500 active:text-transparent" onClick={()=>{setBtnbool(!btnbool)}}>{btnbool?"Dosta":"Iznenadjenje"}</button>

            <input type="text" value={query}onChange={(e)=>{setQuery(e.target.value)}} placeholder="NebitnoStagod" />
            <button onClick={()=>{searchVideo()}}>Nadji</button>
            {videoId &&       
            ( <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay"
            allowFullScreen
            style={{ marginTop: "2rem" }}
        />
      )}
        </div>
    );
}