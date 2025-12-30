import React from "react";
import {createPortal} from "react-dom";
import {Calendar, Check, Wallet} from "lucide-react";


export default function FinishedTransactionModal({open, onClose, transaction}) {

    if(!open) return null;

    console.log(transaction);



    const modalContent = (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 h-full">
            <div className="absolute inset-0" onClick={onClose}></div>

                <div className={"bg-white border border-gray-100 shadow-2xl duration-300 fade-in flex rounded-[2.5rem] font-text " +
                    "overflow-hidden max-w-5xl w-full "}>
                    <div className={"lg:w-5/12 bg-emerald-600 p-8 md:p-12 text-white relative text-center flex flex-col items-center justify-center shrink-0"}>
                        <div className={"flex flex-col items-center"}>
                            <div className={"w-24 h-24 md:w-28 md:h-28 bg-white text-emerald-600 rounded-[2rem] " +
                                "shadow-2xl shadow-emerald-900/20 mb-8 flex items-center justify-center"}>
                                <Check size={56} strokeWidth={"3"}/>
                            </div>

                            <h2 className={"text-3xl md:text-4xl font-bold mb-4 tracking-tight"}>
                                Succès !
                            </h2>
                            <p className={"text-emerald-50 text-lg font-medium leading-relaxed max-w-xs"}>
                                Votre dépôt a été validé et enregistré sur la blockchain.
                            </p>
                        </div>
                    </div>
                    <div className={"w-full lg:w-7/12 p-8 md:p-12 flex flex-col bg-white relative overflow-y-auto"}>
                        <div className={"flex-1 flex flex-col justify-center"}>
                            <h3 className={"text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-4"}>
                                <span className={"w-8 h-0.5 bg-gray-200 rounded-full"}></span>
                                reçu de transaction
                            </h3>
                            <div className={"flex flex-col items-start mb-10"}>
                                <span className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Montant Transféré</span>
                                <div
                                    className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tighter flex items-baseline flex-wrap">{transaction.amount}<span
                                    className="text-2xl md:text-3xl text-gray-400 ml-2 font-medium">€</span></div>
                            </div>
                            <div className={"space-y-6 md:space-y-8 pr-4"}>
                                {transaction?.to_account && (
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 group">
                                    <span className="text-gray-400 font-medium flex items-center gap-3 group-hover:text-emerald-600 transition-colors text-sm">
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                            <Wallet size={20}/>
                                        </div>
                                        Compte bénéficiaire
                                    </span>
                                        <span className="font-bold text-gray-900 text-base md:text-md text-right">{transaction.to_account}</span>
                                    </div>
                                )}
                                {transaction?.from_account && (
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-4 group">
                                    <span className="text-gray-400 font-medium flex items-center gap-3 group-hover:text-emerald-600 transition-colors text-sm">
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                            <Wallet size={20}/>
                                        </div>
                                        Compte débité
                                    </span>
                                        <span className="font-bold text-gray-900 text-base md:text-md text-right">{transaction.from_account}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4 group">
                                    <span className="text-gray-400 font-medium flex items-center gap-3 group-hover:text-blue-600 transition-colors text-sm">
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                            <Calendar size={20}/>
                                        </div>
                                        Date
                                    </span>
                                    <span className="font-bold text-gray-900 text-base md:text-md text-right">{new Date(transaction.timestamp).toLocaleString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }).replace(':', 'h')}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4 group">
                                    <span className="text-gray-400 font-medium flex items-center gap-3 group-hover:text-emerald-600 transition-colors text-sm">
                                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                            <Wallet size={20}/>
                                        </div>
                                        Transaction
                                    </span>
                                    <span className="font-bold text-gray-900 text-base md:text-md text-right">{transaction.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"}>
                            <button
                                onClick={onClose}
                                className={"col-span-1 md:col-span-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all " +
                                    "shadow-xl shadow-gray-900/10 active:scale-[0.98] text-lg flex justify-center items-center"}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    )
    return createPortal(modalContent, document.body);
}