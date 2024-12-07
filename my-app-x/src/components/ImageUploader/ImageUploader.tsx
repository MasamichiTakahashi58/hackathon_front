import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadToFirebase } from "../../services/FirebaseService";

interface ImageUploaderProps {
    currentImage: string;
    onUploadSuccess: (url: string) => void; // 親に通知するURL
    type: "icon" | "header";
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onUploadSuccess, type }) => {
    const [preview, setPreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setIsUploading(true);

        try {
            const options = {
                maxSizeMB: type === "icon" ? 2 : 5,
                maxWidthOrHeight: type === "icon" ? 500 : 1920,
                useWebWorker: true,
            };
            const compressedBlob = await imageCompression(file, options);
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            // Firebaseで画像をアップロードしてURLを取得
            const downloadURL = await uploadToFirebase(compressedFile, type);

            // 親に通知
            onUploadSuccess(downloadURL);
        } catch (error) {
            alert("画像アップロードに失敗しました。");
            console.error("アップロードエラー:", error);
            setPreview(currentImage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`image-uploader ${type}`}>
            <label>
                <img src={preview} alt={`${type} preview`} className={`${type}-image`} />
                {isUploading && <p>アップロード中...</p>}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="image-input"
                    disabled={isUploading}
                />
            </label>
        </div>
    );
};

export default ImageUploader;
