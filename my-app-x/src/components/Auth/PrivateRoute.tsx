import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { fireAuth } from "../../firebase";

interface PrivateRouteProps {
    children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [user, loading] = useAuthState(fireAuth);

    if (loading) {
        return <p>Loading...</p>;
    }

    return user ? children : <Navigate to="/login" />;
};
