import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  // Verify admin role
  const hasAdminAccess = await isAdmin();

  if (!hasAdminAccess) {
    redirect('/login');
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const handleLogout = async () => {
    'use server';
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-4 border-black py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold uppercase mb-2">Admin Dashboard</h1>
            <Link href="/" className="text-sm hover:opacity-70">
              ← View Blog
            </Link>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 border-2 border-black font-bold uppercase hover:bg-black hover:text-white transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <Link
            href="/admin/posts/new"
            className="inline-block px-6 py-3 bg-black text-white font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition-colors"
          >
            + Create New Post
          </Link>
        </div>

        <div className="border-4 border-black">
          <div className="border-b-4 border-black p-4 bg-white">
            <h2 className="text-2xl font-bold uppercase">All Posts</h2>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="mb-4">No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {posts.map((post: typeof posts[number]) => (
                <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="hover:opacity-70"
                          target="_blank"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span className={`font-bold ${post.published ? 'text-green-700' : 'text-gray-500'}`}>
                          {post.published ? '● PUBLISHED' : '○ DRAFT'}
                        </span>
                        <span>
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-4 py-2 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
