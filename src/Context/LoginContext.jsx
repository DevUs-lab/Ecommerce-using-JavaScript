import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

const LoginContext = createContext(null);

export const LoginProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <LoginContext.Provider value={{ user, authLoading }}>
            {children}
        </LoginContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider belong together
export const useLogin = () => useContext(LoginContext);
