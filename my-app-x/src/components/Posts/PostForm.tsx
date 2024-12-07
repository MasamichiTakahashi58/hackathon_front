import React, { useState, useEffect } from "react";
import { createPost } from "../../services/PostService";
import { getUserById } from "../../services/UserService"; // UserService をインポート
import { useAuth } from "../Auth/AuthContext"; // 認証コンテキスト
import ImageUploader from "../ImageUploader/ImageUploader"; // 画像アップローダー
import "./PostForm.css";

const defaultImage = "/images/default.jpg-1733549945541";
const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string>(""); // 画像URL
    const [profileImage, setProfileImage] = useState<string>(defaultImage); // 仮のアイコン画像を初期値に
    const { userID } = useAuth(); // ログイン中のユーザーIDを取得

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userID) return;
            try {
                const userProfile = await getUserById(userID); // UserService のメソッドを使用
                setProfileImage(userProfile.profile_image || defaultImage);
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました:", error);
            }
        };

        fetchUserProfile();
    }, [userID]);

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
            await createPost(content, userID, imageUrl); // 投稿データをバックエンドに送信
            setContent("");
            setImageUrl(""); // フォームをリセット
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
                        src={profileImage} // ユーザーアイコン画像を表示
                        alt="User Icon"
                        className="user-icon"
                    />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="いまどうしてる？"
                    className="post-textarea"
                />
            </div>

            {/* 画像アップローダー */}
            <div className="post-image-uploader">
            <ImageUploader
                currentImage=""
                onUploadSuccess={(url) => {
                    console.log("ImageUploader uploaded URL:", url); // URLが渡されているか確認
                    setImageUrl(url);
                }}
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
                        onClick={() => setImageUrl("")} // 画像URLをリセット
                    >
                        ✖
                    </button>
                </div>
            )}

            <div className="post-form-footer">
                <button className="post-button" onClick={handleSubmit}>
                    ポストする
                </button>
            </div>
        </div>
    );
};

export default PostForm;
