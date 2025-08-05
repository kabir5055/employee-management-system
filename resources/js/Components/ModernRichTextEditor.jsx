import React, { useRef, useEffect, useCallback } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = '', className = '', readOnly = false }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = useCallback(() => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const handleKeyDown = useCallback((e) => {
        // Handle tab for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    }, []);

    const formatText = useCallback((command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    }, [handleInput]);

    const insertList = useCallback((ordered = false) => {
        const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
        document.execCommand(command, false, null);
        editorRef.current?.focus();
        handleInput();
    }, [handleInput]);

    const applyHeading = useCallback((level) => {
        document.execCommand('formatBlock', false, `h${level}`);
        editorRef.current?.focus();
        handleInput();
    }, [handleInput]);

    if (readOnly) {
        return (
            <div
                className={`rich-text-editor-readonly prose prose-sm max-w-none ${className}`}
                dangerouslySetInnerHTML={{ __html: value || '' }}
            />
        );
    }

    return (
        <div className={`rich-text-editor border border-gray-300 rounded-md ${className}`}>
            {/* Toolbar */}
            <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => formatText('bold')}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 font-bold"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => formatText('italic')}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 italic"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => formatText('underline')}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 underline"
                    title="Underline"
                >
                    U
                </button>

                <div className="border-l border-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => insertList(false)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
                    title="Bullet List"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => insertList(true)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
                    title="Numbered List"
                >
                    1. List
                </button>

                <div className="border-l border-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => applyHeading(1)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 font-bold"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => applyHeading(2)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 font-semibold"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => applyHeading(3)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200 font-medium"
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => formatText('formatBlock', 'p')}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
                    title="Normal Text"
                >
                    P
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="p-3 min-h-[120px] focus:outline-none prose prose-sm max-w-none"
                style={{
                    minHeight: '120px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}
                data-placeholder={placeholder}
                suppressContentEditableWarning={true}
            />

            <style jsx>{`
                .rich-text-editor [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9CA3AF;
                    font-style: italic;
                    pointer-events: none;
                }

                .rich-text-editor [contenteditable] h1 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.5em 0;
                }

                .rich-text-editor [contenteditable] h2 {
                    font-size: 1.3em;
                    font-weight: 600;
                    margin: 0.4em 0;
                }

                .rich-text-editor [contenteditable] h3 {
                    font-size: 1.1em;
                    font-weight: 500;
                    margin: 0.3em 0;
                }

                .rich-text-editor [contenteditable] ul,
                .rich-text-editor [contenteditable] ol {
                    margin: 0.5em 0;
                    padding-left: 1.5em;
                }

                .rich-text-editor [contenteditable] li {
                    margin: 0.2em 0;
                }

                .rich-text-editor [contenteditable] p {
                    margin: 0.5em 0;
                }
            `}</style>
        </div>
    );
}
