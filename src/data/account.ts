import prisma from '@/lib/prismadb'

export const getAccounByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId
      }
    })
    return account
  } catch (error) {
    return null
  }
}
