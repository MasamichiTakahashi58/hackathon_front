import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import LoginForm from "./components/Auth/LoginForm";
import PostsComponent from "./components/Posts/PostsComponent";

const App: React.FC = () => {
    const [user, setUser] = useState(fireAuth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <h1>ようこそ、{user.displayName || user.email} さん！</h1>
                    <PostsComponent />
                </div>
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default App;
