import React from "react";
import "./RightSidebar.css";
import Gemini from '../Gemini/Gemini';

const RightSidebar: React.FC = () => {
    return (
        <div className="right-sidebar">
            <div className="recommended">
                <h3>おすすめユーザー</h3>
                <ul>
                    <li>@nemui</li>
                    <li>@ramen_tabetai</li>
                    <li>@baba_boom</li>
                </ul>
            </div>
            <div className="trending">
                <h3>いま話題のトレンド</h3>
                <ul>
                    <li>#12月</li>
                    <li>#2024</li>
                    <li>#クリスマス</li>
                </ul>
            </div>
            <Gemini />
        </div>
    );
};


export default RightSidebar;
