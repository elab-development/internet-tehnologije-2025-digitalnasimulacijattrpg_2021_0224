"use client"

import { usePathname } from "next/navigation"
import { NavBar } from "./navbar"

export const RenderNavbar = () => {
    const pathname = usePathname()
    return pathname.includes("/session") ? null : <NavBar />
}