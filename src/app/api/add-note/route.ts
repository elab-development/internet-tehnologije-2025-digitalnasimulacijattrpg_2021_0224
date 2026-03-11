
import { db } from '../../../db';
import { notesTable } from '../../../db/schema';
import { NextResponse } from 'next/server';
import { player } from '../../../../server';


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

type newNote = {
    newNote : string
    player : player
}

export async function POST(req:Request) {
    try{
        if(req.method!=="POST"){
            console.log("nije trazen dobar metod");
            return NextResponse.json({error:"Nedobar metod, nije DELETE"},{status:405});
        }

        const { newNote, player } = (await req.json()) as newNote
        
        if(!newNote || !player){
            return NextResponse.json({error:"Nisu nadjeni atributi"},{status:400})
        }
        await db.insert(notesTable).values({
            content : newNote,
            writtenIn : player.charSheet.id
        })
        return NextResponse.json({success: true})
    }
    catch(err){
        console.log("UPOMOC POSLEDNJI CATCH JE IZASAO AAAAAabbbbbbbbbbbb");
        return NextResponse.json({ message: "DB error" },{ status: 500 });
    }
}