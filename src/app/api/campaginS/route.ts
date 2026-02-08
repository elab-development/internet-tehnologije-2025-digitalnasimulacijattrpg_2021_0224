import {db} from "@/db";
import {usersTable, charSheetsTable,campaignsTable,campaignPlayersTable } from '@/db/schema';
import { eq } from "drizzle-orm";
// import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import {AUTH_COOKIE, cookieOptions, signAuthToken} from "@/lib/auth"; 
// const MAGICNIBROJ = parseInt(process.env.MAGICNIBROJ!);
import { campaign,charSheet } from "@/app/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { UUID } from "crypto";



export async function GET(req:NextApiRequest, res: NextApiResponse<campaign[] | {error:string}>) {
    if(req.method!=="GET"){
        console.log("NIJE TRAZEN GET ALO UPOMOC");
        res.status(405).json({error:"Method not allowed"});
    }

    const userId=req.query.userId as UUID;
    if(!userId){
        res.status(400).json({error:"No usserId was sent"});
    }
        try{
            const campsGM:any[]=await db.select().from(campaignsTable).where(eq(campaignsTable.gameMaster,userId));
            const campaigns:campaign[]=campsGM.map(row=>{
            return{   
                id : row.id,
                name : row.name,
                description : row.description,
                dateStart : row.dateStart,
                gameMaster : row.gameMaster,
           }
            })
            const campP:any[]=await db.select().from(campaignsTable).innerJoin(campaignPlayersTable,eq(campaignPlayersTable.capmaign,campaignsTable.id)).where(eq(campaignPlayersTable.player,userId));
            campaigns.push(...campP.map(row=>{
            return{   
                id : row.id,
                name : row.name,
                description : row.description,
                dateStart : row.dateStart,
                gameMaster : row.gameMaster,
           
            }}));
            //resi join problem
            res.status(200).json(campaigns);
        }catch(err){
            console.log("Problem s bazom pri prikupljanju kampanja");
            res.status(500).json({error:"Problem s bazom"})
        }
}