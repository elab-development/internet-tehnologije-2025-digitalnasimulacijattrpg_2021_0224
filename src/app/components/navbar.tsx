'use client'

import { useAuth } from "./AuthProvider";
import { useState } from "react";
import Image from "next/image";

export function NavBar() {

    const {status, user, logout} = useAuth()
 
    const [isPopupShown, setIsPopupShown] = useState(false);
    const togglePopupShown = () => {
        setIsPopupShown(!isPopupShown);
    };
    const onLogout = () => {
        togglePopupShown()
        logout()
    }

    return (
        <div className="flex flex-row items-center justify-between border gap-2 pr-2 pl-2 font-bold">
            <div className="flex flex-row justify-between gap-2">
                <NavbarLink link="/" tekst={
                    <Logo />
                }/>
                { status === "unauthenticated" &&
                <div className="flex flex-row justify-between gap-2">
                    <NavbarLink link="/" tekst="welcome"/>
                    <NavbarLink link="/about/" tekst="about"/>
                </div>
                }
                { status === "authenticated" &&
                <div className="flex flex-row justify-between gap-2">
                    <NavbarLink link="/home/" tekst="home"/>
                    <NavbarLink link="/about/" tekst="about"/>
                </div>
                }
            </div>

            { status === "unauthenticated" &&
            <div className="flex flex-row gap-2">
                <NavbarLink link="/log-in/" tekst="log in"/>
                <p>/</p>
                <NavbarLink link="/sign-up/" tekst="sign up"/>
            </div>
            }

            { status === "authenticated" &&
            <div className="flex flex-row gap-2">
                <button className="hover:text-pink-500 active:text-transparent" onClick={togglePopupShown}>{user.username}</button>
            </div>
            }

            {isPopupShown &&
            <div className="flex flex-col absolute right-1 top-1 bg-black border p-1 pt-0">
                <button className="text-right hover:text-pink-500 active:text-transparent" onClick={togglePopupShown}> x </button>
                <button className="border flex hover:text-pink-500 p-1 whitespace-nowrap active:text-transparent" onClick={onLogout} > <a href="/"> log out </a> </button>
            </div>
            }
        </div>
    );
}

function NavbarLink(props : any) {
    return (
        <a href={props.link} className="hover:text-pink-500 active:text-transparent">{props.tekst}</a>
    );
}

function Logo() {
    return (
        <div className="group">
            <Image src="/images/logo/logo_w.svg" alt="logo" width={8} height={8} className="group-hover:hidden" />
            <Image src="/images/logo/logo_c.svg" alt="logo" width={8} height={8} className="hidden group-hover:block group-active:opacity-0" />
        </div>
    );
}
