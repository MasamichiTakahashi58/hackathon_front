import React, { useState, useEffect } from "react";
import { getUserById } from "../../services/UserService"; // サービスをインポート
import { useAuth } from "../Auth/AuthContext"; // ログイン情報を取得
import Sidebar from "../Home/Sidebar";
import RightSidebar from "../Home/RightSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs"
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
    const { userID } = useAuth(); // ログイン情報からユーザーIDを取得
    const [userInfo, setUserInfo] = useState<any | null>(null);
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
                const userData = await getUserById(Number(userID)); // ユーザー情報を取得
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
        return <p>{error}</p>;
    }

    return (
        <div className="profile-page">
            {/* 左サイドバー */}
            <Sidebar />

            {/* 中央のプロフィール情報 */}
            <div className="main-content">
                {userInfo && <ProfileHeader userInfo={userInfo} />} {/* プロフィールヘッダー */}
                {userID && userInfo && <ProfileTabs userID={userID} />} {/* 投稿タブ */}
            </div>

            {/* 右サイドバー */}
            <RightSidebar />
        </div>
    );
};

export default ProfilePage;
