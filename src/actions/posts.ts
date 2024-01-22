'use server'

import { z } from 'zod'

import prisma from '@/lib/prismadb'
import { CreatePostSchema } from '@/schemas'

export const createPost = async (values: z.infer<typeof CreatePostSchema>) => {
  const validatedFields = CreatePostSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      errors: 'Invalid fields'
    }
  }

  const { title, content } = validatedFields.data

  await prisma.post.create({
    data: {
      title,
      content
    }
  })

  return {
    success: 'Post created'
  }
}

export const getAllPosts = async () => {
  'use server'

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return posts
  } catch (error) {
    return null
  }
}
