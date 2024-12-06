import React, { useState, useEffect } from "react";
import { getUserById } from "../../services/UserService";
import { uploadUserImage } from "../../services/ImageService";
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

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleImageChange = async (type: "icon" | "header", file: File) => {
        if (!userID) {
            console.error("ユーザーIDが無効です。");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert("ファイルサイズが大きすぎます（10MB以下にしてください）。");
            return;
        }

        try {
            const filePath = await uploadUserImage(Number(userID), file, type);
            setUserInfo((prev) => ({
                ...prev!,
                [`${type}_image`]: `${BASE_URL}${filePath}`,
            }));
        } catch (err) {
            console.error("画像アップロードエラー:", err);
            alert("画像のアップロードに失敗しました。");
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
                const userData = await getUserById(Number(userID));
                setUserInfo({
                    ...userData,
                    profile_image: userData.profile_image ? `${BASE_URL}${userData.profile_image}` : "",
                    header_image: userData.header_image ? `${BASE_URL}${userData.header_image}` : "",
                });
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
