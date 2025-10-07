import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, isAnalyzing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Please select a valid image file (PNG, JPEG, JPG, or WebP)");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            onImageSelect(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? "border-primary bg-primary/10" : "border-gray-700 hover:border-gray-500 bg-surface"}
          ${preview ? "border-primary" : ""}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleChange}
                    disabled={isAnalyzing}
                />

                {preview ? (
                    <div className="relative h-64 flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-full max-w-full rounded object-contain"
                        />
                        {!isAnalyzing && (
                            <button
                                onClick={clearImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Upload size={48} className="mb-4 text-primary" />
                        <h3 className="text-lg font-medium text-white mb-2">Upload Your Image</h3>
                        <p className="text-sm mb-4">Drag & drop or click to select</p>
                        <span className="text-xs text-gray-500">Supports: PNG, JPEG, JPG, WebP</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
