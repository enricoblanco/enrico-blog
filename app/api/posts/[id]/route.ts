import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single post by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.post.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        media: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT update post (protected endpoint)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, coverImage, published, media } = body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug conflicts with another post
      const slugConflict = await prisma.post.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A post with this title already exists' },
          { status: 400 }
        );
      }
    }

    // Delete existing media if provided
    if (media) {
      await prisma.media.deleteMany({
        where: { postId: id },
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        slug,
        content: content !== undefined ? content : existingPost.content,
        excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        published: published !== undefined ? published : existingPost.published,
        publishedAt:
          published && !existingPost.published
            ? new Date()
            : published === false
            ? null
            : existingPost.publishedAt,
        media: media
          ? {
              create: media.map((m: { url: string; type: string; alt?: string; position: number }) => ({
                url: m.url,
                type: m.type,
                alt: m.alt,
                position: m.position,
              })),
            }
          : undefined,
      },
      include: {
        media: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post (protected endpoint)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
