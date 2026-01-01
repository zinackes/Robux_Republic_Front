import React, { useState } from "react";
import { motion } from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip.jsx";
import { ArrowUpDown, Coins } from "lucide-react";
import BankCard from "@/components/Card.jsx";
import CardSwap, { Card } from "@/components/CardSwap.jsx";
import HomeLayout from "@/components/layouts/HomeLayout.jsx";
import {cn} from "@/lib/utils.js";
import ProjectInfoModal from "@/components/modals/ProjectInfoModal.jsx";

function Home() {
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(true);

  const [convertMoney, setConvertMoney] = useState({
    top: {
      money: "Dollars",
      symbol: (
          <img src={"robux_logo.png"} alt={"Robux"} className={"max-w-7"} />
      ),
      value: 100.0,
      convertionRate: 1 / 100,
    },
    bottom: {
      money: "EUR",
      symbol: <span className={"text-2xl"}>€</span>,
      value: 1.0,
      convertionRate: 100,
    },
  });

  const updateConvertedMoney = (newMoney) => {
    setConvertMoney((prev) => ({
      ...prev,
      top: { ...prev.top, value: newMoney },
      bottom: { ...prev.bottom, value: calcConvertedMoney(newMoney) },
    }));
  };

  const calcConvertedMoney = (newMoney) => {
    return newMoney * convertMoney.top.convertionRate;
  };

  const handleSwap = () => {
    setConvertMoney((prev) => {
      const newTopValue = Number.parseFloat(prev.bottom.value) || 0;
      const newBottomValue = (newTopValue * prev.bottom.convertionRate).toFixed(2);

      return {
        top: { ...prev.bottom },
        bottom: { ...prev.top, value: newBottomValue },
      };
    });
  };

  return (
    <HomeLayout>
      <ProjectInfoModal
        open={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
      <div className={"relative min-h-screen overflow-hidden"}>
        <div
            className={cn(
                "fixed inset-0 z-0 pointer-events-none",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
            )}
        />
        <div className={"relative z-10 flex flex-col justify-between min-h-screen py-10"}>
          <div className={"flex flex-col gap-1 items-center h-full my-auto"}>
            <h1 className={"relative z-20 font-title py-8 !text-5xl !font-bold sm:!text-6xl md:!text-7xl flex items-baseline gap-6"}>
              <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
                <LayoutTextFlip
                    text="Vos euros. "
                    words={["Sécurisés.", "Accessibles.", "Valorisés."]}
                />
              </motion.div>
            </h1>
            <p className={"relative z-20 font-text text-gray-600 md:text-lg text-md max-w-2xl text-center px-4 dark:text-gray-400"}>
              Bienvenue à Banque Republic. La banque nouvelle génération pour les joueurs. Transformez vos euros en véritable capital.
            </p>

          </div>

          <div className={"relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-5 gap-6 sm:gap-10 flex flex-col md:flex-row justify-center md:justify-around items-center mt-10 sm:mt-20 md:mt-auto font-text font-medium"}>

            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-neutral-800 h-full flex flex-col transition-colors duration-300 w-full max-w-sm">

              <div className="bg-gray-50 dark:bg-gray-700 rounded-[1.5rem] p-6 flex flex-col gap-6 relative transition-colors duration-300">

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">De {convertMoney.top.money}</h3>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-600 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-500 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-500 flex items-center justify-center shrink-0">
                      {convertMoney.top.symbol}
                    </div>
                    <input
                        placeholder="0"
                        onChange={(e) => updateConvertedMoney(e.target.value)}
                        className="text-2xl font-bold bg-transparent outline-none w-full text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-500"
                        value={convertMoney.top.value}
                    />
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div
                      onClick={handleSwap}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md shadow-blue-500/30 border-[6px] border-gray-50 dark:border-gray-700 cursor-pointer transition-all active:scale-90 active:rotate-180"
                  >
                    <ArrowUpDown size={20} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vers {convertMoney.bottom.money}</h3>
                  <div className="flex items-center gap-3 bg-white dark:bg-gray-600 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-500 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-500 flex items-center justify-center shrink-0">
                      {convertMoney.bottom.symbol}
                    </div>
                    <input
                        placeholder="0.00"
                        readOnly
                        className="text-2xl font-bold bg-transparent outline-none w-full text-gray-900 dark:text-white cursor-default"
                        value={convertMoney.bottom.value}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white dark:bg-gray-700 py-4 rounded-2xl border border-gray-50 dark:border-gray-600 flex flex-col items-center font-sans transition-colors duration-300">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Indice de change</p>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-gray-600 px-4 py-1.5 rounded-full">
                  <div className="flex gap-1 items-center">
                    <span>1</span>
                    <Coins size={14} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">=</span>
                  <div className="flex gap-1 items-center">
                    <span>0.01</span>
                    <span>€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center py-10 md:py-0 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mt-10 md:mt-0 pointer-events-none">
              <CardSwap
                  cardDistance={35}
                  verticalDistance={40}
                  delay={3000}
                  skewAmount={2}
                  pauseOnHover={false}
              >
                <Card>
                  <BankCard
                      iban={"FR76 3000 4028 3790 736"}
                      balance={12450.50}
                      accountName="Compte Principal"
                  />
                </Card>

                <Card>
                  <BankCard
                      iban={"US88 1234 5678 9012 345"}
                      balance={50200.00}
                      currency="€"
                      label="ÉPARGNE EUROS"
                      accountName="Coffre Fort"
                  />
                </Card>

                <Card>
                  <BankCard
                      iban={"GB29 4321 8765 2109 876"}
                      balance={340.20}
                      accountName="Investissement"
                      percentage={-2.4}
                  />
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Home;