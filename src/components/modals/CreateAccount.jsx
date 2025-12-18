import React, { useState, useEffect } from "react";

import SimpleModal from "@/components/modals/ModalCreateAccount.jsx";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils.js";
import { createBankAccount } from "@/api/bankAccount.js";
import { useUser } from "@/context/UserContext.jsx";

export default function CreateAccountModal({ open, onClose, onSuccess }) {
  const { control, handleSubmit, reset } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (open) {
      reset({ name: "" });
    }
  }, [open, reset]);

  const onSubmit = async (values) => {
    setErrorMessage(""); 
    const loaddata = {
      name: values.name,
      uid: user?.uid,
    };

    try {
      const result = await createBankAccount(loaddata);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      const mergedAccount = {
        ...result.bank_account,
        ...result.user_bank_account,  
        id: result.bank_account.id    
      };
      if (onSuccess) {
        console.log("Account created successfully"+ mergedAccount);
        onSuccess(mergedAccount); 
      } else {
          onClose();
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la création du compte : " + error.message);
      console.error(error);
    }
  };

  return (
    <SimpleModal isOpen={open} onClose={onClose} title="Création de Compte">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name={"name"}
          control={control}
          defaultValue={""}
          rules={{ required: "Nom du compte requis" }}
          render={({ field, fieldState }) => (
            <LabelInputContainer className={"mb-4"}>
              <label
                htmlFor="name"
                className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2"
              >
                Nom du compte
              </label>
              <input
                {...field}
                id="name"
                placeholder="Nom du compte"
                type="text"
                className="border border-gray-300 p-3 mb-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {fieldState.error && (
                <p className="text-red-500 text-xs ml-2">
                  {fieldState.error.message}
                </p>
              )}
            </LabelInputContainer>
          )}
        />
        {errorMessage && (
          <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
        )}
        <button
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] py-4 rounded-2xl transition-colors shadow-sm"
          type="submit"
        >
          Créer le compte
        </button>
      </form>
    </SimpleModal>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
