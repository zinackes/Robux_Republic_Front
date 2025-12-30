import React, { useEffect, useState } from "react";
import { ExternalLink, Wallet, Plus } from "lucide-react";
import { useUser } from "@/context/UserContext.jsx";
import { getAllBankAccounts } from "@/api/bankAccount";
import { getTransactionsByIbanList } from "@/api/transaction.js";
import TransactionList from "@/components/transactions/TransactionList.jsx";
import BankCard from "@/components/Card.jsx";
import { useNavigate } from "react-router-dom";
import CreateAccountModal from "@/components/modals/CreateAccount.jsx";

import AppLayout from "@/components/layouts/AppLayout.jsx";
import {enrichTransactions} from "@/lib/utils.js";
import fetchBeneficiaries from "@/api/beneficiary.js";

const AddAccountCard = () => {
  return (
    <div className="h-64 w-full max-w-md rounded-3xl border-2 border-dashed border-gray-300 bg-white/50 flex flex-col items-center justify-center gap-3 text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 group dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-500 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-gray-700/50">
      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300 dark:bg-gray-700 dark:group-hover:bg-gray-600">
        <Plus size={24} />
      </div>
      <span className="font-bold text-sm tracking-wide">OUVRIR UN COMPTE</span>
    </div>
  );
};

function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllAccountsVisible, setIsAllAccountsVisible] = useState(false);
  const [createAccountIsVisible, setCreateAccountIsVisible] = useState(false);
  const [isAllTransactionsVisible, setIsAllTransactionsVisible] = useState(false);
  const [beneficiaryAccounts, setBeneficiaryAccounts] = useState([]);

  // Ajoute dynamiquement le nouveau compte banquaire
  const handleAccountCreated = (newAccount) => {
    setBankAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    setCreateAccountIsVisible(false);
  };

  // Récupere les benecifiaires de l'utilisateur connecté
  useEffect(() => {
      fetchBeneficiaries().then((result) => {
        if(result){
          setBeneficiaryAccounts(result);
        }
      })
  }, []);

  // Récuperer tout les comptes bancaires actifs de l'utilisateurs
  useEffect(() => {
    if (!user?.uid) return;
    getAllBankAccounts(user.uid).then((data) => {
      if (data.account && Array.isArray(data.account)) {
        setBankAccounts(data.account);
      } else {
        setBankAccounts([]);
      }
    });
  }, [user.uid]);

  // récupere toutes les transactions et ajoute les noms des bénéficiaires
  useEffect(() => {
    const fetchTransactions = async () => {
      if (bankAccounts.length === 0) {
        setIsLoading(false);
        return;
      }
      try {
        const ibanList = bankAccounts.map((acc) => acc.iban);
        const data = await getTransactionsByIbanList(ibanList);
        console.log(data);

        setTransactions(enrichTransactions(data.transactions, bankAccounts, beneficiaryAccounts));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [bankAccounts]);

  if (isLoading) {
    return (
      <AppLayout>
         <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-blue-600 font-bold">Chargement...</div>
         </div>
      </AppLayout>
    );
  }

  // Limite l'affichage ou non des comptes bancaires et transactions
  const displayedBankAccounts = isAllAccountsVisible ? bankAccounts : bankAccounts.slice(0, 5);
  const displayedTransactions = isAllTransactionsVisible ? transactions : transactions ? transactions.slice(0, 10) : [];

  return (
    <AppLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Mes Comptes
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 sm:mt-1 dark:text-gray-300">
                Gérez vos finances et vos transactions
              </p>
            </div>

            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 dark:shadow-gray-900"
              onClick={() => setIsAllAccountsVisible(!isAllAccountsVisible)}
            >
              <ExternalLink size={18} />
              {isAllAccountsVisible ? "Voir moins" : "Voir tous mes comptes"}
            </button>
          </div>

          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {displayedBankAccounts.map((account, index) => (
                <div
                  onClick={() =>
                    navigate(`/bank-account/${account.id}`, {
                      state: { bankAccount: account },
                    })
                  }
                  key={account.id || index}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="flex justify-center md:justify-start">
                    <div className="w-full max-w-md">
                      <BankCard
                        label="COMPTE COURANT"
                        accountName={account.name || "Compte sans nom"}
                        balance={account.balance || 0}
                        iban={account.iban}
                        icon={
                          account.name?.toLowerCase().includes("principal")
                            ? undefined
                            : Wallet
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="flex justify-center md:justify-start"
                onClick={() => setCreateAccountIsVisible(true)}
              >
                <AddAccountCard />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transactions Récentes
              </h2>
            </div>

            {transactions && transactions.length > 0 ? (
              <div className="rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden">
                <TransactionList
                  transactions={displayedTransactions}
                  toggleView={setIsAllTransactionsVisible}
                  isExpanded={isAllTransactionsVisible}
                  bankAccountList={bankAccounts}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                Aucune transaction récente trouvée.
              </div>
            )}
          </div>
        </div>

        <CreateAccountModal
          onSuccess={handleAccountCreated}
          open={createAccountIsVisible}
          onClose={() => setCreateAccountIsVisible(false)}
        />
    </AppLayout>
  );
}

export default Dashboard;