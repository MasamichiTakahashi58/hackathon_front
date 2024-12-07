import React, { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../services/UserService";
import { useAuth } from "../Auth/AuthContext";
import Sidebar from "../Home/Sidebar";
import RightSidebar from "../Home/RightSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import "./ProfilePage.css";

interface UserInfo {
    username: string;
    display_name: string;
    bio: string;
    profile_image: string;
    header_image: string;
}

const ProfilePage: React.FC = () => {
    const { userID } = useAuth();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userID) {
                setError("ログインしていません。");
                setLoading(false);
                return;
            }

            try {
                const userData = await getUserById(userID);
                setUserInfo(userData);
            } catch (err) {
                console.error("プロフィール取得エラー:", err);
                setError("プロフィール情報の取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userID]);

    if (loading) {
        return <p>読み込み中...</p>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleImageChange = async (type: "icon" | "header", url: string) => {
        if (!userID) {
            console.error("ユーザーIDが無効です。");
            return;
        }
    
        try {
            // 更新するフィールドを決定
            const updates =
                type === "icon" ? { profile_image: url } : { header_image: url };
    
            // バックエンドに変更部分だけを送信
            await updateUser(userID, updates);
    
            // ローカル状態を更新
            setUserInfo((prev) => ({
                ...prev!,
                ...updates,
            }));
    
            console.log(`${type === "icon" ? "アイコン" : "ヘッダー"}画像が更新されました。`);
        } catch (err) {
            console.error("バックエンド更新エラー:", err);
            alert("画像の更新に失敗しました。");
        }
    };
    

    return (
        <div className="profile-page">
            <Sidebar />
            <div className="main-content">
                {userInfo && (
                    <ProfileHeader
                        userInfo={userInfo}
                        onImageChange={handleImageChange}
                    />
                )}
                {userID && userInfo && <ProfileTabs userID={userID} />}
            </div>
            <RightSidebar />
        </div>
    );
};

export default ProfilePage;
