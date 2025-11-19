import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  PieChart,
  Ban,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useUser } from "@/context/UserContext.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getTransactionsByIbanList } from "@/api/transaction.js";
import { cn } from "@/lib/utils";
import { getAllBankAccounts} from "@/api/bankAccount";
import { generateSingleAccountPDF } from "@/api/bankAccount";
import TransactionList from "@/components/transactions/TransactionList.jsx";
import BankCard from "@/components/Card.jsx";
import ModalInfo from "@/components/transactions/ModalInfo.jsx";
import BankDetailsDisplay from "@/components/transactions/BankDetailsDisplay.jsx";
import AnalysisModal from "@/components/transactions/AnalysisModal.jsx";
import DeleteAccountModal from "@/components/DeleteModal.jsx";
import { getMe } from "@/api/auth.js";
import { getTransactionByIban } from "@/api/transaction.js";
import AppLayout from "@/components/AppLayout.jsx";

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md transition-all duration-200 group w-full aspect-square"
  >
    <div className="p-3 rounded-full bg-gray-50 text-gray-600 group-hover:bg-white group-hover:text-blue-600 transition-colors">
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 tracking-wide uppercase">
      {label}
    </span>
  </button>
);

function BankAccount() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!location.state?.bankAccount) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.state, navigate]);

  const [bankAccount, setBankAccount] = useState(
    location.state?.bankAccount || null
  );
  const [transactions, setTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(!bankAccount);
  const [isAllTransactionsVisible, setIsAllTransactionsVisible] = useState(false);
  const [deleteBankAccount, setDeleteBankAccount] = useState(false);

  const [showInfo, setShowInfo] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const spendingLimit = 2000;
  const spendingPercentage = (monthlyExpenses / spendingLimit) * 100;
  const [createAccountIsVisible, setCreateAccountIsVisible] = useState(false);

  useEffect(() => {
    const fetchAccountDetails = async () => {
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
            setBankAccount(freshAccountData);
          } else {
            console.warn("⚠️ Compte introuvable via l'API");
          }
        }
      } catch (error) {
        console.error("❌ Erreur API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountDetails();
  }, [user?.uid, location.state?.bankAccount?.iban]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!bankAccount?.iban) return;
      try {
        const data = await getTransactionsByIbanList([bankAccount.iban]);
        setTransactions(data.transactions);
        setMonthlyExpenses(data.expenses || 0);
        setMonthlyIncome(data.income || 0);
      } catch (error) {
        console.error("Erreur transactions", error);
      }
    };
    fetchTransactions();
  }, [bankAccount]);

  const handleDownloadPDF = async () => {
  try {
    const userInfo = await getMe();
    generateSingleAccountPDF(userInfo, bankAccount, transactions);
  } catch (err) {
    console.error(err);
    alert("Impossible de générer le relevé.");
  }
};



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

  const displayedTransactions = isAllTransactionsVisible
    ? transactions
    : transactions
      ? transactions.slice(0, 10)
      : [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Détails du Compte
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-400 hover:text-gray-700 transition-colors w-fit font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour au Dashboard
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

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Plafonds de carte
                </h3>
              </div>

              <div className="space-y-3 mb-10">
                <div className="flex justify-between text-sm font-bold text-gray-600">
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
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Entrées (Mai)
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                    {monthlyIncome.toFixed(2)} €
                    <TrendingDown size={16} className="rotate-45" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Sorties (Mai)
                  </p>
                  <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
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

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-2">
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
        <p className="mb-4 text-gray-600">
          Voici les détails de votre compte courant. Vous pouvez copier l'IBAN
          pour le partager.
        </p>
        <BankDetailsDisplay iban={bankAccount?.iban} bic="RBUXFRPPXXX" />
      </ModalInfo>

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