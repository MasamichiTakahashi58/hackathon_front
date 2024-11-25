import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import LoginForm from "./components/Auth/LoginForm";
import ProfileCreateForm from "./components/Profile/ProfileCreateForm";
import ProfileEditForm from "./components/Profile/ProfileEditForm";
import HomePage from "./components/Home/HomePage";

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setIsLoggedIn(!!user); 
        });

        return () => unsubscribe(); // クリーンアップ処理
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <LoginForm />} />
                <Route path="/profile/create" element={isLoggedIn ? <ProfileCreateForm /> : <Navigate to="/login" />} />
                <Route path="/profile/edit" element={isLoggedIn ? <ProfileEditForm /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;