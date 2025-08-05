import React from 'react';

export default function RichTextEditor({ value, onChange, placeholder = '', className = '' }) {
    return (
        <div className={`rich-text-editor ${className}`}>
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                rows="4"
                style={{
                    minHeight: '120px',
                    resize: 'vertical'
                }}
            />
            <div className="text-xs text-gray-500 mt-1">
                Rich text editor temporarily using textarea. Full editor will be restored shortly.
            </div>
        </div>
    );
}
