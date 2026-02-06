'use client'

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export type User = { id: string; name: string; email: string; createdAt: string }

//tip za stanje (podatke) koje zelimo da delimo
type AuthState = { status: "loading"; user: null }
    | { status: "unauthenticated"; user: null }
    | { status: "authenticated"; user: User };

//Context Shape - tip podatka koji prosledjujemo React Context hook-u
// sadrzi stanje plus funkcije AuthProvider-a
type Ctx = AuthState & {
    refresh: () => Promise<void>
    logout: () => Promise<void>
};

//pogledati React useContext hook
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [state, setState] = useState<AuthState>({ status: "loading", user: null })

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/user", { credentials: "include" })
            const data = await res.json()
            if (!data || !data?.user) {
                setState({ status: "unauthenticated", user: null })
            } else {
                setState({ status: "authenticated", user: data.user })
            }
        } catch {
            setState({ status: "unauthenticated", user: null })
        }
    }, [])

    const logout = async () => {
        const res = await fetch("/api/logout", { method: "POST", credentials: "include" })
        setState({ status: "unauthenticated", user: null })
        router.refresh()
    }

    useEffect(() => {
        refresh()
    }, [refresh])

    //azuriramo memorisanu vrednost kada se neki dependency promeni
    const value = useMemo<Ctx>(() => ({ ...state, refresh, logout }), [state, refresh, logout])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

//hook koji pozivamo kad nam treba AuthProvider ili neki njegov deo
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx;
}