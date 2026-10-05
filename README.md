# Fazle Rabbi Faiyaz — Portfolio

A full-stack personal portfolio built with Next.js 16 (App Router), React 19, TypeScript, Drizzle ORM, PostgreSQL, and Base UI / Tailwind CSS.

## About the Project

A full-stack personal portfolio platform with blogging capabilities. It combines a static content layer (profile, about, education, work experience, photo and video galleries) with a dynamic blogging featured backed by PostgreSQL — covering session authentication, role-based authorization, marking posts as favorite, and searching and pagination.

## Key Features

- **Home (`/`)**: Hero profile with resume view, contact link, and links to GitHub/LinkedIn, plus a card grid for quick navigation.
- **About (`/about`)**: Biography, skills and technologies grouped by category, framework proficiencies, and certifications`.
- **Education (`/education`)**: Chronological academic timeline.
- **Work Experience (`/work-experience`)**: Career timeline.
- **Galleries**:
  - **Pictures (`/gallery/pictures`)**: Responsive photo grid
  - **Videos (`/gallery/videos`)**: Playlist-driven gallery with a single active video player.
- **Blog (`/blog`, `/blog/[id]`, `/blog/favorites`)**:
  - **Authentication**: Session-based auth via `iron-session` with Argon2 password hashing. Admins are seeded through a script; visitors can register or log in from a tabbed dialog.
  - **Role-Based Access**: Two roles — `admin` and `user`. Admins get full CRUD over posts and categories; users can favorite posts; all posts are publicly readable.
  - **Post Management**: CRUD pushs as an admin in a single reused dialog with guarded deletes.
  - **Favorites**: User with role `user` can be mark a post as favorite.
- **Contact (`/contact`)**: Validated contact form that delivers submissions through the Resend API.

## Project Structure

```text
portfolio/
├── src/
│   ├── actions/                  # Next.js Server Actions
│   │   ├── auth/                 # Consolidated authentication actions (login, register, logout)
│   │   ├── blog/                 # Blog post and category CRUD & search queries
│   │   └── contact/              # Contact form email delivery actions
│   ├── app/                      # Next.js App Router pages and layouts
│   │   ├── about/                # About page
│   │   ├── blog/                 # Blog list and search
│   │   │   ├── [id]/             # Dynamic post detail page
│   │   │   └── favorites/        # Signed-in user's favorited posts
│   │   ├── contact/              # Contact form page
│   │   ├── education/            # Education background page
│   │   ├── gallery/              # Media galleries
│   │   │   ├── pictures/         # Photo grid with lightbox and "Load more"
│   │   │   └── videos/           # Video playlist gallery
│   │   ├── work-experience/      # Career and experience timeline
│   │   ├── layout.tsx            # Global root layout with AppHeader and AppFooter
│   │   └── page.tsx              # Home / profile landing page
│   ├── components/               # React UI components
│   │   ├── blog/                 # PostCard, PostList, AuthTabs, LoginForm, RegistrationForm, PostModal, CategoryModal, SearchBar
│   │   ├── common/               # AppLayout, AppHeader, AppFooter
│   │   ├── contact/              # ContactForm
│   │   ├── home/                 # ProfileHeader, NavigationGrid
│   │   └── ui/                   # Reusable primitive UI components (Button, Dialog, Card, Badge)
│   ├── drizzle/                  # Drizzle ORM configuration & database schemas
│   │   ├── migrations/           # SQL migration files
│   │   ├── seed/                 # Database seed scripts (admin user creation)
│   │   ├── db.ts                 # Database pool connection instance
│   │   ├── relations.ts          # Relational definitions
│   │   └── schema.ts             # Tables: users, categories, posts, userFavorites
│   ├── data/                     # Static JSON content: about, education, experience, videos
│   ├── lib/                      # Core helpers, constants, session management
│   │   ├── constants.ts          # App configuration, links, and navigation
│   │   ├── session.ts            # Typed iron-session configuration and auth helpers
│   │   └── utils.ts              # General utilities
│   └── schemas/                  # Zod validation schemas
│       ├── auth.schema.ts        # Login & registration schemas
│       ├── blog.schema.ts        # Post & category schemas
│       └── contact.schema.ts     # Contact form schema
├── drizzle.config.ts             # Drizzle Kit migration configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and build scripts
└── tsconfig.json                 # TypeScript compiler configuration
```

## Setup

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `pnpm` (the project pins `pnpm@12.5.1`); `npm` and `yarn` also work
- **PostgreSQL 15+**: Any Postgres instance — local, Neon, Supabase, or Vercel Postgres
- **Native toolchain**: `argon2` is a native module; its build script is allowlisted in `pnpm-workspace.yaml`, so a prebuilt binary or a working C++ toolchain is required

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Ensure the following variables are defined:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?sslmode=disable"
SESSION_SECRET="complex_32_character_long_password_secret_here"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="SecureAdminPassword123!"
ADMIN_NAME="Administrator"
RESEND_API_KEY="re_..."
CONTACT_RECEIVER_EMAIL="your-email@example.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Apply database migrations

Drizzle Kit applies the committed SQL migrations in `src/drizzle/migrations/`:

```bash
pnpm db:migrate
```

When you change `src/drizzle/schema.ts`, generate a new migration first:

```bash
pnpm db:generate
```

### 4. Seed the administrator account

Admins are never created through the UI — the registration action always assigns the `user` role. Seed the admin with:

```bash
pnpm db:seed src/drizzle/seed/user.seed.ts
```

The script is idempotent: it skips insertion if a user with `ADMIN_EMAIL` already exists.

Optionally, seed sample blog content. Note that this script does **not** load `.env` itself, so `DATABASE_URL` must already be exported in your shell:

```bash
pnpm db:seed src/drizzle/seed/post.seed.ts
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Production build (runs TypeScript checks via Next.js) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run Biome checks across the project |
| `pnpm format` | Format files with Biome |
| `pnpm db:generate` | Generate a SQL migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations to the target database |
| `pnpm db:seed <file>` | Run a seed script through `tsx` (the file argument is required) |
| `pnpm prepare` | Husky install hook, invoked automatically on install |

### Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 and the React Compiler enabled
- **Language**: TypeScript
- **Database**: PostgreSQL via `pg` and Drizzle ORM
- **Auth**: `iron-session` cookies with Argon2 password hashing
- **Validation**: Zod schemas shared between Server Actions and React Hook Form
- **UI**: Base UI primitives in shadcn/ui
- **Linting**: Biome (linter and formatter)
- **Email**: Email configuration via Resend for contact page.
- **Video**: `@videojs/react` with the YouTube IFrame player tech

