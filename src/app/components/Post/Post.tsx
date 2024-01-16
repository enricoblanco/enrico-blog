'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'

import { NextResponse } from 'next/server'
import React, { useEffect, useState } from 'react'

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
    <div className="flex flex-col justify-center w-full bg-red-500">
      <div className="text-[25px] font-bold">{post?.title}</div>
      <div>{post?.content}</div>
    </div>
  )
}
