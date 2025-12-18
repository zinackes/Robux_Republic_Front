import {useUser} from "@/context/UserContext.jsx";
import { Navigate } from "react-router-dom";

// fonction pour inscrire un nouvel utilisateur

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8000";

export const signUpUser = async (
    user
) => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth: {
                    ...user
                },
                bank_account: {
                }
            })
        })

        return res.json();

    } catch (error) {
        console.log(error)
    }
}

// fonction pour se connecter
export const signInUser = async (
    request
)=> {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    ...request
            })
        })

        const json = await res.json();

        if (!res.ok) {
            console.error("Erreur serveur :", json);
            return json;
        }
        console.log(json);
        sessionStorage.setItem("access_token", json.token);

        return await getMe();

    } catch(error) {
        console.log("Erreur dans signInUser :", error);
        throw error;
    }
}

// fonction pour récupérer les informations de l'utilisateur connecté
export const getMe = async() => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        })

        if(res.ok) return res.json();
    } catch (error) {
        console.log("Erreur dans get me :", error);
        Navigate("/register");
    }
}