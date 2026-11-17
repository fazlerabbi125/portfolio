# Fazle Rabbi Faiyaz — Digital Portfolio

[![Validate and deploy](https://github.com/fazlerabbi125/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/fazlerabbi125/portfolio/actions/workflows/ci.yml)

A full-stack portfolio created for CS5709 Software Engineering Evolution. The application uses Next.js App Router, React, TypeScript, Drizzle ORM, PostgreSQL, Tailwind CSS, and Base UI.

## Project scope

The portfolio presents professional information and media while providing a database-backed blog. It separates the static public portfolio from authenticated blog administration and user favourites.

- Public visitors and recruiters can review the profile, education, experience, galleries, blog posts, and contact form.
- Blog readers can search and filter posts, register, sign in, and manage favourites.
- Administrators can manage posts and categories through protected controls.

Light theme is the default. A selected dark theme is stored in an `app-theme` cookie so the server renders the correct colour tokens before the first paint.

## Features

- Responsive home, about, education, work-experience, contact, photo, and video pages.
- Education and work timelines with dates to the left of the timeline marker.
- A 72-item picture gallery: 22 existing records and 50 supplied mock-image records. Every thumbnail and lightbox image is lazy loaded.
- CSS view-timeline picture-card reveals, with a visible non-animated fallback where the feature is unavailable.
- Video gallery with reusable pagination controls.
- Dynamic blog backed by PostgreSQL: public reading, combined search/category filtering, detail views, and observer-driven infinite scrolling for the blog and favourites.
- Session authentication with Argon2 password hashing, role checks, profile editing, password change, and favourites.
- Validated contact delivery through Resend.
- GSAP ScrollTrigger staggered reveals for portfolio timeline, skills, and certification content.
- Jest component/page smoke tests, Biome, TypeScript checks, and GitHub Actions validation/deployment.

## Routes

| Route file | URL | Responsibility |
| --- | --- | --- |
| `src/app/layout.tsx` | All routes | Defines root metadata, font/theme setup, toaster, and shared application layout. |
| `src/app/page.tsx` | `/` | Renders the profile hero and navigation cards. |
| `src/app/about/page.tsx` | `/about` | Renders biography, skills, technology proficiency, and certifications from static data. |
| `src/app/education/page.tsx` | `/education` | Renders the academic timeline from static data. |
| `src/app/work-experience/page.tsx` | `/work-experience` | Renders the professional-experience timeline from static data. |
| `src/app/contact/page.tsx` | `/contact` | Hosts the validated contact form. |
| `src/app/gallery/pictures/page.tsx` | `/gallery/pictures` | Loads picture data and renders the responsive lazy-loaded gallery. |
| `src/app/gallery/videos/page.tsx` | `/gallery/videos` | Loads video data and renders the paginated video gallery. |
| `src/app/blog/page.tsx` | `/blog` | Fetches initial posts/categories and renders the filterable infinite blog list. |
| `src/app/blog/[id]/page.tsx` | `/blog/:id` | Loads and renders one blog post, its optional image, and its actions. |
| `src/app/blog/favorites/page.tsx` | `/blog/favorites` | Loads the signed-in user's initial favourites list. |

## Source structure

| Directory | Responsibility |
| --- | --- |
| `src/actions` | Server Actions for authentication, blog mutations/favourites, and contact email. These validate input and enforce permissions before writes. |
| `src/app` | App Router pages, layouts, metadata, and global semantic theme styles. |
| `src/components` | Presentation and interactive UI, grouped by feature (`blog`, `gallery`, `home`, `contact`, `common`) plus reusable `ui` primitives. |
| `src/data` | Versioned static JSON content for profile, timelines, and galleries. |
| `src/drizzle` | Database client, schema, relations, migrations, and repeatable seed scripts. |
| `src/hooks` | Client-side reusable behaviour, currently including infinite-scroll observation. |
| `src/lib` | Cross-cutting utilities, constants, and session configuration. |
| `src/queries` | Read-only database queries used by Server Components and Server Actions. |
| `src/schemas` | Zod validation schemas shared by forms and server-side operations. |
| `src/types` | Shared TypeScript contracts used across data, actions, and presentation components. |
| `__tests__` | Jest tests for database-independent pages and reusable UI behaviour. |
| `docs` | Assessment report, report outline, and supporting academic evidence. |
| `.github/workflows` | Pull-request validation and `main` deployment workflow. |

## Architecture

Server Components read static content and database queries. Client Components own interaction such as dialogs, filtering, infinite scrolling, and theme switching. Server Actions are the write boundary: they validate with Zod, obtain the session, check roles where needed, and then use Drizzle to update PostgreSQL.

```mermaid
flowchart LR
    Browser[React client components] --> Pages[App Router server pages]
    Browser --> Actions[Server Actions]
    Pages --> Queries[Read-only queries]
    Actions --> Schemas[Zod schemas]
    Actions --> Session[iron-session]
    Queries --> DB[Drizzle / PostgreSQL]
    Actions --> DB
    Actions --> Email[Resend]
    Pages --> JSON[Static JSON data]
```

## Setup

### Requirements

- Node.js 22.13.0 or newer
- pnpm 12.5.1
- PostgreSQL 15 or newer
- A working native toolchain if an Argon2 prebuilt binary is unavailable

### Install and configure

```bash
pnpm install --frozen-lockfile
cp .env.example .env
```

Set the environment variables required by the deployed services:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?sslmode=disable"
SESSION_SECRET="<generate-a-unique-random-secret-of-at-least-32-characters>"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="SecureAdminPassword123!"
ADMIN_NAME="Administrator"
RESEND_API_KEY="re_..."
CONTACT_RECEIVER_EMAIL="your-email@example.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a unique session secret with `openssl rand -base64 32`; do not reuse
the placeholder value.

Apply the database schema and seed the administrator:

```bash
pnpm db:migrate
pnpm db:seed src/drizzle/seed/user.seed.ts
pnpm dev
```

`register()` always creates a `user`; the seeded account is the only route to an `admin` role. When the schema changes, run `pnpm db:generate` before migrating.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Produce the production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | Run Biome checks. |
| `pnpm format` | Apply Biome formatting. |
| `pnpm test` | Run the Jest suite once. |
| `pnpm test:watch` | Run Jest in watch mode. |
| `pnpm db:generate` | Generate a migration from schema changes. |
| `pnpm db:migrate` | Apply pending migrations. |
| `pnpm db:seed <file>` | Execute a seed script with `tsx`. |

## Testing and accessibility

Jest uses `next/jest`, jsdom, Testing Library, and `jest-dom`. The current tests deliberately cover only synchronous, database-independent route composition and the shared search input; database/authentication workflows need an isolated test database and remain a planned integration-test extension.

Manual acceptance checks cover phone, tablet, laptop, and desktop layouts; keyboard focus; semantic labels; visible control states; filter/reset behaviour; theme persistence; and lazy gallery images. The design uses semantic CSS tokens, rather than `prefers-color-scheme`, and does not use colour as the only indicator of state.

### Documentation conventions

The codebase uses concise JSDoc for public server actions, queries, session and utility functions, route functions, shared contracts, and tests. Comments are reserved for non-obvious security checks, query behaviour, and asynchronous safeguards; self-explanatory presentation code is kept clear through feature-based structure and descriptive names.

## Continuous integration and deployment

GitHub stores the source repository and GitHub Actions runs on every pull request and on `main` pushes:

1. frozen dependency install;
2. Biome;
3. TypeScript with `tsc --noEmit`;
4. Jest;
5. production build.

After a successful `main` validation, the deploy job builds and deploys the Vercel production artifact. The live portfolio is hosted on [Vercel](https://portfolio-phi-red-18.vercel.app/). Configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub secrets. Keep `DATABASE_URL`, `SESSION_SECRET`, and Resend credentials in Vercel environment variables, never in the repository.

## Technology choices

- Next.js 16 App Router, React 19, and TypeScript
- PostgreSQL, Drizzle ORM, and Drizzle Kit
- iron-session, Argon2, Zod, React Hook Form
- Tailwind CSS, Base UI, Lucide, and semantic CSS custom properties
- GSAP ScrollTrigger, CSS scroll-driven animations, and Next Image
- Resend, Biome, Jest, Testing Library, and GitHub Actions
