import React, { useState, useEffect } from "react";
import LikeButton from "../Like/LikeButton";
import ReplyForm from "../Reply/ReplyForm";
import ReplyList from "../Reply/ReplyList";
import { getRepliesByPost } from "../../services/ReplyService";
import { getUserById } from "../../services/UserService"; // ユーザー情報取得
import "./PostItem.css";

interface Post {
    id: number;
    user_id: number; // ユーザーIDを追加
    username: string;
    display_name: string;
    content: string;
    image_url?: string;
    created_at: string;
}
const defaultImage = "/images/default.jpg-1733549945541";
const PostItem: React.FC<{ post: Post }> = ({ post }) => {
    const [isReplyVisible, setIsReplyVisible] = useState(false);
    const [replyCount, setReplyCount] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>(defaultImage); // 仮のアイコン画像

    useEffect(() => {
        fetchReplyCount();
        fetchProfileImage(); // アイコン画像を取得
    }, []);

    const fetchReplyCount = async () => {
        try {
            const replies = await getRepliesByPost(post.id);
            setReplyCount(replies?.length || 0);
        } catch (error) {
            console.error("リプライ数取得エラー:", error);
        }
    };

    const fetchProfileImage = async () => {
        try {
            const userProfile = await getUserById(post.user_id); // `user_id` を使ってユーザー情報を取得
            setProfileImage(userProfile.profile_image || defaultImage);
        } catch (error) {
            console.error("プロフィール画像の取得に失敗しました:", error);
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
                    src={profileImage} // フェッチしたアイコン画像を使用
                    alt="User Icon"
                    className="user-icon"
                />
                <div className="user-info">
                    <h3 className="display-name">{post.display_name}</h3>
                    <p className="username">@{post.username}</p>
                </div>
                <small className="post-date">{new Date(post.created_at).toLocaleDateString()}</small>
            </div>

            {post.content && <p className="post-content">{post.content}</p>}
            {post.image_url && (
                <div className="post-image">
                    <img src={post.image_url} alt="Post Content" className="post-image-content" />
                </div>
            )}

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
