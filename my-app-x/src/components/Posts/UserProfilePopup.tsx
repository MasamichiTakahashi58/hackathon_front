import React from "react";
import "./UserProfilePopup.css";

interface UserProfilePopupProps {
    displayName: string;
    username: string;
    profileImage: string;
    bio?: string;
    onClose: () => void;
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({
    displayName,
    username,
    profileImage,
    bio,
    onClose,
}) => {
    return (
        <div className="user-profile-popup">
            <div className="popup-overlay" onClick={onClose}></div>
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <img src={profileImage} alt="User Icon" className="profile-image" />
                <h3 className="popup-display-name">{displayName}</h3>
                <p className="popup-username">@{username}</p>
                {bio && <p className="popup-bio">{bio}</p>}
            </div>
        </div>
    );
};

export default UserProfilePopup;
