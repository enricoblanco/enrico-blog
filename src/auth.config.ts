import bcrypt from 'bcryptjs'

import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from './schemas'
import { getUserByEmail } from './data/user'

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validadetFields = LoginSchema.safeParse(credentials)

        if (validadetFields.success) {
          const { email, password } = validadetFields.data

          const user = await getUserByEmail(email)

          if (!user || !user.password) {
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (passwordMatch) {
            return user
          }
        }
        return null
      }
    })
  ]
} satisfies NextAuthConfig
