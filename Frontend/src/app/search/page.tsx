'use client';   

import { useState } from 'react';  // hook that pulls data from supabase
import { supabase } from '@/lib/supabaseClient';    // sets up connection to supabase

// defining player structure
interface Player {
  id: number;
  full_name: string;
  position: string;
  team_id: { name: string } | null;
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
        setError("Please enter at least 2 letters to search")
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
    
    {/* Header Search Message*/}
    <h1 className="text-6xl front-extrabold mb-8 text-white">
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
          className="flex items-center justify-center h-full text-lg p-4 bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>

    {/*Search result options*/}
    <div className="mt-12 w-full max-w-xl">
      {/* error */}
      {error && ( 
        <p className="text-center text-gray-700">{error}</p>
      )}

      {/* Loading */}
      {isLoading && (
        <p className="text-center text-gray-700">Loading player data from database...</p>
      )}

      {/* No results */}
      {!isLoading && !error && searchResults.length === 0 && searchTerm.length > 0 &&(
        <p className="text-center text-gray-700">No players found matching "{searchTerm}".</p>
      )}

      {/* show list of players matching the search*/}
      {!isLoading && searchResults.length > 0 && (
        <ul className="space-y-3">
          {searchResults.map((player) => (
            <li key={player.id} className="flex justify-between items-center bg-gray-300 p-4 rounded-lg shadow-md border-3 border-red-500">
              <span className="text-xl font-medium text-black">{player.full_name}</span>
              <span className="text-sm text-black">{player.position} | {player.team_id?.name || 'N/A'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
   </main>
 );
}