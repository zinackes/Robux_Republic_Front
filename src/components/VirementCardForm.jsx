import React, {useEffect} from 'react';
import {ArrowRight, Landmark, Loader, Type, User, X} from "lucide-react";
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
import {cancelTransaction, createTransaction} from "@/api/transaction.js";
import {MultiStepLoader} from "@/components/ui/multi-step-loader.jsx";
import Autocomplete from "@/components/ui/Autocomplete.jsx";
import {fetchBeneficiaries} from "@/api/beneficiary.js";

function VirementCardForm({allBankAccounts}) {

    const {handleSubmit, control} = useForm();

    const [submitError, setSubmitError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [beneficiaries, setBeneficiaries] = React.useState([]);
    const [beneficiariesName, setBeneficiariesName] = React.useState([]);

    const [createdTransactionData, setCreateTransactionData] = React.useState({});

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

    useEffect(() => {
        fetchBeneficiaries().then((response) => {
            setBeneficiaries(response);

            const getBeneficiariesName = response.map((beneficiary) => {
                return beneficiary.name;
            })
            setBeneficiariesName(getBeneficiariesName);
            console.log(beneficiaries);
        })
    }, [])

    useEffect(() => {
        console.log(beneficiaries)
    }, [beneficiaries]);


    const onSubmit = (values) => {

        console.log(values.iban_to);
        const getBeneficiaryIban = beneficiaries.find((beneficiary) => beneficiary.name === values.iban_to).iban_to ?? values.iban_to;

        console.log(getBeneficiaryIban);
        const finalPayload = {
            ...values,
            amount: parseFloat(values.amount),
            iban_to: getBeneficiaryIban,
            name: values.name || "",
            action: "virement",
            timestamp: new Date().toISOString(),
            iban_bank_from: null,
            status: "pending",
        }

        console.log(finalPayload)

        createTransaction(finalPayload).then((result) => {
            console.log(result);
            setSubmitError(result?.detail);

            if(result?.detail) return;

            setLoading(true);
            setIsLoading(true);
            setCreateTransactionData(result);
        });
    }

    const onCancel = () => {
        cancelTransaction(parseInt(createdTransactionData.transaction_id)).then((result) => {
            console.log(result);
            setSubmitError("Vous avez annuler le virement.")
            setLoading(false);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        console.log(isLoading)
    }, [isLoading]);

    return (
        <>
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
                                        <Autocomplete {...field} suggestionsList={beneficiariesName} />
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
                            rules={{ required: "Montant requis", valueAsNumber: true }}
                            name="amount"
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

                <Button type="submit" className="w-full sm:w-auto flex gap-2 justify-center items-center ml-auto text-sm sm:text-base py-3 px-6 rounded-xl text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-200">
                    Envoyer les fonds <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
                </Button>

                {submitError && (
                    <p className="text-red-400 text-xs text-center sm:text-right md:text-sm mt-2">{submitError}</p>
                )}
            </form>

            {loading && (
                <div className={"absolute w-full h-full top-0 left-0 bg-white flex items-center justify-center"}>
                    <MultiStepLoader loadingStates={loadingStates} duration={1250} loading={isLoading} loop={false}/>

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
        </>
    );
}

export default VirementCardForm;