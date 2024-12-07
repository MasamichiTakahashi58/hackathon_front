import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadToFirebase = async (
    file: File,
    type: "icon" | "header" | "post_image" 
): Promise<string> => {
    try {
        const storage = getStorage(); 
        if (!file) throw new Error("ファイルが無効です。");
        if (!type) throw new Error("タイプが無効です。");

        const filePath = `${type}/${file.name}-${Date.now()}`; 
        const storageRef = ref(storage, filePath);

        // Firebase Storageにアップロード
        const snapshot = await uploadBytes(storageRef, file);

        // ダウンロードURLを取得して返す
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Firebaseアップロードエラー:", error);
        throw new Error("Firebaseアップロードに失敗しました。");
    }
};
