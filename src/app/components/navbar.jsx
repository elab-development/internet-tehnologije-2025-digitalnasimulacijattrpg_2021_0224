import Image from "next/image";

export function NavBar() {
    return (
        <div className="flex flex-row items-center justify-between border gap-2 pr-2 pl-2 font-bold">
            <div className="flex flex-row justify-between gap-2">
                <NavbarLink link="/" tekst={
                    <Logo />
                }/>
                <div className="flex flex-row justify-between gap-2">
                    <NavbarLink link="/" tekst="welcome"/>
                    <NavbarLink link="" tekst="about"/>
                </div>
            </div>
            <div className="flex flex-row gap-2">
                <NavbarLink link="" tekst="log in"/>
                <p>/</p>
                <NavbarLink link="" tekst="sign up"/>
            </div>
        </div>
    );
}

function NavbarLink(props) {
    return (
        <a href={props.link} className="hover:text-pink-500 active:text-transparent">{props.tekst}</a>
    );
}

function Logo() {
    return (
        <div className="group">
            <Image src="/images/logo/logo_w.svg" alt="logo" width={8} height={9} className="group-hover:hidden" />
            <Image src="/images/logo/logo_c.svg" alt="logo" width={8} height={9} className="hidden group-hover:block group-active:opacity-0" />
        </div>
    );
}