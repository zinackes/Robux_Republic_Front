import React, { useEffect } from "react";
import { Info, X, Code2, Users, GitBranch, Zap } from "lucide-react";

export default function ProjectInfoModal({
  open = false,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[200] transition-opacity animate-in fade-in duration-200 px-6 sm:px-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div
        className="
          relative
          rounded-[24px]
          p-[2px]
          max-w-2xl
          w-full
          shadow-[0_0_30px_rgba(0,246,255,0.2)]
          animate-in zoom-in-95 duration-200
        "
        style={{
          background: "linear-gradient(135deg, #00f6ff, #8d00ff)",
        }}
      >
        <div className="bg-white rounded-[22px] p-4 sm:p-6 md:p-8 border border-gray-100 bg-gradient-to-br from-white to-gray-50 flex flex-col max-h-[80vh] dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400">
                <Info size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                À propos de Robux Republic
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors dark:hover:bg-gray-700 shrink-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-1 sm:pr-2 text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 sm:space-y-6 text-sm sm:text-base">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                Bienvenue sur <span className="font-bold text-blue-600 dark:text-blue-400">Robux Republic</span> !
                Cette plateforme bancaire virtuelle a été développée dans un cadre pédagogique.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400 shrink-0">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Stack technique</h3>
                  <p className="text-sm sm:text-base">
                    Frontend <span className="font-semibold text-blue-600 dark:text-blue-400">React</span> avec
                    Vite, backend <span className="font-semibold text-green-600 dark:text-green-400">FastAPI</span> (Python),
                    et base de données <span className="font-semibold text-indigo-600 dark:text-indigo-400">PostgreSQL</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50 border border-green-100 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Équipe & durée</h3>
                  <p className="text-sm sm:text-base">
                    Développé par une équipe de <span className="font-semibold">4 personnes</span> en
                    <span className="font-semibold"> 2 semaines</span>, dont une semaine consacrée au développement
                    et une semaine dédiée au DevOps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400 shrink-0">
                  <GitBranch size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">DevOps & CI/CD</h3>
                  <div className="text-sm sm:text-base space-y-1">
                    <p>Mise en place d'une chaîne complète d'intégration continue :</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      <li>Tests unitaires automatisés</li>
                      <li>Documentation automatique à chaque push</li>
                      <li>Déploiement automatique via GitHub Actions</li>
                      <li>Mise à jour du serveur avec Watchtower</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-400 shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Compte démo</h3>
                  <p className="text-sm sm:text-base">
                    Vous êtes actuellement connecté avec le compte de démonstration.
                    Explorez toutes les fonctionnalités librement !
                  </p>
                  <div className="mt-2 bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-700">
                    <p className="text-xs sm:text-sm font-mono">
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>{" "}
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">demo@republic.fr</span>
                    </p>
                    <p className="text-xs sm:text-sm font-mono">
                      <span className="text-gray-500 dark:text-gray-400">Mot de passe:</span>{" "}
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">Demo123.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="
                px-4 sm:px-6 py-2 sm:py-2.5
                rounded-xl
                bg-gradient-to-r from-blue-600 to-purple-600
                text-white
                font-medium
                text-sm sm:text-base
                hover:from-blue-700 hover:to-purple-700
                hover:shadow-lg
                active:scale-95
                transition-all
                min-h-[44px]
              "
            >
              Découvrir l'application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
