## Sunset in Munich

A tiny, cute mobile-first Next.js site that shows the next sunset forecast (quality, cloud cover, golden/blue hour) for a specific balcony in Munich.

Data source: [Sunsethue API docs](https://documenter.getpostman.com/view/39964523/2sAYBUDY4W).

### Setup

1. Create your env file:

```bash
cd projects/sunset-in-munich
cp .env.local.example .env.local
```

2. Put your Sunsethue key into `.env.local`:

```bash
SUNSETHUE_API_KEY=9240501b1ceb741dcd2f9f947b93ef3d
```

### Run

```bash
cd projects/sunset-in-munich
npm run dev
```

Open `http://localhost:3000`.

### Notes

- The API key is used **server-side** (React Server Component), so it won’t be exposed in the browser.
- Coordinates are hard-coded in `src/lib/sunsethue.ts`.

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
