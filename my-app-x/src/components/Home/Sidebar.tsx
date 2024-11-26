import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { fireAuth } from "../../firebase";
import { useAuth } from "../Auth/AuthContext"; // 認証コンテキストをインポート
import "./Sidebar.css";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // 認証状態を取得

    const handleNavigation = (path: string) => {
        if (!user) {
            alert("ログインしていません。");
            navigate("/login");
            return;
        }
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await signOut(fireAuth); // Firebaseサインアウト
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
