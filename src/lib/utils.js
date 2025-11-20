import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function enrichTransactions(transactions, userBankAccounts, beneficiaries) {
    const names = {};

    userBankAccounts.forEach(account => {
      names[account.iban] = account.name;
    })

    beneficiaries.forEach(account => {
      names[account.iban_to] = account.name;
    })

  console.log(names);

  return transactions.map(transaction => {
    return {
      ...transaction,
      sender_display_name: names[transaction.iban_from] || transaction.iban_from,
      receiver_display_name: names[transaction.iban_to] || transaction.iban_to
    }
  })
}