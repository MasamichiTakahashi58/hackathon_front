import React, { useState } from "react";
import "./ProfileTabs.css";

interface ProfileTabsProps {
    userID: string | number;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userID }) => {
    const [activeTab, setActiveTab] = useState("posts");

    const renderContent = () => {
        switch (activeTab) {
            case "posts":
                return <div>ポスト一覧 (UserID: {userID})</div>;
            case "replies":
                return <div>返信一覧 (UserID: {userID})</div>;
            case "media":
                return <div>いいね一覧 (UserID: {userID})</div>;
        }
    };

    return (
        <div className="profile-tabs">
            <div className="tabs">
                <button
                    className={activeTab === "posts" ? "active" : ""}
                    onClick={() => setActiveTab("posts")}
                >
                    ポスト
                </button>
                <button
                    className={activeTab === "replies" ? "active" : ""}
                    onClick={() => setActiveTab("replies")}
                >
                    返信
                </button>
                <button
                    className={activeTab === "media" ? "active" : ""}
                    onClick={() => setActiveTab("media")}
                >
                    いいね
                </button>
            </div>
            <div className="tab-content">{renderContent()}</div>
        </div>
    );
};

export default ProfileTabs;
