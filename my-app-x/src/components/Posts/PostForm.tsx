import React, { useState } from "react";
import { createPost } from "../../services/PostServices";
import "./PostForm.css"; 

const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!content.trim()) return;
        const userId = 1; // 仮のユーザーID
        await createPost(content, userId);
        setContent("");
        onPostCreated();
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
