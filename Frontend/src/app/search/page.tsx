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
    <div className="mb-4 w-full max-w-4xl flex items-center justify-between">
      <h1 className="text-3xl font-bold">Player Search</h1>
    </div>

    {/* Search bar*/}
    <form onSubmit={searchPlayers} className="w-full max-w-4xl">
      <div className="flex items-center mb-6 border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-800">
        <input
          type="text"
          placeholder="Search players (e.g., Lebron James)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 focus:outline-none text-black"
        />
        <button
          type="submit"
          className="flex items-center justify-center flex-shrink-0 text-lg p-3 bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-800"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>

    {/* Error / Loading */}
    <div className="w-full max-w-4xl">
      {error && <p className="mb-4 text-red-200">Error: {error}</p>}
      {isLoading && <p className="mb-4 text-white/90">Loading players...</p>}
    </div>

    {/* Table */}
    <div className="w-full max-w-4xl overflow-x-auto">
        <table className="min-w-full bg-white text-[#0693e3] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#0580c3] text-white">
              <th className="py-3 px-8 text-left">Player Name</th>
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map(searchResults => (
                <tr
                  key={searchResults.id}
                  className="border-b border-gray-200 hover:bg-[#e6f7ff] cursor-pointer"
                  onClick={() => {
                    // Placeholder. Later I will have a pop up with player stats
                    console.log('Clicked player id:', searchResults.id);
                  }}
                >
                  <td className="py-2 px-4 text-black">{searchResults.full_name}</td>
                  <td className="py-2 px-4 text-black">{searchResults.team_id?.name ?? 'N/A'}</td>
                  <td className="py-2 px-4 text-black">{searchResults.position}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 text-center text-black">
                  {isLoading ? 'Loading...' : 'No players found on this page'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

   </main>
 );
}