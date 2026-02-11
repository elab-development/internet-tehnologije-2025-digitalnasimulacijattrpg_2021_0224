import {db} from "@/db";
import {charSheetsTable} from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req:Request) {
    try{
    if(req.method!=="POST"){
        console.log("nije trazen dobar metod");
        return NextResponse.json({error:"Nedobar metod, nije POST"},{status:405});
    }
    //name,str,dex,will,armor,hp,currency,owner
    const{name,str,dex,will,armor,hp,currency,owner}=await req.json();
    if(!name||!str||!dex||!will||!armor||!hp||!currency||!owner){
        return NextResponse.json({error:"Nedobro popunjeno"},{status:400});
    }
    const [newCharSheet]=await db.insert(charSheetsTable).values({name,str,dex,will,armor,hp,currency,owner}).returning();
    console.log(newCharSheet,"Nova kampanja");
    return NextResponse.json(newCharSheet,{status:201});
    }
    catch(err){
        console.log("UPOMOC POSLEDNJI CATCH JE IZASAO AAAAAa");
        return NextResponse.json({ message: "DB error" },{ status: 500 });
    }
}