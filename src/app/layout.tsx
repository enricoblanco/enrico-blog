import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  description: "Enrico Blanco's personal blog",
  title: "Enrico's Blog"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={cn('text-slate-700', inter.className)}>
          <div className="flex flex-col min-h-screen">
            <Toaster />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </SessionProvider>
  )
}
