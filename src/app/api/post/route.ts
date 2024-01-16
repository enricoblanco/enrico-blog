import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await prisma.post.findMany()

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json()
    const newPost = await prisma.post.create({
      data: {
        title,
        content
      }
    })
    return NextResponse.json(newPost)
  } catch (e) {
    return NextResponse.json({ error: 'Something went wrong' })
  }
}
