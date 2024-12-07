import React, { useState } from "react";
import { createPost } from "../../services/PostService";
import { useAuth } from "../Auth/AuthContext"; // 認証コンテキスト
import ImageUploader from "../ImageUploader/ImageUploader"; // 画像アップローダー
import "./PostForm.css";

const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string>(""); // 画像URL
    const { userID } = useAuth(); // ログイン中のユーザーIDを取得

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
                        src="https://via.placeholder.com/48" // 仮のアイコン画像URL
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
                    onUploadSuccess={setImageUrl} // アップロード成功時に画像URLを保存
                    type="post_image"
                />
            </div>

            <div className="post-form-footer">
                <button className="post-button" onClick={handleSubmit}>
                    ポストする
                </button>
            </div>
        </div>
    );
};

export default PostForm;
