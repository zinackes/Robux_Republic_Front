import React from 'react';
import {Navbar, NavbarButton, NavbarLogo, NavBody} from "@/components/ui/resizable-navbar.jsx";
import {useUser} from "@/context/UserContext.jsx";

function HomeLayout({children}) {

    const { user } = useUser();

    return (
        <div className={"min-h-screen min-w-screen flex flex-col absolute"}>
            <Navbar className={"-top-40"}>
                <NavBody>
                    <NavbarLogo href={"/robux_republic_logo.png"}/>
                    <div>
                        {!user && (
                            <>
                                <NavbarButton variant={"secondary"} href={"/register"}>S'inscrire</NavbarButton>
                                <NavbarButton variant={"primary"} href={"/login"}>Se connecter</NavbarButton>
                            </>
                        )}
                        {user && (
                            <NavbarButton variant={"primary"} href={"/dashboard"}>Dashboard</NavbarButton>
                        )}
                    </div>
                </NavBody>
            </Navbar>

            {children}
        </div>
    );
}

export default HomeLayout;