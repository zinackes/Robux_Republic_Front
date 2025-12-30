import React from "react";
import {createPortal} from "react-dom";
import {Calendar, Check, Wallet} from "lucide-react";


export default function FinishedTransactionModal({open, onClose, transaction}) {

    if(!open) return null;

    console.log(transaction);



    const modalContent = (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-6 py-4 overflow-y-auto">
            <div className="absolute inset-0" onClick={onClose}></div>

                <div className={"bg-white border border-gray-100 shadow-2xl duration-300 fade-in flex flex-col lg:flex-row rounded-2xl sm:rounded-3xl font-text " +
                    "overflow-hidden max-w-5xl w-full max-h-[90vh] relative my-auto"}>
                    <div className={"lg:w-5/12 bg-emerald-600 p-6 sm:p-8 md:p-12 text-white relative text-center flex flex-col items-center justify-center shrink-0"}>
                        <div className={"flex flex-col items-center"}>
                            <div className={"w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white text-emerald-600 rounded-xl sm:rounded-2xl " +
                                "shadow-2xl shadow-emerald-900/20 mb-4 sm:mb-6 md:mb-8 flex items-center justify-center"}>
                                <Check size={40} strokeWidth={"3"} className="sm:w-12 sm:h-12 md:w-14 md:h-14"/>
                            </div>

                            <h2 className={"text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight"}>
                                Succès !
                            </h2>
                            <p className={"text-emerald-50 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xs px-2"}>
                                Votre dépôt a été validé et enregistré sur la blockchain.
                            </p>
                        </div>
                    </div>
                    <div className={"w-full lg:w-7/12 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col bg-white relative overflow-y-auto"}>
                        <div className={"flex-1 flex flex-col justify-center"}>
                            <h3 className={"text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-4"}>
                                <span className={"w-6 sm:w-8 h-0.5 bg-gray-200 rounded-full"}></span>
                                reçu de transaction
                            </h3>
                            <div className={"flex flex-col items-start mb-6 sm:mb-8 md:mb-10"}>
                                <span className="text-xs sm:text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Montant Transféré</span>
                                <div
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter flex items-baseline flex-wrap">{transaction.amount}<span
                                    className="text-xl sm:text-2xl md:text-3xl text-gray-400 ml-2 font-medium">€</span></div>
                            </div>
                            <div className={"space-y-4 sm:space-y-6 md:space-y-8 pr-0 sm:pr-2 md:pr-4"}>
                                {transaction?.to_account && (
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 sm:pb-4 group gap-2 sm:gap-0">
                                    <span className="text-gray-400 font-medium flex items-center gap-2 sm:gap-3 group-hover:text-emerald-600 transition-colors text-xs sm:text-sm">
                                        <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors shrink-0">
                                            <Wallet size={16} className="sm:w-5 sm:h-5"/>
                                        </div>
                                        Compte bénéficiaire
                                    </span>
                                        <span className="font-bold text-gray-900 text-sm sm:text-base break-all sm:text-right">{transaction.to_account}</span>
                                    </div>
                                )}
                                {transaction?.from_account && (
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 sm:pb-4 group gap-2 sm:gap-0">
                                    <span className="text-gray-400 font-medium flex items-center gap-2 sm:gap-3 group-hover:text-emerald-600 transition-colors text-xs sm:text-sm">
                                        <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors shrink-0">
                                            <Wallet size={16} className="sm:w-5 sm:h-5"/>
                                        </div>
                                        Compte débité
                                    </span>
                                        <span className="font-bold text-gray-900 text-sm sm:text-base break-all sm:text-right">{transaction.from_account}</span>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 sm:pb-4 group gap-2 sm:gap-0">
                                    <span className="text-gray-400 font-medium flex items-center gap-2 sm:gap-3 group-hover:text-blue-600 transition-colors text-xs sm:text-sm">
                                        <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors shrink-0">
                                            <Calendar size={16} className="sm:w-5 sm:h-5"/>
                                        </div>
                                        Date
                                    </span>
                                    <span className="font-bold text-gray-900 text-sm sm:text-base sm:text-right">{new Date(transaction.timestamp).toLocaleString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }).replace(':', 'h')}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 sm:pb-4 group gap-2 sm:gap-0">
                                    <span className="text-gray-400 font-medium flex items-center gap-2 sm:gap-3 group-hover:text-emerald-600 transition-colors text-xs sm:text-sm">
                                        <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors shrink-0">
                                            <Wallet size={16} className="sm:w-5 sm:h-5"/>
                                        </div>
                                        Transaction
                                    </span>
                                    <span className="font-bold text-gray-900 text-sm sm:text-base sm:text-right">{transaction.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"}>
                            <button
                                onClick={onClose}
                                className={"col-span-1 md:col-span-2 bg-gray-900 hover:bg-black text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all " +
                                    "shadow-xl shadow-gray-900/10 active:scale-[0.98] text-base sm:text-lg flex justify-center items-center min-h-[44px]"}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    )
    return createPortal(modalContent, document.body);
}