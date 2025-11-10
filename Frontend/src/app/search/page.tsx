'use client';   

import { useState } from 'react'; 
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDetails, setModalDetails]= useState<PlayerStats | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const searchPlayers = async (e: React.FormEvent) => {
      e.preventDefault();
      const queryTerm = searchTerm.trim();
      
      if (queryTerm.length < 2) {
        setError("Please enter at least 2 letters to search")
        setSearchResults([])
        return;
      }

      setIsLoading(true);
      setError(null);
      setSearchResults([]);

      try {
        const { data, error } = await supabase
        .from('players')
        .select('id, full_name, position, team_id!inner(name)')
        .ilike('full_name', `%${queryTerm}%`)
        .limit(5);

        if (error) {
          console.error('Supabase search error: ', error);
          setError(`Failed to fetch players. Error: ${error.message}`);
          return;
        }

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
            free_through_percentage: data.free_through_percentage,
            total_rebounds: data.total_rebounds,
            assists: data.assists,
            steals: data.steaks, 
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

      {/* Player stats modal */}
      <PlayerStatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={modalDetails}
        isLoading={isModalLoading}
      />
   </main>
 );
}