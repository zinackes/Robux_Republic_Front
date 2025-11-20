import React, {useEffect} from "react";
import TransactionItem from "@/components/transactions/TransactionItem.jsx";
import { useLocation } from "react-router-dom";
import TransactionDetailsModal from "@/components/transactions/TransactionsDetailsModal.jsx";
import { useState, useMemo } from "react";
import Autocomplete from "@/components/ui/Autocomplete.jsx";

const TransactionList = ({ transactions, toggleView, isExpanded, bankAccountList }) => {

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [transactionsName, setTransactionsName] = useState([""]);
  const [query, setQuery] = useState("");

  const sortedFilteredTransactions = useMemo(() => {
    if (!transactions) return [];

    const sortedFilteredTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    console.log(transactions);
    const lowerCaseQuery = query.toLowerCase();

    return sortedFilteredTransactions.filter((transaction) => {
      return (
          transaction.transaction_name?.toLowerCase().includes(lowerCaseQuery) ||

          transaction.amount?.toString().includes(lowerCaseQuery) ||

          transaction.display_name?.toLowerCase().includes(lowerCaseQuery) ||

          transaction.type?.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [transactions, sortOrder, query]);

  useEffect(() => {
    const getTransactionsNames = () => {
      console.log([...new Set(transactions.map((t) => t.transaction_name))]);
      setTransactionsName([...new Set(transactions.map((t) => t.transaction_name))]);
    }

    getTransactionsNames();
  }, []);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-200">
        Aucune transaction enregistrée pour cette période.
      </div>
    );
  }
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm dark:bg-gray-800 ">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Transactions récentes</h3>

        <div className={"flex items-center gap-10"}>
          <div className="flex items-center space-x-2 text-sm dark:text-gray-300">
            <Autocomplete
                value={query}
                onChange={setQuery}
                suggestionsList={transactionsName}
                placeholder={"Chercher une transaction..."}
            />
            <span className="text-gray-400 text-xs mr-1 whitespace-nowrap mr-2">Trier par date :</span>

            <button
                onClick={() => setSortOrder("asc")}
                className={`p-1 rounded hover:bg-gray-200 transition dark:hover:bg-gray-700 ${
                    sortOrder === "asc"
                        ? "text-blue-600 bg-blue-50 font-bold dark:bg-gray-700 hover:bg-gray-700"
                        : "text-gray-500 dark:text-gray-400"
                }`}
                title="Plus anciennes en premier"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </button>

            <button
                onClick={() => setSortOrder("desc")}
                className={`p-1 rounded hover:bg-gray-200 transition dark:hover:bg-gray-700 ${
                    sortOrder === "desc"
                        ? "text-blue-600 bg-blue-50 font-bold dark:bg-gray-700 hover:bg-gray-700"
                        : "text-gray-500"
                }`}
                title="Plus récentes en premier"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {sortedFilteredTransactions.map((t) => (
        <div
          key={`${t.id}-${t.user_iban}-${t.timestamp}`}
          className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b last:border-b-0 dark:hover:bg-gray-700"
          onClick={() => setSelectedTransaction(t)}
        >
          <TransactionItem transaction={t} />
        </div>
      ))}

      <div className="text-center py-4">
        <button
          className="hover:bg-gray-100 text-blue-600 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out text-sm dark:hover:bg-gray-700 "
          onClick={() => {
            toggleView(!isExpanded);
          }}
        >
          {isExpanded ? "Voir moins" : "Voir tout l'historique"}
        </button>
      </div>

      <TransactionDetailsModal
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionList;
