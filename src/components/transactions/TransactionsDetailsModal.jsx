import React, { useState } from "react";
import ModalInfo from "./ModalInfo.jsx";
import {
  Copy,
  Check,
  Landmark,
  User,
  Banknote,
  Calendar,
  Hash,
  ArrowRight,
} from "lucide-react";

const ReadOnlyField = ({
  label,
  value,
  icon: Icon,
  copyable = false,
  highlightColor,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyable || !value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>

      <div
        onClick={copyable ? handleCopy : undefined}
        className={`
          group relative
          flex items-center justify-between
          w-full p-3.5 rounded-xl
          bg-gray-50 border border-gray-200
          text-gray-700 font-mono text-sm md:text-base
          transition-all duration-200
          ${
            copyable
              ? "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50"
              : ""
          }
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden w-full">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-white text-gray-400 shadow-sm border border-gray-100 shrink-0">
              <Icon size={16} />
            </div>
          )}
          <span
            className={`truncate select-all font-medium ${
              highlightColor || ""
            }`}
          >
            {value || "Non renseigné"}
          </span>
        </div>

        {copyable && (
          <div className="pl-3 shrink-0">
            {copied ? (
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md animate-in fade-in zoom-in">
                <Check size={12} />
              </span>
            ) : (
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                title="Copier"
              >
                <Copy size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TransactionDetailsModal({
  open,
  onClose,
  transaction,
}) {
  if (!transaction && open) return null;
  if (!transaction) return null;

  const isCredit = transaction.type === "credit";
  const amount = parseFloat(transaction.amount || 0);
  const formattedAmount = `${isCredit ? "+" : "-"}${Math.abs(amount).toFixed(
    2
  )} €`;
  const amountColor = isCredit ? "text-green-600" : "text-gray-900";

  let formattedDate = "Date inconnue";
  if (transaction.date || transaction.timestamp) {
    const d = new Date(transaction.date || transaction.timestamp);
    formattedDate = d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <ModalInfo open={open} onClose={onClose} title="Détails de l'opération">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1">
        <div className="p-4">
          <ReadOnlyField
            label="Montant de la transaction"
            value={formattedAmount}
            icon={Banknote}
            highlightColor={`text-lg font-bold ${amountColor}`}
          />

          <ReadOnlyField
            label="Date et Heure"
            value={formattedDate}
            icon={Calendar}
          />

          <div className="my-4 flex items-center gap-2 text-xs text-gray-300 uppercase font-bold">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span>Flux Financier</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <ReadOnlyField
            label="Compte Débité"
            value={transaction.iban_from}
            icon={Landmark}
            copyable={true}
          />

          <ReadOnlyField
            label="Compte Crédité "
            value={transaction.iban_to}
            icon={ArrowRight}
            copyable={true}
          />

          {transaction.id && (
            <ReadOnlyField
              label="Référence Transaction"
              value={String(transaction.id)}
              icon={Hash}
              copyable={true}
            />
          )}
        </div>

        <div className="bg-gray-50 p-3 text-center border-t border-gray-100 rounded-b-xl">
          <p className="text-xs text-gray-500">
            Preuve de transaction numérique certifiée.
          </p>
        </div>
      </div>
    </ModalInfo>
  );
}
