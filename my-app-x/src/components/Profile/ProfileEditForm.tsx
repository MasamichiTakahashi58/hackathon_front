import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const ProfileEditForm: React.FC = () => {
    const [profile, setProfile] = useState({
        username: "",
        display_name: "",
        bio: "",
        location: "",
        website: "",
    });

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const userID = localStorage.getItem("userID"); // ログイン後に保存されたID
            if (!userID) {
                alert("ログインしていません。");
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
    }, []);

    const handleSubmit = async () => {
        try {
            const userID = localStorage.getItem("userID"); // ログイン後に保存されたID
            if (!userID) {
                alert("ログインしていません。");
                return;
            }
            await api.put("/users/update", { id: userID, ...profile });
            alert("プロフィールが更新されました！");
            navigate("/posts");
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
            <input
                type="text"
                placeholder="所在地"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
            <input
                type="text"
                placeholder="ウェブサイト"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            />
            <button onClick={handleSubmit}>更新</button>
        </div>
    );
};

export default ProfileEditForm;
