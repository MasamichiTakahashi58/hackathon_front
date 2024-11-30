import React, { useState } from "react";
import { createReply } from "../../services/ReplyService";
import { useAuth } from "../Auth/AuthContext";

const ReplyForm: React.FC<{ postID: number; onReplyCreated: () => void }> = ({ postID, onReplyCreated }) => {
    const [content, setContent] = useState("");
    const { userID } = useAuth();

    const handleReply = async () => {
        if (!content.trim()) return;
        if (!userID) {
            alert("ログインしていません。");
            return;
        }
        try {
            await createReply(content, postID, Number(userID)); // サービスファイルを使用
            setContent("");
            onReplyCreated();
        } catch (error) {
            console.error("リプライ作成エラー:", error);
        }
    };

    return (
        <div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleReply}>リプライ</button>
        </div>
    );
};

export default ReplyForm;
