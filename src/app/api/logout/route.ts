import { AUTH_COOKIE } from "../../../lib/auth";
import { NextResponse } from "next/server";

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

export async function POST() {
    const res = NextResponse.json({ ok: true })

    res.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true, // ne moze da se pristupi kroz JS, stiti od XSS
        sameSite: "lax" as const, // stiti od CSRF
        secure: process.env.NODE_ENV === "production", // samo HTTPS na produkciji
        path: "/",
        maxAge: 0,
        expires: new Date(0) //01.01.1970.
    })

    return res
}