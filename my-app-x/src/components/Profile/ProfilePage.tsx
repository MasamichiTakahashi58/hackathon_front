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
    
    // 画像アップロード後の処理
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    const handleImageChange = async (type: "icon" | "header", file: File) => {
        if (!userID) {
            console.error("ユーザーIDが無効です。");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert("ファイルサイズが大きすぎます（10MB以下にしてください）。");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);
        formData.append("userId", String(userID)); // ログイン中のユーザーID

        try {
            const response = await fetch("/upload/user-image", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("画像のアップロードに失敗しました。");
            }
            const data = await response.json();
            setUserInfo((prev: any) => ({
                ...prev,
                [`${type}_image`]: data.filePath, // プロフィール画像 or ヘッダー画像を更新
            }));
        } catch (err) {
            console.error("画像アップロードエラー:", err);
        }
    };

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
                {userInfo && (
                    <ProfileHeader
                        userInfo={userInfo}
                        onImageChange={handleImageChange} // ここで渡す
                    />
                )}
                {userID && userInfo && <ProfileTabs userID={userID} />}
            </div>

            {/* 右サイドバー */}
            <RightSidebar />
        </div>
    );
};

export default ProfilePage;
