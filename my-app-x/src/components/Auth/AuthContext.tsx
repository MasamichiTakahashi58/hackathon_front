import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "../../firebase";
import api from "../../api/axiosInstance";

interface AuthContextType {
    user: User | null;
    userID: number | null; 
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userID: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userID, setUserID] = useState<number | null>(null); // userID を number 型で管理
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser?.email) {
                try {
                    console.log("Fetching userID for email:", firebaseUser.email);
                    const response = await api.get(`/users/email`, { params: { email: firebaseUser.email } });
                    if (response.data && typeof response.data.id === "number") {
                        setUserID(response.data.id); // 数値型で保存
                        console.log("Fetched userID:", response.data.id);
                    } else {
                        console.error("Invalid response format or missing ID:", response.data);
                        setUserID(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch userID:", error);
                    setUserID(null);
                }
            } else {
                setUserID(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userID, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
