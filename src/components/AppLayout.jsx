import React, { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Bell,
  Contact,
  Coins,
  ArrowRightLeft
} from "lucide-react";
import { useUser } from "@/context/UserContext.jsx";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <Link to="/dashboard" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
        Robux Republic
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link to="/dashboard" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default function AppLayout({ children }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const disconnect = (e) => {
    if (e) e.preventDefault(); 
    sessionStorage.removeItem("access_token");
    window.location.href = "/login"; 
};

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Bénéficiaire", href: "/beneficiary", icon: <Contact className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Dépot", href: "/dashboard/transaction?type=depot", icon: <Coins className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
    { label: "Virement", href: "/dashboard/transaction?type=virement", icon: <ArrowRightLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" 
      )}
    >
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {sidebarOpen ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>


            <SidebarLink
              link={{
            label: "Profil",href: "/profile", icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            
                }}
            />
            <SidebarLink
              link={{
            label: "Déconnexion", icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            }}
                onClick={disconnect}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col relative bg-gray-50 dark:bg-neutral-900">
        
        <div
            className={cn(
              "absolute inset-0 z-0 pointer-events-none",
              "[background-size:40px_40px]",
              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
            )}
          />

        <header className="relative z-10 h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div>
             <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Bienvenue, {user?.first_name || "Utilisateur"} 👋
             </h2>
             <p className="text-xs text-gray-500 capitalize">{today}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={20} />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10">
          <main className="p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}