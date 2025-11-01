'use client';

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0693e3] text-white p-6">
      <h1 className="text-6xl font-extrabold mb-8">Select a position</h1>

      <div className="flex flex-col gap-4">
        <Link
          href="/position/guards"
          className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold flex justify-center items-center"
        >
          Guards
        </Link>
        <Link
          href="/position/forwards"
          className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold justify-center flex justify-center items-center"
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
    </main>
  );
}     