import React, { useEffect, useState } from 'react';
import { getPosts, createPost } from '../services/PostServices';

interface Post {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
}

const PostsComponent: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState<string>('');

    useEffect(() => {
    const fetchPosts = async () => {
        try {
        const data = await getPosts();
        setPosts(data);
        } catch (error) {
        console.error('Error fetching posts:', error);
        }
    };

    fetchPosts();
    }, []);

    const handleCreatePost = async () => {
    try {
        const userID = 1; 
        await createPost(newPost, userID);
        setNewPost('');
        const updatedPosts = await getPosts();
        setPosts(updatedPosts);
    } catch (error) {
        console.error('Error creating post:', error);
    }
    };

    return (
    <div>
        <h1>Posts</h1>
        <div>
        <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
        />
        <button onClick={handleCreatePost}>Post</button>
    </div>
    {posts.map((post) => (
        <div key={post.id}>
            <h3>Post by User {post.user_id}</h3>
            <p>{post.content}</p>
            <small>Created at: {post.created_at}</small>
        </div>
    ))}
    </div>
    );
};

export default PostsComponent;
