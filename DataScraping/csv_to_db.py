import pandas as pd
import psycopg2

# Database connection
conn = psycopg2.connect(
    host="localhost",
    database="fantasy_nba",
    user="rileyburns",
    port="5432"
)
cur = conn.cursor()

# Read CSV
df = pd.read_csv('nba_fantasy_stats_with_positions.csv')

# Get current season ID (assuming 2024-25 season exists)
cur.execute("SELECT id FROM seasons WHERE season_year = '2024-25'")
season_id = cur.fetchone()[0]

print(f"Processing {len(df)} players...")

# Process each row
for index, row in df.iterrows():
    # 1. Insert team (check if exists first)
    team_abbr = row['TEAM_ABBREVIATION']
    # Since CSV doesn't have TEAM_ID, we'll use a placeholder (0) or generate one
    team_nba_id = 0  # Placeholder value since CSV doesn't contain team IDs
    
    # Check if team already exists
    cur.execute("SELECT id FROM teams WHERE name = %s", (team_abbr,))
    team_result = cur.fetchone()
    
    if team_result is None:
        # Team doesn't exist, insert it
        cur.execute("""
            INSERT INTO teams (name) 
            VALUES (%s)
        """, (team_abbr,))
        
        # Get the newly inserted team ID
        cur.execute("SELECT id FROM teams WHERE name = %s", (team_abbr,))
        team_id = cur.fetchone()[0]
    else:
        team_id = team_result[0]
    
    # 2. Insert player (update if already exists)
    player_nba_id = int(row['PLAYER_ID'])
    player_name = row['PLAYER_NAME']
    position = row['POSITION'] if pd.notna(row['POSITION']) else 'UNKNOWN'
    
    # Split name into first and last name
    name_parts = player_name.split(' ', 1)  # Split on first space only
    first_name = name_parts[0] if len(name_parts) > 0 else 'Unknown'
    last_name = name_parts[1] if len(name_parts) > 1 else 'Unknown'
    
    cur.execute("""
        INSERT INTO players (player_id, first_name, last_name, full_name, position, team_id) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (player_id) DO UPDATE SET 
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            full_name = EXCLUDED.full_name,
            position = EXCLUDED.position,
            team_id = EXCLUDED.team_id
    """, (player_nba_id, first_name, last_name, player_name, position, team_id))
    
    # Get player internal ID
    cur.execute("SELECT id FROM players WHERE player_id = %s", (player_nba_id,))
    player_id = cur.fetchone()[0]
    
    # 3. Insert player stats with data validation
    # Clean and validate the data - FIXED VERSION
    def clean_numeric(value, allow_negative=False):
        if pd.isna(value) or value is None:
            return 0.0
        try:
            num_val = float(value)
            if allow_negative:
                return num_val  # Allow negative values for plus_minus
            else:
                return num_val if num_val >= 0 else 0.0  # Only return 0 if actually negative
        except (ValueError, TypeError):
            return 0.0
    
    def clean_percentage(value):
        """Special handling for percentages (should be 0-1)"""
        if pd.isna(value) or value is None:
            return 0.0
        try:
            num_val = float(value)
            return max(0.0, min(1.0, num_val))  # Cap between 0 and 1
        except (ValueError, TypeError):
            return 0.0
    
    # Prepare the stats data - FIXED TO INCLUDE MINUTES AND PROPER HANDLING
    stats_data = (
        player_id, season_id, team_id,
        clean_numeric(row.get('GP', 0)),                    # games_played
        clean_numeric(row.get('MIN', 0)),                   # total_minutes - FIXED: was missing
        clean_percentage(row.get('FG_PCT', 0)),             # field_goal_percentage (0-1)
        clean_percentage(row.get('FG3_PCT', 0)),            # three_point_percentage (0-1)
        clean_percentage(row.get('FT_PCT', 0)),             # free_throw_percentage (0-1)
        clean_numeric(row.get('REB', 0)),                   # total_rebounds
        clean_numeric(row.get('AST', 0)),                   # assists
        clean_numeric(row.get('TOV', 0)),                   # turnovers
        clean_numeric(row.get('STL', 0)),                   # steals
        clean_numeric(row.get('BLK', 0)),                   # blocks
        clean_numeric(row.get('PTS', 0)),                   # points - FIXED: no more cap
        clean_numeric(row.get('NBA_FANTASY_PTS', 0)),       # fantasy_points_standard - FIXED: no more cap
        clean_numeric(row.get('PLUS_MINUS', 0), allow_negative=True)  # plus_minus - FIXED: allows negative
    )
    
    # Debug print for problematic rows
    if index == 0:  # Print first row for debugging
        print(f"Sample stats data: {stats_data}")
    
    try:
        cur.execute("""
            INSERT INTO player_season_stats (
                player_id, season_id, team_id, games_played, total_minutes,
                field_goal_percentage, three_point_percentage, free_throw_percentage,
                total_rebounds, assists, turnovers, steals, blocks, points,
                fantasy_points_standard, plus_minus
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (player_id, season_id) DO UPDATE SET
                team_id = EXCLUDED.team_id,
                games_played = EXCLUDED.games_played,
                total_minutes = EXCLUDED.total_minutes,
                field_goal_percentage = EXCLUDED.field_goal_percentage,
                three_point_percentage = EXCLUDED.three_point_percentage,
                free_throw_percentage = EXCLUDED.free_throw_percentage,
                total_rebounds = EXCLUDED.total_rebounds,
                assists = EXCLUDED.assists,
                turnovers = EXCLUDED.turnovers,
                steals = EXCLUDED.steals,
                blocks = EXCLUDED.blocks,
                points = EXCLUDED.points,
                fantasy_points_standard = EXCLUDED.fantasy_points_standard,
                plus_minus = EXCLUDED.plus_minus
            """, stats_data)
    except Exception as e:
        print(f"Error inserting player {player_name} (index {index}): {e}")
        print(f"Stats data: {stats_data}")
        raise
    
    if index % 50 == 0:
        print(f"Processed {index} players...")

# Save everything
conn.commit()
cur.close()
conn.close()

print("✅ Done! All data imported.")