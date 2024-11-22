import React from "react";
import "./PostItem.css"; 

const PostItem: React.FC<{ post: any }> = ({ post }) => {
    return (
        <div className="post-item">
        <h3>User {post.user_id}</h3>
        <p>{post.content}</p>
        <small>{new Date(post.created_at).toLocaleString()}</small>
        </div>
    );
};

export default PostItem;
