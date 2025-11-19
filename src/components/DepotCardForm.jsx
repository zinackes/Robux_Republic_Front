import React, {useEffect, useState} from 'react';
import {ArrowRight, Banknote, FilePenLine, Landmark, MapPin, QrCode, Type, User, Wallet, X} from "lucide-react";
import {Controller, useForm} from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {Input} from "@/components/ui/input.jsx";
import {cancelTransaction, createTransaction} from "@/api/transaction.js";
import {getRobuxBankAccount} from "@/api/bankAccount.js";
import FinishedTransactionModal from "@/components/FinishedTransactionModal.jsx";
import {MultiStepLoader} from "@/components/ui/multi-step-loader.jsx";
import {Button} from "@/components/animate-ui/components/buttons/button.jsx";

function DepotCardForm({allBankAccounts = []}) {

    const {handleSubmit, control} = useForm();


    const [loading, setLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [depotType, setDepotType] = useState("espece");
    const [robuxBankAccount, setRobuxBankAccount] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [createdTransactionData, setCreateTransactionData] = React.useState({});

    const [submitError, setSubmitError] = React.useState("");


    const STEP_DURATION = 1250;

    const loadingStates = [
        {
            text: "Vérification des coordonnées bancaires...",
        },
        {
            text: "Sécurisation de la transaction en cours...",
        },
        {
            text: "Transfert des fonds vers le bénéficiaire...",
        },
        {
            text: "Finalisation de l'opération...",
        }
    ]

    const onSubmit = (values) => {

        const finalPayload = {
            ...values,
            amount: parseFloat(values.amount),
            iban_from: values.iban_from || robuxBankAccount.iban,
            name: values.name || "",
            action: values.iban_bank_from ? "virement" : "depot",
            timestamp: new Date().toISOString(),
            status: "pending",
        }

        createTransaction(finalPayload).then((result) => {
            console.log(result);
            setSubmitError(result?.detail);

            if(result?.detail) return;


            setLoading(true);
            setIsLoading(true);
            const transactionPayload = {
                ...finalPayload,
                ...result,
                to_account: allBankAccounts.find((bank_account) => bank_account.iban === finalPayload.iban_to).name,
                type: depotType === "espece" ? "Espèces" : "Chèque",
            }

            setCreateTransactionData(transactionPayload);
        });
    }

    const onCancel = () => {
        console.log(createdTransactionData);
        cancelTransaction(parseInt(createdTransactionData.transaction_id)).then((result) => {
            console.log(result);
            setSubmitError("Vous avez annuler le virement.")
            setLoading(false);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getRobuxBankAccount().then((result) => setRobuxBankAccount(result));
    }, []);


    useEffect(() => {
        let timer;

        if (isLoading) {
            const totalTime = loadingStates.length * STEP_DURATION;

            timer = setTimeout(() => {
                setLoading(false);
                setIsLoading(false);

                setIsModalOpen(true);

            }, totalTime);
        }

        return () => clearTimeout(timer);
    }, [isLoading, loadingStates.length]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">

                {/* BLOC 1: INTITULÉ */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-green-600 shrink-0">
                        <Type className="text-green-600 w-5 h-5 sm:w-6 sm:h-6"/>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Intitulé
                        </label>
                        <Controller
                            control={control}
                            defaultValue={""}
                            render={({ field }) => (
                                <input {...field}
                                       className="bg-transparent !outline-none w-full font-medium text-gray-900 text-sm sm:text-base placeholder-gray-400 truncate"
                                       placeholder="Motif du dépôt (optionnel)"/>
                            )}
                            name="name"
                        />
                    </div>
                </div>

                {/* BLOC 2: COMPTE DESTINATION */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-green-600 shrink-0">
                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6"/>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Compte de destination
                        </label>

                        <Controller
                            rules={{ required: "Un compte de destination est requis"}}
                            control={control}
                            name="iban_to"
                            render={({ field, fieldState }) => (
                                <div className="relative w-full">
                                    <Select {...field} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full h-auto p-0 border-0 bg-transparent shadow-none !text-black text-sm sm:text-base font-medium focus:ring-0">
                                            <SelectValue placeholder="Sélectionner un compte"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Vos comptes</SelectLabel>
                                                {allBankAccounts.map(account => (
                                                    <SelectItem key={account.iban} value={account.iban} className="text-xs sm:text-sm">
                                                        <span className="font-medium">{account.name}</span>
                                                        <span className="mx-1 text-gray-400">•</span>
                                                        <span>{parseFloat(account.balance).toFixed(2)} RBX</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && (
                                        <p className="text-red-500 text-xs my-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* BLOC 3: SÉLECTEUR DE MÉTHODE */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0">
                            <Banknote className="w-5 h-5 sm:w-6 sm:h-6"/>
                        </div>
                        <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Moyen de dépôt
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setDepotType("espece")}
                            className={`
                                flex justify-center items-center gap-2 
                                py-2 px-3 sm:px-4 rounded-xl border transition-all duration-200 
                                text-sm font-bold cursor-pointer
                                ${depotType === "espece"
                                ? "bg-white border-green-500 text-green-700 shadow-sm"
                                : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
                            }
                            `}>
                            <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Espèces</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setDepotType("cheque")}
                            className={`
                                flex justify-center items-center gap-2 
                                py-2 px-3 sm:px-4 rounded-xl border transition-all duration-200 
                                text-sm font-bold cursor-pointer
                                ${depotType === "cheque"
                                ? "bg-white border-green-500 text-green-700 shadow-sm"
                                : "bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200"
                            }
                            `}>
                            <FilePenLine className="w-4 h-4 sm:w-5 sm:h-5"/>
                            <span>Chèque</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-col gap-4 mb-6 sm:mb-8">

                    {depotType === "espece" ? (
                        <div className="flex flex-row gap-4 items-center">
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 shrink-0">
                                <QrCode size={60} className="sm:w-[80px] sm:h-[80px]"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Point de dépôt</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                                    Présentez ce QR code à un guichet automatique compatible.
                                </p>
                                <button
                                    type="button"
                                    className="mt-2 text-xs font-semibold text-green-600 flex items-center gap-1 hover:underline"
                                >
                                    <MapPin size={14}/>
                                    Localiser un point
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-3 sm:space-y-4">
                            {/* IBAN Émetteur */}
                            <div className="flex flex-row gap-3 items-start sm:items-center w-full">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0 hidden sm:block">
                                    <User className="w-5 h-5"/>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Émetteur du chèque (IBAN)
                                    </label>
                                    <Controller
                                        control={control}
                                        rules={{required: "Emetteur requis"}}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <div className="relative w-full">
                                                <Input {...field}
                                                       className="bg-white border-gray-200 w-full shadow-sm rounded-lg text-sm h-10"
                                                       placeholder="FR76..."
                                                />
                                                {fieldState.error && (
                                                    <p className="text-red-500 text-xs mt-1 mb-1">
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        name="iban_from"
                                    />
                                </div>
                            </div>

                            {/* Banque Émetteur */}
                            <div className="flex flex-row gap-3 items-start sm:items-center w-full">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0 hidden sm:block">
                                    <Landmark className="w-5 h-5"/>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                        Banque de l'émetteur (IBAN)
                                    </label>
                                    <Controller
                                        control={control}
                                        rules={{required: "Banque requise"}}
                                        defaultValue=""
                                        render={({ field, fieldState }) => (
                                            <div className="relative w-full">
                                                <Input {...field}
                                                       className="bg-white border-gray-200 w-full shadow-sm rounded-lg text-sm h-10"
                                                       placeholder="Ex: FR76..."
                                                />
                                                {fieldState.error && (
                                                    <p className="text-red-500 text-xs my-1">
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        name="iban_bank_from"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-purple-50 shadow-purple-50 shadow-sm flex flex-col items-center justify-center gap-2 mt-2 mb-4">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        montant du dépôt
                    </label>
                    <div className="flex items-baseline gap-1 sm:gap-2 justify-center w-full">
                        <Controller
                            control={control}
                            rules={{ required: "Montant requis", valueAsNumber: true,
                                min: {
                                    value: 0.01,
                                    message: "Le montant doit être supérieur à 0"
                                }}}
                            name="amount"
                            defaultValue={0.00}
                            render={({ field, fieldState }) => (
                                <div className="flex flex-col items-center justify-center relative">
                                    <input type="number"
                                           {...field}
                                           className="text-3xl sm:text-5xl font-bold text-center text-gray-900 placeholder-gray-200 outline-none w-full max-w-[200px] sm:max-w-xs bg-transparent p-0 m-0"
                                           placeholder="0.00"
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-[10px] absolute -bottom-4 w-max">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <span className="text-lg sm:text-xl font-medium text-gray-400">
                        RBX
                    </span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto flex gap-2 justify-center items-center ml-auto text-sm sm:text-base py-3 px-6 rounded-xl text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-200 font-medium"
                >
                    Générer le mandat <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>

                {submitError && (
                    <p className="text-red-400 text-xs text-center sm:text-right mt-2">{submitError}</p>
                )}

            </form>


            {loading && (
                <div className={"absolute w-full h-full top-0 left-0 bg-white flex items-center justify-center"}>
                    <MultiStepLoader loadingStates={loadingStates} duration={STEP_DURATION} loading={isLoading} loop={false}/>

                    <div className={"z-999 mt-auto mb-10 flex flex-col items-center"}>
                        <Button
                            onClick={onCancel}
                            className={"z-999 flex items-center font-bold bg-red-50 text-red-600 hover:!bg-red-100 px-10 py-5"}>
                            <X size={50}/> Annuler l'opération
                        </Button>
                        <p className={"text-center text-xs text-gray-400 mt-2 z-999 max-w-xs"}>
                            L'opération sera validée automatiquement à la fin du temps imparti
                        </p>
                    </div>
                </div>
            )}

            <FinishedTransactionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={createdTransactionData}/>
        </>
    );
}

export default DepotCardForm;