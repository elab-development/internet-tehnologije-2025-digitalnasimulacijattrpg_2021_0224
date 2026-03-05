import { db } from "../../../db";
import {campaignsTable,campaignPlayersTable,campaignPlayersCharSheetsTable,usersTable } from '../../../db/schema';
import { eq,and } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { campaign } from "../../types";
import { UUID } from "crypto";
import { error } from "console";




export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}


export async function GET(req:Request,) {
    if(req.method!=="GET"){
        return NextResponse.json({error:"Method not allowed"},{status:405});
        
    }
            const { searchParams } = new URL(req.url);
            const campaginId=searchParams.get("campaginId");
    
    
    if(!campaginId){
        console.log("Ne postoji kampanja koju si kliknuo, nije li to smesno zar ne?")
        return NextResponse.json({error:"No campaginID found"},{status:400})
    }
        try{
            const p:any[]=await db.select().from(campaignPlayersTable).innerJoin(usersTable,eq(usersTable.id,campaignPlayersTable.player)).where((eq(campaignPlayersTable.capmaign,campaginId)))
            const players=p.map(player=>{
                console.log(player)
                return{
                    id:player.User.id,
                    username:player.User.username,
                }
            })
            return NextResponse.json(players, { status: 200 });
        }catch(err){
            console.log("Problem s bazom pri prikupljanju kampanja");
            throw new Error("poslednji catch u route!!");
        }
}