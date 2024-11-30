import api from "../api/axiosInstance";

export const addLike = async (postID: number, userID: string | number) => {
    const response = await api.post(`/like/add`, { post_id: postID, user_id: userID });
    return response.data;
};

export const removeLike = async (postID: number, userID: string | number) => {
    const response = await api.delete(`/like/remove`, { params: { post_id: postID, user_id: userID } });
    return response.data;
};

export const countLikes = async (postID: number) => {
    const response = await api.get(`/like/count`, { params: { post_id: postID } });
    return response.data;
};
