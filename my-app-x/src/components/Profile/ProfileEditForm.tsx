import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/UserService";
import { useAuth } from "../Auth/AuthContext";
import "./ProfileEditForm.css";

const MAX_BIO_LENGTH = 160;

const ProfileEditForm: React.FC = () => {
    const [profile, setProfile] = useState({
        username: "",
        display_name: "",
        bio: "",
    });
    const [bioLength, setBioLength] = useState(0);
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
                setProfile({
                    username: userData.username || "",
                    display_name: userData.display_name || "",
                    bio: userData.bio || "",
                });
                setBioLength(userData.bio?.length || 0);
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
                alert("プロフィールの取得に失敗しました。");
            }
        };

        fetchProfile();
    }, [userID]);

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const bio = e.target.value;
        if (bio.length <= MAX_BIO_LENGTH) {
            setProfile({ ...profile, bio });
            setBioLength(bio.length);
        }
    };

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
        <div className="form-group">
            <label>ユーザー名</label>
            <input
                type="text"
                placeholder="ユーザー名"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>表示名</label>
            <input
                type="text"
                placeholder="表示名"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label>自己紹介</label>
            <textarea
                placeholder="自己紹介"
                value={profile.bio}
                onChange={handleBioChange}
            />
            <div className={`char-count ${bioLength > MAX_BIO_LENGTH ? "error" : ""}`}>
                {bioLength}/{MAX_BIO_LENGTH}
            </div>
        </div>
        <button className="submit-button" onClick={handleSubmit}>
            更新
        </button>
    </div>
    );
};

export default ProfileEditForm;
