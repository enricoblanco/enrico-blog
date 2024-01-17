import Link from 'next/link'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { SiLetterboxd } from 'react-icons/si'

export const Footer = () => {
  return (
    <div className="w-full text-sm px-44 py-12">
      <div className="flex justify-between text-gray-400 opacity-80">
        <div>Copyright © 2024 Enrico Blanco</div>
        <ul className="flex flex-row gap-2 text-xl">
          <li>
            <Link
              target="_blank"
              className="hover:text-gray-800 transition-all"
              href={'https://github.com/enricoblanco'}
            >
              <FaGithub />
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              className="hover:text-gray-800 transition-all"
              href={'https://www.instagram.com/enricocity/'}
            >
              <FaInstagram />
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              className="hover:text-gray-800 transition-all"
              href={
                'https://www.linkedin.com/in/enrico-cidade-blanco-760517231/'
              }
            >
              <FaLinkedin />
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              className="hover:text-gray-800 transition-all"
              href={'https://twitter.com/enricocity'}
            >
              <FaSquareXTwitter />
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              className="hover:text-gray-800 transition-all"
              href={'https://letterboxd.com/enricocity/'}
            >
              <SiLetterboxd />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
