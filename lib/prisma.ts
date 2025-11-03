import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Mock Prisma for development without database
const USE_MOCK_DB = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost');

type MockPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  media?: unknown[];
};

type FindManyArgs = {
  where?: {
    published?: boolean;
    [key: string]: unknown;
  };
  orderBy?: Record<string, string>;
  select?: Record<string, boolean>;
};

type FindUniqueArgs = {
  where?: {
    id?: string;
    slug?: string;
  };
  select?: Record<string, boolean>;
};

type FindFirstArgs = {
  where?: {
    id?: string;
    slug?: string;
    OR?: Array<{ id?: string; slug?: string }>;
  };
};

type CreateArgs = {
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published?: boolean;
  };
};

type UpdateArgs = {
  where: {
    id: string;
  };
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published?: boolean;
    publishedAt?: Date | null;
  };
};

type DeleteArgs = {
  where: {
    id: string;
  };
};

type DeleteManyArgs = {
  where: {
    postId: string;
  };
};

const mockPosts = [
  {
    id: 'mock-1',
    title: 'Welcome to Enrico Cidade Blanco\'s Blog',
    slug: 'welcome',
    content: '<p>This is my first blog post. I\'m excited to share my thoughts and ideas with you.</p><p>This blog features a classical typewriter aesthetic with the Courier Prime font. Clean, simple, and focused on the content.</p><h2>Why I Started This Blog</h2><p>I wanted a place to share my experiences, learnings, and reflections. Writing helps me think more clearly and connect with others who share similar interests.</p><blockquote>Writing is thinking. To write well is to think clearly. That\'s why it\'s so hard.</blockquote><p>I hope you enjoy reading!</p>',
    excerpt: 'Welcome to my blog! Here I share my thoughts, ideas, and experiences.',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
    published: true,
    publishedAt: new Date('2025-01-15'),
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'mock-2',
    title: 'The Art of Minimalism',
    slug: 'the-art-of-minimalism',
    content: '<h2>Less is More</h2><p>In a world full of distractions, minimalism offers a path to clarity and focus.</p><p>The principles of minimalism can be applied to:</p><ul><li>Design and aesthetics</li><li>Daily routines and habits</li><li>Digital life and technology</li><li>Physical possessions</li></ul><p>By removing the unnecessary, we make room for what truly matters.</p><h3>Starting Your Minimalist Journey</h3><p>Begin small. Choose one area of your life to simplify. Notice how it feels. Then expand from there.</p>',
    excerpt: 'Exploring the principles of minimalism and how they can improve our lives.',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=600&fit=crop',
    published: true,
    publishedAt: new Date('2025-01-20'),
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
  {
    id: 'mock-3',
    title: 'Coffee and Contemplation',
    slug: 'coffee-and-contemplation',
    content: '<p>There\'s something special about the morning ritual of brewing coffee. The smell, the warmth, the quiet moment before the day begins.</p><h2>The Perfect Cup</h2><p>For me, coffee isn\'t just about caffeine. It\'s about the ritual:</p><ol><li>Grinding the beans fresh</li><li>Boiling water to the right temperature</li><li>Waiting as it brews</li><li>That first sip</li></ol><p>These small moments of mindfulness set the tone for the entire day.</p><blockquote>Coffee is a language in itself.</blockquote><p>What\'s your morning ritual?</p>',
    excerpt: 'Reflecting on the simple pleasure of a morning cup of coffee.',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
    published: true,
    publishedAt: new Date('2025-01-25'),
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25'),
  },
];

const mockPrisma = {
  post: {
    findMany: async (args?: FindManyArgs): Promise<MockPost[]> => {
      // Filter by published if specified
      if (args?.where?.published === true) {
        return mockPosts.filter(p => p.published);
      }
      return mockPosts;
    },
    findUnique: async (args: FindUniqueArgs): Promise<MockPost | null> => {
      const post = mockPosts.find(p =>
        p.id === args.where?.id || p.slug === args.where?.slug
      );
      return post ? { ...post, media: [] } : null;
    },
    findFirst: async (args: FindFirstArgs): Promise<MockPost | null> => {
      if (args?.where?.OR) {
        const post = mockPosts.find(p =>
          p.id === args.where?.OR?.[0]?.id || p.slug === args.where?.OR?.[1]?.slug
        );
        return post ? { ...post, media: [] } : null;
      }
      const post = mockPosts.find(p =>
        p.slug === args?.where?.slug
      );
      return post ? { ...post, media: [] } : null;
    },
    create: async (args: CreateArgs): Promise<MockPost> => {
      const post: MockPost = {
        id: `mock-${Date.now()}`,
        title: args.data.title,
        slug: args.data.slug,
        content: args.data.content,
        excerpt: args.data.excerpt || null,
        coverImage: args.data.coverImage || null,
        published: args.data.published || false,
        publishedAt: args.data.published ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [],
      };
      console.log('Mock: Created post', post.title);
      return post;
    },
    update: async (args: UpdateArgs): Promise<MockPost> => {
      const post: MockPost = {
        id: args.where.id,
        title: args.data.title || 'Mock Post',
        slug: args.data.slug || 'mock-post',
        content: args.data.content || '',
        excerpt: args.data.excerpt || null,
        coverImage: args.data.coverImage || null,
        published: args.data.published ?? false,
        publishedAt: args.data.publishedAt || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        media: [],
      };
      console.log('Mock: Updated post', post.title);
      return post;
    },
    delete: async (args: DeleteArgs): Promise<{ id: string }> => {
      console.log('Mock: Deleted post', args.where.id);
      return { id: args.where.id };
    },
  },
  media: {
    deleteMany: async (args: DeleteManyArgs): Promise<{ count: number }> => {
      console.log('Mock: Deleted media for post', args.where.postId);
      return { count: 0 };
    },
  },
};

export const prisma = USE_MOCK_DB
  ? mockPrisma
  : (globalForPrisma.prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== 'production' && !USE_MOCK_DB) {
  globalForPrisma.prisma = prisma as PrismaClient;
}
