import React, { useState } from "react";
import imageCompression from "browser-image-compression";
interface ImageUploaderProps {
    currentImage: string;
    onImageUpload: (file: File) => void;
    type: "icon" | "header";
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload, type }) => {
    const [preview, setPreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setIsUploading(true);

            try {
                // 圧縮オプションを用途別に設定
                const options = {
                    maxSizeMB: type === "icon" ? 2 : 5, // プロフィール画像は最大2MB、その他は最大5MB
                    maxWidthOrHeight: type === "icon" ? 500 : 1920, // アイコンは最大500px、その他は1920px
                    useWebWorker: true, // Web Workerを使用してパフォーマンス向上
                };

                // 画像を圧縮
            const compressedBlob = await imageCompression(file, options);

            // Blob を File に変換
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            // 圧縮後のファイルをアップロード処理に渡す
            await onImageUpload(compressedFile);
            } catch (error) {
                alert("画像圧縮に失敗しました。もう一度お試しください。");
                console.error("画像圧縮エラー:", error);
                setPreview(currentImage); // エラー時は元の画像を保持
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className={`image-uploader ${type}`}>
            <label className="image-label">
                <img src={preview} alt={type} className={`${type}-image`} />
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
