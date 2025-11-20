import React from "react";
import { deleteBankAccount } from "@/api/bankAccount.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DeleteAccountModal({ open, onClose, iban }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  if (!open) return null;

  const handleConfirm = async () => {
    if (!iban) {
      setErrorMessage("Aucun IBAN fourni pour la suppression");
      return;
    }

    try {
      await deleteBankAccount(iban);
      onClose();
      navigate(-1);
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression : " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div
        className="relative rounded-3xl p-[2px] max-w-sm w-full bg-black overflow-hidden shadow-[0_0_20px_rgba(0,255,200,0.25)] z-10"
        style={{
          background: "linear-gradient(135deg, #0e0499ff, #2dafd3ff)",
        }}
      >
        <div className="bg-white rounded-3xl p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100 dark:text-gray-100">
            Confirmer la suppression
          </h2>
          <p className="text-gray-600 mb-6 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est
            irréversible.
          </p>
          <div className="flex justify-end gap-3">
            {errorMessage && (
              <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}