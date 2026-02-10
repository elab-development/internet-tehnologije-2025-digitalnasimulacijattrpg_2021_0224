import {db} from "@/db";
import {campaignsTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { campaign} from "@/app/types";

export async function POST(req:Request) {
    try{
    if(req.method!=="POST"){
        console.log("nije trazen dobar metod");
        return NextResponse.json({error:"Nedobar metod, nije POST"},{status:405});
    }
    //naziv, opis, gejmaster
    const{name,description,gameMaster}=await req.json();
    if(!name||!description||!gameMaster){
        return NextResponse.json({error:"Nedobro popunjeno"},{status:400});
    }
    const [newCampagin]=await db.insert(campaignsTable).values({name,description,gameMaster}).returning();
    console.log(newCampagin,"Nova kampanja");
    return NextResponse.json(newCampagin,{status:201});
    }
    catch(err){
        console.log("UPOMOC POSLEDNJI CATCH JE IZASAO AAAAAa");
        return NextResponse.json({ message: "DB error" },{ status: 500 });
    }
}