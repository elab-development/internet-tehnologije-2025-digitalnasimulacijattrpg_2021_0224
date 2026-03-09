import { charSheet } from '../../types';
import { db } from '../../../db';
import {charSheetsTable,campaignPlayersCharSheetsTable } from '../../../db/schema';
import { eq,and, isNull } from "drizzle-orm";
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
     if(!userId){
        console.log("nije nasao usera");
        return NextResponse.json({error:"No usserId found"},{status:400});
    }
    try{
        const karakteri:any[]= await db.select().from(charSheetsTable).leftJoin(campaignPlayersCharSheetsTable,eq(charSheetsTable.id,campaignPlayersCharSheetsTable.charSheet)).where(and(eq(charSheetsTable.owner,userId),isNull(campaignPlayersCharSheetsTable.charSheet)));
        const res=karakteri.map(char=>{
            console.log(char);
            return{
                id:char.CharSheet.id,
                name:char.CharSheet.name,
                str:char.CharSheet.str,
                dex:char.CharSheet.dex,
                will:char.CharSheet.will,
                armor:char.CharSheet.armor,
                hp:char.CharSheet.hp,
                currency:char.CharSheet.currency,
                owner:char.CharSheet.owner
            }
        })
            return NextResponse.json(res,{status:200});


    }catch(err){
        console.log("umrecu");
        throw new Error("poslednji catch, pomozi boze");
    }
}