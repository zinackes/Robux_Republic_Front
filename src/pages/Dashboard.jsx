import React, { useEffect, useState } from "react";
// 1. On retire 'Sidebar' des imports lucide pour éviter les conflits de noms
import { ExternalLink, Wallet, Plus, LayoutDashboard, User, Settings, LogOut } from "lucide-react"; 
import { useUser } from "@/context/UserContext.jsx";

import { getAllBankAccounts } from "@/api/bankAccount";
import { getTransactionsByIbanList } from "@/api/transaction.js";

import TransactionList from "@/components/transactions/TransactionList.jsx";
import BankCard from "@/components/Card.jsx";

import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
// import { Navigate } from "react-router-dom"; // Inutile si vous utilisez useNavigate

import CreateAccountModal from "@/components/CreateAccount.jsx";

// 2. Import correct des composants Aceternity Sidebar
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

const AddAccountCard = () => {
  return (
    <div className="h-64 w-full max-w-md rounded-3xl border-2 border-dashed border-gray-300 bg-white/50 flex flex-col items-center justify-center gap-3 text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 group">
      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <Plus size={24} />
      </div>
      <span className="font-bold text-sm tracking-wide">OUVRIR UN COMPTE</span>
    </div>
  );
};

// Petit composant Logo pour la Sidebar
export const Logo = () => {
  return (
    <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
        Bank App
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
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

  // 3. État pour la Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 4. Définition des liens de navigation
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Déconnexion",
      href: "#",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const handleAccountCreated = (newAccount) => {
    setBankAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    setCreateAccountIsVisible(false);
  };

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

  useEffect(() => {
    const fetchTransactions = async () => {
      if (bankAccounts.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const ibanList = bankAccounts.map((acc) => acc.iban);
        const data = await getTransactionsByIbanList(ibanList);
        setTransactions(data.transactions);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [bankAccounts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-600 font-bold">
          Chargement de vos finances...
        </div>
      </div>
    );
  }

  const displayedBankAccounts = isAllAccountsVisible
    ? bankAccounts
    : bankAccounts.slice(0, 5);

  const displayedTransactions = isAllTransactionsVisible
    ? transactions
    : transactions
    ? transactions.slice(0, 10)
    : [];

  // 5. Structure de retour modifiée pour inclure la Sidebar
  return (
    <div className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // Prend toute la hauteur de l'écran
      )}>
      
      {/* Zone Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {sidebarOpen ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.name || "Utilisateur",
                href: "#",
                icon: (
                   <div className="h-7 w-7 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                   </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Zone Contenu Principal (Votre ancien Dashboard) */}
      <div className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-neutral-900">
        
        {/* Background Pattern */}
        <div
          className={cn(
            "absolute inset-0 z-0 pointer-events-none",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        {/* Contenu Scrollable */}
        <div className="p-6 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Mes Comptes
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Gérez vos finances et vos transactions
                </p>
              </div>

              <button
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                onClick={() => setIsAllAccountsVisible(!isAllAccountsVisible)}
              >
                <ExternalLink size={18} />
                {isAllAccountsVisible ? "Voir moins" : "Voir tous mes comptes"}
              </button>
            </div>

            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <h2 className="text-xl font-bold text-gray-900">
                  Transactions Récentes
                </h2>
              </div>

              {transactions && transactions.length > 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <TransactionList
                    transactions={displayedTransactions}
                    toggleView={setIsAllTransactionsVisible}
                    isExpanded={isAllTransactionsVisible}
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  Aucune transaction récente trouvée.
                </div>
              )}
            </div>
          </div>
        </div>

        <CreateAccountModal
          onSuccess={handleAccountCreated}
          open={createAccountIsVisible}
          onClose={() => setCreateAccountIsVisible(false)}
        />
      </div>
    </div>
  );
}

export default Dashboard;