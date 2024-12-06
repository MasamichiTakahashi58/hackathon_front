import React from "react";
import { useNavigate } from "react-router-dom";
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
    onImageChange: (type: "icon" | "header", file: File) => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, onImageChange }) => {
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate("/profile/edit"); // プロフィール編集ページへ遷移
    };

    return (
        <div className="profile-header">
            <div className="header-container">
                <ImageUploader
                    currentImage={userInfo.header_image}
                    onImageUpload={(file) => onImageChange("header", file)}
                    type="header"
                />
            </div>

            <div className="icon-container">
                <ImageUploader
                    currentImage={userInfo.profile_image}
                    onImageUpload={(file) => onImageChange("icon", file)}
                    type="icon"
                />
            </div>

            <div className="profile-info">
                <h1>{userInfo.display_name}</h1>
                <p>@{userInfo.username}</p>
                <p className="bio">{userInfo.bio}</p>
                <button className="edit-button" onClick={handleEditProfile}>
                    プロフィールを編集
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;
