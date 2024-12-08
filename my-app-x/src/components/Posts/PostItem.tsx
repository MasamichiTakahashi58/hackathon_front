import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import LikeButton from "../Like/LikeButton";
import ReplyForm from "../Reply/ReplyForm";
import ReplyList from "../Reply/ReplyList";
import { getRepliesByPost } from "../../services/ReplyService";
import { getUserById } from "../../services/UserService"; 
import { deletePost } from "../../services/PostService";
import UserProfilePopup from "./UserProfilePopup";
import "./PostItem.css";

interface Post {
    id: number;
    user_id: number; 
    username: string;
    display_name: string;
    content: string;
    image_url?: string;
    created_at: string;
}
const defaultImage = "/images/default.jpg-1733549945541";

const PostItem: React.FC<{ post: Post; onDelete: (postID: number) => void }> = ({ post, onDelete }) => {
    const [isReplyVisible, setIsReplyVisible] = useState(false);
    const [replyCount, setReplyCount] = useState<number>(0);
    const [profileImage, setProfileImage] = useState<string>(defaultImage); 
    const { userID } = useAuth();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [userBio, setUserBio] = useState<string | null>(null);

    useEffect(() => {
        fetchReplyCount();
        fetchProfileImage();
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
            const userProfile = await getUserById(post.user_id); 
            setProfileImage(userProfile.profile_image || defaultImage);
        } catch (error) {
            console.error("プロフィール画像の取得に失敗しました:", error);
        }
    };

    const handleOpenPopup = async () => {
        setIsPopupVisible(true);
        try {
            const userProfile = await getUserById(post.user_id); // APIでbioを取得
            setUserBio(userProfile.bio || ""); // bioを更新
        } catch (error) {
            console.error("ユーザープロフィールの取得に失敗しました:", error);
        }
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setUserBio(null); // ポップアップを閉じるときにbioをリセット
    };

    const handleReplyCreated = () => {
        fetchReplyCount();
    };

    const handleDelete = async () => {
        if (window.confirm("この投稿を削除しますか？")) {
            try {
                await deletePost(post.id); // サービスを呼び出して削除
                onDelete(post.id); // 削除後に親コンポーネントへ通知
            } catch (error) {
                console.error("ポスト削除に失敗しました:", error);
                alert("ポスト削除に失敗しました");
            }
        }
    };

    if (userID === null) {
        // ログインしていない場合はリストを表示しない
        return null;
    }

    return (
        <div className="post-item">
            {/* 投稿情報 */}
            <div className="post-header">
                <img
                    src={profileImage} 
                    alt="User Icon"
                    className="user-icon"
                />
                <div
                    className="user-info"
                    onClick={handleOpenPopup}
                >
                    <h3 className="display-name">{post.display_name}</h3>
                    <p className="username">@{post.username}</p>
                </div>

                <small className="post-date">{new Date(post.created_at).toLocaleDateString()}</small>
                {userID === post.user_id && (
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        削除
                    </button>
                )}
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
                    <ReplyList
                        postID={post.id}
                        onReplyCountChange={setReplyCount}
                        currentUserID={userID} // プロファイルページ情報を渡す
                    />
                </>
            )}
            {isPopupVisible && (
                <UserProfilePopup
                    displayName={post.display_name}
                    username={post.username}
                    profileImage={profileImage}
                    bio={userBio || "Loading..."} // bioを渡す
                    onClose={handleClosePopup} // ポップアップを閉じる
                />
            )}
        </div>
    );
};

export default PostItem;
