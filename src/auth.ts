import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import authConfig from '@/auth.config'
import prisma from '@/lib/prismadb'
import { getUserId } from './data/user'
import { UserRole } from '@prisma/client'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserId(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role

      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  ...authConfig
})
