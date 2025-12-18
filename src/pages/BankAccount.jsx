import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  Download,
  PieChart,
  Ban,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { useUser } from "@/context/UserContext.jsx";
import {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getTransactionsByIbanList } from "@/api/transaction.js";
import { getAllBankAccounts, generateSingleAccountPDF } from "@/api/bankAccount";
import TransactionList from "@/components/transactions/TransactionList.jsx";
import BankCard from "@/components/Card.jsx";
import ModalInfo from "@/components/transactions/ModalInfo.jsx";
import BankDetailsDisplay from "@/components/transactions/BankDetailsDisplay.jsx";
import AnalysisModal from "@/components/transactions/AnalysisModal.jsx";
import DeleteAccountModal from "@/components/modals/DeleteModal.jsx";
import { getMe } from "@/api/auth.js";
import AppLayout from "@/components/layouts/AppLayout.jsx";
import DepotCardForm from "@/components/forms/DepotCardForm.jsx";
import { fetchBeneficiaries } from "@/api/beneficiary.js";
import VirementCardForm from "@/components/forms/VirementCardForm.jsx";
import ModalInfoBig from "@/components/transactions/ModalInfoBig.jsx";
import {enrichTransactions} from "@/lib/utils.js";

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group w-full aspect-square dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/50"
  >
    <div className="p-3 rounded-full bg-gray-50 text-gray-600 group-hover:bg-white group-hover:text-blue-600 transition-colors dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-900/50 dark:group-hover:text-blue-400">
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 tracking-wide uppercase">
      {label}
    </span>
  </button>
);

function BankAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();

  const [bankAccount, setBankAccount] = useState(
    location.state?.bankAccount || null
  );
  const [transactions, setTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(!bankAccount);
  const [isAllTransactionsVisible, setIsAllTransactionsVisible] =
    useState(false);
  const [deleteBankAccount, setDeleteBankAccount] = useState(false);

  const [showInfo, setShowInfo] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const spendingLimit = 2000;
  const spendingPercentage = (monthlyExpenses / spendingLimit) * 100;

  const [createTransactionIsVisible, setCreateTransactionIsVisible] =
    useState(false);

  const [allBankAccounts, setAllBankAccounts] = useState([]);
  const [allBeneficiaries, setAllBeneficiaries] = useState([]);

  const [defaultTab, setDefaultTab] = useState(
    searchParams.get("type") || "virement"
  );

  // Recuperer
  const fetchAccountDetails = useCallback(async () => {
    if (!user?.uid || !location.state?.bankAccount?.iban) return;

    try {
      const data = await getAllBankAccounts(user.uid);
      const accountsList = data.account || (Array.isArray(data) ? data : []);

      if (Array.isArray(accountsList)) {
        const freshAccountData = accountsList.find(
          (acc) =>
            String(acc.iban) === String(location.state?.bankAccount?.iban)
        );

        if (freshAccountData) {
          console.log("Compte mis à jour:", freshAccountData);
          setBankAccount(freshAccountData);
        }
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, location.state?.bankAccount?.iban]);

  // Recuperer les transactions
  const fetchTransactions = useCallback(async () => {
    if (!bankAccount?.iban) return;
    try {
      const data = await getTransactionsByIbanList([bankAccount.iban]);
      setTransactions(enrichTransactions(data.transactions, allBankAccounts, allBeneficiaries));
      setMonthlyExpenses(data.expenses || 0);
      setMonthlyIncome(data.income || 0);
    } catch (error) {
      console.error("Erreur transactions", error);
    }
  }, [bankAccount?.iban]);


  useEffect(() => {
    if (!location.state?.bankAccount) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (searchParams.get("type")) {
      setDefaultTab(searchParams.get("type"));
    } else {
      setDefaultTab("depot");
    }
  }, [searchParams]);

  // Fetch les beneficiaires et les comptes bancaires ouvert (de l'utilisateur)
  useEffect(() => {
    if (user?.uid) {
      getAllBankAccounts(user.uid).then((result) => {
        console.log("Comptes bancaires pour transfert:", result.account);
        setAllBankAccounts(result.account);
      });
    }
    fetchBeneficiaries().then((result) => {
      setAllBeneficiaries(result);
    });
  }, [user?.uid]);

  useEffect(() => {
    fetchAccountDetails();
  }, [fetchAccountDetails]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (!defaultTab) return null;

  // Fonction pour mettre a jour dynamiquement le compte bancaire et les transactions
  const handleTransactionSuccess = async (transaction) => {
    const balance = transaction.type === "Espèces" || transaction.type === "Chèque" ? (Number.parseFloat(bankAccount.balance) + transaction.amount).toString() : (Number.parseFloat(bankAccount.balance) - transaction.amount).toString();
    setBankAccount((prevAccount) => ({
      ...prevAccount,
      balance: balance,
    })); 
    console.log("Nouvelle transaction ajoutée:", transaction);
    const transactionPlayload = {
      ...transaction,
      transaction_name: transaction.name,
      type: transaction.type === "Espèces" || transaction.type === "Chèque" ? "credit" : "",

    }
    setTransactions((prevTransactions) => [
      transactionPlayload,
      ...prevTransactions,
    ]);
  };

  // Fonction pour telecharger le pdf
  const handleDownloadPDF = async () => {
    try {
      const userInfo = await getMe();
      generateSingleAccountPDF(userInfo, bankAccount, transactions);
    } catch (err) {
      console.error(err);
      alert("Impossible de générer le relevé.");
    }
  };

  // Montre le chargement de la page
  if (isLoading || !bankAccount) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-pulse text-blue-600 font-bold">
            Chargement...
          </div>
        </div>
      </AppLayout>
    );
  }

  // Affiche seulement le bon nombre de transactions a la fois
  const displayedTransactions = isAllTransactionsVisible
    ? transactions
    : transactions
    ? transactions.slice(0, 10)
    : [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Détails du Compte
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors w-fit font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour au Dashboard
            </button>
          </div>

          <button
            onClick={() => setCreateTransactionIsVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
          >
            <ArrowRightLeft size={18} />
            Faire une transaction
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <BankCard
                label="SOLDE ACTUEL"
                accountName={bankAccount.name}
                balance={bankAccount.balance}
                iban={bankAccount.iban}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <ActionButton
                icon={Download}
                label="RIB / IBAN"
                onClick={() => setShowInfo(true)}
              />
              <ActionButton
                icon={PieChart}
                label="Analyses"
                onClick={() => setShowAnalysis(true)}
              />
              <ActionButton
                icon={FileText}
                label="Relevés"
                onClick={handleDownloadPDF}
              />
              <ActionButton
                icon={Ban}
                label="Clôturer"
                onClick={() => setDeleteBankAccount(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Plafonds de carte
                </h3>
              </div>

              <div className="space-y-3 mb-10">
                <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-300">
                  <span>Dépensé ce mois (30j)</span>
                  <span>
                    {monthlyExpenses}€ / {spendingLimit}€
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200"
                    style={{ width: `${spendingPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 dark:text-gray-400">
                    Entrées (Mai)
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                    {monthlyIncome.toFixed(2)} €
                    <TrendingDown size={16} className="rotate-45" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 dark:text-gray-400">
                    Sorties (Mai)
                  </p>
                  <div className="flex items-center gap-2 text-gray-800 font-bold text-lg dark:text-gray-200">
                    {monthlyExpenses.toFixed(2)} €
                    <TrendingUp size={16} className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Historique des transactions
            </h2>
          </div>

          <div className="rounded-[2rem] shadow-sm overflow-hidden p-2 ">
            {transactions && transactions.length > 0 ? (
              <TransactionList
                transactions={displayedTransactions}
                toggleView={setIsAllTransactionsVisible}
                isExpanded={isAllTransactionsVisible}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                Aucune transaction.
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalInfo
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title="Coordonnées Bancaires"
      >
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Voici les détails de votre compte courant. Vous pouvez copier l'IBAN
          pour le partager.
        </p>
        <BankDetailsDisplay iban={bankAccount?.iban} bic="RBUXFRPPXXX" />
      </ModalInfo>

      <ModalInfoBig
        open={createTransactionIsVisible}
        onClose={() => setCreateTransactionIsVisible(false)}
        title="Créer une transaction"
      >
        <div className="flex flex-col items-center justify-center w-full py-8">
          <Tabs
            defaultValue={defaultTab}
            className={"font-text z-20 w-full md:w-2/3 max-w-4xl"}
          >
            <TabsList className={"px-1.5 !py-1.5 h-11"}>
              <TabsTrigger
                className={"text-md font-text px-10"}
                value={"depot"}
              >
                Dépôt
              </TabsTrigger>
              <TabsTrigger
                className={"font-text text-md px-10"}
                value={"virement"}
              >
                Virement
              </TabsTrigger>
            </TabsList>

            <Card
              className={
                "py-0 mt-6 shadow-lg border-gray-200 dark:border-neutral-700"
              }
            >
              <TabsContents className={"px-6 py-6 relative"}>
                <TabsContent value={"depot"} className={"flex flex-col gap-6"}>
                  <CardHeader>
                    <CardTitle
                      className={
                        "text-3xl font-title font-bold flex items-center gap-2"
                      }
                    >
                      <div className={"bg-green-600/15 rounded-lg px-2.5 py-2"}>
                        <ArrowDown className={"text-green-600"} />
                      </div>
                      Déposer de l'argent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DepotCardForm
                      allBankAccounts={allBankAccounts}
                      onSuccess={handleTransactionSuccess}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent
                  value={"virement"}
                  className={"flex flex-col gap-6"}
                >
                  <CardHeader>
                    <CardTitle
                      className={
                        "text-3xl font-title font-bold flex items-center gap-2"
                      }
                    >
                      <div className={"bg-blue-600/15 rounded-lg px-2.5 py-2"}>
                        <ArrowRight className={"text-blue-600"} />
                      </div>
                      Effectuer un virement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={"pb-6"}>
                    <VirementCardForm
                      allBankAccounts={allBankAccounts}
                      onSuccess={handleTransactionSuccess}
                    />
                  </CardContent>
                </TabsContent>
              </TabsContents>
            </Card>
          </Tabs>
        </div>
      </ModalInfoBig>

      <AnalysisModal
        open={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        transactions={transactions}
      />
      <DeleteAccountModal
        iban={bankAccount.iban}
        open={deleteBankAccount}
        onClose={() => setDeleteBankAccount(false)}
      />
    </AppLayout>
  );
}

export default BankAccount;
