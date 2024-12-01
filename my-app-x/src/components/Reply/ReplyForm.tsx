import React, { useState } from "react";
import { createReply } from "../../services/ReplyService"; 
import { useAuth } from "../Auth/AuthContext"; 
import "./ReplyForm.css"; 

const ReplyForm: React.FC<{
    postID: number;
    parentID?: number; 
    onReplyCreated: () => void; 
}> = ({ postID, parentID, onReplyCreated }) => {
    const [content, setContent] = useState(""); 
    const { userID } = useAuth(); 

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("リプライ内容を入力してください。");
            return;
        }

        if (!userID) {
            alert("ログインしていません。");
            return;
        }

        try {
            console.log("リクエストデータ:", {
                content,
                postID,
                userID,
                parentID: parentID ?? null,
            });
            await createReply(content, postID, userID, parentID);
            setContent(""); 
            onReplyCreated(); 
        } catch (error: any) {
            console.error("リプライ作成エラー:", error);
            alert(error.response?.data?.message || "リプライの作成に失敗しました。");
        }
    };

    return (
        <div className="reply-form">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="リプライを入力..."
                className="reply-textarea"
            />
            <button className="reply-button" onClick={handleSubmit}>
                リプライ
            </button>
        </div>
    );
};

export default ReplyForm;
