import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className="flex-col flex justify-center">
      <div className="py-[60px] px-12">
        <Link href={'/'} className="text-[28px] font-bold">
          KINDA FUNNY
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

export default Navbar
