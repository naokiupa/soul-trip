# Soul Trip - React Version

Korean travel itinerary application built with React, TypeScript, and Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Set up Supabase database:
Run the SQL commands in `supabase/schema.sql` in your Supabase SQL Editor to create the wishlist table and insert seed data.

4. Run the development server:
```bash
npm run dev
```

## Features

- 📅 3-day Korean travel itinerary (August 9-11, 2025)
- ✈️ Flight information display
- 📍 Activity scheduling with person-specific and shared activities
- ⭐ Interactive wishlist with persistent state
- 📱 Responsive design
- 🔄 Ready for Supabase integration

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS Modules
- Supabase (ready for integration)

## Project Structure

```
src/
├── components/      # React components
├── types/          # TypeScript type definitions
├── lib/            # External service configurations
├── App.tsx         # Main application component
├── App.module.css  # Application styles
└── main.tsx        # Application entry point
```