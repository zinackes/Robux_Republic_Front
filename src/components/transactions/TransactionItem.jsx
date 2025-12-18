import {ArrowRightLeft, Banknote, ArrowRight} from "lucide-react";

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
    colorClass = "text-red-500 dark:text-red-400";
    symbol = "-";
  }


  return (
    <div className="flex items-center justify-between p-3 font-text">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 ${iconBgClass} rounded-xl mr-4 flex items-center justify-center`}
        >
          <IconComponent size={20} />
        </div>
        <div>
          <h3 className="font-semibold">{transaction.transaction_name}</h3>
          <div className={"flex items-center gap-2 text-xs mt-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-800 w-fit px-2.5 py-1 rounded-lg border border-gray-100 max-w-full"}>
              <p className={"font-semibold text-gray-500 dark:text-gray-500 truncate max-w-[80px] sm:max-w-[120px]"}>{transaction.sender_display_name}</p>
              <ArrowRight size={13} className={"text-gray-500"}/>
              <p className={"font-semibold text-gray-700 dark:text-gray-400 truncate max-w-[80px] sm:max-w-[120px]"}>{transaction.receiver_display_name}</p>
          </div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>
      <div className={`text-right `}>
        <span className={`font-bold ${colorClass}`}>
          {" " + symbol}
          {Math.abs(transaction.amount).toFixed(2) + " "}
          RBX
        </span>
        <p className="text-sm text-gray-500">{transaction.action}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
