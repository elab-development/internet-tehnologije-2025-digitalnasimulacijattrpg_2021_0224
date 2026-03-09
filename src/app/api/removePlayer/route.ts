import { db } from '../../../db';
import { campaignsTable,campaignPlayersCharSheetsTable,campaignPlayersTable } from '../../../db/schema';
import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";


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

export async function DELETE(req:Request) {
    try{
    if(req.method!=="DELETE"){
        console.log("nije trazen dobar metod");
        return NextResponse.json({error:"Nedobar metod, nije DELETE"},{status:405});
    }
    
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId");    
    if(!playerId){
        return NextResponse.json({error:"playerID nije nadjen"},{status:400})
    }
    await db.transaction(async (tx)=>{
        await tx.delete(campaignPlayersTable).where(eq(campaignPlayersTable.player,playerId))
        await tx.delete(campaignPlayersCharSheetsTable).where(eq(campaignPlayersCharSheetsTable.player,playerId))
    })
    
    return NextResponse.json({success: true})
    }
    catch(err){
        console.log("UPOMOC POSLEDNJI CATCH JE IZASAO AAAAAa");
        return NextResponse.json({ message: "DB error" },{ status: 500 });
    }
}