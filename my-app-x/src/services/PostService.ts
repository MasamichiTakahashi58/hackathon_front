import api from '../api/axiosInstance';

export const getPosts = async () => {
    try {
        const response = await api.get("/post/get");
        console.log("Fetched posts:", response.data); // デバッグ用にレスポンスを表示
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error); // エラー詳細を確認
        return [];
    }
};


export const createPost = async (
    content: string,
    userID: number,
    imageUrl: string = "" // オプション引数として追加
) => {
    const response = await api.post('/post/create', {
        content,
        user_id: userID,
        image_url: imageUrl, // 画像URLを含める
    });
    return response.data;
};
