import {db} from "@/db";
import {usersTable } from '@/db/schema';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import {AUTH_COOKIE, cookieOptions, signAuthToken} from "@/lib/auth"; 
const MAGICNIBROJ = parseInt(process.env.MAGICNIBROJ!);


type Body = {
    username: string;
    password: string;
}

export async function POST(req: Request) {
    
    const { username, password } = (await req.json()) as Body
    
    
    if (!username || !password) {
        return NextResponse.json({ error: "Pogresan username ili lozinka" }, { status: 401 })
    }

    const [u] = await db.select().from(usersTable).where(eq(usersTable.username, username))

    if (!u) {
        return NextResponse.json({ error: "Pogresan username ili lozinka" }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, u.password)
    
    if (!ok) {
        return NextResponse.json({ error: "Pogresan username ili lozinka" }, { status: 401 })
    }

    
    const token = signAuthToken({ userID: u.id, username: u.username})

    
    const res = NextResponse.json({ id: u.id, username: u.username })
    res.cookies.set(AUTH_COOKIE, token, cookieOptions())

    return res;
}