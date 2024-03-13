import { Session } from 'inspector'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center">
      {children}
    </div>
  )
}

export default ProtectedLayout
