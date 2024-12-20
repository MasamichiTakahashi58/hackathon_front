import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fireAuth } from "../../firebase"; 
import api from "../../api/axiosInstance";
import "./ProfileCreateForm.css";

const ProfileCreateForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const user = fireAuth.currentUser; // Firebase の現在のユーザーを取得
            if (!user) {
                alert("ログインしていません。");
                return;
            }

            const email = user.email; // メールアドレスを取得
            if (!email) {
                alert("メールアドレスを取得できませんでした。");
                return;
            }
            const usernameRegex = /^[a-zA-Z0-9]+$/; // 半角英数字のみ許可
            if (!username.trim()) {
                setUsernameError("ユーザー名を入力してください。");
                return;
            }
            if (!usernameRegex.test(username)) {
                setUsernameError("ユーザー名は半角英数字のみ使用できます。");
                return;
            }
            setUsernameError("");
            if (!displayName.trim()) {
                alert("表示名を入力してください。");
                return;
            }

            const payload = {
                email: email,
                username: username,
                display_name: displayName,
                profile_image: "",
                header_image: "",
                bio: "",
            };
            console.log("Sending payload:", payload);

            // API に送信
            await api.post("/users/create", { email, username, display_name: displayName });

            alert("プロフィールが作成されました！");
            
            navigate("/home"); 

            setTimeout(() => {
                window.location.reload();
            }, 500);

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
                placeholder="ユーザー名(半角英数字)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="error-message">{usernameError}</p>}
            

            
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