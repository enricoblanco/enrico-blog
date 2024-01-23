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

export const getPostById = async (id: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id
      }
    })
    return post
  } catch (error) {
    return null
  }
}
