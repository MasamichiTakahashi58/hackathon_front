import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { fireAuth } from "../../firebase";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await signOut(fireAuth); // Firebaseサインアウト
            localStorage.removeItem("userEmail"); // ログイン情報を削除
            navigate("/login"); // ログイン画面に遷移
            alert("ログアウトしました");
        } catch (error) {
            console.error("ログアウトエラー:", error);
            alert("ログアウトに失敗しました。");
        }
    };

    return (
        <div className="sidebar">
            <button onClick={() => handleNavigation("/home")}>ホーム</button>
            <button onClick={() => handleNavigation("/posts")}>投稿</button>
            <button onClick={() => handleNavigation("/profile/edit")}>プロフィール編集</button>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
};

export default Sidebar;

