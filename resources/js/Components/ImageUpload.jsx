import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ImageUpload({
    label = "Image",
    name = "image",
    value = null,
    onChange,
    error = null,
    accept = "image/*",
    maxSize = 5, // MB
    className = ""
}) {
    const [preview, setPreview] = useState(value);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    const handleFileSelect = (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            onChange(null, 'Please select a valid image file.');
            return;
        }

        // Validate file size (in MB)
        if (file.size > maxSize * 1024 * 1024) {
            onChange(null, `File size must be less than ${maxSize}MB.`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Call onChange with file
        onChange(file, null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="space-y-4">
                {/* Preview */}
                {preview && (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Upload Area */}
                {!preview && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={handleClick}
                        className={`
                            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                            ${isDragging
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }
                        `}
                    >
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Click to upload
                                </span>
                                {' '}or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to {maxSize}MB
                            </p>
                        </div>
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
