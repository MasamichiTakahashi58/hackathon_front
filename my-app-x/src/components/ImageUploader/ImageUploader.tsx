import React, { useState } from "react";

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
                await onImageUpload(file); // 親コンポーネントにファイルを渡す
            } catch (error) {
                alert("画像アップロードに失敗しました。もう一度お試しください。");
                setPreview(currentImage); // アップロード失敗時は元の画像を使用
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
