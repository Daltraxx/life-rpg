# LifeRPG

LifeRPG is an application where users create accounts to define personal attributes they wish to hone and regular tasks ("quests") that earn experience points. These quests level both individual attributes and overall player level.

The leveling system rewards consistent quest completion to encourage habit formation. By emulating the feedback loop of RPGs, LifeRPG helps users feel more rewarded when accomplishing daily productivity goals.

The overarching goal is to help users who feel they'd benefit from such a system reap real-life progress towards their aspirational goals.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Overview

### Tables

- **strength_levels**: Lookup table for strength rank multipliers (E-S)
  - `level`: Primary key, strength rank enum (E, D, C, B, A, S)
  - `multiplier`: Decimal multiplier for experience calculation
  - `updated_at`: Timestamp of last update

- **users**: Core user accounts with level and experience tracking
  - `id`: UUID, references auth.users
  - `username`: Username (max 50 chars)
  - `usertag`: Unique usertag (max 50 chars)
  - `created_at`: Account creation timestamp
  - `last_login`: Last login timestamp
  - `verified`: Account verification status
  - `profile_complete`: Whether user has defined their tasks (default false)
  - `level`: Overall player level (default 1)
  - `experience`: Total experience points
  - `updated_at`: Timestamp of last update

- **user_attributes**: Player-defined attributes that level independently
  - `id`: Serial primary key
  - `user_id`: References users table
  - `name`: Attribute name (max 50 chars, unique per user)
  - `level`: Attribute level (default 1)
  - `experience`: Attribute experience points
  - `created_at`: Creation timestamp
  - `updated_at`: Timestamp of last update

- **tasks**: Quests assigned by users with frequency, streak, and strength mechanics
  - `id`: Serial primary key
  - `user_id`: References users table
  - `name`: Task name (max 200 chars)
  - `description`: Optional task description
  - `created_at`: Creation timestamp
  - `is_completed`: Completion status
  - `frequency`: How often task must be completed (min 0)
  - `rest_frequency`: Allowed rest days without streak reset (min 0)
  - `last_rest_date`: Date of last rest day
  - `experience_share`: Base points value (0-100)
  - `streak`: Current streak count
  - `strength_points`: Accumulated strength points
  - `strength_level`: Current strength rank (E-S)
  - `last_completed_date`: Date of last completion
  - `updated_at`: Timestamp of last update

- **task_completions**: Records each task completion with streak and experience earned
  - `id`: Serial primary key
  - `task_id`: References tasks table
  - `completed_at`: Completion timestamp
  - `streak_count`: Streak at time of completion
  - `experience_earned`: Experience points awarded
  - `updated_at`: Timestamp of last update

- **experience_log**: Audit trail of all experience transactions
  - `id`: Serial primary key
  - `user_id`: References users table
  - `task_id`: References tasks table (nullable)
  - `experience_amount`: Experience points in transaction
  - `reason`: Description of transaction
  - `created_at`: Transaction timestamp

- **tasks_attributes**: Junction table linking tasks to attributes with power multipliers
  - `id`: Serial primary key
  - `user_id`: References users table
  - `task_id`: References tasks table
  - `attribute_id`: References user_attributes table
  - `attribute_power`: Power multiplier (default 1)
  - `updated_at`: Timestamp of last update
  - Unique constraint on (task_id, attribute_id)

### Key Features

- Strength rank system (E-S) applies experience multipliers to task rewards
- Frequency and rest_frequency fields support flexible habit scheduling
- Experience shared across user level, individual attributes, and task streaks
- Cascading deletes maintain referential integrity when users or tasks are removed
- Trigger upon insertion to Supabase auth.users that inserts user to project users table

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
