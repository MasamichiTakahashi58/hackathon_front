import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import LoginForm from "./components/Auth/LoginForm";
import ProfileCreateForm from "./components/Profile/ProfileCreateForm";
import ProfileEditForm from "./components/Profile/ProfileEditForm";
import HomePage from "./components/Home/HomePage";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ログインページ */}
                    <Route path="/login" element={<LoginForm />} />

                    
                    <Route
                        path="/profile/create"
                        element={
                            <PrivateRoute>
                                <ProfileCreateForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile/edit"
                        element={
                            <PrivateRoute>
                                <ProfileEditForm />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />

                    {/* デフォルトルート */}
                    <Route path="*" element={<LoginForm />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
