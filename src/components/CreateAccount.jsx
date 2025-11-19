import React, { useEffect } from "react";
import SimpleModal from "@/components/ModalCreateAccount.jsx";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { createBankAccount } from "@/api/bankAccount.js";
import { useUser } from "@/context/UserContext.jsx";

export default function CreateAccountModal({ open, onClose, onSuccess }) {
  const { control, handleSubmit, reset } = useForm();
  const { setUser, user } = useUser();

  useEffect(() => {
    if (open) {
      reset({ name: "" });
    }
  }, [open, reset]);

  const onSubmit = async (values) => {
    const loaddata = {
      name: values.name,
      uid: sessionStorage.getItem("access_token"),
    };
    const result = await createBankAccount(loaddata);
    if (result.error) {
      setError(result.error);
      return;
    }
    setIsOpen(false);
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
