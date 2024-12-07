import React,  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { fireAuth } from "../../firebase";
import { useAuth } from "../Auth/AuthContext"; // 認証コンテキストをインポート
import "./Sidebar.css";

const Sidebar: React.FC = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); // 認証状態を取得

    const handleNavigation = (path: string) => {
        if (!user) {
            alert("ログインしていません。");
            navigate("/login");
            return;
        }
        navigate(path);
        setSidebarVisible(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(fireAuth); // Firebaseサインアウト
            navigate("/login"); // ログイン画面に遷移
            alert("ログアウトしました");
            setSidebarVisible(false);
        } catch (error) {
            console.error("ログアウトエラー:", error);
            alert("ログアウトに失敗しました。");
        }
    };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <div>
            {/* トグルボタン */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isSidebarVisible ? "✖️ 閉じる" : "☰ メニュー"}
            </button>
            {/* サイドバー本体 */}
            {isSidebarVisible && (
                <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
                    <button onClick={() => handleNavigation("/home")}>🏠 ホーム</button>
                    <button onClick={() => handleNavigation("/profile")}>👤 プロフィール</button>
                    <button onClick={() => handleNavigation("/profile/edit")}>✏️ プロフィール編集</button>
                    <div className="logout-button-container">
                        <button className="logout-button" onClick={handleLogout}>
                            🚪 ログアウト
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
