import { cn } from "@/lib/utils";
import React from "react";
import PersonalInfoCard from "@/components/ui/PersonalInfoCard.jsx";
import { CreditCard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip.jsx";
import { useUser } from "@/context/UserContext.jsx";
import DeleteAccount from "@/components/DeleteModal.jsx";
import Createaccount from "@/components/CreateAccount.jsx";

export default function BodyProfile() {
    const { user, isPending } = useUser();

    if (isPending) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-slate-500">Chargement des informations...</div>
        );
    }
    const disconnect = () => {
        sessionStorage.removeItem("access_token");
        window.location.reload();
    }
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-20">
                <div
                    className={cn(
                        "absolute inset-0",
                        "[background-size:40px_40px]",
                        "[background-image:linear-gradient(to_right,#e4e4e7_2px,transparent_2px),linear-gradient(to_bottom,#e4e4e7_2px,transparent_2px)]",
                        "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                    )}
                />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center gap-12">
                <h1 className="font-title text-5xl font-bold sm:text-6xl md:text-7xl text-center">
                    <motion.div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
                        <LayoutTextFlip
                            text="Vos Robux. "
                            words={["Sécurisés.", "Accessibles.", "Valorisés."]}
                        />
                    </motion.div>
                </h1>
               
                <div className="flex gap-6 max-w-6xl w-full justify-center items-stretch">
                    <div className="flex flex-col justify-between gap-6 w-64">
                        <div className="flex-1 bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Informations Personnelles
                            </h2>
                            <p className="text-sm text-slate-500 mb-6">Mettez à jour vos coordonnées et vos paramètres de compte.</p>
                        </div>

                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 tracking-wider">Actions</h3>
                            <nav className="space-y-2">
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition"><CreditCard size={20} />
                                    <span>Compte bancaire</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition mt-4" onClick={disconnect}>
                                    <LogOut size={20} />
                                    <span>Déconnexion</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Colonne droite */}
                    <PersonalInfoCard user={user} />
                </div>
            </div>
        </div>
    );
}
