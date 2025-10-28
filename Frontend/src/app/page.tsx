'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0693e3] text-white p-6">
      <h1 className="text-6xl font-extrabold mb-8">Welcome to My App</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Search for your favorite players and view their stats.
      </p>

      {/* Button to go to the search page */}
      <Link
        href="/search"
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-150 mb-8"
      >
        Go to Search
      </Link>

      {/* Button to go to the teams page */}
      <Link href="/teams" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-150 mb-8">
        Go to teams page
      </Link>

      {/* Button to go to the position page */}
      <Link href="/position" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-150">
        Go to position page
      </Link>

    </main>
  );
}
