import {db} from "@/db";
import {notesTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';



export async function GET(req:Request) {
    const { searchParams } = new URL(req.url);
    const charSheetID = searchParams.get("charSheetID")?.trim();
        if (!charSheetID) {
            return NextResponse.json({ error: "No charSheetID found" }, { status: 400 });
        }
    try {
        const result = await  db.select().from(notesTable).where(eq(notesTable.writtenIn, charSheetID));
        const notes: any[] = result.map(row=>{
            return{
                id: row.id,
                content: row.content,
                writtenIn: row.writtenIn
            }
        }); 
        return NextResponse.json(notes);
} catch (err) {
        return NextResponse.json({ error: "Failed to retrieve notes." }, { status: 500 });
    }
}



export async function POST(req:Request) {
    const {content, writtenIn} = await req.json();
    try {
        const result = await db.insert(notesTable).values({
            content,
            writtenIn
        });
        return NextResponse.json({message: "Note created successfully"});
    } catch (err) {
        return NextResponse.json({ error: "Failed to create note." }, { status: 500 });
    }
}