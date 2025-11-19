// fonction pour récupérer les transactions par IBAN
export const getTransactionByIban = async (iban) => {
  try {
    const res = await fetch(
      "http://localhost:8000/transactions/transactions/" + iban,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const completedTransactions = Array.isArray(data)
        ? data.filter((t) => t.status === "completed") 
        : [];

      return {
        transactions: completedTransactions,
        userIban: iban,
      };
    }
  } catch (e) {
    return null;
  }
};

const processAllTransactions = (apiResults) => {
  let finalTransactionList = [];

  let expensesThisMonth = 0;
  let incomeThisMonth = 0;

  const now = new Date();
  const currentMonth = now.getMonth(); 
  const currentYear = now.getFullYear();

  apiResults.forEach((result) => {
    if (
      !result ||
      !result.transactions ||
      !Array.isArray(result.transactions)
    ) {
      return;
    }

    const currentIban = result.userIban;

    const processedTransactions = result.transactions.map((transaction) => {
      let type;
      let counterparty;

      if (transaction.iban_to === currentIban) {
        type = "credit";
        counterparty = transaction.account_name || transaction.iban_from;
      } else if (transaction.iban_from === currentIban) {
        type = "debit";
        counterparty = transaction.account_name || transaction.iban_to;
      } else {
        type = "unknown";
        counterparty = null;
      }

      let ts = transaction.timestamp;

      if (typeof ts === "number") {
        if (ts < 10000000000) {
          ts = ts * 1000;
        }
      }

      const tDate = new Date(ts);
   
      if (
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      ) {
        const amount = Math.abs(parseFloat(transaction.amount));

        if (type === "debit") {
          expensesThisMonth += amount;
        } else if (type === "credit") {
          incomeThisMonth += amount;
        }
      }

      return {
        ...transaction,
        type: type,
        user_iban: currentIban,
        display_name: counterparty,
      };
    });

    finalTransactionList = finalTransactionList.concat(processedTransactions);
  });

  finalTransactionList.sort((a, b) => b.id - a.id);

  return {
    transactions: finalTransactionList,
    expenses: expensesThisMonth, 
    income: incomeThisMonth, 
  };
};

// fonction pour récupérer les transactions par une liste d'IBANs
export const getTransactionsByIbanList = async (ibanList) => {
  if (!ibanList || ibanList.length === 0) {
    return [];
  }

  const promises = ibanList.map((iban) => getTransactionByIban(iban));

  try {
    const results = await Promise.all(promises);

    const successfulResults = results.filter(Boolean);

    const allProcessedTransactions = processAllTransactions(successfulResults);
    return allProcessedTransactions;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération ou du traitement des transactions:",
      error
    );
    return [];
  }
};



export const createTransaction = async (transaction) => {

    try {
        const res = await fetch("http://localhost:8000/transactions/transactions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                ...transaction
            })
        })

        return res.json();
    } catch (e) {
        console.error(e)
    }
}

export const cancelTransaction = async (transaction_id) => {
    try {
        const res = await fetch(`http://localhost:8000/transactions/transaction/${transaction_id}/cancel`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                id: transaction_id
            })
        })

        return res.json();
    } catch (e) {
        console.error(e)
    }
}