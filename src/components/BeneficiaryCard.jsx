import React from 'react'
import { User, Trash2, Copy, ShieldCheck } from "lucide-react";
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
        <div className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">

            {/* Decorative Header */}
            <div className={`h-28 bg-gradient-to-r ${getGradient(beneficiary.id.toString())} relative`}>
                <div className="relative mb-4 flex justify-center items-center ">
                    <div>
                        <img src="avatar.png" className="w-36 h-36" />
                    </div>
                </div>
            </div>
            

            {/* Avatar & Info */}
            <div className="px-6 py-4 relative flex flex-col items-center text-center flex-1">
                
                <h3 className="font-bold text-gray-900 text-xl mb-1">{beneficiary.name}</h3>

                {/* IBAN Display */}
                <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-4 group-hover:border-blue-200 transition-colors relative group/iban">
                    
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 text-left flex justify-between">
                        Identifiant Bancaire
                    </p>
                    <p className="font-mono text-xs font-medium text-gray-700 tracking-tight text-center break-words ">
                        {beneficiary.iban_to}
                    </p>
                    <p className="font-mono text-[8px] font-light italic text-gray-700 tracking-tight break-words text-left opacity-30 mt-2">
                        {beneficiary.creation_date.slice(8, 10)}/{beneficiary.creation_date.slice(5, 7)}/{beneficiary.creation_date.slice(0, 4)}

                    </p>
                </div>
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


    )
}

export default BeneficiaryCard