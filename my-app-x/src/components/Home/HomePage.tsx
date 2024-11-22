import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import PostItem from "../Posts/PostItem";
import PostForm from "../Posts/PostForm";
import { getPosts } from "../../services/PostServices";
import "./HomePage.css";

interface Post {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
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
                        posts.map((post) => <PostItem key={post.id} post={post} />)
                    ) : (
                        <p>投稿がありません。</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
