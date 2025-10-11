import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, Camera, RefreshCw, RotateCcw, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';

const ImageUpload = ({ onImageSelect, isAnalyzing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isCameraMode, setIsCameraMode] = useState(true);
    const [facingMode, setFacingMode] = useState("environment");
    const [cameraError, setCameraError] = useState(false);
    const inputRef = useRef(null);
    const webcamRef = useRef(null);

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
            setIsCameraMode(false);
            setCameraError(false);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = (e) => {
        if (e) e.stopPropagation();
        setPreview(null);
        onImageSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        setIsCameraMode(true);
        setCameraError(false);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreview(imageSrc);
        onImageSelect(imageSrc);
        setIsCameraMode(false);
    }, [webcamRef, onImageSelect]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    const handleUserMediaError = useCallback((err) => {
        console.error("Camera error:", err);
        setCameraError(true);
    }, []);

    return (
        <div className="w-full h-full relative bg-black">
            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleChange}
                disabled={isAnalyzing}
            />

            {/* Camera View */}
            {isCameraMode && !cameraError && (
                <div className="absolute inset-0 z-0">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode }}
                        onUserMediaError={handleUserMediaError}
                    />
                </div>
            )}

            {/* Camera Error / Permission Denied View */}
            {isCameraMode && cameraError && (
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-8 text-center bg-surface">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle size={40} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Camera Access Denied</h2>
                    <p className="text-gray-400 mb-8 max-w-xs">
                        We couldn't access your camera. Please allow camera permissions or upload an image instead.
                    </p>
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="bg-primary text-black px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Upload size={20} />
                        Upload Image
                    </button>
                </div>
            )}

            {/* Image Preview View */}
            {!isCameraMode && preview && (
                <div className="absolute inset-0 z-10 bg-black flex items-center justify-center">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                    />
                    {!isAnalyzing && (
                        <button
                            onClick={clearImage}
                            className="absolute top-20 right-4 bg-primary text-black p-2 rounded-full hover:bg-primary/80 transition-colors z-50 shadow-lg"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
            )}

            {/* Upload Placeholder (fallback) */}
            {!isCameraMode && !preview && !cameraError && (
                <div className="absolute inset-0 z-0 flex items-center justify-center text-gray-500">
                    <p>No image selected</p>
                </div>
            )}


            {/* Controls Overlay */}
            {!cameraError && (
                <div className="absolute bottom-0 left-0 right-0 z-20 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex flex-col items-center justify-end h-48">
                    <div className="pointer-events-auto flex items-center gap-6">
                        {/* Upload Button */}
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                            disabled={isAnalyzing}
                            title="Upload Image"
                        >
                            <Upload size={24} />
                        </button>

                        {/* Capture Button (Only in Camera Mode) */}
                        {isCameraMode && (
                            <button
                                onClick={capture}
                                className="p-1 rounded-full border-4 border-white/30"
                                disabled={isAnalyzing}
                            >
                                <div className="w-16 h-16 bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                            </button>
                        )}

                        {/* Retake/Clear Button (Only in Preview Mode) */}
                        {!isCameraMode && preview && !isAnalyzing && (
                            <button
                                onClick={clearImage}
                                className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                            >
                                <RefreshCw size={24} />
                            </button>
                        )}

                        {/* Switch Camera Button (Only in Camera Mode) */}
                        {isCameraMode && (
                            <button
                                onClick={toggleCamera}
                                className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                                disabled={isAnalyzing}
                                title="Switch Camera"
                            >
                                <RotateCcw size={24} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
