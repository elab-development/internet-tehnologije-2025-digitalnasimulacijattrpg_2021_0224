import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ["http://localhost:3000"]

export function proxy(request: NextRequest) {

  const origin = request.headers.get("origin")

  
  if (request.method === "OPTIONS") {
    const res = NextResponse.next()
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin)
      res.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      )
      res.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-csrf-token"
      )
      res.headers.set("Access-Control-Allow-Credentials", "true")
    }
    return res
  }

  
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse("CORS blocked", { status: 403 })
  }

  if (request.nextUrl.pathname.startsWith("/home")) {
    if (!request.cookies.has("auth")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  
  const response = NextResponse.next()
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-csrf-token"
    )
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  return response
}

export const config = {
	matcher : ["/home", "/api/:path*"]
}

