'use client';

import { useState } from 'react';
// Ensure this import path is correct for your project structure
import { supabase } from '@/lib/supabaseClient'; 

// Updated Interface: Uses 'full_name' for the player name and
// expects the team data to be a nested object from the JOIN query on 'team_id'.
interface Player {
  id: number;
  full_name: string; 
  position: string;
  // team_id holds the joined data from the 'teams' table, aliased as 'name'
  team_id: {
    name: string;
  } | null;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState(''); // Stores the text currently typed into the search box.
  const [searchResults, setSearchResults] = useState<Player[]>([]); // Stores the array of player objects returned by Supabase after a successful search.
  const [isLoading, setIsLoading] = useState(false); // show a "Loading..." message while waiting for the network request to finish
  const [error, setError] = useState<string | null>(null); // Stores any error message

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = searchTerm.trim();
    
    if (queryTerm.length < 2) {
      setError('Please enter at least 2 characters to search.');
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const { data, error } = await supabase
        .from('players')
        // SELECT Statement:
        // - 'full_name' is the correct column for the player's name.
        // - 'team_id!inner(name)' performs a JOIN on the team_id foreign key 
        //   and selects ONLY the 'name' column from the associated 'teams' table.
        .select('id, full_name, position, team_id!inner(name)') 
        // QUERY: Search on the correct column 'full_name'
        // - This compares the full_name column to the search term. 
        //   The % symbols are wildcards, meaning it will find results where the 
        //   search term appears anywhere in the name. i means case-insensitive.
        .ilike('full_name', `%${queryTerm}%`) 
        .limit(20);

      if (error) {
        console.error('Supabase Search Error:', error);
        setError(`Failed to fetch players. Check RLS policy. Error: ${error.message}`);
        // IMPORTANT: Also check RLS on the 'teams' table!
        return;
      }
      
      // FIX FOR RED UNDERLINE: Explicitly map and cast to satisfy TypeScript's strict type checking
      if (data) {
        // We cast to 'as any[]' temporarily to bypass the complex nested type issue 
        // with Supabase joins, and then cast to the correct Player[] type structure.
        const typedData = (data as any[]).map(item => ({
            id: item.id,
            full_name: item.full_name,
            position: item.position,
            team_id: item.team_id,
        })) as Player[];

        setSearchResults(typedData);
      } else {
        setSearchResults([]);
      }

    } catch (err) {
      console.error('General Search Error:', err);
      setError('An unexpected error occurred during search.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6">
      
      {/* Welcome Message */}
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-400">
        Welcome to Fantasy NBA
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden focus-within:border-yellow-500 transition duration-150">
          <input
            type="text"
            placeholder="Search players (e.g., LeBron James)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="p-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition duration-150"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results Display */}
      <div className="mt-12 w-full max-w-xl">
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Loading State */}
        {isLoading && (
          <p className="text-center text-gray-400">Loading player data...</p>
        )}

        {/* No Results State */}
        {!isLoading && !error && searchResults.length === 0 && searchTerm.length > 0 && (
          <p className="text-center text-gray-400">No players found matching "{searchTerm}".</p>
        )}

        {/* Results List */}
        {!isLoading && searchResults.length > 0 && (
          <ul className="space-y-3">
            {searchResults.map((player) => (
              <li key={player.id} className="bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500 flex justify-between items-center">
                <span className="text-xl font-medium">{player.full_name}</span> 
                <span className="text-sm text-gray-400">
                  {player.position} | {player.team_id?.name || 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

