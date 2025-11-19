'use client';   

import { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabaseClient'; 
import PlayerStatsModal, {PlayerStats} from '@/components/PlayerStatsModal';

interface Player {
  id: number;
  full_name: string;
  position: string;
  team_id: { name: string } | null;
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Player[]>([]);
    const [page, setPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const PAGE_SIZE = 13

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDetails, setModalDetails]= useState<PlayerStats | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    useEffect(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch();
      }
    }, [page]);

    const performSearch = async () => {
      const queryTerm = searchTerm.trim();
      
      if (queryTerm.length < 2) {
        setError("Please enter at least 2 letters to search")
        setSearchResults([])
        return;
      }

      setIsLoading(true);
      setError(null);
      // setSearchResults([]);

      // pagination
      const from = (page - 1) * PAGE_SIZE;
      const to = page * PAGE_SIZE - 1;

      try {
        let query = supabase
          .from('players')
          .select('id, full_name, position, team_id!inner(name)')
          .ilike('full_name', `%${queryTerm}%`)
          .limit(PAGE_SIZE);
        
        const { data, error: dbError } = await query.range(from, to);

        if (dbError) {
          console.error('Supabase search error: ', dbError);
          setError(`Failed to fetch players. Error: ${dbError.message}`);
          return;
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
          setSearchResults(inputData);
        } else {
          setSearchResults([]);
          setHasMorePages(false);
        }
    
      } catch (err) {
        console.error('General Error:', err);
        setError('An unexpected error occured during search.');
      } finally {
        setIsLoading(false);
      }
    };

    const searchPlayers = async (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1); 
      await performSearch();
    };

    const fetchAndOpenModal = async (player: Player) => {
      setIsModalOpen(true); 
      setModalDetails(null); 
      setIsModalLoading(true);

      try {
        const { data, error: dbError } = await supabase
          .from('player_season_stats')
          .select('*, team_name:teams!inner(name)')
          .eq('player_id', player.id)
          .single();

        if (dbError) {
          console.error('Error fetching player stats:', dbError);
          setModalDetails(null);
        } 
        
        if (data) {
          const stats: PlayerStats = {
            full_name: player.full_name,
            position: player.position,
            team_name: data.team_name.name || 'N/A', 
            games_played: data.games_played,
            total_minutes: data.total_minutes,
            field_goal_percentage: data.field_goal_percentage,
            three_point_percentage: data.three_point_percentage,
            free_throw_percentage: data.free_throw_percentage,
            total_rebounds: data.total_rebounds,
            assists: data.assists,
            steals: data.steals, 
            blocks: data.blocks,
            turnovers: data.turnovers,
            points: data.points,
            fantasy_points_standard: data.fantasy_points_standard,
            plus_minus: data.plus_minus,
          };
          setModalDetails(stats);
        }
      } catch (err) {
        console.error('Unexpected error fetching stats:', err)
        setModalDetails(null);
      } finally {
        setIsModalLoading(false);
      }
    };

return (
   <main className="flex flex-col items-center justify-start min-h-screen bg-[#0693e3] text-white p-6">
    <div className="w-full max-w-4xl bg-[#181818] p-8 rounded shadow-2xl">
      {/* Search page title */}
      <div className="mb-4 w-full max-w-4xl flex items-center justify-between">
        <h1 className="text-3xl font-bold">Player Search</h1>
        {searchResults.length > 0 && <div className="text-sm">Page {page}</div>}
      </div>

      {/* Search bar*/}
      <form onSubmit={searchPlayers} className="w-full max-w-4xl">
        <div className="flex items-center mb-6 border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-800">
          <input
            type="text"
            placeholder="Search players (e.g., Lebron James)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); setPage(1);
            }}
            className="w-full p-3 focus:outline-none text-white"
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
                      fetchAndOpenModal(searchResults);
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

        {/* Pagination controls */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || !searchTerm.trim()}
            className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMorePages || !searchTerm.trim()}
            className="bg-white text-[#0693e3] px-4 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Player stats modal */}
        <PlayerStatsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          details={modalDetails}
          isLoading={isModalLoading}
        />
      </div>
   </main>
 );
}