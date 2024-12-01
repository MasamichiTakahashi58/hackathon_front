import React from "react";
import "./ProfileHeader.css";

interface ProfileHeaderProps {
    userInfo: {
        username: string;
        display_name: string;
        bio: string;
    };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo }) => {
    return (
        <div className="profile-header">
            <div className="cover-photo"></div>
            <div className="profile-info">
                <img
                    className="profile-picture"
                    src="https://via.placeholder.com/150" // 仮のプロフィール画像
                    alt="Profile"
                />
                <div className="profile-details">
                    <h1>{userInfo.display_name}</h1> {/* 表示名 */}
                    <p>@{userInfo.username}</p> {/* ユーザー名 */}
                    <p>2024年12月から利用中</p> {/* 登録日 */}
                    <p>{userInfo.bio}</p> {/* 自己紹介 */}
                </div>
            </div>
            <div className="profile-stats">
                <span>14 フォロー中</span>
                <span>5 フォロワー</span>
            </div>
        </div>
    );
};

export default ProfileHeader;
