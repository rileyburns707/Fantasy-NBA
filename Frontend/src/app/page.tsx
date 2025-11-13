'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'; 

const titleText = "Welcome to Fantasy NBA";

// Split the title into an array of <span> elements
const animatedTitle = titleText.split('').map((letter, index) => (
  <span 
    key={index} 
    // Apply a subtle transition, the hover color change, and inline-block for better spacing
    className="transition duration-100 hover:text-[#0693e3] inline-block animate-text-load-in hover:animate-letter-jump-hover-config"
    style={{ animationDelay: `${0.01 * index}s`}}
  >
    {/* Use non-breaking space for actual spaces in the text */}
    {letter === ' ' ? '\u00A0' : letter} 
  </span>
));

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-6 pt-50">
      <div className='mb-10 animate-logo-fix'>
        <Image
          src='/fantasy-NBA-logo-black.png'
          alt='NBA Logo'
          width={300}
          height={100}
        />
      </div>
      <h1 className="text-6xl font-extrabold tracking-wider mb-6">
        {animatedTitle}
      </h1>
      <Link
        href="/search"
        className="text-xl text-white font-bold tracking-widest transition duration-150 p-2 
                    border-2 border-white
                    hover:text-black
                    hover:bg-[#0693e3]
                    hover:border-[#0693e3]"
      >
        GET STARTED
      </Link>
    </main>
  );
}