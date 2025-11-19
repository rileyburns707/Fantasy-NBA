'use client';

import Link from 'next/link';
import React from 'react'; 
import * as NBAIcons from 'react-nba-logos';  // SVG files for team logos

interface Team {
  name: string;
  href: string;
  Logo: React.ComponentType<{ size?: string | number }>;
}

interface DivisionGroupProps {
  title: string;
  teams: Team[]; 
  delay?: string;
}

const DivisionGroup: React.FC<DivisionGroupProps> = ({ title, teams, delay = '0s' }) => (
  <div 
    className="flex flex-col gap-3 animate-rise-up"
    style={{ animationDelay: delay }}
  >
    <h2 className="text-2xl font-bold uppercase text-center mb-1">{title}</h2>
    
    <div className="flex flex-col gap-2"> 
      {teams.map((team) => (
        <Link
          key={team.name}
          href={team.href}
          className="font-bold px-2 py-1 flex justify-start items-center hover:bg-white/10 transition-colors rounded" 
        >
          {team.Logo && <team.Logo size={50} />}
          <span className="ml-4">{team.name}</span>
        </Link>
      ))}
    </div>
  </div>
);


export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-3 px-10">
      <h1 className="justify-center text-5xl font-extrabold mb-12">Select a team</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 w-full max-w-7xl">
        
        {/* Eastern conference */}
        <DivisionGroup 
          title="Atlantic Division" 
          delay="0s"
          teams={[
            { name: 'Boston Celtics', href: '/teams/celtics', Logo: NBAIcons.BOS },
            { name: 'Brooklyn Nets', href: '/teams/nets', Logo: NBAIcons.BKN },
            { name: 'New York Knicks', href: '/teams/knicks', Logo: NBAIcons.NYK },
            { name: 'Philadelphia 76ers', href: '/teams/76ers', Logo: NBAIcons.PHI },
            { name: 'Toronto Raptors', href: '/teams/raptors', Logo: NBAIcons.TOR },
          ]}
        />
        
        <DivisionGroup 
          title="Central Division" 
          delay="0.1s"
          teams={[
            { name: 'Chicago Bulls', href: '/teams/bulls', Logo: NBAIcons.CHI },
            { name: 'Cleveland Cavaliers', href: '/teams/cavaliers', Logo: NBAIcons.CLE },
            { name: 'Detroit Pistons', href: '/teams/pistons', Logo: NBAIcons.DET },
            { name: 'Indiana Pacers', href: '/teams/pacers', Logo: NBAIcons.IND },
            { name: 'Milwaukee Bucks', href: '/teams/bucks', Logo: NBAIcons.MIL },
          ]}
        />
        
        <DivisionGroup 
          title="Southeast Division" 
          delay="0.2s"
          teams={[
            { name: 'Atlanta Hawks', href: '/teams/hawks', Logo: NBAIcons.ATL },
            { name: 'Charlotte Hornets', href: '/teams/hornets', Logo: NBAIcons.CHA },
            { name: 'Miami Heat', href: '/teams/heat', Logo: NBAIcons.MIA },
            { name: 'Orlando Magic', href: '/teams/magic', Logo: NBAIcons.ORL },
            { name: 'Washington Wizards', href: '/teams/wizards', Logo: NBAIcons.WAS },
          ]}
        />
        
        {/* Western conference */}
        <DivisionGroup 
          title="Northwest Division" 
          delay="0.3s"
          teams={[
            { name: 'Denver Nuggets', href: '/teams/nuggets', Logo: NBAIcons.DEN },
            { name: 'Minnesota Timberwolves', href: '/teams/timberwolves', Logo: NBAIcons.MIN },
            { name: 'Oklahoma City Thunder', href: '/teams/thunder', Logo: NBAIcons.OKC },
            { name: 'Portland Trail Blazers', href: '/teams/blazers', Logo: NBAIcons.POR },
            { name: 'Utah Jazz', href: '/teams/jazz', Logo: NBAIcons.UTA },
          ]} 
        />
        <DivisionGroup 
          title="Pacific Division"
          delay="0.4s"
          teams={[
            { name: 'Golden State Warriors', href: '/teams/warriors', Logo: NBAIcons.GSW },
            { name: 'LA Clippers', href: '/teams/clippers', Logo: NBAIcons.LAC },
            { name: 'Los Angeles Lakers', href: '/teams/lakers', Logo: NBAIcons.LAL },
            { name: 'Phoenix Suns', href: '/teams/suns', Logo: NBAIcons.PHX },
            { name: 'Sacramento Kings', href: '/teams/kings', Logo: NBAIcons.SAC },
          ]}
        />
        <DivisionGroup
        title="Southwest Division"
        delay="0.5s"
        teams={[
            { name: 'Dallas Mavericks', href: '/teams/mavericks', Logo: NBAIcons.DAL },
            { name: 'Houston Rockets', href: '/teams/rockets', Logo: NBAIcons.HOU },
            { name: 'Memphis Grizzlies', href: '/teams/grizzlies', Logo: NBAIcons.MEM },
            { name: 'New Orleans Pelicans', href: '/teams/pelicans', Logo: NBAIcons.NOP },
            { name: 'San Antonio Spurs', href: '/teams/spurs', Logo: NBAIcons.SAS },
          ]}
        />

      </div>
    </main>
  );
}