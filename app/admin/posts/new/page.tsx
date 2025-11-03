'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import MediaUpload from '@/components/MediaUpload';
import Link from 'next/link';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  position: number;
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [published, setPublished] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);

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
      setCoverImage(data.url);
    } catch (err) {
      setError('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || null,
          coverImage: coverImage || null,
          published,
          media: media.length > 0 ? media : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const post = await response.json();
      router.push(`/admin/posts/${post.id}/edit`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/admin" className="text-lg font-bold hover:opacity-70">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold uppercase mt-4">Create New Post</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border border-black p-4 bg-red-50">
              <p className="font-bold text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-bold mb-2 uppercase">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-black focus:outline-none bg-white text-xl font-bold"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold mb-2 uppercase">
              Excerpt (Optional)
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-black focus:outline-none bg-white resize-none"
              placeholder="Brief summary for the blog listing..."
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-bold mb-2 uppercase">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="w-full px-4 py-3 border border-black focus:outline-none bg-white"
              disabled={saving || uploadingCover}
            />
            {uploadingCover && (
              <p className="text-sm mt-2">Uploading cover image...</p>
            )}
            {coverImage && !uploadingCover && (
              <div className="mt-3 border border-black p-2">
                <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="mt-2 text-sm hover:opacity-70"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase">
              Content *
            </label>
            <PostEditor content={content} onChange={setContent} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase">
              Additional Media
            </label>
            <MediaUpload media={media} onMediaChange={setMedia} />
          </div>

          <div className="flex items-center gap-3 border border-black p-4">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 border border-black"
              disabled={saving}
            />
            <label htmlFor="published" className="font-bold uppercase">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving || !title || !content}
              className="px-6 py-3 bg-black text-white font-bold uppercase hover:bg-white hover:text-black border border-black transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : published ? 'Publish Post' : 'Save Draft'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 border border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
