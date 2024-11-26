import React from "react";
import "./PostItem.css"; 

interface Post {
    display_name: string;
    username: string;
    created_at: string;
    content: string;
}

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
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
                <button className="action-button">リプライ</button>
                <button className="action-button">リポスト</button>
                <button className="action-button">いいね</button>
            </div>
        </div>
    );
};

export default PostItem;
