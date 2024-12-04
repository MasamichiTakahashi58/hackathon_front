import React from "react";
import ImageUploader from "../ImageUploader/ImageUploader";
import "./ProfileHeader.css";

interface ProfileHeaderProps {
    userInfo: {
        username: string;
        display_name: string;
        bio: string;
        profile_image: string;
        header_image: string;
    
    };
    onImageChange: (type: "icon" | "header", file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, onImageChange }) => {
    return (
        <div className="profile-header">
            {/* ヘッダー画像 */}
            <div className="header-container">
                <ImageUploader
                    currentImage={userInfo.header_image}
                    onImageUpload={(file) => onImageChange("header", file)}
                    type="header"
                />
            </div>

            {/* プロフィール画像 */}
            <div className="icon-container">
                <ImageUploader
                    currentImage={userInfo.profile_image}
                    onImageUpload={(file) => onImageChange("icon", file)}
                    type="icon"
                />
            </div>
            {/* 編集ボタン */}
            <button className="edit-button">プロフィールを編集</button>


            {/* プロフィール情報 */}
            <div className="profile-info">
                <h1>{userInfo.display_name}</h1>
                <p>@{userInfo.username}</p>
                <p className="bio">{userInfo.bio}</p>
                <div className="profile-stats">
                    <span>14 フォロー中</span>
                    <span>5 フォロワー</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
