import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadToFirebase } from "../../services/FirebaseService";

interface ImageUploaderProps {
    currentImage: string;
    onUploadSuccess: (url: string) => void; 
    type: "icon" | "header" | "post_image"; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onUploadSuccess, type }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // 圧縮設定をtypeごとに変更
            const options = {
                maxSizeMB: type === "icon" ? 2 : type === "header" ? 5 : 3,
                maxWidthOrHeight: type === "icon" ? 500 : type === "header" ? 1920 : 1080,
                useWebWorker: true,
            };
            const compressedBlob = await imageCompression(file, options);
            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            });

            const downloadURL = await uploadToFirebase(compressedFile, type);

            onUploadSuccess(downloadURL);
        } catch (error) {
            alert("画像アップロードに失敗しました。");
            console.error("アップロードエラー:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click(); // ボタンから非表示のinputをクリック
    };

    return (
        <div className={`image-uploader ${type}`}>
            {type === "post_image" && (
                <>
                    {/* 非表示のinputタグ */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef} // refを設定
                        style={{ display: "none" }} // 非表示にする
                        disabled={isUploading}
                    />
                    {/* 別ボタンからクリックをトリガー */}
                    <button
                        className="post-image-upload-circle"
                        onClick={handleButtonClick}
                        disabled={isUploading}
                    >
                        {!isUploading ? "画像+" : "アップロード中..."}
                    </button>
                </>
            )}

            {type !== "post_image" && (
                <>
            <div className={`image-uploader ${type}`}>
            <div className={`${type}-image-container`}>
                {/* 現在の画像を表示 */}
                {currentImage && (
                    <img
                        src={currentImage}
                        alt={`${type} preview`}
                        className={`${type}-image`}
                    />
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                disabled={isUploading}
            />
            <button
                className={`${type}-image-upload-button`}
                onClick={handleButtonClick}
                disabled={isUploading}
            >
                {isUploading ? "アップロード中..." : "画像を選択"}
            </button>
        </div>
            </>
            )}
        </div>
    );
};

export default ImageUploader;
