import {db} from "@/db";
import {campaignsTable,campaignPlayersTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { campaign} from "@/app/types";



export async function GET(req:Request) {
    if(req.method!=="GET"){
        console.log("NIJE TRAZEN GET ALO UPOMOC");
        return NextResponse.json({error:"Method not allowed"},{status:405});
        
    }
    
            const { searchParams } = new URL(req.url);
             const userId = searchParams.get("userId");
    
    if(!userId){
        console.log("nije nasao usera");
        return NextResponse.json({error:"No usserId found"},{status:400});
    }
        try{
            const campsGM:any[]=await db.select().from(campaignsTable).where(eq(campaignsTable.gameMaster,userId));
            console.log("ne radi prvi db.select");
            const campaigns:campaign[]=campsGM.map(row=>{
           console.log("radi prvi map");
            return{   
                id : row.id,
                name : row.name,
                description : row.description,
                dateStart : row.dateStart,
                gameMaster : row.gameMaster,
           }
            })
            const campP:any[]=await db.select().from(campaignsTable).innerJoin(campaignPlayersTable,eq(campaignPlayersTable.capmaign,campaignsTable.id)).where(eq(campaignPlayersTable.player,userId));
           console.log("ne radi drugi sb.select");

            campaigns.push(...campP.map(row=>{
           console.log("radi prvi map");

            return{   
                id : row.campaign.id,
                name : row.campaign.name,
                description : row.campaign.description,
                dateStart : row.campaign.dateStart,
                gameMaster : row.campaign.gameMaster,
           
            }}));
            console.log("linija pre res.status(200), nadam se da je ubacio sve u jednu listu");
            return NextResponse.json(campaigns, { status: 200 });
        }catch(err){
            console.log("Problem s bazom pri prikupljanju kampanja");
            throw new Error("poslednji catch u route!!");
        }
}