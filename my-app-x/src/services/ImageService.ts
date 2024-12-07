import api from "../api/axiosInstance";

/**
 * バックエンドAPIに画像の更新を通知
 * @param userId - ユーザーID
 * @param type - 画像のタイプ ("icon" | "header")
 * @param url - Firebaseから取得した画像のURL
 */
export const updateUserImage = async (
    userId: number,
    type: "icon" | "header",
    url: string
): Promise<void> => {
    const response = await api.post("/users/update", {
        userId,
        [type === "icon" ? "profile_image" : "header_image"]: url,
    });
    if (response.status !== 200) {
        throw new Error("バックエンド更新エラー");
    }
};
