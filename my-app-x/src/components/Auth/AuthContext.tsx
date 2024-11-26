import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "../../firebase";
import api from "../../api/axiosInstance";

interface AuthContextType {
    user: User | null;
    userID: string | null; // userID を追加
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userID: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userID, setUserID] = useState<string | null>(null); // userID を管理
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser?.email) {
                try {
                    console.log("リクエスト送信: /users/email", { email: firebaseUser.email });
                    // email から userID を取得
                    const response = await api.get(`/users/email`, { params: { email: firebaseUser.email } });
                    console.log("レスポンス取得:", response.data);
                    setUserID(response.data.id); // userID を保存
                } catch (error) {
                    console.error("userIDの取得に失敗しました:", error);
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

export const useAuth = () => useContext(AuthContext);
