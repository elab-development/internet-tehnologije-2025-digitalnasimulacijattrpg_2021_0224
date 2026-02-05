import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { AUTH_COOKIE, vertifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    console.log("Token retrieved:", token);

    if (!token) {
        console.log("No token found, returning unauthenticated response.");
        return NextResponse.json({ user: null });
    }

    try {
        const claims = vertifyAuthToken(token);
        console.log("Claims from token:", claims);

        const [user] = await db
            .select({ id: usersTable.id, username: usersTable.username })
            .from(usersTable)
            .where(eq(usersTable.id, claims.sub));
        
        console.log("User found:", user);
        return NextResponse.json({ user: user ?? null });
    } catch (error) {
        console.error("Error verifying token or querying database:", error);
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
