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
  const { id } = useParams()

  useEffect(() => {
    console.log(id)
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

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="flex flex-col gap-8">
          <div className="text-[25px] flex justify-center font-bold">
            {post?.title ?? <TextSkeleton width={210} count={1} />}
          </div>
          <div className="text-justify">
            {post?.content ?? <TextSkeleton />}
          </div>
        </div>
      </div>
    </div>
  )
}
