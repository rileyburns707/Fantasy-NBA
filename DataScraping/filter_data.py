# importing libraries I need for NBA data scraping
from nba_api.stats.endpoints import leaguedashplayerstats   # nba_api has all the data I want
import pandas as pd     # Data manipulation library

print("Getting NBA player stats...")

# Make API call to get current season player stats
player_stats = leaguedashplayerstats.LeagueDashPlayerStats(    # Creates NBA API request object
    season='2024-25',
    season_type_all_star='Regular Season'
)

# Convert API response to pandas df
df = player_stats.get_data_frames()[0]  # API returns list of tables, we want the main one at index 0

# Columns I want to use
fantasy_columns = [
    'PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'MIN', 
    'FG_PCT', 'FG3_PCT', 'FT_PCT', 'REB', 'AST', 'TOV', 
    'STL', 'BLK', 'PTS', 'PLUS_MINUS', 'NBA_FANTASY_PTS', 
    'NBA_FANTASY_PTS_RANK', 'PLUS_MINUS_RANK'
]

filtered_df = df[fantasy_columns]   # Creates new dataframe with only specified columns

print(f"Filtered data to {len(fantasy_columns)} columns")
print("\nTop 10 fantasy players:")
print(filtered_df.head(10))

# Sort players by fantasy points (highest to lowest)
top_fantasy = filtered_df.sort_values('NBA_FANTASY_PTS', ascending=False)   # ascending=False = highest first
print("\nTop 5 fantasy performers:")
print(top_fantasy.head(10))

# Save the filtered data to CSV
top_fantasy.to_csv('nba_fantasy_stats.csv', index=False)
print(f"\nData saved to 'nba_fantasy_stats.csv'")
print(f"Total players: {len(filtered_df)}")