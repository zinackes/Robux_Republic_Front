import React, {useEffect, useState} from 'react';
import {cn} from "@/lib/utils.js";
import {ArrowDown, ArrowRight} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
    TabsTrigger
} from "@/components/animate-ui/components/animate/tabs.jsx";
import {useSearchParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {getAllBankAccountsTransfert} from "@/api/bankAccount.js";
import {useUser} from "@/context/UserContext.jsx";
import {fetchBeneficiaries} from "@/api/beneficiary.js";
import VirementCardForm from "@/components/VirementCardForm.jsx";
import DepotCardForm from "@/components/DepotCardForm.jsx";

import AppLayout from "@/components/AppLayout.jsx";

function Transaction() {

    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useUser();

    const [defaultTab, setDefaultTab] = useState(searchParams.get("type") || "virement");
    const [allBankAccounts, setAllBankAccounts] = useState([]);
    const [allBeneficiaries, setAllBeneficiaries] = useState([]);

    useEffect(() => {
        const defineDefaultTab = () => {
            if(searchParams.get("type")){
                setDefaultTab(searchParams.get("type"));
            }
            else{
                setDefaultTab("depot")
            }
        }

        defineDefaultTab();
    }, []);

    useEffect(() => {
        if (user?.uid) {
            getAllBankAccountsTransfert(user.uid).then((result) => {
                setAllBankAccounts(result);
            });
        }

        fetchBeneficiaries().then((result) => {
            setAllBeneficiaries(result);
        })

    }, [user?.uid]);

    if(!defaultTab) return null;

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full py-8">
                
                <Tabs defaultValue={defaultTab} className={"font-text z-20 w-full md:w-2/3 max-w-4xl"}>
                    <TabsList className={"px-1.5 !py-1.5 h-11"}>
                        <TabsTrigger className={"text-md font-text px-10 cursor-pointer"} value={"depot"}>
                            Dépôt
                        </TabsTrigger>
                        <TabsTrigger className={"font-text text-md px-10 cursor-pointer"} value={"virement"}>
                            Virement
                        </TabsTrigger>
                    </TabsList>

                    <Card className={"py-0 mt-6 shadow-lg border-gray-200 dark:border-neutral-700"}>
                        <TabsContents className={"px-6 py-6 relative"}>
                            
                            <TabsContent value={"depot"} className={"flex flex-col gap-6"}>
                                <CardHeader>
                                    <CardTitle className={"text-3xl font-title font-bold flex items-center gap-2"}>
                                        <div className={"bg-green-600/15 rounded-lg px-2.5 py-2"}>
                                            <ArrowDown className={"text-green-600"}/>
                                        </div>
                                        Déposer de l'argent
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DepotCardForm allBankAccounts={allBankAccounts}/>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value={"virement"} className={"flex flex-col gap-6"}>
                                <CardHeader>
                                    <CardTitle className={"text-3xl font-title font-bold flex items-center gap-2"}>
                                        <div className={"bg-blue-600/15 rounded-lg px-2.5 py-2"}>
                                            <ArrowRight className={"text-blue-600"}/>
                                        </div>
                                        Effectuer un virement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={"pb-6"}>
                                    <VirementCardForm allBankAccounts={allBankAccounts}/>
                                </CardContent>
                            </TabsContent>

                        </TabsContents>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}

export default Transaction;