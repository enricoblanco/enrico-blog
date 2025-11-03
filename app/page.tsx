import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="py-8 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">
            Enrico Cidade Blanco
          </h1>
          <p className="text-sm">
            Software Engineer
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12">
        {posts.length === 0 ? (
          <div className="py-12">
            <p>No posts yet.</p>
          </div>
        ) : (
          <div>
            {posts.map((post: typeof posts[number]) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">
            © 2025 Enrico Cidade Blanco
          </p>
        </div>
      </footer>
    </div>
  );
}
