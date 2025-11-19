import React, { useState } from "react";
import SimpleModal from "@/components/ModalCreateAccount.jsx";
import { Controller, useForm } from "react-hook-form";


export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSubmit = (values) => {
    signInUser(values).then((data) => {
      console.log(data)
      if (data) setUser(data);
      console.log("user", user)

    });
  };

  return (
    <div className="p-10">
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Creer un compte</button>
      <SimpleModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Création de Compte">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller name={"name"}
            control={control}
            defaultValue={""}
            rules={{ required: "Nom du compte requis" }}
            render={({ field,
              fieldState }) => (
              <LabelInputContainer className={"mb-4"}>
                <label htmlFor="name">Nom du compte</label>
                <input {...field} id="name" placeholder="Nom du compte" type="text" />
                {fieldState.error && (
                  <p className="text-red-500 text-xs ml-2">
                    {fieldState.error.message}
                  </p>
                )}
              </LabelInputContainer>
            )}
          />
          <button
            className="group/btn relative block cursor-pointer h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Créer le compte &rarr;
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
