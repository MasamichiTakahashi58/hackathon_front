import React, { useState } from 'react';
import './Gemini.css';

const Gemini = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Error generating content');
        const data = await res.json();
        setResponse(data.Candidates[0].Content.Parts[0]); // Geminiの応答を取得
        } catch (error) {
        console.error(error);
        setResponse('エラーが発生しました。もう一度試してください。');
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
            </div>
        )}
        </div>
    );
};

export default Gemini;
