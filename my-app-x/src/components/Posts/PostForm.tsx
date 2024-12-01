import React, { useState } from "react";
import { createPost } from "../../services/PostService";
import { useAuth } from "../Auth/AuthContext"; // 認証コンテキストをインポート
import "./PostForm.css";

const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const { userID } = useAuth(); // ログイン中のユーザーIDを取得

    const handleSubmit = async () => {
        if (!content.trim()) return;

        if (!userID) {
            alert("ログインしていません。");
            return;
        }

        try {
            await createPost(content, userID); // ログイン中のユーザーIDを利用
            setContent("");
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
            <div className="post-form-footer">
                <button className="post-button" onClick={handleSubmit}>
                    ポストする
                </button>
            </div>
        </div>
    );
};

export default PostForm;
