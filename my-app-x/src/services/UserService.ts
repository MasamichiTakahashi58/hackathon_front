import api from "../api/axiosInstance";

export const getUserById = async (userID: string | number) => {
    const response = await api.get(`/users/get`, { params: { id: userID } });
    return response.data;
};

export const updateUser = async (userID: string | number, updates: any) => {
    const response = await api.put(`/users/update`, { id: userID, ...updates });
    return response.data;
};

export const deleteUser = async (userID: string | number) => {
    const response = await api.delete(`/users/delete`, { params: { id: userID } });
    return response.data;
};
