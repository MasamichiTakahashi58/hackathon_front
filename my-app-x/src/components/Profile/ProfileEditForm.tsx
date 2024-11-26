import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import api from "../../api/axiosInstance";

const ProfileEditForm: React.FC = () => {
    const [profile, setProfile] = useState({
        username: "",
        display_name: "",
        bio: "",
    });
    const { userID, user } = useAuth(); // userID と認証情報を取得
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            if (!userID) {
                alert("ログインしていません。");
                navigate("/login");
                return;
            }
            const response = await api.get(`/users/${userID}`);
            setProfile(response.data);
        } catch (error) {
            console.error("プロフィール取得エラー:", error);
            alert("プロフィールの取得に失敗しました。");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userID]);

    const handleSubmit = async () => {
        try {
            if (!userID) {
                alert("ログインしていません。");
                navigate("/login");
                return;
            }
            await api.put(`/users/update`, { id: userID, ...profile });
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
