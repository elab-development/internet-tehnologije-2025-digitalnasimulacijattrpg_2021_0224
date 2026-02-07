import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request : NextRequest) {
	if (!request.cookies.has('auth')) {
		console.log("NEMAS KOLAC")
		return NextResponse.redirect(new URL('/', request.url))
	}
}

export const config = {
	matcher : '/home',
}
