import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { fireAuth, googleProvider, registerWithEmailAndPassword, loginWithEmailAndPassword } from "../../firebase";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(fireAuth, googleProvider);
            alert(`Googleでログインしました: ${result.user.displayName}`);
        } catch (error) {
            alert(`ログインエラー: ${error}`);
        }
    };

    const handleEmailLogin = async () => {
        try {
            await loginWithEmailAndPassword(email, password);
            alert("メールでログイン成功！");
        } catch (error) {
            alert(`ログインエラー: ${error}`);
        }
    };

    const handleEmailRegister = async () => {
        try {
            await registerWithEmailAndPassword(email, password);
            alert("アカウント登録成功！");
        } catch (error) {
            alert(`登録エラー: ${error}`);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(fireAuth);
            alert("ログアウトしました！");
        } catch (error) {
            alert(`ログアウトエラー: ${error}`);
        }
    };

    return (
        <div>
            <h2>ログイン</h2>
            <button onClick={handleGoogleLogin}>Googleでログイン</button>

            <div>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleEmailLogin}>メールでログイン</button>
                <button onClick={handleEmailRegister}>アカウントを登録</button>
            </div>

            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
};

export default LoginForm;
