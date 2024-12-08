import React, { useState } from "react";
import { createReply } from "../../services/ReplyService";
import { useAuth } from "../Auth/AuthContext";
import "./ReplyForm.css";

const MAX_REPLY_LENGTH = 160;

const ReplyForm: React.FC<{
    postID: number;
    parentID?: number;
    onReplyCreated: () => void;
}> = ({ postID, parentID, onReplyCreated }) => {
    const [content, setContent] = useState("");
    const [error, setError] = useState<string>("");
    const { userID } = useAuth();

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_REPLY_LENGTH) {
            setContent(newContent);
            setError(""); // エラークリア
        } else {
            setError(`リプライは最大${MAX_REPLY_LENGTH}文字までです。`);
        }
    };

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
            setContent(""); // フォームをリセット
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
                onChange={handleContentChange}
                placeholder="リプライを入力..."
                className="reply-textarea"
            />
            <div className={`char-count ${content.length > MAX_REPLY_LENGTH ? "error" : ""}`}>
                {content.length}/{MAX_REPLY_LENGTH}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
                className="reply-button"
                onClick={handleSubmit}
                disabled={content.length > MAX_REPLY_LENGTH}
            >
                リプライ
            </button>
        </div>
    );
};

export default ReplyForm;
