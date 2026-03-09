import { charSheet } from '../../types';
import { db } from '../../../db';
import {usersTable,campaignPlayersTable } from '../../../db/schema';
import { eq,and,isNull,ne } from "drizzle-orm";
import { NextResponse } from 'next/server';


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


export async function GET(req:Request) {
        if(req.method!=="GET"){
        console.log("NIJE TRAZEN GET ALO UPOMOC");
        return NextResponse.json({error:"Method not allowed"},{status:405});
    }
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const campaginId=searchParams.get("campaginId")
     if(!userId||!campaginId){
        return NextResponse.json({error:"Nedobro poslati parametri"},{status:400})}
    try{
        const stvar:any[]=await db.select().from(usersTable).leftJoin(campaignPlayersTable,eq(campaignPlayersTable.player,usersTable.id)).where(and(isNull(campaignPlayersTable.player),ne(usersTable.id,userId)))
        const res=stvar.map((stvarcica=>{
            return{
                id:stvarcica.User.id,
                username:stvarcica.User.username
            }
        }))
        return NextResponse.json(res, { status: 200 });

    }catch(err){
        console.log("umrecu");
        throw new Error("poslednji catch, pomozi boze");
    }
}