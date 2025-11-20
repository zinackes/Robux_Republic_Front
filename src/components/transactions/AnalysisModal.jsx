import React, { useMemo } from "react";
import ModalInfo from "./ModalInfo.jsx";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  PieChart,
} from "lucide-react";

const TransactionMiniItem = ({ t }) => {
  const isCredit = t.type === "credit";
  const amount = parseFloat(t.amount).toFixed(2);
  const date = t.date ? new Date(t.date).toLocaleDateString() : "Date inconnue";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-200 group dark:bg-gray-800 dark:border-indigo-700">
      <div className="flex items-center gap-3">
        <div
          className={`
          p-2 rounded-full dark:bg-gray-700
          ${
            isCredit ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }
          group-hover:scale-110 transition-transform
        `}
        >
          {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 truncate max-w-[150px]">
            {t.iban_from || t.counterparty_name || "Opération"}
          </p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <span
        className={`font-mono font-bold text-sm dark:text-gray-200 ${
          isCredit ? "text-green-600" : "text-gray-900"
        }`}
      >
        {isCredit ? "+" : "-"}
        {Math.abs(amount)} €
      </span>
    </div>
  );
};

const ExpenseDonut = ({ transactions }) => {
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#94a3b8"];
  const chartData = useMemo(() => {
    if (!transactions) return [];
    const expenses = transactions.filter((t) => t.type === "debit");
    const totalExpenses = expenses.reduce(
      (acc, t) => acc + Math.abs(parseFloat(t.amount)),
      0
    );

    if (totalExpenses === 0) return [];

    const groups = {};
    expenses.forEach((t) => {
      const name = t.iban_from || t.counterparty_name || "Divers";
      const amount = Math.abs(parseFloat(t.amount));
      groups[name] = (groups[name] || 0) + amount;
    });

    let sorted = Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value,
        percent: (value / totalExpenses) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    if (sorted.length > 4) {
      const top4 = sorted.slice(0, 4);
      const othersValue = sorted
        .slice(4)
        .reduce((acc, curr) => acc + curr.value, 0);
      top4.push({
        name: "Autres",
        value: othersValue,
        percent: (othersValue / totalExpenses) * 100,
      });
      sorted = top4;
    }

    return sorted;
  }, [transactions]);

  if (chartData.length === 0)
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        Pas assez de données pour le graphique.
      </div>
    );

  let currentAngle = 0;
  const gradientParts = chartData.map((item, index) => {
    const start = currentAngle;
    const end = currentAngle + item.percent;
    currentAngle = end;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  });
  const backgroundStyle = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-4 dark:bg-gray-800 dark:border-gray-700 dark:border-indigo-700">
      <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
        <PieChart size={14} /> Répartition des Dépenses
      </h4>

      <div className="flex items-center gap-6">
        <div
          className="relative w-32 h-32 rounded-full shrink-0"
          style={{ background: backgroundStyle }}
        >
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
            <span className="text-xs font-bold text-gray-400">TOP 5</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                ></div>
                <span
                  className="text-gray-600 font-medium truncate max-w-[100px]"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-gray-900">
                {Math.round(item.percent)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function AnalysisModal({
  open,
  onClose,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  transactions = [],
}) {
  const totalFlow = Math.abs(monthlyIncome) + Math.abs(monthlyExpenses);
  const incomePercent =
    totalFlow === 0 ? 50 : (Math.abs(monthlyIncome) / totalFlow) * 100;

  const netBalance = monthlyIncome - monthlyExpenses;
  const isPositive = netBalance >= 0;

  return (
    <ModalInfo open={open} onClose={onClose} title="Analyse Mensuelle">
      <div className="space-y-6">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between dark:bg-gray-800 dark:border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm dark:bg-gray-700 dark:text-indigo-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Solde Net (Mois)
              </p>
              <p
                className={`text-lg font-bold ${
                  isPositive ? "text-green-600" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}
                {netBalance.toFixed(2)} €
              </p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-indigo-200/50 mx-2"></div>
          <div className="text-right">
            <p className="text-xs text-indigo-400 font-medium">Activité</p>
            <p className="text-sm font-bold text-indigo-900">
              {transactions ? transactions.length : 0} opés
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl border border-green-100 bg-green-50/50 flex flex-col gap-2 dark:bg-gray-800 dark:border-green-700">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <TrendingDown size={18} className="rotate-45" />
              <span className="text-xs font-bold uppercase dark:text-gray-300">Reçus</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {monthlyIncome.toFixed(2)}{" "}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300">€</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-red-100 bg-red-50/50 flex flex-col gap-2 dark:bg-gray-800 dark:border-red-700">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <TrendingUp size={18} className="rotate-45" />
              <span className="text-xs font-bold uppercase dark:text-gray-300">Dépensés</span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {monthlyExpenses.toFixed(2)}{" "}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300">€</span>
            </span>
          </div>
        </div>

        <ExpenseDonut transactions={transactions} />

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase px-1">
            <span>Flux Entrant</span>
            <span>Flux Sortant</span>
          </div>
          <div className="h-3 w-full bg-red-100 rounded-full overflow-hidden flex dark:bg-gray-700">
            <div
              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-500"
              style={{ width: `${incomePercent}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 ml-1">
            Derniers Mouvements
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {transactions && transactions.length > 0 ? (
              transactions
                .slice(0, 10)
                .map((t, idx) => (
                  <TransactionMiniItem key={t.id || idx} t={t} />
                ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Aucune transaction ce mois-ci.
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalInfo>
  );
}
