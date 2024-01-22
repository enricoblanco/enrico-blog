'use client'

import { NextResponse } from 'next/server'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

import { TextSkeleton } from './TextSkeleton'

interface PostInterface {
  id: string
  title: string
  content: string
  image: string
  createdAt: string
}

export const Post = () => {
  const params = useParams()

  const id = params?.id

  useEffect(() => {
    const postReq = async () => {
      try {
        const response = await axios.get(`/api/post/${id}`)
        setPost(response.data)
      } catch (error) {
        NextResponse.error()
      }
    }
    postReq()
  }, [id])

  const [post, setPost] = useState<PostInterface>()

  const isMobile = window.innerWidth < 768

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="text-[25px] font-bold">
        {post?.title ?? <TextSkeleton width={210} count={1} />}
      </div>
      <div className="text-justify flex justify-center flex-col mx-10 md:mx-36 text-sm md:text-lg">
        {post?.content ?? <TextSkeleton width={isMobile ? 230 : 500} />}
      </div>
    </div>
  )
}
