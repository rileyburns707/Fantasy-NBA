'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  useEffect(() => {
    // Define an asynchronous function to fetch the teams data
    const fetchTeams = async () => {
      // Use the 'supabase' client to query the 'teams' table.
      // We are selecting all columns and limiting the result to the first 5 rows.
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .limit(5);

      // Check for errors and log them to the console
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // Log the fetched data to the console to confirm a successful connection
        console.log('Successfully fetched teams data:', data);
      }
    };

    // Call the function to initiate the data fetch
    fetchTeams();
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p>Checking Supabase Connection...</p>
        <p>Check the browser console (F12) for the results.</p>
      </div>
    </main>
  );
}
