from nba_api.stats.endpoints import leaguedashplayerstats
import pandas as pd

print("Getting NBA player stats...")

# Get current season player stats
player_stats = leaguedashplayerstats.LeagueDashPlayerStats(
    season='2024-25',
    season_type_all_star='Regular Season'
)

# Convert to a pandas dataframe (like a spreadsheet)
df = player_stats.get_data_frames()[0]

print(f"Found {len(df)} players")
print("\nColumn names (what data we have):")
print(df.columns.tolist())

print("\nFirst 5 players:")
print(df.head())