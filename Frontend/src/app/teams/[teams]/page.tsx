'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import PlayerStatsModal, {PlayerStats} from "@/components/PlayerStatsModal";

interface Player {
  id: number;
  full_name: string;
  position: string;
  team_id: { name: string } | null;
}

export default function TeamsPlayerPage() {
  const { teams } = useParams(); 
  const teamParam = Array.isArray(teams) ? teams[0] : teams || '';  
  const normalizedTeam = teamParam.toLowerCase();
  // the database stores teams in this format 'BOS', 'BKN', etc.
  const teamMap: Record<string, string> = {
    'celtics': 'BOS',
    'nets': 'BKN',
    'knicks': 'NYK',
    '76ers': 'PHI',
    'raptors': 'TOR',
    'bulls': 'CHI',
    'cavaliers': 'CLE',
    'pistons': 'DET',
    'pacers': 'IND',
    'bucks': 'MIL',
    'hawks': 'ATL',
    'hornets': 'CHA',
    'heat': 'MIA',
    'magic': 'ORL',
    'wizards': 'WAS',
    'nuggets': 'DEN',
    'timberwolves': 'MIN',
    'thunder': 'OKC',
    'blazers': 'POR',
    'jazz': 'UTA',
    'warriors': 'GSW',
    'clippers': 'LAC',
    'lakers': 'LAL',
    'suns': 'PHX',
    'kings': 'SAC',
    'mavericks': 'DAL',
    'rockets': 'HOU',
    'grizzlies': 'MEM',
    'pelicans': 'NOP',
    'spurs': 'SAS',
  };
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch ] = useState('');
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAGE_SIZE = 10

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState<PlayerStats | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    if (!normalizedTeam) return;

    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('players')
          .select('id, full_name, position, team_id!inner(name)')
          .eq('team_id.name', teamMap[normalizedTeam]);

        if (search.trim()) {
          query = query.ilike('full_name', `%${search.trim()}%`);
        }

        const from = (page - 1) * PAGE_SIZE;
        const to = page * PAGE_SIZE - 1

        const { data, error: dbError} = await query.range(from, to);

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
    if (teamParam) fetchPlayers();
  }, [teamParam, page, search]);

  const fetchAndOpenModal = async (player: Player) => {
    setIsModalOpen(true);
    setModalDetails(null);
    setIsModalLoading(true);

    try {
      const { data, error: dbError} = await supabase
        .from('player_season_stats')
        .select('*, team_name:teams!inner(name)')
        .eq('player_id', player.id)
        .single();

      if (dbError) {
        console.error('Error fetching player stats:', dbError)
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
        setModalDetails(stats)
      }
    } catch (err) {
      console.error('Unexpected error fetching stats:', err);
      setModalDetails(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0693e3] text-white p-6">
      {/* Team name and page number*/}
      <div className="mb-4 w-full max-w-4xl flex items-center justify-between">
        <h1 className="text-3xl font-bold">{teamParam.toUpperCase()}</h1>
        <div className="text-sm">Page {page}</div>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-4xl mb-6 border border-white rounded-lg">
        <input 
          type="text"
          placeholder="Search player on this team (e.g., Lebron James)"
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
              <th className="py-3 px-8 text-left">Player Name</th>
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
                    fetchAndOpenModal(player)
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

      <PlayerStatsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={modalDetails}
        isLoading={isModalLoading}
      />
    </main>
  );
}