import React, { useState } from 'react';
import api from "../../api/axiosInstance";
import { createPost } from "../../services/PostService"; // postServiceをインポート
import { useAuth } from "../Auth/AuthContext"; // AuthContextをインポート
import './Gemini.css';

const Gemini = () => {
    const { userID } = useAuth(); // useAuthからuserIDを取得
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setResponse('プロンプトを入力してください。');
            return;
        }

        try {
            const res = await api.post('/api/generate', { prompt });
            setResponse(res.data.Candidates[0].Content.Parts[0]); // Geminiの応答を取得
        } catch (error) {
            console.error('エラー:', error);
            setResponse('エラーが発生しました。もう一度試してください。');
        }
    };

    const handlePostResponse = async () => {
        if (!response) {
            alert("Geminiの回答がありません。");
            return;
        }

        if (userID === null) {
            alert("ユーザーIDが取得できません。ログインしてください。");
            return;
        }

        try {
            const postData = await createPost(response, userID); // createPostを呼び出す
            alert("Geminiの回答をポストしました！");
            console.log("ポスト内容:", postData);
        } catch (error) {
            console.error("ポストに失敗しました:", error);
            alert("ポストに失敗しました。もう一度試してください。");
        }
    };

    return (
        <div className="gemini-container">
            <h3>Gemini AI</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="提案や質問を入力してください..."
                    rows={3}
                    className="gemini-textarea"
                />
                <button type="submit" className="gemini-button">送信</button>
            </form>
            {response && (
                <div className="gemini-response">
                    <h4>Geminiの回答:</h4>
                    <p>{response}</p>
                    <button onClick={handlePostResponse} className="post-button">
                        この回答をポストする
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gemini;
