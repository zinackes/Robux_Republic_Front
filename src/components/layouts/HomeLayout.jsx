import React from 'react';
import {Navbar, NavbarButton, NavbarLogo, NavBody} from "@/components/ui/resizable-navbar.jsx";
import {useUser} from "@/context/UserContext.jsx";
import {ModeToggle} from "@/components/ui/theme/modeToggle.jsx";
import { Link } from "react-router-dom";

function HomeLayout({children}) {

    const { user } = useUser();

    return (
        <div className={"min-h-screen min-w-screen flex flex-col absolute"}>
            {/* Desktop Navbar (hidden on mobile, visible on lg+) */}
            <Navbar className={"top-0"}>
                <NavBody>
                    <div className={"flex w-full gap-3 items-center justify-end"}>
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

            {/* Mobile Header (visible on mobile/tablet, hidden on lg+) */}
            <header className="lg:hidden sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <Link to="/" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        Banque Republic
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {!user && (
                            <>
                                <Link
                                    to="/register"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                                >
                                    S'inscrire
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                                >
                                    Connexion
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link
                                to="/dashboard"
                                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                            >
                                Dashboard
                            </Link>
                        )}
                        <ModeToggle/>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
}

export default HomeLayout;