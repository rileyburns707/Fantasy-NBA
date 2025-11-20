'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as NBAIcons from 'react-nba-logos';  // SVG files for team logos

interface Team {
  name: string;
  slug: string;
  href: string;
  Logo: React.ComponentType<{ size?: string | number }>;
}

export default function mapPage() {
  const allTeams: Team[] = [
    // Atlantic
    { name: 'Boston Celtics', slug: 'celtics', href: '/teams/celtics', Logo: NBAIcons.BOS },
    { name: 'Brooklyn Nets', slug: 'nets', href: '/teams/nets', Logo: NBAIcons.BKN },
    { name: 'New York Knicks', slug: 'knicks', href: '/teams/knicks', Logo: NBAIcons.NYK },
    { name: 'Philadelphia 76ers', slug: '76ers', href: '/teams/76ers', Logo: NBAIcons.PHI },
    { name: 'Toronto Raptors', slug: 'raptors', href: '/teams/raptors', Logo: NBAIcons.TOR },
    
    // Central
    { name: 'Chicago Bulls', slug: 'bulls', href: '/teams/bulls', Logo: NBAIcons.CHI },
    { name: 'Cleveland Cavaliers', slug: 'cavaliers', href: '/teams/cavaliers', Logo: NBAIcons.CLE },
    { name: 'Detroit Pistons', slug: 'pistons', href: '/teams/pistons', Logo: NBAIcons.DET },
    { name: 'Indiana Pacers', slug: 'pacers', href: '/teams/pacers', Logo: NBAIcons.IND },
    { name: 'Milwaukee Bucks', slug: 'bucks', href: '/teams/bucks', Logo: NBAIcons.MIL },
    
    // Southeast
    { name: 'Atlanta Hawks', slug: 'hawks', href: '/teams/hawks', Logo: NBAIcons.ATL },
    { name: 'Charlotte Hornets', slug: 'hornets', href: '/teams/hornets', Logo: NBAIcons.CHA },
    { name: 'Miami Heat', slug: 'heat', href: '/teams/heat', Logo: NBAIcons.MIA },
    { name: 'Orlando Magic', slug: 'magic', href: '/teams/magic', Logo: NBAIcons.ORL },
    { name: 'Washington Wizards', slug: 'wizards', href: '/teams/wizards', Logo: NBAIcons.WAS },
    
    // Northwest
    { name: 'Denver Nuggets', slug: 'nuggets', href: '/teams/nuggets', Logo: NBAIcons.DEN },
    { name: 'Minnesota Timberwolves', slug: 'timberwolves', href: '/teams/timberwolves', Logo: NBAIcons.MIN },
    { name: 'Oklahoma City Thunder', slug: 'thunder', href: '/teams/thunder', Logo: NBAIcons.OKC },
    { name: 'Portland Trail Blazers', slug: 'blazers', href: '/teams/blazers', Logo: NBAIcons.POR },
    { name: 'Utah Jazz', slug: 'jazz', href: '/teams/jazz', Logo: NBAIcons.UTA },
    
    // Pacific
    { name: 'Golden State Warriors', slug: 'warriors', href: '/teams/warriors', Logo: NBAIcons.GSW },
    { name: 'LA Clippers', slug: 'clippers', href: '/teams/clippers', Logo: NBAIcons.LAC },
    { name: 'Los Angeles Lakers', slug: 'lakers', href: '/teams/lakers', Logo: NBAIcons.LAL },
    { name: 'Phoenix Suns', slug: 'suns', href: '/teams/suns', Logo: NBAIcons.PHX },
    { name: 'Sacramento Kings', slug: 'kings', href: '/teams/kings', Logo: NBAIcons.SAC },
    
    // Southwest
    { name: 'Dallas Mavericks', slug: 'mavericks', href: '/teams/mavericks', Logo: NBAIcons.DAL },
    { name: 'Houston Rockets', slug: 'rockets', href: '/teams/rockets', Logo: NBAIcons.HOU },
    { name: 'Memphis Grizzlies', slug: 'grizzlies', href: '/teams/grizzlies', Logo: NBAIcons.MEM },
    { name: 'New Orleans Pelicans', slug: 'pelicans', href: '/teams/pelicans', Logo: NBAIcons.NOP },
    { name: 'San Antonio Spurs', slug: 'spurs', href: '/teams/spurs', Logo: NBAIcons.SAS },
  ];

  const teamPositions: Record<string, { left: string; top: string }> = {
    // Atlantic
    'Boston Celtics': { left: '77%', top: '31%' },
    'New York Knicks': { left: '74.2%', top: '32.4%' },
    'Brooklyn Nets': { left: '74%', top: '37%' }, 
    'Philadelphia 76ers': { left: '72%', top: '40%' }, 
    'Toronto Raptors': { left: '68%', top: '25%' }, 

    // Central
    'Chicago Bulls': { left: '59%', top: '35%' },  
    'Cleveland Cavaliers': { left: '65.5%', top: '35%' },  
    'Detroit Pistons': { left: '63.5%', top: '31%' },  
    'Indiana Pacers': { left: '61%', top: '40%' },  
    'Milwaukee Bucks': { left: '58%', top: '29%' },  
    
    // Southeast
    'Atlanta Hawks': { left: '64%', top: '58%' }, 
    'Charlotte Hornets': { left: '68%', top: '53%' }, 
    'Miami Heat': { left: '71%', top: '77%' }, 
    'Orlando Magic': { left: '68%', top: '73%' }, 
    'Washington Wizards': { left: '70%', top: '44%' }, 
    
    // Northwest
    'Denver Nuggets': { left: '39%', top: '41%' }, 
    'Minnesota Timberwolves': { left: '52%', top: '25%' }, 
    'Oklahoma City Thunder': { left: '48%', top: '53%' }, 
    'Portland Trail Blazers': { left: '22.5%', top: '21%' }, 
    'Utah Jazz': { left: '32%', top: '36%' }, 
    
    // Pacific
    'Golden State Warriors': { left: '20%', top: '40%' },
    'LA Clippers': { left: '23%', top: '56%' }, 
    'Los Angeles Lakers': { left: '22%', top: '51%'},
    'Phoenix Suns': { left: '30%', top: '57%' }, 
    'Sacramento Kings': { left: '22%', top: '37%' }, 
    
    // Southwest
    'Dallas Mavericks': { left: '49%', top: '61%' }, 
    'Houston Rockets': { left: '51%', top: '69%' }, 
    'Memphis Grizzlies': { left: '56%', top: '55%' }, 
    'New Orleans Pelicans': { left: '57%', top: '70%' }, 
    'San Antonio Spurs': { left: '46%', top: '70%' }, 
  };
  
  return (
    <main className="min-h-screen bg-black text-white pt-3 px-10">
      <div className="relative flex items-center justify-center w-full">
        <h1 className="text-5xl font-extrabold">Select a team</h1>
        <Link
          href="/teams"
          className="absolute right-0  text-white font-bold tracking-widest transition duration-150 p-2
                      border-2 border-white
                      hover:text-black
                      hover:bg-[#0693e3]
                      hover:border-[#0693e3]"
        >
          Grid View
        </Link>
      </div>

      <div className="relative w-full h-[85vh] animate-rise-up">
        <Image
          src="/map.png"
          alt='USA map'
          fill
          className="object-contain"
        />

         {allTeams.map(team => {
            const position = teamPositions[team.name];
            if (!position) return null;
            
            return (
              <Link
                key={team.name}
                href={team.href}
                className="absolute transition-transform hover:scale-160 hover:z-50"
                style={{ 
                  left: position.left,
                  top: position.top 
                }}
              >
                <team.Logo size={70} />
              </Link>
            );
          })}
        </div>
    </main>
  );
}