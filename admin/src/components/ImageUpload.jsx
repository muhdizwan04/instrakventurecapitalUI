import React, { useState, useRef } from 'react';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const BUCKET = 'site-assets';

const isNetworkError = (err) => {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = (err.code || '').toLowerCase();
    return (
        msg.includes('network') || msg.includes('connection') || msg.includes('load failed') ||
        msg.includes('failed to fetch') || msg.includes('timeout') || msg.includes('aborted') ||
        code === 'network_error' || code === 'fetch_error'
    );
};

const warmUpStorage = async () => {
    try {
        await supabase.storage.from(BUCKET).list('', { limit: 1 });
    } catch (_) { /* ignore */ }
};

const retryUpload = async (uploadFn, { maxRetries = 4, baseDelay = 800 } = {}) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await uploadFn();
        } catch (err) {
            if (attempt === maxRetries || !isNetworkError(err)) throw err;
            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`[ImageUpload] Retry ${attempt + 1}/${maxRetries} in ${delay}ms`);
            toast.loading(`Connection issue — retrying upload (${attempt + 1}/${maxRetries})...`, { id: 'image-upload-retry' });
            await new Promise(r => setTimeout(r, delay));
            if (attempt >= 1) await warmUpStorage();
        }
    }
};

/**
 * ImageUpload Component — Supabase Storage Version
 * Uploads images to Supabase Storage and returns a public URL.
 * Falls back to base64 only if Storage upload fails.
 *
 * @param {string} value - Current image (URL or legacy base64 string)
 * @param {function} onChange - Callback with new image URL
 * @param {string} aspectRatio - CSS aspect ratio (default: '3/4')
 * @param {string} className - Additional CSS classes
 * @param {number} maxSizeMB - Max file size in MB (default: 2)
 * @param {number} maxWidth - Max width to resize to (default: 1600px)
 * @param {string} folder - Storage subfolder (default: 'images')
 */
const ImageUpload = ({
    value,
    onChange,
    aspectRatio = '3/4',
    className = '',
    maxSizeMB = 2,
    maxWidth = 1600,
    folder = 'images',
    previewFit = 'cover' // 'cover' | 'contain' — use 'contain' for person photos so face isn't cropped
}) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
                        'image/webp',
                        0.82
                    );
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

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image must be less than ${maxSizeMB}MB`);
            return;
        }

        setUploading(true);

        try {
            await warmUpStorage();

            const blob = await resizeImage(file);
            const ext = 'webp';
            const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

            const result = await retryUpload(async () => {
                const { data, error } = await supabase.storage
                    .from(BUCKET)
                    .upload(filename, blob, {
                        contentType: 'image/webp',
                        cacheControl: '31536000',
                        upsert: false
                    });
                if (error) throw error;
                return data;
            }, { maxRetries: 4, baseDelay: 800 });

            toast.dismiss('image-upload-retry');
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(result.path);
            onChange(urlData.publicUrl);
            toast.success('Image uploaded!');
        } catch (error) {
            toast.dismiss('image-upload-retry');
            console.error('Storage upload error:', error);
            if (isNetworkError(error)) {
                toast.error('Upload failed after retries. Check your connection and try again.');
            } else {
                toast.error('Failed to upload image: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        // If the value is a Supabase Storage URL, try to delete the file
        if (value && value.includes(`/storage/v1/object/public/${BUCKET}/`)) {
            try {
                const path = value.split(`/storage/v1/object/public/${BUCKET}/`)[1];
                if (path) {
                    await supabase.storage.from(BUCKET).remove([path]);
                }
            } catch (e) {
                // Non-critical — old file stays in storage but that's fine
            }
        }
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
                        <span className="text-xs">Uploading...</span>
                    </div>
                ) : value ? (
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full"
                        style={{ objectFit: previewFit }}
                    />
                ) : (
                    <div className="text-center text-gray-400 p-4">
                        <ImageIcon className="mx-auto mb-2" size={24} />
                        <span className="text-xs block">Click or drag to upload</span>
                        <span className="text-[10px] text-gray-300 mt-1 block">Max {maxSizeMB}MB • Auto-optimized</span>
                    </div>
                )}
            </div>

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
