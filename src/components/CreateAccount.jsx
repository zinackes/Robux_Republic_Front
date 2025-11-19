import React, { useState } from "react";
import SimpleModal from "@/components/ModalCreateAccount.jsx";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { createBankAccount } from "@/api/BankAccount.js";
import { useUser } from "@/context/UserContext.jsx";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const { setUser } = useUser();
  const { user } = useUser();


  const onSubmit = (values) => {

    const loaddata = {
      name: values.name,
      uid: user?.uid
    }

    createBankAccount(loaddata).then((data) => {
      if (data) setUser(data);
      setIsOpen(false);
      console.log("Compte crée !", data)
      console.log("values", values)
    });
  };

  return (
    <div className="p-10">
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Créer un compte</button>
      <SimpleModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Création de Compte">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller name={"name"}
            control={control}
            defaultValue={""}
            rules={{ required: "Nom du compte requis" }}
            render={({ field,
              fieldState }) => (
              <LabelInputContainer className={"mb-4"}>
                <label htmlFor="name" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Nom du compte</label>
                <input {...field} id="name" placeholder="Nom du compte" type="text" className="border border-gray-300 p-3 mb-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"/>
                {fieldState.error && (
                  <p className="text-red-500 text-xs ml-2">
                    {fieldState.error.message}
                  </p>
                )}
              </LabelInputContainer>
            )}
          />
          <button className="w-full mt-6 bg-[#8d00ff] hover:bg-[#7a00cc] text-white font-bold text-[15px] py-4 rounded-2xl transition-colors shadow-sm" type="submit">
            Créer le compte
          </button>
        </form>
      </SimpleModal>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
