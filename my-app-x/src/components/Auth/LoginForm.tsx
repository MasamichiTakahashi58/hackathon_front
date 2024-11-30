import React, { useState } from "react";
import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { fireAuth } from "../../firebase";
import { useNavigate } from "react-router-dom"; 
import "./LoginForm.css";

const LoginForm: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // 処理中の状態
    const navigate = useNavigate(); 

    const handleGoogleSignIn = async () => {
        setIsProcessing(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(fireAuth, provider);
            alert(`ようこそ、${result.user.displayName}さん！`);
            navigate("/profile/create");// プロフィール作成ページへ遷移
        } catch (error: any) {
            handleFirebaseError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEmailAuth = async () => {
        setIsProcessing(true);
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
                alert(`アカウント作成成功: ${userCredential.user.email}`);
                navigate("/profile/create"); // プロフィール作成ページへ遷移
            } else {
                const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);
                alert(`ログイン成功: ${userCredential.user.email}`);
                navigate("/home"); // ホームページへ遷移
            }
        } catch (error: any) {
            handleFirebaseError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFirebaseError = (error: any) => {
        if (error.code === "auth/email-already-in-use") {
            alert("このメールアドレスは既に使用されています。");
        } else if (error.code === "auth/invalid-email") {
            alert("メールアドレスの形式が正しくありません。");
        } else if (error.code === "auth/weak-password") {
            alert("パスワードは6文字以上にしてください。");
        } else if (error.code === "auth/wrong-password") {
            alert("パスワードが正しくありません。");
        } else if (error.code === "auth/user-not-found") {
            alert("このメールアドレスに一致するアカウントが見つかりません。");
        } else {
            alert(`エラー: ${error.message}`);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isSignUp ? "アカウント作成" : "ログイン"}</h2>
                <button
                    className="google-button"
                    onClick={handleGoogleSignIn}
                    disabled={isProcessing}
                >
                    Googleで{isSignUp ? "登録" : "ログイン"}
                </button>
                <div className="divider">または</div>
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
                <button
                    className={`auth-button ${isSignUp ? "signup" : ""}`}
                    onClick={handleEmailAuth}
                    disabled={isProcessing}
                >
                    {isSignUp ? "アカウントを作成" : "ログイン"}
                </button>
                <p className="switch-mode">
                    {isSignUp ? (
                        <>
                            アカウントをお持ちですか？{" "}
                            <span onClick={() => setIsSignUp(false)}>ログイン</span>
                        </>
                    ) : (
                        <>
                            アカウントをお持ちでない場合は <span onClick={() => setIsSignUp(true)}>登録</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
