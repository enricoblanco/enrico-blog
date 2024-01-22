import prisma from '@/lib/prismadb'

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
