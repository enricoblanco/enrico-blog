'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const [data, setData] = useState({
    username: '',
    password: ''
  })

  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    signIn('credentials', {
      ...data,
      redirect: false
    })
    router.push('/about')
  }

  return (
    <div className="w-full flex justify-center mt-20">
      <form className="flex flex-col gap-4 max-w-md border-2 border-blue-400 rounded-md p-6">
        <input
          onChange={e => setData({ ...data, username: e.target.value })}
          type="text"
          placeholder="username"
          className="outline-none"
        />
        <input
          onChange={e => setData({ ...data, password: e.target.value })}
          type="password"
          placeholder="password"
          className="outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-400 text-white rounded-lg"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  )
}
