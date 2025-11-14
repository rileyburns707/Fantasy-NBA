'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-20">
      <h1 className="text-5xl font-extrabold ml-30 mb-15 self-start">Select a position</h1>

      <div className="flex gap-8 justify-center w-full">
        <Link
          href="/position/guards"
        >
          <Image
              src='/poole.png'
              alt='jordan poole photo'
              width={300}
              height={100}
          />
        </Link>
        <Link
          href="/position/forwards"
        >
          Forwards
        </Link>
        <Link 
          href="/position/centers"
          className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold flex justify-center items-center"
        >
          Centers
        </Link>
      </div>

      <div className="relative group w-48 h-64 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-red-700/50 mt-20">
          <Link href="/position/forwards" className="block w-full h-full">
            <div className="absolute inset-0 bg-blue-700/0 group-hover:bg-blue-700/50 transition-all duration-300 z-10 flex flex-col justify-end p-2">
              <span className="text-xl font-bold mb-4 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                FORWARDS
              </span>
              <button className="bg-white text-black font-bold py-1 px-3 rounded-full text-sm self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View
              </button>
            </div>
            {/* Placeholder Image (Replace with a Forward photo) */}
            <Image
              src='/lebron.png'
              alt='lebron james photo'
              width={300}
              height={100}
            />
          </Link>
        </div>
    </main>
  );
}     