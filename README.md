# LifeRPG

LifeRPG is an application where users create accounts to define personal attributes they wish to hone and regular tasks ("quests") that earn experience points. These quests level both individual attributes and overall player level.

The leveling system rewards consistent quest completion to encourage habit formation. By emulating the feedback loop of RPGs, LifeRPG helps users feel more rewarded when accomplishing daily productivity goals.

The overarching goal is to help users who feel they'd benefit from such a system reap real-life progress towards their aspirational goals.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Overview

The database schema uses a relational design to manage users, tasks, attributes, and experience points. Key features include a strength rank system (E–S) for task multipliers, shared experience across player and attribute levels, and flexible habit scheduling via frequency and rest_frequency fields.

An overview of the database schema can be found in [DATABASE.md](DATABASE.md).

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
