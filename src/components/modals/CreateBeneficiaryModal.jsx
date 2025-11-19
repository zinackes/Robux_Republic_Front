import React, {useEffect, useState} from 'react';
import {AlertTriangle, PlusCircle} from "lucide-react";
import {RippleButton, RippleButtonRipples} from "@/components/animate-ui/components/buttons/ripple.jsx";
import {createBeneficiary} from "@/api/beneficiary.js";
import {createPortal} from "react-dom";

function CreateBeneficiaryModal({ibanParams, setBeneficiaries, isOpen, setIsOpen}) {

    const [name, setName] = useState("")
    const [iban, setIban] = useState("")
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadIban = () => {
            console.log(ibanParams);
            if(ibanParams) {
                setIban(ibanParams)
            }
        }

        loadIban();
    }, []);

    const handleSubmit = async () => {
        try {
            const newBeneficiary = await createBeneficiary(name, iban)
            if(setBeneficiaries){
                setBeneficiaries(prev => [...prev, newBeneficiary])
            }
            setIsOpen(false)
            setName("")
            setIban("")
            setError(null)
        } catch (err) {
            console.error("Erreur lors de l’ajout :", err)
            setError(err.message)
        }
    }

    if(!isOpen) return null;

    const contentType = (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div
                className="
      relative
      rounded-3xl
      p-[2px]
      max-w-md
      w-full
      bg-black
      overflow-hidden
      shadow-[0_0_20px_rgba(0,255,200,0.25)]
    "
                style={{
                    background: "linear-gradient(135deg, #00f6ff, #8d00ff)", // Bordure néon
                }}
            >
                <div
                    className="
        bg-white
        rounded-3xl
        p-8
        border border-gray-200
        bg-gradient-to-br from-white to-gray-50
        hover:shadow-xl transition-shadow
      "
                >

                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200">
                            <PlusCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Ajouter un Bénéficiaire
                        </h2>
                    </div>

                    <input
                        type="text"
                        placeholder="Nom du bénéficiaire"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="
          border border-gray-300
          p-3 mb-4
          rounded-xl
          w-full
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
        "
                    />

                    <input
                        type="text"
                        placeholder="IBAN"
                        value={iban}
                        onChange={e => setIban(e.target.value)}
                        className="
          border border-gray-300
          p-3 mb-4
          rounded-xl
          w-full
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
        "
                    />

                    {error && (
                        <div className="
          bg-red-50
          text-red-600
          p-3
          rounded-xl
          mb-4
          border border-red-200
          flex items-center gap-2
        ">
                            <AlertTriangle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="
            px-4 py-2
            rounded-lg
            bg-gray-100
            hover:bg-gray-200
            border border-gray-300
          "
                        >
                            Annuler
                        </button>

                        <RippleButton
                            onClick={handleSubmit}
                            className="
            px-4 py-2
            rounded-lg
            bg-indigo-600
            text-white
            hover:bg-indigo-700
            flex items-center gap-2
            shadow-md
          "
                        >
                            <PlusCircle className="w-5 h-5" />
                            Enregistrer
                            <RippleButtonRipples />
                        </RippleButton>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(contentType, document.body);
}

export default CreateBeneficiaryModal;