import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs.jsx";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { getAllBankAccountsTransfert } from "@/api/bankAccount.js";
import { useUser } from "@/context/UserContext.jsx";
import VirementCardForm from "@/components/forms/VirementCardForm.jsx";
import DepotCardForm from "@/components/forms/DepotCardForm.jsx";

import AppLayout from "@/components/layouts/AppLayout.jsx";

function Transaction() {
  const [searchParams] = useSearchParams();
  const { user } = useUser();

  const [defaultTab, setDefaultTab] = useState(
    searchParams.get("type") || "virement"
  );
  const [allBankAccounts, setAllBankAccounts] = useState([]);

  useEffect(() => {
    const defineDefaultTab = () => {
      if (searchParams.get("type")) {
        setDefaultTab(searchParams.get("type"));
      } else {
        setDefaultTab("depot");
      }
    };

    defineDefaultTab();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      getAllBankAccountsTransfert(user.uid).then((result) => {
        const allOpenBankAccounts = result?.filter((bankAccount) => bankAccount?.is_closed === false) ?? [];
        setAllBankAccounts(allOpenBankAccounts)
      });
    }
  }, [user?.uid]);

  if (!defaultTab) return null;

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full py-4 sm:py-8 px-3 sm:px-4">

                <Tabs defaultValue={defaultTab} className={"font-text z-20 w-full sm:w-11/12 md:w-2/3 max-w-4xl"}>
                    <TabsList className={"px-1.5 !py-1.5 h-10 sm:h-11 w-full sm:w-auto"}>
                        <TabsTrigger className={"text-sm sm:text-md font-text px-6 sm:px-10 cursor-pointer flex-1 sm:flex-initial"} value={"depot"}>
                            Dépôt
                        </TabsTrigger>
                        <TabsTrigger className={"font-text text-sm sm:text-md px-6 sm:px-10 cursor-pointer flex-1 sm:flex-initial"} value={"virement"}>
                            Virement
                        </TabsTrigger>
                    </TabsList>

          <Card
            className={
              "py-0 mt-4 sm:mt-6 shadow-lg border-gray-200 dark:border-neutral-700"
            }
          >
            <TabsContents className={"px-4 sm:px-6 py-4 sm:py-6 relative"}>
              <TabsContent value={"depot"} className={"flex flex-col gap-4 sm:gap-6"}>
                <CardHeader className="px-0">
                  <CardTitle
                    className={
                      "text-2xl sm:text-3xl font-title font-bold flex items-center gap-2"
                    }
                  >
                    <div className={"bg-green-600/15 rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2"}>
                      <ArrowDown className={"text-green-600 w-5 h-5 sm:w-6 sm:h-6"} />
                    </div>
                    Déposer de l'argent
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <DepotCardForm allBankAccounts={allBankAccounts} />
                </CardContent>
              </TabsContent>

              <TabsContent value={"virement"} className={"flex flex-col gap-4 sm:gap-6"}>
                <CardHeader className="px-0">
                  <CardTitle
                    className={
                      "text-2xl sm:text-3xl font-title font-bold flex items-center gap-2"
                    }
                  >
                    <div className={"bg-blue-600/15 rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2"}>
                      <ArrowRight className={"text-blue-600 w-5 h-5 sm:w-6 sm:h-6"} />
                    </div>
                    Effectuer un virement
                  </CardTitle>
                </CardHeader>
                <CardContent className={"px-0 pb-4 sm:pb-6"}>
                  <VirementCardForm allBankAccounts={allBankAccounts} />
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
