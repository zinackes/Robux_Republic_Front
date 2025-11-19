import React, { useState } from "react";
import GridBackground from "@/components/ui/GridBackground.jsx";
import { motion } from "motion/react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip.jsx";
import {ArrowRight, ArrowUpDown, LogIn} from "lucide-react";
import { GradientBackground } from "@/components/animate-ui/components/backgrounds/gradient.jsx";
import { useNavigate } from "react-router-dom";
import {useUser} from "@/context/UserContext.jsx";
import {Card} from "@/components/ui/card.jsx";
import BankCard from "@/components/Card.jsx";

function Home() {
  const navigate = useNavigate();

  const { user } = useUser();

  const [convertMoney, setConvertMoney] = useState({
    top: {
      money: "Robux",
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
      top: {
        ...prev.top,
        value: newMoney,
      },
      bottom: {
        ...prev.bottom,
        value: calcConvertedMoney(newMoney),
      },
    }));
  };

  const calcConvertedMoney = (newMoney) => {
    return newMoney * convertMoney.top.convertionRate;
  };

  const handleSwap = () => {
    setConvertMoney((prev) => {
      const newTopValue = parseFloat(prev.bottom.value) || 0;
      const newBottomValue = (newTopValue * prev.bottom.convertionRate).toFixed(
        2
      );

      return {
        top: { ...prev.bottom },
        bottom: { ...prev.top, value: newBottomValue },
      };
    });
  };

  return (
    <GridBackground>
      <div className={"flex flex-col justify-around min-h-screen py-10"}>
        <div className={"flex flex-col gap-1 items-center h-full my-auto"}>
          <h1
            className={
              "relative z-20 font-title py-8 !text-5xl !font-bold sm:!text-6xl md:!text-7xl flex items-baseline gap-6"
            }
          >
            <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
              <LayoutTextFlip
                text="Vos Robux. "
                words={["Sécurisés.", "Accessibles.", "Valorisés."]}
              />
            </motion.div>
          </h1>
          <p
            className={
              "relative z-20 font-text text-gray-600 md:text-lg text-md max-w-2xl text-center"
            }
          >
            Bienvenue à Robux Republic. La banque nouvelle génération pour les
            joueurs. Transformez vos Robux en véritable capital.
          </p>

          <button
            onClick={() => user ? navigate("/dashboard") : navigate("/register")}
            className={
              "relative mt-5 z-20 font-bold text-md flex items-center gap-2 font-text bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-full cursor-pointer"
            }
          >
            {user ? "Aller au dashboard" : "S'inscrire"}
            {user ? <ArrowRight /> : <LogIn/>}
          </button>

        </div>

        <div
          className={
            "relative z-20 w-screen px-5 gap-10 flex justify-evenly items-center mt-auto font-text font-medium"
          }
        >
          <div
            className={
              "bg-gray-100 dark:bg-[#171717] flex flex-col gap-3 rounded-[3rem] px-3 py-3 transition-colors duration-300"
            }
          >
            <div
              className={
                "bg-white dark:bg-neutral-800 px-8 py-5 rounded-4xl gap-7 flex flex-col transition-colors duration-300"
              }
            >
              <div>
                <h3
                  className={"text-lg mb-1.5 text-gray-500 dark:text-gray-400"}
                >
                  De {convertMoney.top.money}
                </h3>
                <div className={"flex gap-3 items-center"}>
                  {convertMoney.top.symbol}
                  <input
                    placeholder={"Votre chiffre"}
                    onChange={(e) => updateConvertedMoney(e.target.value)}
                    className={
                      "text-2xl font-title max-w-45 focus-visible:outline-none bg-transparent dark:text-white dark:placeholder:text-gray-600"
                    }
                    value={convertMoney.top.value}
                  />
                </div>
              </div>

              <div
                className={
                  "flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition rounded-full mx-auto p-2 cursor-pointer w-10 h-10"
                }
                onClick={handleSwap}
              >
                <ArrowUpDown color={"white"} size={20} />
              </div>

              <div>
                <h3
                  className={"text-lg mb-1.5 text-gray-500 dark:text-gray-400"}
                >
                  A {convertMoney.bottom.money}
                </h3>
                <div className={"flex gap-0.5 items-center"}>
                  {convertMoney.bottom.symbol}
                  <input
                    placeholder={"Votre chiffre"}
                    onChange={(e) => updateConvertedMoney(e.target.value)}
                    className={`text-2xl mr-auto max-w-45 font-title focus-visible:outline-none bg-transparent dark:text-white`}
                    readOnly={true}
                    value={convertMoney.bottom.value}
                  />
                </div>
              </div>
            </div>

            <div
              className={
                "bg-white dark:bg-neutral-800 py-3 rounded-b-4xl rounded-t-md flex flex-col items-center font-text transition-colors duration-300"
              }
            >
              <p
                className={
                  "text-md font-medium text-gray-500 dark:text-gray-400"
                }
              >
                Indice de change
              </p>
              <div className={"flex gap-1 dark:text-white"}>
                <div className={"flex gap-1 items-center"}>
                  <p>1</p>
                  <img
                    src={"robux_logo.png"}
                    alt={"Robux"}
                    className={"max-w-4"}
                  />
                </div>

                <div className={"flex gap-1 items-center"}>
                  <p>0.01</p>
                  <span className={"text-lg"}>€</span>
                </div>
              </div>
            </div>
          </div>

          <BankCard iban={"FR76 3000 4028 3790 736"}/>
        </div>
      </div>
    </GridBackground>
  );
}

export default Home;
