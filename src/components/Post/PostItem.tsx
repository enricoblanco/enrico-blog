'use client'

import React, { useEffect, useState } from 'react'
import formatDate from '@/functions/formatDate'
import Link from 'next/link'
import { TextSkeleton } from './TextSkeleton'
import { getAllPosts } from '@/actions/posts'
import { Post } from '@prisma/client'

export const PostItem = () => {
  const [loading, setLoading] = useState(true)
  const [postsArray, setPostsArray] = useState<Post[] | null>([])

  const fetchPosts = async () => {
    setLoading(true)

    const result = await getAllPosts()

    setPostsArray(result)

    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="text-lg">
      {loading ? (
        <TextSkeleton width={210} />
      ) : (
        postsArray?.map(post => (
          <div className="flex flex-row gap-8" key={post.id}>
            <div className="w-fit">{formatDate(post.createdAt)}</div>
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-400 hover:text-gray-600 transition-all"
            >
              {post.title}
            </Link>
          </div>
        ))
      )}
    </div>
  )
}
