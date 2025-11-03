import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || '',
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      media: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const postMedia = (post.media ?? []) as Array<{
    id: string;
    url: string;
    type: string;
    alt: string | null;
    position: number;
  }>;

  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-sm hover:opacity-70">
            ← Back
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {post.title}
          </h1>
          {formattedDate && (
            <p className="text-sm">{formattedDate}</p>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {postMedia.length > 0 && (
          <div className="mt-8 space-y-6">
            {postMedia.map((media) => (
              <div key={media.id}>
                {media.type === 'image' ? (
                  <Image
                    src={media.url}
                    alt={media.alt || ''}
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-auto"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}
      </article>

      <footer className="py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-sm hover:opacity-70">
            ← Back
          </Link>
        </div>
      </footer>
    </div>
  );
}
