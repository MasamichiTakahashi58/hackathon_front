import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadToFirebase = async (file: File, type: "icon" | "header"): Promise<string> => {
    try {
        const storage = getStorage(); // Firebase Storage インスタンス
        if (!file) throw new Error("ファイルが無効です。");
        if (!type) throw new Error("タイプが無効です。");

        const filePath = `${type}/${file.name}-${Date.now()}`;
        const storageRef = ref(storage, filePath);

        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref); // ダウンロードURLを返す
    } catch (error) {
        console.error("Firebaseアップロードエラー:", error);
        throw new Error("Firebaseアップロードに失敗しました。");
    }
};
