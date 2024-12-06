import React, { useEffect, useState } from "react";
import { getRepliesByPost } from "../../services/ReplyService";
import ReplyForm from "./ReplyForm";
import "./ReplyList.css";

interface Reply {
    id: number;
    user_id: number;
    username: string;
    display_name: string;
    post_id: number;
    content: string;
    parent_id?: number | null;
    created_at: string;
    relation_depth: number;
}

const ReplyList: React.FC<{
    postID: number;
    onReplyCountChange: (count: number) => void;
}> = ({ postID, onReplyCountChange }) => {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
    const [showReplyFormFor, setShowReplyFormFor] = useState<number | null>(null);

    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            const data = await getRepliesByPost(postID);
            console.log("受け取ったリプライ一覧:", data); // デバッグ用ログ
            setReplies(data || []);
            onReplyCountChange(data?.length || 0);
        } catch (error) {
            console.error("リプライ取得エラー:", error);
            setReplies([]);
            onReplyCountChange(0);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpandReplies = (replyID: number) => {
        setExpandedReplies((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(replyID)) {
                newSet.delete(replyID);
            } else {
                newSet.add(replyID);
            }
            return newSet;
        });
    };

    const closeChildReplies = (replyID: number) => {
        setExpandedReplies((prev) => {
            const newSet = new Set(prev);
            newSet.delete(replyID);
            return newSet;
        });
    };

    const renderReplies = (parentID: number | null, depth: number) => {
        const childReplies = replies.filter((reply) => {
            if (parentID === null) {
                return !reply.parent_id && reply.relation_depth === depth;
            }
            return reply.parent_id === parentID && reply.relation_depth === depth;
        });

        console.log("親リプライ:", parentID, "深さ:", depth, "対象のリプライ:", childReplies);

        return childReplies.map((reply) => {
            const hasChildReplies = replies.some(
                (child) => child.parent_id === reply.id && child.relation_depth === depth + 1
            );
        
            return (
                <div key={reply.id} className="reply-item">
                    <div className="reply-header">
                        <h4>{reply.display_name}</h4>
                        <p className="username">@{reply.username}</p>
                        <small>{new Date(reply.created_at).toLocaleDateString()}</small>
                    </div>
                    <p className="reply-content">{reply.content}</p>
        
                    {/* ボタンの表示部分 */}
                    <div className="reply-actions">
                        {/* リプライフォームを表示するボタン */}
                        <button
                            className="reply-create-button"
                            onClick={() =>
                                setShowReplyFormFor((current) =>
                                    current === reply.id ? null : reply.id
                                )
                            }
                        >
                            {showReplyFormFor === reply.id ? "キャンセル" : "リプライを作成"}
                        </button>
        
                        {/* 子リプライの表示/閉じるボタン */}
                        {hasChildReplies && (
                            <button
                                className="reply-toggle-button"
                                onClick={() => toggleExpandReplies(reply.id)}
                            >
                                {expandedReplies.has(reply.id) ? "閉じる" : "子リプライを表示"} (
                                {
                                    replies.filter(
                                        (child) =>
                                            child.parent_id === reply.id &&
                                            child.relation_depth === depth + 1
                                    ).length
                                }
                                )
                            </button>
                        )}
                    </div>
        
                    {/* 子リプライフォーム */}
                    {showReplyFormFor === reply.id && (
                        <ReplyForm
                            postID={postID}
                            parentID={reply.id}
                            onReplyCreated={() => {
                                fetchReplies();
                                setShowReplyFormFor(null);
                            }}
                        />
                    )}
        
                    {/* 子リプライの展開 */}
                    {expandedReplies.has(reply.id) && (
                        <div className="child-replies">
                            {renderReplies(reply.id, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
        
    };

    if (loading) {
        return <p>リプライを読み込み中...</p>;
    }

    if (replies.length === 0) {
        return <p>リプライはありません。</p>;
    }

    return <div className="replies-list">{renderReplies(null, 1)}</div>;
};

export default ReplyList;
