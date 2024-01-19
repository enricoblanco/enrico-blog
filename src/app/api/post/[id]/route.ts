import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = await req.url.toString()
    const id = url.split('/')[5]
    const newPost = await prisma.post.findUnique({
      where: {
        id
      }
    })
    return NextResponse.json(newPost)
  } catch (e) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
