import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { fireAuth } from "../../firebase";

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [user, loading, error] = useAuthState(fireAuth);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>認証情報を確認しています...</p>
                <div className="spinner" />
            </div>
        );
    }

    if (error) {
        console.error("Firebase認証エラー:", error);
        return <p>エラーが発生しました。再度お試しください。</p>;
    }

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
