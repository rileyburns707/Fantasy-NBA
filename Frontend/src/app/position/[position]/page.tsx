'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

interface Player {
  id: number;
  full_name: string;
  position: string;
  team_id: { name: string } | null;
}

export default function PositionPage() {
  const { position } = useParams(); 
  const positionParam = Array.isArray(position) ? position[0] : position || '';
  const normalizedPosition = positionParam.toLowerCase();
  // mapping object because URL segment will be a word, like "guards", but database only stores "G" and "G-F"
  const positionMap: Record<string, string[]> = {
    'guards': ['G', 'G-F'],
    'forwards': ['F', 'F-C', 'G-F'],
    'centers': ['C', 'F-C'],
  };
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch ] = useState('');
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAGE_SIZE = 15

  useEffect(() => {
    if (!normalizedPosition) return;
    
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('players')
          .select('id, full_name, position, team_id!inner(name)')
          .in('position', positionMap[normalizedPosition] || []);
        
        // search bar
        if (search.trim()) {
          query = query.ilike('full_name', `%${search.trim()}%`);
        }

        // pagination
        const from = (page - 1) * PAGE_SIZE;
        const to = page * PAGE_SIZE - 1;

        const { data, error: dbError } = await query.range(from, to);

        if (dbError) {
          console.error('Supabase fetch error: ', dbError);
          setError(`Failed to fetch players. Error: ${dbError.message}`);
          setPlayers([]);
        }

        if (data) {
          const isLastPage = data.length < PAGE_SIZE; 
          setHasMorePages(!isLastPage);

          const inputData = (data as any[]).map(item => ({
            id: item.id,
            full_name: item.full_name,
            position: item.position,
            team_id: item.team_id,
          })) as Player[];
          setPlayers(inputData);
        } else {
          setPlayers([]);
          setHasMorePages(false);
        }

      } catch (err) {
        console.error('Error fetching players:', err);
        setError('An unexpected error occured fetching.');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (positionParam) fetchPlayers();
  }, [positionParam, page, search]);


  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0693e3] text-white p-6">
      {/* Top-left position title */}
      <div className="mb-4 w-full max-w-4xl flex items-center justify-between">
        <h1 className="text-3xl font-bold">{positionParam.replace('-', ' ').toUpperCase()}</h1>

        {/* Page indicator */}
        <div className="text-sm">Page {page}</div>
      </div>

      {/* Search input */}
      <div className="w-full max-w-4xl mb-6 border border-white rounded-lg">
        <input
          type="text"
          placeholder="Search players in this position (e.g., LeBron James)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full p-3 rounded-md text-black"
        />
      </div>

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
              <th className="py-3 px-8 text-left">Player Full Name</th>
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map(player => (
                <tr
                  key={player.id}
                  className="border-b border-gray-200 hover:bg-[#e6f7ff] cursor-pointer"
                  onClick={() => {
                    // Placeholder. Later I will have a pop up with player stats
                    console.log('Clicked player id:', player.id);
                  }}
                >
                  <td className="py-2 px-4 text-black">{player.full_name}</td>
                  <td className="py-2 px-4 text-black">{player.team_id?.name ?? 'N/A'}</td>
                  <td className="py-2 px-4 text-black">{player.position}</td>
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

      {/* Pagination controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMorePages}
          className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}