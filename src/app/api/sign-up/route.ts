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
    confirmPassword: string;
}

export async function POST(req: Request) {
    const { username, password, confirmPassword } = (await req.json()) as Body

    if (!username || !password || !confirmPassword) {
        return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 })
    }


    if (password !== confirmPassword) {
        return NextResponse.json({ error: "Lozinke se ne poklapaju" }, { status: 400 })
    }

    
    const exists = await db.select().from(usersTable).where(eq(usersTable.username, username))
    if (exists.length) {
        return NextResponse.json({ error: "Username postoji u bazi" }, { status: 400 })
    }
    const passHash = await bcrypt.hash(password, MAGICNIBROJ);

    const [u] = await db.insert(usersTable)
        .values({ username, password: passHash })
        .returning({ id: usersTable.id, username: usersTable.username })

          
    const token = signAuthToken({ userID: u.id, username: u.username })
    const res = NextResponse.json(u)
    res.cookies.set(AUTH_COOKIE, token, cookieOptions())

    
    return res;

}

