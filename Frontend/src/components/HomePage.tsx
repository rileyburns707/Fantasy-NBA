'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedTitle from '@/components/AnimatedTitle'; 

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
        <AnimatedTitle />
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