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
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/posts/${slug}`;
  const imageUrl = post.coverImage || `${siteUrl}/og-default.png`;

  return {
    title: post.title,
    description: post.excerpt || 'Read this post on Enrico Cidade Blanco\'s blog',
    authors: [{ name: 'Enrico Cidade Blanco' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Read this post on Enrico Cidade Blanco\'s blog',
      url: postUrl,
      siteName: 'Enrico Cidade Blanco',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || 'Read this post on Enrico Cidade Blanco\'s blog',
      images: [imageUrl],
      creator: '@enricocity',
    },
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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-sm hover:opacity-70">
            ← Back
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 pb-12 grow">
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

      <footer className="py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm hover:opacity-70">
              ← Back
            </Link>
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
