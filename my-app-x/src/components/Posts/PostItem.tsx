import React, { useState, useEffect } from "react";
import LikeButton from "../Like/LikeButton";
import ReplyForm from "../Reply/ReplyForm";
import ReplyList from "../Reply/ReplyList";
import { getRepliesByPost } from "../../services/ReplyService"; // リプライを取得する関数をインポート
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
    const [replyCount, setReplyCount] = useState<number>(0);

    // 初期表示時にリプライ数を取得
    useEffect(() => {
        fetchReplyCount();
    }, []);

    const fetchReplyCount = async () => {
        try {
            const replies = await getRepliesByPost(post.id);
            setReplyCount(replies?.length || 0);
        } catch (error) {
            console.error("リプライ数取得エラー:", error);
        }
    };

    const handleReplyCreated = () => {
        fetchReplyCount(); 
    };

    return (
        <div className="post-item">
            {/* 投稿情報 */}
            <div className="post-header">
                <img
                    src="https://via.placeholder.com/48" // 仮のアイコン画像
                    alt="User Icon"
                    className="user-icon"
                />
                <div className="user-info">
                    <h3 className="display-name">{post.display_name}</h3>
                    <p className="username">@{post.username}</p>
                </div>
                <small className="post-date">{new Date(post.created_at).toLocaleDateString()}</small>
            </div>

            <p className="post-content">{post.content}</p>

            {/* アクションボタン */}
            <div className="post-actions">
                <button
                    className="action-button"
                    onClick={() => setIsReplyVisible(!isReplyVisible)}
                >
                    💬 {replyCount}
                </button>
                <button className="action-button">リポスト</button>
                <LikeButton postID={post.id} />
            </div>

            {/* リプライフォーム */}
            {isReplyVisible && (
                <>
                    <ReplyForm postID={post.id} onReplyCreated={handleReplyCreated} />
                    <ReplyList postID={post.id} onReplyCountChange={setReplyCount} />
                </>
            )}
        </div>
    );
};

export default PostItem;
