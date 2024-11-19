import api from '../api/axiosInstance';

export const getPosts = async () => {
    const response = await api.get('/post/get');
    return response.data;
    };

export const createPost = async (content: string, userID: number) => {
    const response = await api.post('/post/create', { content, user_id: userID });
    return response.data;
};
