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
    onImageChange: (type: "icon" | "header", url: string | null) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, onImageChange }) => {
    const handleRemoveImage = (type: "icon" | "header") => {
        onImageChange(type, null); // nullを渡して画像を削除
    };

    return (
        <div className="profile-header">
            {/* ヘッダー画像 */}
            <div className="header-container">
                <ImageUploader
                    currentImage={userInfo.header_image}
                    onUploadSuccess={(url) => onImageChange("header", url)}
                    type="header"
                />
                <button
                    className="remove-button header-remove-button"
                    onClick={() => handleRemoveImage("header")}
                >
                    削除
                </button>
            </div>

            {/* アイコン画像 */}
            <div className="icon-container">
                <ImageUploader
                    currentImage={userInfo.profile_image}
                    onUploadSuccess={(url) => onImageChange("icon", url)}
                    type="icon"
                />
                <button
                    className="remove-button icon-remove-button"
                    onClick={() => handleRemoveImage("icon")}
                >
                    削除
                </button>
            </div>

            {/* プロフィール情報 */}
            <div className="profile-info">
                <h1>{userInfo.display_name}</h1>
                <p>@{userInfo.username}</p>
                <p>{userInfo.bio}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
