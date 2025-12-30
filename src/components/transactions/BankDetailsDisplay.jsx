import React, { useState } from "react";
import { Copy, Check, Landmark, User } from "lucide-react";

const ReadOnlyField = ({ label, value, icon: Icon, copyable = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyable || !value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-3 sm:mb-4 last:mb-0">
      <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>

      <div
        onClick={copyable ? handleCopy : undefined}
        className={`
          group relative
          flex items-center justify-between
          w-full p-2.5 sm:p-3.5 rounded-xl
          bg-gray-50 border border-gray-200
          text-gray-700 font-mono text-xs sm:text-sm
          transition-all duration-200
          dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300
          min-h-[44px]
          ${
            copyable
              ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-500"
              : ""
          }
        `}
      >
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          {Icon && (
            <div className="p-1 sm:p-1.5 rounded-lg bg-white text-gray-400 shadow-sm border border-gray-100 shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              <Icon size={14} className="sm:w-4 sm:h-4" />
            </div>
          )}
          <span className="truncate select-all font-medium break-all">
            {value || "Non renseigné"}
          </span>
        </div>

        {copyable && (
          <div className="pl-2 sm:pl-3 shrink-0">
            {copied ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md animate-in fade-in zoom-in">
                <Check size={10} className="sm:w-3 sm:h-3" /> Copié
              </span>
            ) : (
              <button
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                title="Copier dans le presse-papier"
              >
                <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function BankDetailsDisplay({
  iban,
  bic = "Non disponible",
  owner,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-3 sm:p-4">
        {owner && (
          <ReadOnlyField
            label="Titulaire du compte"
            value={owner}
            icon={User}
          />
        )}

        <ReadOnlyField
          label="IBAN"
          value={iban}
          icon={Landmark}
          copyable={true}
        />

        <div className="flex gap-4">
          <div className="w-full">
            <ReadOnlyField
              label="Code BIC / SWIFT"
              value={bic}
              copyable={true}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-2.5 sm:p-3 text-center border-t border-gray-100 rounded-b-xl dark:bg-gray-800 dark:border-gray-700">
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
          Utilisez ces coordonnées pour effectuer des virements vers ce compte.
        </p>
      </div>
    </div>
  );
}
