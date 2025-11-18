import React from 'react'
import * as NBAIcons from 'react-nba-logos';  // SVG files for team logos

export interface PlayerStats {
  // header details
  full_name: string;
  position: string;
  team_name: string;

  // stat details
  games_played: number;
  total_minutes: number;
  field_goal_percentage: number;
  three_point_percentage: number;
  free_throw_percentage: number;
  total_rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  points: number;
  fantasy_points_standard: number;
  plus_minus: number;
}

const StatItem = ({label, value, isPercentage = false}: {label: string, value: number | string | undefined, isPercentage?: boolean }) => (
  <div className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-100">
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    {/* Handle percentages and general numbers */}
    <div className="text-xl md:text-2xl font-extrabold text-gray-900 mt-1">
      {typeof value === 'number' 
        ? (isPercentage ? (value * 100).toFixed(1) + '%' : value.toFixed(1))
        : (value ?? 'N/A')}
    </div>
  </div>
);

export default function PlayerStatsModal({isOpen, onClose, details, isLoading} : {
  isOpen: boolean,
  onClose: () => void,
  details: PlayerStats | null,
  isLoading: boolean
}) {
  if (!isOpen) return null;

  // Per-game averages
  const getPerGameAvg = (total: number) => {
    if (!details || details.games_played === 0) return 0;
    return total / details.games_played;
  };

  const TeamLogo = details?.team_name ? (NBAIcons as any)[details.team_name] : null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-gray-200 text-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform scale-100 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-3 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-[#0693e3]">
                {isLoading ? 'Loading Stats...' : details?.full_name || 'Player Details'}
              </h2>
              {TeamLogo && <TeamLogo size={50} />}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition transform hover:rotate-90"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#0693e3]"></div>
                <p className="mt-4 text-sm font-medium text-gray-600">Fetching player data...</p>
              </div>
            ) : details ? (
              <div className="space-y-6">
                
                {/* Secondary Header Details */}
                <div className="flex justify-around text-base md:text-lg font-bold border-b pb-2">
                  <p><span className="text-[#0693e3] mr-1">Team:</span> {details.team_name}</p>  
                  <p><span className="text-[#0693e3] mr-1">Pos:</span> {details.position}</p>
                  <p><span className="text-[#0693e3] mr-1">GP:</span> {details.games_played}</p>
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#0693e3]">Per-Game Statistics</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <StatItem label="Points" value={getPerGameAvg(details.points)} />
                  <StatItem label="Assists" value={getPerGameAvg(details.assists)} />
                  <StatItem label="Rebounds" value={getPerGameAvg(details.total_rebounds)} />
                  <StatItem label="Steals" value={getPerGameAvg(details.steals)} />
                  <StatItem label="Blocks" value={getPerGameAvg(details.blocks)} />
                  <StatItem label="Turnovers" value={getPerGameAvg(details.turnovers)} />
                  <StatItem label="Minutes" value={getPerGameAvg(details.total_minutes)} />
                  <StatItem label="+/-" value={getPerGameAvg(details.plus_minus)} />
                </div>
                
                <h3 className="text-2xl font-extrabold text-[#0693e3]">Shooting Percentages</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <StatItem label="FG%" value={details.field_goal_percentage} isPercentage={true} />
                  <StatItem label="3PT%" value={details.three_point_percentage} isPercentage={true} />
                  <StatItem label="FT%" value={details.free_throw_percentage} isPercentage={true} />
                </div>

                <h3 className="text-2xl font-extrabold text-[#0693e3]">Fantasy Points</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <StatItem label="Total Fantasy Pts" value={(details.fantasy_points_standard)} />
                  <StatItem label="Fantasy Pts per game" value={getPerGameAvg((details.fantasy_points_standard))} />
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-medium p-3 bg-red-50 rounded-lg">
                Could not load detailed stats for this player.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}