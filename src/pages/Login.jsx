import React from 'react';
import {Controller, useForm} from "react-hook-form";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {signUpUser} from "@/api/auth.js";
import {cn} from "@/lib/utils.js";

function Login() {

    const {control, handleSubmit, getValues} = useForm();

    const onSubmit = (values) => signUpUser(values);

    return (
        <div className={"flex flex-col gap-4 items-center justify-center min-h-screen"}>
            <h2 className="text-xl font-bold font-title lg:text-3xl text-neutral-800 dark:text-neutral-200">
                Se connecter à Robux Republic
            </h2>
            <p className="mt-2 max-w-sm text-sm font-text text-neutral-600 dark:text-neutral-300">
                Login to aceternity if you can because we don&apos;t have a login flow
                yet
            </p>

            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>

                <Controller name={"email"}
                            control={control}
                            defaultValue={""}
                            rules={{ required: "L'adresse mail est requise" }}
                            render={({ field,
                                         fieldState}) => (
                                <LabelInputContainer className={"mb-4"}>
                                    <Label htmlFor="email">Adresse mail</Label>
                                    <Input {...field} id="email" placeholder="robux@gmail.com" type="email" />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-xs ml-2">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </LabelInputContainer>
                            )}
                />

                <Controller name={"password"}
                            control={control}
                            defaultValue={""}
                            rules={{ required: "Le mot de passe est requis",
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                                    message: "Le mot de passe doit contenir 8 caractères, 1 majuscule et 1 caractère spécial"
                                } }}
                            render={({ field,
                                         fieldState}) => (
                                <LabelInputContainer className={"mb-4"}>
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input {...field} id="password" placeholder="••••••••" type="password" />
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
                    Se connecter &rarr;
                </button>
            </form>
        </div>
    );
}

export default Login;

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