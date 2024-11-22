import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";
import PostForm from "./PostForm";
import { getPosts } from "../../services/PostServices";

interface Post {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
}

const PostsComponent: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null); // エラー用

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data || []); 
            setError(null); 
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Failed to load posts."); 
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="posts-container">
            <PostForm onPostCreated={fetchPosts} />
            {error ? (
                <p className="error-message">{error}</p> 
            ) : posts.length === 0 ? (
                <p className="no-posts-message">No posts available.</p> 
            ) : (
                <div className="post-list">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostsComponent;

