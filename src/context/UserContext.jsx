import {createContext, useContext, useEffect, useState} from "react";
import {getMe, signInUser} from "@/api/auth.js";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isPending,setIsPending] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getMe();
                if (currentUser) {
                    setUser(currentUser);
                    setIsPending(false);
                } else {
                    // Auto-login with demo account if no user is logged in
                    const demoUser = await signInUser({
                        email: "demo@republic.fr",
                        password: "Demo123."
                    });
                    setUser(demoUser);
                    setIsPending(false);
                }
            } catch (error) {
                console.log("Error loading user, trying demo login:", error);
                try {
                    const demoUser = await signInUser({
                        email: "demo@republic.fr",
                        password: "Demo123."
                    });
                    setUser(demoUser);
                } catch (demoError) {
                    console.error("Failed to login with demo account:", demoError);
                } finally {
                    setIsPending(false);
                }
            }
        }

        loadUser();
    }, []);

    useEffect(() => {
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser, isPending }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};