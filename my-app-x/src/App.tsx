import React from "react";
import "./App.css"; 
import PostsComponent from "./components/Posts/PostsComponent"; // 作成したPostsComponentをインポート

const App: React.FC = () => {
  return (
    <div className="App">
      <PostsComponent />
    </div>
  );
};

export default App;

