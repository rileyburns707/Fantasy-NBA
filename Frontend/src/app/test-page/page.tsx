'use client';   // client side 

import { useEffect, useState } from 'react';  // hook that pulls data from supabase
import { supabase } from '@/lib/supabaseClient';    // sets up connection to supabase

interface Player {
  id: number;
  full_name: string;
  position: string;
  team_id: {
    name: string;
  } | null;
}

export default function SearchPage() {
    // state declarations
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // core logic (query building and fetching)
    const searchPlayers = async (e: React.FormEvent) => {
      e.preventDefault();
      const queryTerm = searchTerm.trim();
      
      if (queryTerm.length < 2) {
        setError("PLease enter at least 2 letters to search")
        setSearchResults([])
        return;
      }

      // set loading state
      setIsLoading(true);
      setError(null);
      setSearchResults([]);

      try {
        // Search supabase
        const { data, error } = await supabase
        .from('players')
        .select('id, full_name, position, team_id!inner(name)')
        .ilike('full_name', `%${queryTerm}%`)
        .limit(5);

        // handle errors
        if (error) {
          console.error('Supabase search error: ', error);
          setError(`Failed to fetch players. Error: ${error.message}`);
          return;
        }

        // set results
        if (data) {
          const inputData = (data as any[]).map(item => ({
            id: item.id,
            full_name: item.full_name,
            position: item.position,
            team_id: item.team_id,
          })) as Player[];
          setSearchResults(inputData);
        } else {
          setSearchResults([]);
        }
    
      } catch (err) {
        console.error('General Error:', err);
        setError('An unexpected error occured during search.');
      } finally {
        setIsLoading(false);
      }
    };

// UI/UX design using JSX
return (
   <main className="flex flex-col items-center justify-start min-h-screen bg-[#0693e3] text-white p-6">
    
    {/* Search Message*/}
    <h1 className="text-6xl front-extrabold mb-8 text-red">
      Player Search
    </h1>

    {/* Search bar*/}
    <form onSubmit={searchPlayers} className="w-full max-w-xl">
      <div className="flex items-center border border-white rounded-lg overflow-hidden focus-within:border-red-500 transition duration-150">
        <input
          type="text"
          placeholder="Search players (e.g., Lebron James)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="p-4 bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>

    {/*Search result options*/}
    <div>
      {/* error */}
      {/* Loading */}
      {/* No results */}
      {/* list of players */}
    </div>


   </main>
 );
}
