'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useState } from 'react';

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 border border-black bg-white',
      },
    },
    immediatelyRender: false,
  });

  const handleAddImageFromUrl = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageUpload(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      editor.chain().focus().setImage({ src: data.url }).run();
      setShowImageUpload(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!editor) {
    return (
      <div className="border border-black bg-white p-4 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border border-black bg-white">
      <div className="border-b border-black p-2 flex flex-wrap gap-2 bg-white">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 border border-black font-bold text-sm transition-colors ${
            editor.isActive('bold') ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 border border-black italic text-sm transition-colors ${
            editor.isActive('italic') ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 border border-black font-bold text-sm transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 border border-black font-bold text-sm transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 border border-black font-bold text-sm transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 border border-black text-sm transition-colors ${
            editor.isActive('bulletList') ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 border border-black text-sm transition-colors ${
            editor.isActive('orderedList') ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 border border-black text-sm transition-colors ${
            editor.isActive('blockquote') ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 border border-black text-sm hover:bg-black hover:text-white transition-colors"
        >
          HR
        </button>
        <button
          type="button"
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="px-3 py-1 border border-black text-sm hover:bg-black hover:text-white transition-colors"
        >
          + Image
        </button>
      </div>

      {showImageUpload && (
        <div className="border-b border-black p-4 bg-white space-y-3">
          <div>
            <label className="block text-xs font-bold mb-2">UPLOAD IMAGE</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              disabled={uploading}
              className="w-full px-3 py-2 border border-black focus:outline-none bg-white text-sm"
            />
            {uploading && <p className="text-xs mt-1">Uploading...</p>}
          </div>
          <div>
            <label className="block text-xs font-bold mb-2">OR IMAGE URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-black focus:outline-none bg-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddImageFromUrl}
                disabled={!imageUrl}
                className="px-4 py-2 border border-black font-bold text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowImageUpload(false)}
            className="text-xs hover:opacity-70"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
