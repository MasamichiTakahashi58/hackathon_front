import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadToFirebase } from "../../services/FirebaseService";

interface ImageUploaderProps {
    currentImage: string;
    onUploadSuccess: (url: string) => void; 
    type: "icon" | "header" | "post_image"; 
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
            // 圧縮設定をtypeごとに変更
            const options = {
                maxSizeMB: type === "icon" ? 2 : type === "header" ? 5 : 3, // post_imageは3MB
                maxWidthOrHeight: type === "icon" ? 500 : type === "header" ? 1920 : 1080, // post_imageは1080px
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
    const handleRemovePreview = () => {
        setPreview(currentImage); // プレビューをリセット
        onUploadSuccess(""); // 親に削除通知
    };

    return (
        <div className={`image-uploader ${type}`}>
            {type === "post_image" && (
                <label className="post-image-upload-circle">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="image-input"
                        disabled={isUploading}
                    />
                    {!isUploading && <span>+</span>}
                </label>
            )}

            {preview && (
                <div className="image-preview-container">
                    <img src={preview} alt={`${type} preview`} className={`${type}-image`} />
                    {type === "post_image" && (
                        <button className="remove-image-button" onClick={handleRemovePreview}>
                            ✖
                        </button>
                    )}
                </div>
            )}

            {type !== "post_image" && (
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
            )}
        </div>
    );
};

export default ImageUploader;
