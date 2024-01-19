'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { RegisterSchema } from '@/schemas'
import prisma from '@/lib/prismadb'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      errors: 'Invalid fields'
    }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return {
      errors: 'Email already taken'
    }
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })

  //TODO send email

  return {
    success: 'User created'
  }
}
