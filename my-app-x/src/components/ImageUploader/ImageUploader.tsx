import React, { useState } from "react";

interface ImageUploaderProps {
    currentImage: string;
    onImageUpload: (file: File) => void;
    type: "icon" | "header"; // アイコン or ヘッダー
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload, type }) => {
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onImageUpload(file); // 親コンポーネントにファイルを渡す
        }
    };

    return (
        <div className={`image-uploader ${type}`}>
            <label className="image-label">
                <img src={preview} alt={type} className={`${type}-image`} />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="image-input"
                />
            </label>
        </div>
    );
};

export default ImageUploader;
