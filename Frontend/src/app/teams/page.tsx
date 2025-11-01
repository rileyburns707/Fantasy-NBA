'use client';

import Link from 'next/link';
import React from 'react'; 

interface Team {
  name: string;
  href: string;
}

interface DivisionGroupProps {
  title: string;
  teams: Team[]; 
}

const DivisionGroup: React.FC<DivisionGroupProps> = ({ title, teams }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl font-bold uppercase text-center mb-1">{title}</h2>
    
    <div className="flex flex-col gap-2"> 
      {teams.map((team) => (
        <Link
          key={team.name}
          href={team.href}
          className="text-white px-2 py-1 flex justify-start items-center hover:bg-white/10 transition-colors rounded" 
        >
          {team.name}
        </Link>
      ))}
    </div>
  </div>
);


export default function HomePage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0693e3] text-white p-6">
      <h1 className="text-6xl font-extrabold mt-16 mb-12">Select a team</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 w-full max-w-6xl">
        
        {/* Eastern conference */}
        <DivisionGroup 
          title="Atlantic Division" 
          teams={[
            { name: 'Boston Celtics', href: '/teams/celtics' },
            { name: 'Brooklyn Nets', href: '/teams/nets' },
            { name: 'New York Knicks', href: '/teams/knicks' },
            { name: 'Philadelphia 76ers', href: '/teams/76ers' },
            { name: 'Toronto Raptors', href: '/teams/raptors' },
          ]}
        />
        
        <DivisionGroup 
          title="Central Division" 
          teams={[
            { name: 'Chicago Bulls', href: '/teams/bulls' },
            { name: 'Cleveland Cavaliers', href: '/teams/cavaliers' },
            { name: 'Detroit Pistons', href: '/teams/pistons' },
            { name: 'Indiana Pacers', href: '/teams/pacers' },
            { name: 'Milwaukee Bucks', href: '/teams/bucks' },
          ]}
        />
        
        <DivisionGroup 
          title="Southeast Division" 
          teams={[
            { name: 'Atlanta Hawks', href: '/teams/hawks' },
            { name: 'Charlotte Hornets', href: '/teams/hornets' },
            { name: 'Miami Heat', href: '/teams/heat' },
            { name: 'Orlando Magic', href: '/teams/magic' },
            { name: 'Washington Wizards', href: '/teams/wizards' },
          ]}
        />
        
        {/* Western conference */}
        <DivisionGroup 
          title="Northwest Division" 
          teams={[
            { name: 'Denver Nuggets', href: '/teams/nuggets' },
            { name: 'Minnesota Timberwolves', href: '/teams/timberwolves' },
            { name: 'Oklahoma City Thunder', href: '/teams/thunder' },
            { name: 'Portland Trail Blazers', href: '/teams/blazers' },
            { name: 'Utah Jazz', href: '/teams/jazz' },
          ]} 
        />
        <DivisionGroup 
          title="Pacific Division"
          teams={[
            { name: 'Golden State Warriors', href: '/teams/warriors' },
            { name: 'LA Clippers', href: '/teams/clippers' },
            { name: 'Los Angeles Lakers', href: '/teams/lakers' },
            { name: 'Phoenix Suns', href: '/teams/suns' },
            { name: 'Sacramento Kings', href: '/teams/kings' },
          ]}
        />
        <DivisionGroup
        title="Southwest Division"
        teams={[
            { name: 'Dallas Mavericks', href: '/teams/mavericks' },
            { name: 'Houston Rockets', href: '/teams/rockets' },
            { name: 'Memphis Grizzlies', href: '/teams/grizzlies' },
            { name: 'New Orleans Pelicans', href: '/teams/pelicans' },
            { name: 'San Antonio Spurs', href: '/teams/spurs' },
          ]}
        />

      </div>
    </main>
  );
}