import {db} from "@/db";
import {campaignPlayersTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { campaign} from "@/app/types";

export async function POST(req:Request) {
    if(req.method!=="POST"){
        console.log("nije trazen dobar metod");
        return NextResponse.json({error:"Nedobar metod, nije POST"},{status:405});
    }
    //naziv, opis, gejmaster
}