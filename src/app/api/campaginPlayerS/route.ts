import {db} from "@/db";
import {campaignsTable,campaignPlayersTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { campaign} from "@/app/types";
import { UUID } from "crypto";



export async function GET(req:Request) {
    if(req.method!=="GET"){
        console.log("NIJE TRAZEN GET ALO UPOMOC");
        return NextResponse.json({error:"Method not allowed"},{status:405});
        
    }
    
            const { searchParams } = new URL(req.url);
             const userId = searchParams.get("userId");
    
    if(!userId){
        console.log("nije nasao usera kod u upisivanju kampanja");
        return NextResponse.json({error:"No usserId found"},{status:400});
    }
        try{
            console.log("radi li ovo uopste?????");
            const campP:any[]=await db.select().from(campaignsTable).innerJoin(campaignPlayersTable,eq(campaignPlayersTable.capmaign,campaignsTable.id)).where(eq(campaignPlayersTable.player,userId));
           console.log(campP[0]);
            console.log("radi??");
            const res= campP.map(row=>{
            return{   
                id : row.Campaign.id,
                name : row.Campaign.name,
                description : row.Campaign.description,
                dateStart : row.Campaign.dateStart,
                gameMaster : row.Campaign.gameMaster,
           
            }});
            return NextResponse.json(res, { status: 200 });
        }catch(err){
            console.log("Problem s bazom pri prikupljanju kampanja");
            throw new Error("poslednji catch u route!!");
        }
}