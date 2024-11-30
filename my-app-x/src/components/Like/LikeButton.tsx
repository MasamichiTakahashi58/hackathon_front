import React, { useState, useEffect } from "react";
import { addLike, removeLike, countLikes } from "../../services/LikeService";
import { useAuth } from "../Auth/AuthContext";

const LikeButton: React.FC<{ postID: number }> = ({ postID }) => {
    const { userID } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const count = await countLikes(postID); // サービスファイルを使用
                setLikeCount(count);
            } catch (error) {
                console.error("いいねの取得に失敗しました:", error);
            }
        };

        fetchLikes();
    }, [postID]);

    const handleLike = async () => {
        if (!userID) {
            alert("ログインしていません。");
            return;
        }
        try {
            if (liked) {
                await removeLike(postID, Number(userID)); // サービスファイルを使用
                setLikeCount((prev) => prev - 1);
            } else {
                await addLike(postID, Number(userID)); // サービスファイルを使用
                setLikeCount((prev) => prev + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("いいね操作エラー:", error);
        }
    };

    return (
        <button onClick={handleLike}>
            {liked ? "いいねを取り消す" : "いいね"} ({likeCount})
        </button>
    );
};

export default LikeButton;
