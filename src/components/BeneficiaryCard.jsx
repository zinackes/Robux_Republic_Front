import React from 'react'
import { User, Trash2 } from "lucide-react";
import { deleteBeneficiary } from '@/api/beneficiary.js';
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple'

const BeneficiaryCard = ({ beneficiary, setError, setBeneficiaries }) => {

    const getGradient = (id) => {
        const gradients = [
            'from-blue-500 to-cyan-400',
            'from-purple-500 to-indigo-500',
            'from-emerald-400 to-teal-500',
            'from-orange-400 to-pink-500',
            'from-gray-700 to-black'
        ];
        const index = id.charCodeAt(id.length - 1) % gradients.length;
        return gradients[index];
    };


    return (
        <li
            className="
              bg-white rounded-xl shadow-md p-0 overflow-hidden border 
              hover:shadow-xl hover:border-indigo-400 
              transition-all h-48 flex flex-col
            "
        >

            <div className="bg-indigo-600 text-white px-4 py-2 text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                {beneficiary.name}
            </div>

            <div className="p-4 flex flex-col justify-between h-full relative">

                <div>
                    <p className="text-gray-500 text-sm break-words">{beneficiary.iban_to}</p>

                    <p className="text-gray-400 text-xs mt-1 break-words">
                        {beneficiary.creation_date.slice(8, 10)}/{beneficiary.creation_date.slice(5, 7)}/{beneficiary.creation_date.slice(0, 4)}
                    </p>
                </div>

                <div className="absolute bottom-3 right-3">
                    <RippleButton
                        onClick={() => {
                            deleteBeneficiary(beneficiary.iban_to)
                                .then(() => {
                                    setBeneficiaries(prev => prev.filter(ben => ben.iban_to !== beneficiary.iban_to))
                                })
                                .catch(err => {
                                    console.error("Erreur suppression :", err)
                                    setError(err.message)
                                })
                        }}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <Trash2 className="w-5 h-5" />
                        <RippleButtonRipples />
                    </RippleButton>
                </div>
            </div>

        </li>
    )
}

export default BeneficiaryCard