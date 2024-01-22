import React from 'react'
import { PostItem } from '@/components/Post'

export default function Posts() {
  return (
    <div>
      <div className="flex flex-col gap-3 ml-12">
        <div className="text-[25px] font-semibold">POSTS</div>
        <PostItem />
      </div>
    </div>
  )
}
