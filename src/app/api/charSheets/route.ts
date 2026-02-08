import { charSheet} from "@/app/types";
import {db} from "@/db";
import {charSheetsTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';

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
        const karakteri:any[]= await db.select().from(charSheetsTable).where(eq(charSheetsTable.owner,userId));
        const cs:charSheet[]=karakteri.map(row=>{
            return{
                id:row.id,
                name:row.name,
                str : row.str,
                dex : row.dex,
                will : row.will,
                armor : row.armor,
                hp : row.hp,
                currency : row.currency,
                owner: row.owner,
            }
        });
        console.log("uspesno sve odradjeno");
         return NextResponse.json(cs, { status: 200 });

    }catch(err){
        console.log("umrecu");
        throw new Error("poslednji catch, pomozi boze");
    }
}