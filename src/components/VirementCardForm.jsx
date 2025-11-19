import React from 'react';
import {ArrowRight, Landmark, Type, User} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import SearchBar from "@/components/SearchBar.jsx";
import {Button} from "@/components/animate-ui/components/buttons/button.jsx";
import {Controller, useForm} from "react-hook-form";
import {createTransaction} from "@/api/transaction.js";

function VirementCardForm({allBankAccounts}) {

    const {handleSubmit, control, getValues} = useForm();

    const [submitError, setSubmitError] = React.useState("");

    const onSubmit = (values) => {

        const finalPayload = {
            ...values,
            amount: parseFloat(values.amount),
            action: "virement",
            timestamp: new Date().toISOString(),
            iban_bank_from: null,
            status: "pending",
        }

        createTransaction(finalPayload).then((result) => {
            console.log(result);
            setSubmitError(result?.detail);
        });
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                {/* Icône réduite légèrement */}
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0">
                    <Type className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6"/>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0"> {/* min-w-0 empêche l'overflow */}
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Intitulé
                    </label>
                    <Controller
                        control={control}
                        render={({ field }) => (
                            <input {...field}
                                   className="bg-transparent !outline-none w-full font-medium text-gray-900 text-sm sm:text-base placeholder-gray-400 truncate"
                                   placeholder="L'intitulé de votre virement"/>
                        )}
                        name="name"
                    />
                </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0">
                    <Landmark className="w-5 h-5 sm:w-6 sm:h-6"/>
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Compte de débit
                    </label>

                    <Controller
                        rules={{ required: "Un compte de débit est requis"}}
                        control={control}
                        name="iban_from"
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
                                                    <span>{parseFloat(account.balance).toFixed(2)}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="text-red-500 text-[10px] mt-1 absolute -bottom-4 left-0">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8"> {/* Marge du bas réduite mais un peu plus grande pour séparer la section montant */}
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0">
                    <User className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6"/>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Bénéficiaire
                    </label>
                    <Controller
                        control={control}
                        rules={{ required: "Requis"}}
                        name="iban_to"
                        render={({ field, fieldState }) => (
                            <div className="relative">
                                {/* J'ai supposé que SearchBar accepte des classes pour réduire la taille */}
                                <div className="text-sm sm:text-base">
                                    <SearchBar {...field} placeholder="Rechercher un bénéficiaire..." className="w-full bg-transparent outline-none placeholder-gray-400"/>
                                </div>
                                {fieldState.error && (
                                    <p className="text-red-500 text-[10px] mt-1 absolute top-full left-0">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-purple-50 shadow-purple-50 shadow-sm flex flex-col items-center justify-center gap-2 mt-2 mb-4">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                    montant du virement
                </label>
                <div className="flex items-baseline gap-1 sm:gap-2 justify-center w-full">
                    <Controller
                        control={control}
                        rules={{ required: "Bénéficiaire requis", valueAsNumber: true }}
                        name="amount"
                        render={({ field, fieldState }) => (
                            <div className="flex flex-col items-center justify-center relative">
                                <input type="number"
                                       {...field}
                                    // Taille responsive : text-3xl sur mobile, text-5xl sur desktop
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

            <Button type="submit" className="w-full sm:w-auto flex gap-2 justify-center items-center ml-auto text-sm sm:text-base py-3 px-6 rounded-xl text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-200">
                Envoyer les fonds <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
            </Button>

            {submitError && (
                <p className="text-red-400 text-xs text-center sm:text-right mt-2">{submitError}</p>
            )}
        </form>
    );
}

export default VirementCardForm;