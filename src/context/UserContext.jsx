import {createContext, useContext, useEffect, useState} from "react";
import {getMe} from "@/api/auth.js";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isPending,setIsPending] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            getMe().then(r => {
                setUser(r);
            }).finally(() => setIsPending(false));
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