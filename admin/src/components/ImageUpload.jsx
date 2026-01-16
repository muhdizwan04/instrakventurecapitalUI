import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ImageUpload Component - Base64 Version
 * Converts images to base64 strings for storage in database (no storage bucket needed!)
 * 
 * @param {string} value - Current image (base64 string or URL)
 * @param {function} onChange - Callback with new base64 image string
 * @param {string} aspectRatio - CSS aspect ratio (default: '3/4')
 * @param {string} className - Additional CSS classes
 * @param {number} maxSizeMB - Max file size in MB (default: 2)
 * @param {number} maxWidth - Max width to resize to (default: 800px)
 */
const ImageUpload = ({
    value,
    onChange,
    aspectRatio = '3/4',
    className = '',
    maxSizeMB = 2,
    maxWidth = 800
}) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Resize and compress image, then convert to base64
    const processImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for resizing
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize if larger than maxWidth
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression (0.8 quality for JPEG)
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(base64);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image must be less than ${maxSizeMB}MB`);
            return;
        }

        setUploading(true);

        try {
            const base64 = await processImage(file);
            onChange(base64);
            toast.success('Image uploaded!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to process image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        toast.success('Image removed');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        handleUpload(file);
    };

    return (
        <div className={`relative ${className}`}>
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    w-full rounded-lg flex flex-col items-center justify-center 
                    border-2 border-dashed transition-all cursor-pointer overflow-hidden
                    ${dragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                    }
                    ${uploading ? 'pointer-events-none opacity-70' : ''}
                `}
                style={{ aspectRatio }}
            >
                {uploading ? (
                    <div className="text-center text-gray-400 p-4">
                        <Loader2 className="mx-auto mb-2 animate-spin" size={24} />
                        <span className="text-xs">Processing...</span>
                    </div>
                ) : value ? (
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-center text-gray-400 p-4">
                        <ImageIcon className="mx-auto mb-2" size={24} />
                        <span className="text-xs block">Click or drag to upload</span>
                        <span className="text-[10px] text-gray-300 mt-1 block">Max {maxSizeMB}MB • Auto-resized</span>
                    </div>
                )}
            </div>

            {/* Remove button */}
            {value && !uploading && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                    <X size={14} />
                </button>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default ImageUpload;
