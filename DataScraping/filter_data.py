# importing all required libraries
from nba_api.stats.endpoints import leaguedashplayerstats, commonallplayers, commonteamroster
import pandas as pd
import time

# getting current season player stats from NBA API
player_stats_endpoint = leaguedashplayerstats.LeagueDashPlayerStats(
    season='2024-25',
    season_type_all_star='Regular Season'
)
df_player_stats = player_stats_endpoint.get_data_frames()[0]

# selecting only relevant columns
fantasy_columns = [
    'PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'MIN',
    'FG_PCT', 'FG3_PCT', 'FT_PCT', 'REB', 'AST', 'TOV',
    'STL', 'BLK', 'PTS', 'PLUS_MINUS', 'NBA_FANTASY_PTS',
    'NBA_FANTASY_PTS_RANK', 'PLUS_MINUS_RANK', 'PLAYER_ID'
]
df_filtered_stats = df_player_stats[fantasy_columns]

# getting allplayers data to map teams to team IDs
all_players_endpoint = commonallplayers.CommonAllPlayers(
    is_only_current_season=1,
    season='2024-25'
)
df_all_players = all_players_endpoint.get_data_frames()[0]

# collecting position data from each team's roster
unique_teams = df_filtered_stats['TEAM_ABBREVIATION'].unique() # getting unique team abbreviations
all_roster_data = [] # list to store all team roster data

for team_abbr in unique_teams: # looping through each team
    try:
        # finding team ID from team abbreviation
        team_info = df_all_players[df_all_players['TEAM_ABBREVIATION'] == team_abbr]
        if not team_info.empty:
            team_id = team_info['TEAM_ID'].iloc[0]
            
            # getting roster data for each team
            roster_endpoint = commonteamroster.CommonTeamRoster(
                team_id=team_id,
                season='2024-25'
            )
            roster_df = roster_endpoint.get_data_frames()[0]
            
            if not roster_df.empty:
                all_roster_data.append(roster_df) # appending roster data to list
            
            time.sleep(0.1) # preventing API rate limiting with small delay
        
    except Exception:
        continue # skipping teams that fail to load

# combining all roster data and merging with player stats
if all_roster_data:
    df_rosters = pd.concat(all_roster_data, ignore_index=True) # concatenating all roster data
    
    # merging player stats with position data on player ID
    final_df = pd.merge(
        df_filtered_stats,
        df_rosters[['PLAYER_ID', 'POSITION']],
        on='PLAYER_ID',
        how='left'
    )
else:
    final_df = df_filtered_stats.copy() # if no roster data retrieved

# exporting to CSV
final_df.to_csv('nba_fantasy_stats_with_positions.csv', index=False)