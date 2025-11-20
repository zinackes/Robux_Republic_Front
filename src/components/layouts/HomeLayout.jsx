import React from 'react';
import {Navbar, NavbarButton, NavbarLogo, NavBody} from "@/components/ui/resizable-navbar.jsx";
import {useUser} from "@/context/UserContext.jsx";
import {ModeToggle} from "@/components/ui/modeToggle.jsx";

function HomeLayout({children}) {

    const { user } = useUser();

    return (
        <div className={"min-h-screen min-w-screen flex flex-col absolute"}>
            <Navbar className={"-top-40"}>
                <NavBody>
                    <NavbarLogo href={"/robux_republic_logo.png"}/>
                    <div className={"flex gap-3 items-center"}>
                        {!user && (
                            <>
                                <NavbarButton variant={"secondary"} href={"/register"}>S'inscrire</NavbarButton>
                                <NavbarButton variant={"primary"} href={"/login"}>Se connecter</NavbarButton>
                            </>
                        )}
                        {user && (
                            <NavbarButton variant={"primary"} href={"/dashboard"}>Dashboard</NavbarButton>
                        )}
                        <ModeToggle/>
                    </div>
                </NavBody>
            </Navbar>

            {children}
        </div>
    );
}

export default HomeLayout;