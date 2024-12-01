import api from "../api/axiosInstance";

export const createReply = async (content: string, postID: number, userID: number, parentID?: number) => {
    const response = await api.post(`/reply/create`, { content, post_id: postID, user_id: userID, parent_id: parentID});
    return response.data;
};

export const getRepliesByPost = async (postID: number) => {
    const response = await api.get(`/reply/get`, { params: { post_id: postID } });
    return response.data;
};

export const deleteReply = async (replyID: number) => {
    const response = await api.delete(`/reply/delete`, { params: { reply_id: replyID } });
    return response.data;
};
