import React, { useEffect, useState } from "react";
import { getRepliesByPost } from "../../services/ReplyService";
import "./ReplyList.css";

interface Reply {
    id: number;
    user_id: number;
    username: string;
    display_name: string;
    post_id: number;
    content: string;
    parent_id: number | null;
    created_at: string;
}

const ReplyList: React.FC<{ postID: number }> = ({ postID }) => {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            const data = await getRepliesByPost(postID);
            setReplies(data);
        } catch (error) {
            console.error("リプライ取得エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>リプライを読み込み中...</p>;
    }

    if (replies.length === 0) {
        return <p>リプライはありません。</p>;
    }

    return (
        <div className="replies-list">
            {replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                    <div className="reply-header">
                        <h4>{reply.display_name}</h4>
                        <p className="username">@{reply.username}</p>
                        <small>{new Date(reply.created_at).toLocaleDateString()}</small>
                    </div>
                    <p className="reply-content">{reply.content}</p>
                </div>
            ))}
        </div>
    );
};

export default ReplyList;
