import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { signInUser } from "@/api/auth.js";
import { cn } from "@/lib/utils.js";
import { useUser } from "@/context/UserContext.jsx";
import { FireworksBackground } from '@/components/animate-ui/components/backgrounds/fireworks';

function Login() {

    const { control, handleSubmit, getValues } = useForm();

    const { user, setUser } = useUser();

    const onSubmit = (values) => {
        signInUser(values).then((data) => {
            console.log(data)
            if (data) setUser(data);
            console.log("user", user)

        });
    };

    return (
        <>
            <FireworksBackground className="absolute inset-0 flex items-center justify-center rounded-xl opacity-50"
                color="blue" fireworkSize="2" particleSize={2}
                population={0.5} />
            <div className={"flex flex-col gap-4 items-center justify-center min-h-screen "}>
                <h2 className="text-xl lg:text-3xl font-bold font-text
    [text-shadow:2px_2px_0_white,4px_4px_12px_rgba(0,0,0,0.45)]
    drop-shadow-[4px_6px_18px_rgba(0,122,255,0.55)]
">
                    Se connecter à Robux Republic
                </h2>



                <form className="my-8 bg-white dark:bg-black px-6 rounded-xl relative z-30 shadow-lg py-6 border font-text" onSubmit={handleSubmit(onSubmit)}>

                    <Controller name={"email"}
                        control={control}
                        defaultValue={""}
                        rules={{ required: "L'adresse mail est requise" }}
                        render={({ field,
                            fieldState }) => (
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
                        rules={{
                            required: "Le mot de passe est requis",
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                                message: "Le mot de passe doit contenir 8 caractères, 1 majuscule et 1 caractère spécial"
                            }
                        }}
                        render={({ field,
                            fieldState }) => (
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

                    <p className="text-sm italic font-light text-gray-500 text-center mb-6"> Pas encore robuxien ? <a href={"/register"} className={"hover:underline"}>S'inscrire</a> </p>

                    <button
                        className="group/btn relative block cursor-pointer h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                        type="submit"
                    >
                        Se connecter &rarr;
                    </button>
                </form>
            </div>
        </>
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