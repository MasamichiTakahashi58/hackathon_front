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
    onImageChange: (type: "icon" | "header", url: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, onImageChange }) => {
    return (
        <div className="profile-header">
            <div className="header-container">
                <ImageUploader
                    currentImage={userInfo.header_image}
                    onUploadSuccess={(url) => onImageChange("header", url)} // URLを親に通知
                    type="header"
                />
            </div>
            <div className="icon-container">
                <ImageUploader
                    currentImage={userInfo.profile_image}
                    onUploadSuccess={(url) => onImageChange("icon", url)} // URLを親に通知
                    type="icon"
                />
            </div>
            <div className="profile-info">
                <h1>{userInfo.display_name}</h1>
                <p>@{userInfo.username}</p>
                <p>{userInfo.bio}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
