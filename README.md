# 🧪 Friend Trap Lab

**Send your friend a tiny brain trap.** If they fall for it, science gets a
point. If they escape, they get revenge.

Live at **[distilledai.org](https://distilledai.org)** — a
[Distilled Science](https://www.youtube.com/@DistilledScience) experiment by
Avisha NessAiver. Motto: *"Cite or it didn't happen."*

## What this is

A viral friend-to-friend game built around real judgment-and-decision-making
research. You arm one of eight "brain traps" (anchoring, framing, base-rate
neglect, confirmation bias, availability, sunk cost, decoy effect,
overconfidence), personalize the bait, and send a link. Your friend takes a
20-second challenge, gets a cinematic trapped-or-escaped reveal, learns the
actual science with a citation, and is handed a revenge button.

## The transparency story

This entire application — product design, game logic, copy, UI, database
layer, email integration, OG image generation, deployment — was built by an
AI coding agent in a single session, starting from an empty directory plus a
written prompt.

The human did the boring plumbing first: domain, GitHub/Vercel auth, Beehiiv
API credentials, an Upstash Redis database, and a `.secrets` file. The
complete prompt and those exact setup steps are free by email — there's a
form on the site.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + Framer Motion
- [Iconify](https://icon-sets.iconify.design/) icons (Tabler / MDI / Game Icons),
  baked to SSR-safe SVG data by `scripts/gen-icons.mjs` so the same icons render
  in the UI and the OG images with zero runtime fetching
- [Upstash Redis](https://upstash.com) for anonymous trap/attempt storage
- [Beehiiv](https://beehiiv.com) V2 API for newsletter signup
- [`@vercel/og`](https://vercel.com/docs/og-image-generation) for dynamic share cards
- Deployed on [Vercel](https://vercel.com)

## Running it yourself

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

Required env vars (see `.env.example`): Upstash Redis REST credentials,
Beehiiv API key + publication id, an `ADMIN_SECRET` for the dashboard, and
`NEXT_PUBLIC_SITE_URL`.

## Honest design notes

- No accounts, no friend-email harvesting, no dark patterns. Email capture
  happens *after* value is delivered, and never gates the game.
- Trap/attempt data is anonymous; raw IPs are never stored.
- Every scientific claim has a citation — see [/sources](https://distilledai.org/sources).
- The roasts are kind. The jellybean jar is fictional. The arithmetic is not.

## License

MIT — steal the experiment, that's the point.
