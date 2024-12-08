import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import PostItem from "../Posts/PostItem";
import PostForm from "../Posts/PostForm";
import { getPosts } from "../../services/PostService";
import "./HomePage.css";

interface Post {
    id: number;
    user_id: number;
    display_name: string; 
    username: string; 
    content: string;
    created_at: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const data = await getPosts(); // バックエンドから投稿データを取得

            // データを降順（新しい投稿が上）にソート
            const sortedPosts = (data || []).sort(
                (a: Post, b: Post) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setPosts(sortedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handlePostDelete = (postID: number) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postID));
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <h2>ホーム</h2>
                <PostForm onPostCreated={fetchPosts} />
                <div className="post-list">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostItem key={post.id} post={post} onDelete={handlePostDelete} />
                        ))
                    ) : (
                        <p>投稿がありません。</p>
                    )}
                </div>
            </div>
            <RightSidebar/>
        </div>
    );
};

export default HomePage;
