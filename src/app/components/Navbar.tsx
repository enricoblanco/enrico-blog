import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <div className="flex-col flex justify-center">
      <div className="pt-[180px] pb-[60px] px-44">
        <Link href={'/'} className="text-[28px] font-bold">
          KINDA FUNNYY
        </Link>
        <nav>
          <ul className="flex flex-row gap-3 text-lg">
            <li>
              <Link
                className="hover:text-gray-500 transition-all"
                href="/posts"
              >
                POSTS
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-gray-500 transition-all"
                href="/about"
              >
                ABOUT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
