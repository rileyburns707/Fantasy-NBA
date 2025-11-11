'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className='absolute top-90 left-50'>
        <Image
          src='/fantasy-NBA-logo.png'
          alt='NBA Logo'
          width={300}
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
