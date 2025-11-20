# Fantasy NBA

Fantasy NBA is a full-stack application for modern basketball analytics. It was designed by using Python to scrape and clean a complete historical dataset of NBA match statistics for  560 players. The data is persisted in a scalable PostgreSQL database hosted on Supabase, and dynamically consumed by a frontend built with Next.js and React. The project is divided into three main components: Data Scraping, Backend, and Frontend.

<img width="1407" alt="Screenshot 2025-11-19 at 9.55.24 PM" src="https://github.com/rileyburns707/Fantasy-NBA/blob/main/Frontend/public/Screenshot%202025-11-19%20at%209.55.24%E2%80%AFPM.png">

You can find the [project here!](https://fantasy-nba-azure.vercel.app/)  
Note: The backend is currently being hosted for free on Supabase and will timeout if it goes 2 weeks with no calls

## Features
 
-   **Data Scraping (Python/Pandas):** Engineered a pipeline using nba_api and pandas to scrape and clean a complete historical dataset of 560 players' full-season statistics. The pipeline combines data endpoints to avoid over 600 individual API calls, preventing potential rate-limiting errors during the initial data load.
-   **Database and Backend (PostgreSQL/Supabase):** Designed a relational schema of four interconnected tables to host the static player data efficiently. Implemented PostgreSQL SQL for rapid filtering, sorting, and on-demand calculation of fantasy points based on the static dataset.
-   **Frontend  (Next.js/React):** Developed a responsive and unique UI/UX using the Next.js App Router framework. Core features include searching/filtering (by team and position) and dynamic player detail pages, all with consistent styling.
-   **Deployment & CI/CD (Vercel):** Hosted the database on the Supabase free tier and deployed the application live on Vercel, utilizing a CI/CD pipeline for automatic updates upon code changes.
