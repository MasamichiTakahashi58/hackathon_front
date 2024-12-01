import React, { useState } from "react";
import ReplyForm from "../Reply/ReplyForm";
import LikeButton from "../Like/LikeButton";
import ReplyList from "../Reply/ReplyList";
import "./PostItem.css"; 

interface Post {
    id: number;
    display_name: string;
    username: string;
    created_at: string;
    content: string;
}

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
    const [isReplyVisible, setIsReplyVisible] = useState(false);

    const handleReplyCreated = () => {
        console.log("リプライが作成されました");
        setIsReplyVisible(false); 
    };

    return (
        <div className="post-item">
            {/* ヘッダー部分: ユーザー情報 */}
            <div className="post-header">
                <img
                    src="https://via.placeholder.com/48" // 仮のアイコン画像URL
                    alt="User Icon"
                    className="user-icon"
                />
                <div className="user-info">
                    <h3 className="display-name">{post.display_name}</h3>
                    <p className="username">@{post.username}</p>
                </div>
                <small className="post-date">{new Date(post.created_at).toLocaleDateString()}</small>
            </div>

            {/* 投稿内容 */}
            <p className="post-content">{post.content}</p>

            {/* アクションボタン */}
            <div className="post-actions">
            <button
                    className="action-button"
                    onClick={() => setIsReplyVisible(!isReplyVisible)}
                >
                    💬
                </button>
                <button className="action-button">リポスト</button>
                <LikeButton postID={post.id} />
            </div>
            
            {isReplyVisible && (
                <>
                    <ReplyForm postID={post.id} onReplyCreated={handleReplyCreated} />
                    <ReplyList postID={post.id} />
                </>
            )}
        </div>
    );
};

export default PostItem;
