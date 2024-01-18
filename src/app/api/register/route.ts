import bcrypt from 'bcrypt'
import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Something went wrong' })
  }
}
