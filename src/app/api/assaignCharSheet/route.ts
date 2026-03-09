import { db } from '../../../db';
import { campaignPlayersCharSheetsTable } from '../../../db/schema';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req:Request) {
    try{
    if(req.method!=="POST"){
        console.log("nije trazen dobar metod");
        return NextResponse.json({error:"Nedobar metod, nije POST"},{status:405});
    }
    const {campaginid,playerid,sheetId}=await req.json();
    if(!sheetId||!campaginid||!playerid){
        return NextResponse.json({error:"Nedobro popunjeno"},{status:400});
    }
    const [newCharSheet]=await db.insert(campaignPlayersCharSheetsTable).values({campaign:campaginid,player:playerid,charSheet:sheetId}).returning();
    return NextResponse.json(newCharSheet,{status:201});
    }
    catch(err){
        console.log("UPOMOC POSLEDNJI CATCH JE IZASAO AAAAAa");
        return NextResponse.json({ message: "DB error" },{ status: 500 });
    }
}