import React, { useState, useEffect, useCallback } from "react";
import { addLike, removeLike, countLikes, hasUserLiked } from "../../services/LikeService"; // hasUserLiked をインポート
import { useAuth } from "../Auth/AuthContext";

const LikeButton: React.FC<{ postID: number }> = ({ postID }) => {
    const { userID } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(false); // リクエスト中かどうか

    useEffect(() => {
        const initializeLikes = async () => {
            if (!userID) return;

            try {
                const count = await countLikes(postID); // いいね数を取得
                const hasLiked = await hasUserLiked(postID, userID); // ユーザーがいいねしたかを取得
                setLikeCount(count);
                setLiked(hasLiked);
            } catch (error) {
                console.error("いいね情報の初期化に失敗しました:", error);
            }
        };

        initializeLikes();
    }, [postID, userID]);

    // 実際にバックエンドにリクエストを送信する関数
    const sendLikeRequest = useCallback(async () => {
        try {
            console.log(
                liked ? "Removing like:" : "Adding like:",
                { postID, userID } // ここでリクエスト内容を確認
            );
            if (liked) {
                await removeLike(postID, Number(userID)); // いいねを削除
            } else {
                await addLike(postID, Number(userID)); // いいねを追加
            }
        } catch (error) {
            console.error("リクエストエラー:", error);
            // エラー時に状態を元に戻す
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        } finally {
            setPendingRequest(false); // リクエスト終了
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
            setLiked(!liked); // フロントエンドの状態を即時変更
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            setPendingRequest(true); // リクエスト中にする
            sendLikeRequest(); // デバウンスでリクエストを送る
        }
    }, 500); // デバウンス間隔を500msに設定

    return (
        <button onClick={handleLike} disabled={pendingRequest}>
            {liked ? "❤️" : "♡"} {likeCount}
        </button>
    );
};

export default LikeButton;
