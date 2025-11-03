'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import MediaUpload from '@/components/MediaUpload';
import Link from 'next/link';
import { use } from 'react';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  position: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  media: MediaItem[];
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setCoverImage(data.coverImage || '');
        setPublished(data.published);
        setMedia(data.media || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update post');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete post');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="border-4 border-black p-8">
          <p className="text-xl font-bold">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="border-4 border-black p-8">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/admin" className="underline hover:opacity-70">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/admin" className="text-lg font-bold hover:opacity-70">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold uppercase mt-4">Edit Post</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border-4 border-black p-4 bg-red-50">
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
              className="w-full px-4 py-3 border-4 border-black focus:outline-none bg-white text-xl font-bold"
              required
              disabled={saving || deleting}
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
              className="w-full px-4 py-3 border-4 border-black focus:outline-none bg-white resize-none"
              placeholder="Brief summary for the blog listing..."
              disabled={saving || deleting}
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-bold mb-2 uppercase">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black focus:outline-none bg-white"
              placeholder="https://..."
              disabled={saving || deleting}
            />
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

          <div className="flex items-center gap-3 border-4 border-black p-4">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 border-2 border-black"
              disabled={saving || deleting}
            />
            <label htmlFor="published" className="font-bold uppercase">
              Published
            </label>
          </div>

          <div className="flex gap-4 justify-between">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving || deleting || !title || !content}
                className="px-6 py-3 bg-black text-white font-bold uppercase hover:bg-white hover:text-black border-4 border-black transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin"
                className="px-6 py-3 border-4 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="px-6 py-3 border-4 border-black bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
