import React, { useMemo } from "react";
import { Building2 } from "lucide-react";

const BankCard = ({
  label = "COMPTE PRINCIPAL",
  accountName = "Compte Courant",
  balance = 12450.5,
  currency = "€",
  percentage = 11.2,
  iban = "FR76 3000 4028 3790",
  icon: Icon = Building2,
}) => {
  const stringToHue = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
  };

  const persistentGradient = useMemo(() => {
    const baseHue = stringToHue(iban);
    const hue1 = baseHue;
    const hue2 = (baseHue + 40) % 360;

    return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 80%, 50%))`;
  }, [iban]);

  const formattedBalance = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  
  return (
    <div
      className="relative w-full max-w-md h-64 rounded-3xl p-6 text-white shadow-xl overflow-hidden transition-transform hover:scale-[1.02] duration-300"
      style={{ background: persistentGradient }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-bold tracking-wider opacity-70 uppercase mb-1">
            {label}
          </p>
          <h2 className="text-2xl font-bold tracking-tight">{accountName}</h2>
        </div>

        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <div className="flex items-baseline gap-3">
          <h3 className="text-4xl font-extrabold">
            {formattedBalance} {currency}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm opacity-80">Solde disponible</span>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md">
            {percentage > 0 ? "+" : ""}
            {percentage}%
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 h-16 opacity-40">
        <svg
          viewBox="0 0 100 25"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 C30,10 50,25 70,15 S100,5 100,10 V25 H0 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <path
            d="M0,22 C20,18 40,24 60,18 S100,12 100,15"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute bottom-6 left-6 z-10">
        <p className="text-xs font-bold opacity-60 uppercase mb-1">IBAN</p>
        <p className="text-sm font-mono tracking-widest opacity-90 shadow-sm">
          {iban}
        </p>
      </div>
    </div>
  );
};

export default BankCard;
