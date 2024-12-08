import React, { useState, useEffect } from "react";
import { createPost } from "../../services/PostService";
import { getUserById } from "../../services/UserService";
import { useAuth } from "../Auth/AuthContext";
import ImageUploader from "../ImageUploader/ImageUploader";
import "./PostForm.css";

const defaultImage = "/images/default.jpg-1733549945541";
const MAX_POST_LENGTH = 160;

const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>(defaultImage);
    const [error, setError] = useState<string>("");
    const { userID } = useAuth();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userID) return;
            try {
                const userProfile = await getUserById(userID);
                setProfileImage(userProfile.profile_image || defaultImage);
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました:", error);
            }
        };

        fetchUserProfile();
    }, [userID]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_POST_LENGTH) {
            setContent(newContent);
            setError("");
        } else {
            setError(`ポストは最大${MAX_POST_LENGTH}文字までです。`);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && !imageUrl) {
            alert("テキストまたは画像を入力してください。");
            return;
        }

        if (!userID) {
            alert("ログインしていません。");
            return;
        }

        try {
            await createPost(content, userID, imageUrl);
            setContent("");
            setImageUrl("");
            onPostCreated();
        } catch (error) {
            console.error("投稿エラー:", error);
            alert("投稿に失敗しました。");
        }
    };

    return (
        <div className="post-form-container">
            <div className="post-form-header">
                <div className="post-icon">
                    <img
                        src={profileImage}
                        alt="User Icon"
                        className="user-icon"
                    />
                </div>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="いまどうしてる？"
                    className="post-textarea"
                />
                <div className={`char-count ${content.length > MAX_POST_LENGTH ? "error" : ""}`}>
                    {content.length}/{MAX_POST_LENGTH}
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            <div className="post-image-uploader">
                <ImageUploader
                    currentImage=""
                    onUploadSuccess={(url) => setImageUrl(url)}
                    type="post_image"
                />
            </div>

            {imageUrl && (
                <div className="image-preview-container">
                    <img
                        src={imageUrl}
                        alt="プレビュー画像"
                        className="image-preview"
                    />
                    <button
                        className="image-remove-button"
                        onClick={() => setImageUrl("")}
                    >
                        ✖
                    </button>
                </div>
            )}

            <div className="post-form-footer">
                <button
                    className="post-button"
                    onClick={handleSubmit}
                    disabled={content.length > MAX_POST_LENGTH}
                >
                    ポストする
                </button>
            </div>
        </div>
    );
};

export default PostForm;
