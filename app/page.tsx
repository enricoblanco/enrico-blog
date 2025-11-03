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
    <div className="min-h-screen bg-white flex flex-col">
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

      <main className="max-w-4xl mx-auto px-4 pb-12 grow">
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

      <footer className="py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              © 2025 Enrico Cidade Blanco
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/enricocity"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/enrico-blanco-760517231/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
