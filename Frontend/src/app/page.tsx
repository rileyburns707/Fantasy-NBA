'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0693e3] text-white p-6 ">
      <div className='absolute top-30 left-10'>
        <Image
          src='/nba-logo.png'
          alt='NBA Logo'
          width={400}
          height={100}
        />
      </div>
      <h1 className="text-6xl font-extrabold mb-8">Welcome to My App</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Search for your favorite players and view their stats.
      </p>
    </main>
  );
}
