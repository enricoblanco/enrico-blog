import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

import prisma from '@/libs/prismadb'

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt'
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: {
          label: 'username',
          type: 'text',
          placeholder: 'jsmith@gmail.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Invalid username or password')
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user || !user?.password) {
          throw new Error('Invalid username or password')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid username or password')
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development',

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      //Passa o id do usuário para o token

      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }
      if (user) {
        return {
          ...token,
          id: user.id
        }
      }

      //update user in the database
      await prisma.user.update({
        where: { id: token.id as string },
        data: {
          username: token.username as string
        }
      })

      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          role: token.role
        }
      }
    }
  }
}

export default NextAuth(authOptions)
