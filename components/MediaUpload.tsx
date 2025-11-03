'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  position: number;
}

interface MediaUploadProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
}

export default function MediaUpload({ media, onMediaChange }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();

      const newMedia: MediaItem = {
        url: data.url,
        type: data.type,
        position: media.length,
      };

      onMediaChange([...media, newMedia]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    // Reorder positions
    const reorderedMedia = newMedia.map((item, i) => ({ ...item, position: i }));
    onMediaChange(reorderedMedia);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newMedia = [...media];
    [newMedia[index - 1], newMedia[index]] = [newMedia[index], newMedia[index - 1]];
    // Update positions
    const reorderedMedia = newMedia.map((item, i) => ({ ...item, position: i }));
    onMediaChange(reorderedMedia);
  };

  const handleMoveDown = (index: number) => {
    if (index === media.length - 1) return;
    const newMedia = [...media];
    [newMedia[index], newMedia[index + 1]] = [newMedia[index + 1], newMedia[index]];
    // Update positions
    const reorderedMedia = newMedia.map((item, i) => ({ ...item, position: i }));
    onMediaChange(reorderedMedia);
  };

  const handleAltChange = (index: number, alt: string) => {
    const newMedia = [...media];
    newMedia[index] = { ...newMedia[index], alt };
    onMediaChange(newMedia);
  };

  return (
    <div className="space-y-4">
      <div className="border-4 border-black p-4">
        <label className="block mb-2 font-bold uppercase">Upload Media</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border-2 border-black focus:outline-none bg-white"
        />
        {uploading && (
          <p className="mt-2 text-sm">Uploading...</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600 border-2 border-black p-2 bg-white">
            {error}
          </p>
        )}
      </div>

      {media.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold uppercase">Media Items ({media.length})</h3>
          {media.map((item, index) => (
            <div key={index} className="border-4 border-black p-4 bg-white">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-48 h-32 border-2 border-black">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.alt || ''}
                      width={192}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs font-bold mb-1">ALT TEXT</label>
                    <input
                      type="text"
                      value={item.alt || ''}
                      onChange={(e) => handleAltChange(index, e.target.value)}
                      placeholder="Description for accessibility"
                      className="w-full px-3 py-2 border-2 border-black focus:outline-none bg-white text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="px-3 py-1 border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === media.length - 1}
                      className="px-3 py-1 border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="px-3 py-1 border-2 border-black bg-black text-white font-bold text-sm hover:bg-white hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
