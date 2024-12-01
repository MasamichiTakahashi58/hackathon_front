import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/UserService";
import { useAuth } from "../Auth/AuthContext";

const ProfileEditForm: React.FC = () => {
    const [profile, setProfile] = useState({
        username: "",
        display_name: "",
        bio: "",
    });
    const { userID } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userID) {
                alert("ログインしていません。");
                return;
            }
            try {
                const userData = await getUserById(Number(userID)); // サービスファイルを使用
                setProfile(userData);
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
                alert("プロフィールの取得に失敗しました。");
            }
        };

        fetchProfile();
    }, [userID]);

    const handleSubmit = async () => {
        if (!userID) {
            alert("ログインしていません。");
            return;
        }
        try {
            await updateUser(Number(userID), profile); // サービスファイルを使用
            alert("プロフィールが更新されました！");
            navigate("/home");
        } catch (error) {
            console.error("プロフィール更新エラー:", error);
            alert("プロフィールの更新に失敗しました。");
        }
    };

    return (
        <div className="profile-edit-form">
            <h2>プロフィール編集</h2>
            <input
                type="text"
                placeholder="ユーザー名"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <input
                type="text"
                placeholder="表示名"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            />
            <textarea
                placeholder="自己紹介"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <button onClick={handleSubmit}>更新</button>
        </div>
    );
};

export default ProfileEditForm;
