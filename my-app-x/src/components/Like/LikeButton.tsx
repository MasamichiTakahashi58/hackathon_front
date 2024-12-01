import React, { useState, useEffect, useCallback } from "react";
import { addLike, removeLike, countLikes, hasUserLiked } from "../../services/LikeService"; 
import { useAuth } from "../Auth/AuthContext";
import "./LikeButton.css"; 

const LikeButton: React.FC<{ postID: number }> = ({ postID }) => {
    const { userID } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(false);

    useEffect(() => {
        const initializeLikes = async () => {
            if (!userID) return;

            try {
                const count = await countLikes(postID); 
                const hasLiked = await hasUserLiked(postID, userID); 
                setLikeCount(count);
                setLiked(hasLiked);
            } catch (error) {
                console.error("いいね情報の初期化に失敗しました:", error);
            }
        };

        initializeLikes();
    }, [postID, userID]);

    const sendLikeRequest = useCallback(async () => {
        try {
            if (liked) {
                await removeLike(postID, Number(userID));
            } else {
                await addLike(postID, Number(userID)); 
            }
        } catch (error) {
            console.error("リクエストエラー:", error);
            setLiked((prev) => !prev); 
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        } finally {
            setPendingRequest(false);
        }
    }, [liked, postID, userID]);

    const debounce = useCallback((func: () => void, delay: number) => {
        let timer: NodeJS.Timeout;
        return () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, delay);
        };
    }, []);

    const handleLike = debounce(() => {
        if (!userID) {
            alert("ログインしていません。");
            return;
        }

        if (!pendingRequest) {
            setLiked(!liked); 
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            setPendingRequest(true); 
            sendLikeRequest(); 
        }
    }, 500);

    return (
        <div className="like-button" onClick={handleLike} role="button" aria-disabled={pendingRequest}>
            <span className="like-icon">{liked ? "❤️" : "♡"}</span>
            <span className="like-count">{likeCount}</span>
        </div>
    );
};

export default LikeButton;
