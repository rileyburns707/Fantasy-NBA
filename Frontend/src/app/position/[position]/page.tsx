'use client'

import { useParams } from "next/navigation";
import { useState } from "react";

// Mock player data
const playersByPosition = {
  'guards': ['Stephen Curry', 'Damian Lillard', 'Kyrie Irving', 'Klay Thompson', 'Devin Booker', 'James Harden'],
  'forwards': ['LeBron James', 'Kevin Durant', 'Jimmy Butler', 'Giannis Antetokounmpo', 'Zion Williamson', 'Jayson Tatum'],
  'centers': ['Nikola Jokic', 'Joel Embiid', 'Bam Adebayo'],
};

export default function PositionPage() {
  const { position } = useParams(); // gets position from URL
  const [search, setSearch ] = useState('');

  const positionParam = Array.isArray(position) ? position[0] : position || '';

  const validPositions = ['guards','forwards','centers'] as const;
  type Position = (typeof validPositions)[number];

  const players = playersByPosition[positionParam as Position] || [];

  // Filter players by search input
  const filteredPlayers = players.filter(player =>
    player.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0693e3] text-white p-6">
      <h1 className="text-4xl font-bold mb-4">
        {positionParam.replace('-', ' ').toUpperCase()}
      </h1>

      <input
        type="text"
        placeholder="Search players"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 rounded-md text-black"
      />

      <ul className="space-y-2">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player, index) => (
            <li key={index} className="text-lg">
              {player}
            </li>
          ))
        ) : (
          <li>No players found</li>
        )}
      </ul>
    </main>
  );
}