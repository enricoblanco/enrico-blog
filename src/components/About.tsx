'use client'

import React from 'react'

export const About = () => {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="flex flex-col gap-8">
          <div className="text-[25px] flex justify-center font-bold">ABOUT</div>
          <div className="text-justify flex flex-col gap-2 mx-10 md:mx-36 text-sm md:text-lg">
            <p>
              Hello! I&apos;m Enrico Cidade(city) Blanco, a student diving into
              the world of computer science. By day, I&apos;m part of the WebMed
              crew, working as a front-end developer, helping out in the
              healthcare tech scene.
            </p>
            <p>
              Currently I&apos;m a student at the University UNISINOS in Brazil,
              persuing a degree in Computer Science. Outside of that, catch me
              gaming, watching movies, playing sports, or tinkering with my own
              projects.
            </p>
            <p>
              Lately, I&apos;ve been digging into cloud computing - it&apos;s
              like my new favorite thing. Stick around, and check out the fun
              and random stuff I&apos;m doing lately. Also fell free to reach
              out to me on any of the platforms below, I&apos;d be delighted to
              receive your message!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
