import { cn } from "@/lib/utils";
import React from "react";
import PersonalInfoCard from "@/components/ui/PersonalInfoCard.jsx";
import { CreditCard, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip.jsx";
import { useUser } from "@/context/UserContext.jsx";
import DeleteAccount from "@/components/DeleteModal.jsx";
import Createaccount from "@/components/CreateAccount.jsx";
import { Bell, Gamepad2 } from "lucide-react";

export default function BodyProfile() {
  const { user, isPending } = useUser();

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-slate-500 dark:text-slate-300">
        Chargement des informations...
      </div>
    );
  }

  const disconnect = () => {
    sessionStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 flex flex-col items-center justify-start gap-12  sm:px-6 lg:px-8">
        <div className="flex gap-6 max-w-6xl w-full justify-center items-stretch">
          <div className="flex flex-col justify-between gap-6 w-64">
            <div className="flex-1 bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Informations Personnelles
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Mettez à jour vos coordonnées et vos paramètres de compte.
              </p>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 tracking-wider">
                Actions
              </h3>
              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition">
                  <CreditCard size={20} />
                  <span>Compte bancaire</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition mt-4"
                  onClick={disconnect}
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
          <PersonalInfoCard user={user} />
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 max-w-6xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl dark:bg-orange-900/20 dark:text-orange-400">
              <Bell size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-800">
              Préférences
            </h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Alertes de transaction par email
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="w-6 h-6 accent-blue-600 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:accent-blue-400"
              />
            </label>
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Notifications Push
              </span>
              <input
                type="checkbox"
                className="w-6 h-6 accent-blue-600 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:accent-blue-400"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 max-w-6xl w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl dark:bg-blue-900/20 dark:text-blue-400">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-800">
                Liaison Roblox
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Nécessaire pour les dépôts en RBX
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-center gap-6 dark:bg-gray-800 dark:border-gray-700">
            <img
              src={`https://pbs.twimg.com/media/GEu_yrTXoAAsbY6.jpg`}
              alt="Roblox Avatar"
              className="w-20 h-20 bg-white rounded-full shadow-sm p-1 border border-gray-200 dark:bg-gray-900 dark:border-gray-700 object-cover"
            />
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block dark:text-gray-400">
                Nom d'utilisateur Roblox
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl py-3 px-4 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-gray-700 dark:focus:border-gray-600"
                />
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 rounded-xl transition-colors py-3 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                  Vérifier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
