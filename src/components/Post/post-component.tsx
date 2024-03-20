'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { TextSkeleton } from './text-skeleton'
import { Post } from '@prisma/client'
import { getPostById } from '@/actions/posts'

export const PostComponent = () => {
  const params = useParams()

  const id = params?.id as string
  const [post, setPost] = useState<Post | null>()

  const postReq = async () => {
    const result = await getPostById(id)

    setPost(result)
  }

  useEffect(() => {
    postReq()
  }, [])

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-[25px] font-bold">
        {post?.title ?? <TextSkeleton width={210} count={1} />}
      </div>
      <div className="text-justify flex justify-center flex-col mx-10 md:mx-36 text-sm md:text-lg">
        {post?.content ?? <TextSkeleton width={210} />}
      </div>
    </div>
  )
}
