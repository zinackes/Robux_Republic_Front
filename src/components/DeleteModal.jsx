import React, { useState } from "react";
import { deleteBankAccount } from "@/api/BankAccount.js";


export default function DeleteAccountPage() {
  const [showPopup, setShowPopup] = useState(false);

  const handleConfirm = async () => {
    const iban = "FR7630090831998818373264RobuxCommunity"; 
    console.log("Compte supprimé !");
    await deleteBankAccount(iban);
    console.log("Compte supprimé !");
    setShowPopup(false);
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <button
        onClick={() => setShowPopup(true)}
        className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md"
      >
        Supprimer le compte
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div
            className="relative rounded-3xl p-[2px] max-w-sm w-full bg-black overflow-hidden shadow-[0_0_20px_rgba(0,255,200,0.25)]"
            style={{ background: "linear-gradient(135deg, #0e0499ff, #2dafd3ff)" }}
          >
            <div className="bg-white rounded-3xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Confirmer la suppression
              </h2>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
