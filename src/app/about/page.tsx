'use client'

import React, { useEffect } from 'react'
import { About } from '../components/About'
import { useSession } from 'next-auth/react'

export default function Posts() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log(session, status)
  }, [session, status])
  return <About />
}
