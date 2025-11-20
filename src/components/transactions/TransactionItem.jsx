import { ArrowDownCircle, ArrowRightLeft, Send, Banknote } from "lucide-react";

const TransactionItem = ({ transaction }) => {
  const dateObj = new Date(transaction.timestamp);
  const formattedDate = dateObj.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  let IconComponent;
  let iconBgClass;
  let symbol;
  let colorClass;

  if (transaction.action === "depot") {
    IconComponent = Banknote;
  } else {
    IconComponent = ArrowRightLeft;
  }

  if (transaction.type === 'credit') {
    iconBgClass = "bg-green-100 text-green-600";
    colorClass = "text-[rgba(60,197,151,1)]";
    symbol = "+";
  } else {
    iconBgClass = "bg-red-100 text-red-600";
    symbol = "-";
  }
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 ${iconBgClass} rounded-full mr-4 flex items-center justify-center`}
        >
          <IconComponent size={20} />
        </div>
        <div>
          <h3 className="font-semibold">{transaction.transaction_name}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>
      <div className={`text-right `}>
        <span className={`font-bold ${colorClass}`}>
          {" " + symbol}
          {Math.abs(transaction.amount).toFixed(2)}
        </span>
        <p className="text-sm text-gray-500">{transaction.action}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
