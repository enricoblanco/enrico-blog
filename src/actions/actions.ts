'use server'

import prisma from '@/libs/prismadb'

export const addPost = async (title: string, content: string) => {
  await prisma.post.create({
    data: {
      title,
      content
    }
  })
}
