import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = 'auth';
const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables')
}

export type JwtUserClaims = {
    userID: string;  
    username: string;
}

export function signAuthToken(claims: JwtUserClaims): string {
    return jwt.sign(claims, JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' })
}

export function vertifyAuthToken(token: string){
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtUserClaims

    if (!payload || !payload.sub){
        throw new Error('Invalid token');
    }

    return {
        sub: payload.sub,
        name: payload.name
    }
}

export function cookieOptions(){
    return {
        httpOnly: true,
        sameSite: 'lax' as const,
        //secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
    }
}
