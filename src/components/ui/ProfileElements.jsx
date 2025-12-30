import React from "react";
import PersonalInfoCard from "@/components/ui/PersonalInfoCard.jsx";
import { CreditCard, LogOut, Bell, Gamepad2 } from "lucide-react";
import { useUser } from "@/context/UserContext.jsx";

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
    <div className="flex flex-col items-center px-2 sm:px-0">
      <div className="relative z-10 flex flex-col items-center justify-start gap-6 sm:gap-8 lg:gap-12 w-full max-w-6xl">

        {/* Section principale - responsive */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">

          {/* Colonne gauche - Infos et Actions */}
          <div className="flex flex-col justify-between gap-4 sm:gap-6 w-full lg:w-64 shrink-0">

            {/* Card Informations */}
            <div className="flex-1 bg-white/95 dark:bg-gray-900/95 rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                Informations Personnelles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Mettez à jour vos coordonnées et vos paramètres de compte.
              </p>
            </div>

            {/* Card Actions */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase mb-3 sm:mb-4 tracking-wider">
                Actions
              </h3>
              <nav className="space-y-2">
                <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition text-sm sm:text-base active:scale-95">
                  <CreditCard size={18} className="sm:w-5 sm:h-5" />
                  <span>Compte bancaire</span>
                </button>
                <button
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition text-sm sm:text-base active:scale-95"
                  onClick={disconnect}
                >
                  <LogOut size={18} className="sm:w-5 sm:h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>

          {/* PersonalInfoCard - s'adapte */}
          <div className="flex-1 w-full">
            <PersonalInfoCard user={user} />
          </div>
        </div>

        {/* Section Préférences */}
        <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-sm dark:bg-gray-900 dark:border-gray-800 w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-orange-50 text-orange-600 rounded-xl sm:rounded-2xl dark:bg-orange-900/20 dark:text-orange-400">
              <Bell size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Préférences
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800 active:scale-[0.98]">
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base pr-2">
                Alertes de transaction par email
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 sm:w-6 sm:h-6 accent-blue-600 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:accent-blue-400 shrink-0"
              />
            </label>
            <label className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800 active:scale-[0.98]">
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base pr-2">
                Notifications Push
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 sm:w-6 sm:h-6 accent-blue-600 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:accent-blue-400 shrink-0"
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
