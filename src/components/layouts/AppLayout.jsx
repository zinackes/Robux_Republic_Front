import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Bell,
  Contact,
  Coins,
  ArrowRightLeft,
  CircleQuestionMark,
} from "lucide-react";
import { useUser } from "@/context/UserContext.jsx";
import { cn } from "@/lib/utils.js";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ui/theme/modeToggle.jsx";
import { IconMenu2, IconX } from "@tabler/icons-react";

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Banque Republic
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal relative flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
    </Link>
  );
};

export default function AppLayout({ children }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const audioRef = useRef();

  useEffect(() => {
    audioRef.current = new Audio('/sounds/logout.mp3');
  }, []);

  const disconnect = (e) => {
    if (e) e.preventDefault();

    sessionStorage.removeItem("access_token");

    // Reset du son + play
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
      window.location.href = "/login";
    }, 350);
  };

  useEffect(() => {
    const closeSidebar = () => {
      setSidebarOpen(false);
      setMobileMenuOpen(false);
    }

    closeSidebar();
  }, [location.pathname]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 flex-shrink-0" />
      ),
    },
    {
      label: "Bénéficiaire",
      href: "/beneficiary",
      icon: (
        <Contact className="text-neutral-700 dark:text-neutral-200 flex-shrink-0" />
      ),
    },
    {
      label: "Dépot",
      href: "/dashboard/transaction?type=depot",
      icon: (
        <Coins className="text-neutral-700 dark:text-neutral-200 flex-shrink-0" />
      ),
    },
    {
      label: "Virement",
      href: "/dashboard/transaction?type=virement",
      icon: (
        <ArrowRightLeft className="text-neutral-700 dark:text-neutral-200 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen max-h-screen"
      )}
    >
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 font-text">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {sidebarOpen ? <Logo /> : <LogoIcon />}
            <div className={`mt-2 flex flex-col gap-2`}>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className={"!text-lg"} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Profil",
                href: "/profile",
                icon: (
                  <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
            <SidebarLink
              className={"cursor-pointer"}
              link={{
                label: "Déconnexion",
                icon: (
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 cursor-pointer" />
                ),
              }}
              onClick={disconnect}
            />

          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col relative bg-gray-50 dark:bg-gray-900 min-h-0">
        <div
          className={cn(
            "absolute inset-0 z-0 pointer-events-none",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        <header className="relative z-10 h-14 sm:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-neutral-700 flex items-center px-4 sm:px-6 md:px-8 shrink-0">
          {/* Burger Menu (mobile uniquement) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 mr-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <IconMenu2 size={20} />
          </button>

          {/* Texte centré sur mobile, à gauche sur desktop */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white">
              Bienvenue, {user?.first_name || "Utilisateur"} 👋
            </h2>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 capitalize hidden sm:block">{today}</p>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-gray-200 rounded-full transition-colors">
              <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <ModeToggle />
          </div>
        </header>

        {/* Menu Mobile (overlay) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-gray-900 shadow-xl z-[100] flex flex-col"
              >
                {/* Header du menu */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <Logo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <IconX size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-2">
                    {links.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.href}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Footer du menu */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profil</span>
                  </Link>
                  <button
                    onClick={disconnect}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 min-h-0">
          <main className="p-4 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
