import Link from 'next/link';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt: Date | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return (
    <article className="mb-4">
      <Link href={`/posts/${post.slug}`} className="flex items-baseline gap-4 no-underline hover:opacity-70">
        {formattedDate && (
          <time className="text-sm shrink-0 w-24">{formattedDate}</time>
        )}
        <h2 className="text-lg font-normal">{post.title}</h2>
      </Link>
    </article>
  );
}
