import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const ProfileCreateForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const email = localStorage.getItem("userEmail"); // Firebase 認証後に保存
            if (!email) {
                alert("ログインしていません。");
                return;
            }
            await api.post("/users/create", { email, username, display_name: displayName });
            alert("プロフィールが作成されました！");
            navigate("/posts");
        } catch (error) {
            console.error("プロフィール作成エラー:", error);
            alert("プロフィールの作成に失敗しました。");
        }
    };

    return (
        <div className="profile-form-container">
            <h2>プロフィール作成</h2>
            <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="表示名"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <button onClick={handleSubmit}>作成</button>
        </div>
    );
};

export default ProfileCreateForm;
