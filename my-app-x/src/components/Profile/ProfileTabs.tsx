import React, { useState, useEffect } from "react";
import { getPosts } from "../../services/PostService";
import { getRepliesByPost } from "../../services/ReplyService";
import { hasUserLiked } from "../../services/LikeService";
import "./ProfileTabs.css";

interface ProfileTabsProps {
    userID: string | number;
}
interface Reply {
    id: number;
    content: string;
    user_id: number;
    parent_id: number;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userID }) => {
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]); // ポストデータ
    const [replies, setReplies] = useState<any[]>([]); // 返信データ
    const [likedPosts, setLikedPosts] = useState<any[]>([]); // いいねした投稿
    const [repliedPosts, setRepliedPosts] = useState<any[]>([]); // 自分がリプライした投稿

    // Fetch posts
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (err) {
            setError("ポストの取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // Fetch replies
    const fetchReplies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRepliesByPost(Number(userID));
            setReplies(data);
        } catch (err) {
            setError("返信の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // Fetch liked posts
    const fetchLikedPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const posts = await getPosts();
            const likedPosts = [];
            for (const post of posts) {
                const liked = await hasUserLiked(post.id, Number(userID));
                if (liked) {
                    likedPosts.push(post);
                }
            }
            setLikedPosts(likedPosts);
        } catch (err) {
            setError("いいねした投稿の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // Fetch replied posts
    const fetchRepliedPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const posts = await getPosts();
            const userReplies = [];

            // 各投稿のリプライをチェック
            for (const post of posts) {
                const replies: Reply[] = await getRepliesByPost(post.id);

                // 自分のリプライがあるかを確認
                const hasUserReplied = replies.some((reply: Reply) => reply.user_id === Number(userID));
                if (hasUserReplied) {
                    userReplies.push(post); // 自分がリプライした投稿をリストに追加
                }
            }

            setRepliedPosts(userReplies);
        } catch (err) {
            setError("リプライした投稿の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // Handle tab switching
    useEffect(() => {
        switch (activeTab) {
            case "posts":
                fetchPosts();
                break;
            case "replies":
                fetchReplies();
                break;
            case "media":
                fetchLikedPosts();
                break;
            case "replied":
                fetchRepliedPosts();
                break;
        }
    }, [activeTab]);

    const renderContent = () => {
        if (loading) return <p>読み込み中...</p>;
        if (error) return <p className="error-message">{error}</p>;

        switch (activeTab) {
            case "posts":
                return (
                    <div>
                        {posts && posts.length > 0 ? (
                            <ul>
                                {posts.map((post) => (
                                    <li key={post.id}>
                                        {post.content}（UserID: {post.user_id}）
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>ポストがありません。</p>
                        )}
                    </div>
                );
            case "replies":
                return (
                    <div>
                        {replies && replies.length > 0 ? (
                            <ul>
                                {replies.map((reply) => (
                                    <li key={reply.id}>
                                        {reply.content}（ParentID: {reply.parent_id}）
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>返信がありません。</p>
                        )}
                    </div>
                );
            case "media":
                return (
                    <div>
                        {likedPosts && likedPosts.length > 0 ? (
                            <ul>
                                {likedPosts.map((post) => (
                                    <li key={post.id}>
                                        {post.content}（投稿者ID: {post.user_id}）
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>いいねした投稿がありません。</p>
                        )}
                    </div>
                );
            case "replied":
                return (
                    <div>
                        {repliedPosts && repliedPosts.length > 0 ? (
                            <ul>
                                {repliedPosts.map((post) => (
                                    <li key={post.id}>
                                        {post.content}（投稿者ID: {post.user_id}）
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>リプライした投稿がありません。</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-tabs">
            <div className="tabs">
                <button
                    className={activeTab === "posts" ? "active" : ""}
                    onClick={() => setActiveTab("posts")}
                >
                    ポスト
                </button>
                <button
                    className={activeTab === "replies" ? "active" : ""}
                    onClick={() => setActiveTab("replies")}
                >
                    返信
                </button>
                <button
                    className={activeTab === "media" ? "active" : ""}
                    onClick={() => setActiveTab("media")}
                >
                    いいね
                </button>
                <button
                    className={activeTab === "replied" ? "active" : ""}
                    onClick={() => setActiveTab("replied")}
                >
                    リプライした投稿
                </button>
            </div>
            <div className="tab-content">{renderContent()}</div>
        </div>
    );
};

export default ProfileTabs;
