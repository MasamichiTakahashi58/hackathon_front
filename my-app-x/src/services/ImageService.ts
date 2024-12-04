import api from "../api/axiosInstance";

export const uploadUserImage = async (
    userId: number,
    file: File,
    type: "icon" | "header"
): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    formData.append("userId", String(userId));

    const response = await api.post("/upload/user-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.filePath; // サーバーが返すファイルパス
};
