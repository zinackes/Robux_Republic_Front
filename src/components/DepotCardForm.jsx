import React, {useEffect, useState} from 'react';
import {ArrowRight, Banknote, FilePenLine, Landmark, MapPin, QrCode, Type, User, Wallet} from "lucide-react";
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
import SearchBar from "@/components/SearchBar.jsx";
import {Button} from "@/components/animate-ui/components/buttons/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {createTransaction} from "@/api/transaction.js";
import {getRobuxBankAccount} from "@/api/bankAccount.js";

function DepotCardForm({allBankAccounts}) {

    const {handleSubmit, control} = useForm();

    const [depotType, setDepotType] = useState("espece");
    const [robuxBankAccount, setRobuxBankAccount] = useState({});

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
        });
    }

    useEffect(() => {
        getRobuxBankAccount().then((result) => setRobuxBankAccount(result));
    }, []);

    useEffect(() => {
        console.log(robuxBankAccount);
    }, [robuxBankAccount]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

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
                        defaultValue={""}
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
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-green-600 shrink-0">
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6"/>
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Compte de déstination
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

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-col items-start gap-3 sm:gap-4 mb-6 sm:mb-8"> {/* Marge du bas réduite mais un peu plus grande pour séparer la section montant */}
                <div className={"flex gap-3"}>
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 shrink-0">
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6"/>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0 justify-center">
                        <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Moyen de dépôt
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                        type={"button"}
                        onClick={() => setDepotType("espece")}
                        className={`
                                flex justify-center items-center gap-2 
                                py-2 px-4 rounded-xl border transition-all duration-200 
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
                        type={"button"}
                        onClick={() => setDepotType("cheque")}
                        className={`
                                flex justify-center items-center gap-2 
                                py-3 px-4 rounded-xl border transition-all duration-200 
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

            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-100 flex flex-col items-start gap-3 sm:gap-4 mb-6 sm:mb-8"> {/* Marge du bas réduite mais un peu plus grande pour séparer la section montant */}


                {depotType === "espece" ? (
                    <div className={"flex flex-col md:flex-row gap-8 items-center"}>
                        <div className={"bg-white p-4 rounded-2xl shadow-sm border border-gray-200 shrink-0"}>
                            <QrCode size={90}/>
                        </div>
                        <div className={"flex-1 space-y-4 text-center md:text-left"}>
                            <div>
                                <h3 className={"font-bold text-gray-900 text-lg"}>Point de dépôt</h3>
                                <p className={"text-sm text-gray-500 mt-1"}>
                                    Présentez ce QR code à un guichet automatique compatible ou chez un partenaire.
                                </p>
                            </div>
                            <button
                                type={"button"}
                                className={"text-xs font-semibold text-green-600 flex items-center justify-center md:justify-start gap-2 hover:underline"}
                            >
                                <MapPin size={16}/>
                                Localiser un point de dépôt
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={"w-full space-y-6"}>
                        <div className={"flex flex-col md:flex-row gap-4 md:items-center w-full"}>
                            <div className={"bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-gray-500 shrink-0 hidden md:block"}>
                                <User/>
                            </div>
                            <div className={"flex-1 w-full"}>
                                <label className={"block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"}>
                                    émetteur du chéque (iban)
                                </label>
                                <Controller
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <Input {...field} className={"bg-white border w-full shadow-sm rounded-lg"} placeholder={"FR76..."}/>
                                    )}
                                    name={"iban_from"}
                                />
                            </div>
                        </div>

                        <div className={"flex flex-col md:flex-row gap-4 md:items-center w-full"}>
                            <div className={"bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-gray-500 shrink-0 hidden md:block"}>
                                <Landmark/>
                            </div>
                            <div className={"flex-1 w-full"}>
                                <label className={"block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"}>
                                    Banque de l'émetteur
                                </label>
                                <Controller
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <Input {...field} className={"bg-white border w-full shadow-sm rounded-lg"} placeholder={"FR76..."}/>
                                    )}
                                    name={"iban_bank_from"}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>



            <div className={"bg-white p-8 rounded-3xl border-2 border-purple-50 shadow-purple-50 shadow-sm flex flex-col items-center justify-center gap-4 mt-4 mb-4"}>
                <label className={"text-xs font-bold text-gray-400 uppercase tracking-wider"}>
                    montant du virement
                </label>
                <div className={"flex items-baseline gap-2"}>

                    <Controller
                        control={control}
                        rules={{ required: "Un montant est requis", valueAsNumber: true }}
                        render={({ field, fieldState }) => (
                            <>
                                <div className={"flex flex-col gap-3 items-center justify-center"}>
                                    <input type="number"
                                           {...field}
                                           className={"text-5xl font-bold text-center text-gray-900 placeholder-gray-200 outline-none w-64 bg-transparent"}
                                           placeholder={"0.00"}
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-xs ml-2">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        name={"amount"}
                    />
                    <span className={"text-xl font-medium text-gray-400"}>
                                                RBX
                                            </span>
                </div>
            </div>

            <Button type={"submit"} className={"flex gap-3 ml-auto text-lg !px-8 !py-6 !rounded-xl text-white cursor-pointer bg-blue-600 hover:bg-blue-700 transition shadow-blue-500"}>
                Générer le mandat <ArrowRight/>
            </Button>

        </form>
    );
}

export default DepotCardForm;