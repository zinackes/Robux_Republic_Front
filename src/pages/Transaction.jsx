import React, {useEffect, useState} from 'react';
import {cn} from "@/lib/utils.js";
import DropdownTransactionMenu from "@/components/DropdownTransactionMenu.jsx";
import {motion} from "motion/react";
import {LayoutTextFlip} from "@/components/ui/layout-text-flip.jsx";
import {ArrowDown, ArrowRight, ArrowUpDown, Landmark, MoveUpRight, User} from "lucide-react";
import {GradientBackground} from "@/components/animate-ui/components/backgrounds/gradient.jsx";
import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
    TabsTrigger
} from "@/components/animate-ui/components/animate/tabs.jsx";
import {useSearchParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.jsx";
import {getAllBankAccounts} from "@/api/bankAccount.js";
import {useUser} from "@/context/UserContext.jsx";
import {Button} from "@/components/animate-ui/components/buttons/button.jsx";
import SearchBar from "@/components/SearchBar.jsx";
import {fetchBeneficiaries} from "@/api/beneficiary.js";
import VirementCardForm from "@/components/VirementCardForm.jsx";
import DepotCardForm from "@/components/DepotCardForm.jsx";

function Transaction() {

    const [searchParams, setSearchParams] = useSearchParams();

    const { user } = useUser();

    const [defaultTab, setDefaultTab] = useState(null);
    const [allBankAccounts, setAllBankAccounts] = useState([]);
    const [allBeneficiaries, setAllBeneficiaries] = useState([]);

    useEffect(() => {
        const defineDefaultTab = () => {
            if(searchParams){
                setDefaultTab(searchParams.get("type"));
            }
        }

        defineDefaultTab();
    }, []);

    useEffect(() => {
        getAllBankAccounts(user.uid).then((result) => {
            setAllBankAccounts(result);
        });

        fetchBeneficiaries().then((result) => {
            setAllBeneficiaries(result);
        })

    }, []);

    if(!defaultTab) return null;

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-white dark:bg-black">
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                )}
            />
            {/* Radial gradient for the container to give a faded look */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

                <Tabs defaultValue={defaultTab} className={"font-text z-20 w-2/3"}>
                    <TabsList className={"px-1.5 !py-1.5 h-11"}>
                        <TabsTrigger className={"text-md font-text px-10"} value={"depot"}>Dépôt</TabsTrigger>
                        <TabsTrigger className={"font-text text-md px-10"} value={"virement"}>Virement</TabsTrigger>
                    </TabsList>
                    <Card className={"py-0"}>
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
    );
}

export default Transaction;