# Rowand's Tech Insights Blog

A modern tech blog built with Next.js, TypeScript, Tailwind CSS, and Supabase. This blog focuses on technical content related to AI, data engineering, hardware integrations, and enterprise solutions.

## Features

- Responsive design for all devices
- Blog posts with Markdown support
- Category filtering
- Projects showcase
- About page
- Newsletter subscription
- Supabase integration for data storage

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel (recommended)
- **Content**: Markdown with React Markdown

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rowandmohammad/tech-blog.git
   cd tech-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `src/app`: Contains all the pages and API routes
- `src/components`: Reusable UI components
- `src/lib`: Utility functions, hooks, and contexts
  - `src/lib/blog`: Blog-related utilities
  - `src/lib/supabase`: Supabase client and utilities

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the environment variables
4. Deploy

## Supabase Setup

For the blog to work with Supabase, you'll need to create the following tables:

### Posts Table

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL,
  author_image TEXT,
  cover_image TEXT
);
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Rowand Mohammad - [GitHub](https://github.com/rowandmohammad) | [LinkedIn](https://linkedin.com/in/rowandmohammad)
