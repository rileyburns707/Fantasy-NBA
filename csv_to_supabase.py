import pandas as pd
import psycopg2
import os
from dotenv import load_dotenv # Import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database credentials from environment variables
SUPABASE_HOST = os.getenv("SUPABASE_HOST")
SUPABASE_PORT = os.getenv("SUPABASE_PORT")
SUPABASE_DBNAME = os.getenv("SUPABASE_DBNAME")
SUPABASE_USER = os.getenv("SUPABASE_USER")
SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD")

# Add a check to ensure essential variables are loaded
if not all([SUPABASE_HOST, SUPABASE_PORT, SUPABASE_DBNAME, SUPABASE_USER, SUPABASE_PASSWORD]):
    raise ValueError("One or more Supabase environment variables are not set. Please ensure your .env file is correctly configured")

# Database connection
conn = None # Initialize conn to None for finally block safety
try:
    conn = psycopg2.connect(
        host=SUPABASE_HOST,
        port=SUPABASE_PORT,
        database=SUPABASE_DBNAME,
        user=SUPABASE_USER,
        password=SUPABASE_PASSWORD
    )
    conn.autocommit = True
    cur = conn.cursor()

    # Read CSV
    df = pd.read_csv('nba_fantasy_stats_with_positions.csv')

    # Get current season ID (assuming 2024-25 season exists)
    cur.execute("SELECT id FROM seasons WHERE season_year = '2024-25'")
    season_id_result = cur.fetchone()
    if season_id_result:
        season_id = season_id_result[0]
    else:
        # Handle case where season doesn't exist. You could insert it:
        print("Season '2024-25' not historical seasons. Inserting it now...")
        # Make sure these dates are appropriate for a new season entry
        cur.execute("INSERT INTO seasons (season_year, start_date, end_date, is_current) VALUES (%s, %s, %s, %s) RETURNING id",
                    ('2024-25', '2024-10-01', '2025-06-30', True)) # Adjust dates as necessary
        season_id = cur.fetchone()[0]
        conn.commit() # Commit the new season insertion
        print(f"Inserted season 2024-25 with ID: {season_id}")


    print(f"Processing {len(df)} players...")

    # Process each row
    for index, row in df.iterrows():
        # 1. Insert team (check if exists first)
        team_abbr = row['TEAM_ABBREVIATION']
        
        # Check if team already exists
        cur.execute("SELECT id FROM teams WHERE name = %s", (team_abbr,))
        team_result = cur.fetchone()
        
        if team_result is None:
            # Team doesn't exist, insert it
            cur.execute("""
                INSERT INTO teams (name) 
                VALUES (%s)
                RETURNING id; -- Use RETURNING id to get the new ID directly
            """, (team_abbr,))
            team_id = cur.fetchone()[0]
        else:
            team_id = team_result[0]
        
        # 2. Insert player (update if already exists)
        player_nba_id = int(row['PLAYER_ID'])
        player_name = row['PLAYER_NAME']
        position = row['POSITION'] if pd.notna(row['POSITION']) else 'UNKNOWN'
        
        # Split name into first and last name
        name_parts = player_name.split(' ', 1)
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
            RETURNING id; -- Use RETURNING id to get the player's internal ID directly
        """, (player_nba_id, first_name, last_name, player_name, position, team_id))
        
        # Get player internal ID directly from the INSERT/UPDATE statement
        player_id = cur.fetchone()[0]
        
        # 3. Insert player stats with data validation
        def clean_numeric(value, allow_negative=False):
            if pd.isna(value) or value is None:
                return 0.0
            try:
                num_val = float(value)
                if allow_negative:
                    return num_val
                else:
                    return num_val if num_val >= 0 else 0.0
            except (ValueError, TypeError):
                return 0.0
        
        def clean_percentage(value):
            if pd.isna(value) or value is None:
                return 0.0
            try:
                num_val = float(value)
                return max(0.0, min(1.0, num_val))
            except (ValueError, TypeError):
                return 0.0
        
        stats_data = (
            player_id, season_id, team_id,
            clean_numeric(row.get('GP', 0)),
            clean_numeric(row.get('MIN', 0)),
            clean_percentage(row.get('FG_PCT', 0)),
            clean_percentage(row.get('FG3_PCT', 0)),
            clean_percentage(row.get('FT_PCT', 0)),
            clean_numeric(row.get('REB', 0)),
            clean_numeric(row.get('AST', 0)),
            clean_numeric(row.get('TOV', 0)),
            clean_numeric(row.get('STL', 0)),
            clean_numeric(row.get('BLK', 0)),
            clean_numeric(row.get('PTS', 0)),
            clean_numeric(row.get('NBA_FANTASY_PTS', 0)),
            clean_numeric(row.get('PLUS_MINUS', 0), allow_negative=True)
        )
        
        if index == 0:
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
                    plus_minus = EXCLUDED.plus_minus,
                    updated_at = CURRENT_TIMESTAMP -- Add this to update the timestamp on conflict
                """, stats_data)
        except Exception as e:
            print(f"Error inserting player {player_name} (index {index}): {e}")
            print(f"Stats data: {stats_data}")
            raise
        
        if index % 50 == 0:
            print(f"Processed {index} players...")

    print("Data loading loop completed.")
    conn.commit() # Ensure a final commit for any remaining uncommitted transactions
    print("Final commit successful.")

except Exception as e:
   print(f"Error connecting to Supabase or loading data: {e}")
   if conn: # Check if conn was successfully established before trying to rollback
       conn.rollback() # Rollback on error
       print("Transaction rolled back due to error.")

finally:
   if conn: # Check if conn exists and is not None
       if not cur.closed: # Check if cursor is not already closed
           cur.close()
       if not conn.closed: # Check if connection is not already closed
           conn.close()
       print("Database connection closed.")
   print("✅ Done! Data import process finished.")