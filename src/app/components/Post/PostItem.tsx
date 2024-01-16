'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NextResponse } from 'next/server'
import formatDate from '@/functions/formatDate'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  image: string
  createdAt: string
}

export const PostItem = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const postsReq = async () => {
      try {
        const response = await axios.get('/api/post')
        setPosts(response.data)
      } catch (error) {
        NextResponse.error()
      }
    }

    postsReq()
  }, [])

  return (
    <div>
      <div>
        {posts.map(post => (
          <div className="flex flex-row gap-8" key={post.id}>
            <div className="w-fit">{formatDate(post.createdAt)}</div>
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-400 hover:text-gray-600 transition-all"
            >
              {post.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
