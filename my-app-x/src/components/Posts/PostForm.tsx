import React, { useState } from "react";
import { createPost } from "../../services/PostServices";
import "./PostForm.css"; 

const PostForm: React.FC<{ onPostCreated: () => void }> = ({ onPostCreated }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!content) return;
        const userId = 1; // 仮のユーザーID
        await createPost(content, userId);
        setContent("");
        onPostCreated();
    };

    return (
        <div className="post-form">
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a new post..."
        />
        <button onClick={handleSubmit}>Post</button>
        </div>
    );
};

export default PostForm;
