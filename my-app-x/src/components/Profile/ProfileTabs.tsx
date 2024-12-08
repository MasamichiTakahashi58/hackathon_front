import React, { useState, useEffect } from "react";
import { getPosts } from "../../services/PostService";
import { getRepliesByPost } from "../../services/ReplyService";
import { hasUserLiked } from "../../services/LikeService";
import PostItem from "../Posts/PostItem";
import "./ProfileTabs.css";

interface ProfileTabsProps {
    userID: number; // userIDプロパティを明示的に型定義
}

interface Post {
    id: number;
    user_id: number;
    username: string;
    display_name: string;
    content: string;
    image_url?: string;
    created_at: string;
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
    const [posts, setPosts] = useState<Post[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [repliedPosts, setRepliedPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        if (!userID) return;
        setLoading(true);
        setError(null);
        try {
            const data: Post[] = await getPosts();
            setPosts(data.filter((post) => post.user_id === Number(userID)));
        } catch (err) {
            setError("ポストの取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedPosts = async () => {
        if (!userID) return;
        setLoading(true);
        setError(null);
        try {
            const allPosts: Post[] = await getPosts();
            const liked: Post[] = [];
            for (const post of allPosts) {
                const likedByUser = await hasUserLiked(post.id, Number(userID));
                if (likedByUser) {
                    liked.push(post);
                }
            }
            setLikedPosts(liked);
        } catch (err) {
            setError("いいねした投稿の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    const fetchRepliedPosts = async () => {
        if (!userID) return;
        setLoading(true);
        setError(null);
    
        try {
            console.log("Fetching all posts for userID:", userID);
            const allPosts: Post[] = await getPosts();
            const replied: Post[] = [];
    
            for (const post of allPosts) {
                console.log("Fetching replies for postID:", post.id);
    
                // リプライを取得
                const replies: Reply[] = (await getRepliesByPost(post.id)) || [];
                console.log("Replies for postID:", post.id, replies);
    
                // ログインユーザーのリプライをチェック
                if (replies.some((reply: Reply) => reply.user_id === Number(userID))) {
                    console.log("User replied to postID:", post.id);
                    replied.push(post);
                }
            }
    
            console.log("Replied posts:", replied);
            setRepliedPosts(replied);
    
        } catch (err) {
            console.error("Error while fetching replied posts:", err);
            setError("リプライした投稿の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        switch (activeTab) {
            case "posts":
                fetchPosts();
                break;
            case "media":
                fetchLikedPosts();
                break;
            case "replied":
                fetchRepliedPosts();
                break;
        }
    }, [activeTab, userID]);

    const renderContent = () => {
        if (loading) return <p>読み込み中...</p>;
        if (error) return <p className="error-message">{error}</p>;

        let content: Post[] = [];
        switch (activeTab) {
            case "posts":
                content = posts;
                break;
            case "media":
                content = likedPosts;
                break;
            case "replied":
                content = repliedPosts;
                break;
        }

        return (
            <div>
                {content.length > 0 ? (
                    content.map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                        />
                    ))
                ) : (
                    <p>表示する投稿がありません。</p>
                )}
            </div>
        );
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
