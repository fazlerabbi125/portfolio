# Fazle Rabbi Faiyaz — Portfolio & Personal Platform

A full-stack personal portfolio and developer platform built with Next.js 16 (App Router), React 19, TypeScript, Drizzle ORM, PostgreSQL, and Base UI / Tailwind CSS.

## 📖 About the Project

This portfolio showcases professional software engineering experience, academic background, creative project galleries (photo and video), a contact messaging channel, and a complete blog publishing platform featuring cookie-based session authentication, role-based authorization, category taxonomy, and search functionality.

## ✨ Key Features

- **Home Page**: Personal profile showcase, avatar, downloadable resume, quick navigation grid, and external professional profiles (GitHub, LinkedIn).
- **About**: Background summary, skills & technologies taxonomy, framework proficiencies, and personal interests.
- **Education & Experience**: Chronological educational milestones and work experience entries.
- **Media Galleries**:
  - **Pictures Gallery**: Responsive photo gallery with infinite scrolling.
  - **Video Gallery**: Responsive video showcase with native/streaming player integrations.
- **Blog & Content Platform**:
  - **Authentication & Authorization**: Session-based auth via `iron-session` and Argon2 password hashing. Admins are seeded into the database, and visitors can register or log in.
  - **Role-Based Access**: Logged-in members can read posts; Admin users have full CRUD permissions over articles and categories.
  - **Post Cards & Presentation**: List cards display post title (line-clamped to at most 2 lines via CSS), publication date, and category tag.
  - **Post Details**: Dedicated view at `/blog/[id]` displaying full formatted content, category badge, publication timestamp, and optional cover image.
  - **Category Management**: Add, edit, and delete categories directly via interactive modals and confirmation dialogs.
  - **Article Management**: Create and edit posts via accessible dialogs; delete posts with safe confirmation dialogs.
  - **Search & Pagination**: Real-time search across titles and content with server-side pagination.
- **Contact & Messaging**: Contact form with validation via Zod, React Hook Form, and Resend email integration.
- **Navigation & Layout**: Universal navigation header with dynamic submenus and social share dialog (LinkedIn, WhatsApp, Facebook).

## 📁 Project Structure

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
│   │   │   └── [id]/             # Dynamic article detail page
│   │   ├── contact/              # Contact form page
│   │   ├── education/            # Education background page
│   │   ├── gallery/              # Media galleries
│   │   │   ├── pictures/         # Photo gallery with infinite scroll
│   │   │   └── videos/           # Video gallery
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
│   ├── hooks/                    # Custom React hooks (useInfiniteScroll)
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

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`
- **PostgreSQL Database**: Any Postgres instance (Neon, Supabase, local PostgreSQL, or Vercel Postgres)

### 2. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

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

### 3. Database Migration and Seeding

Run the database migrations and seed the initial admin account:

```bash
# Apply migrations to PostgreSQL
pnpm db:migrate

# Seed the default admin user
pnpm db:seed src/drizzle/seed/user.seed.ts
```

### 4. Running the Development Server

Start the local Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🛠️ Scripts

- `pnpm dev`: Start Next.js development server
- `pnpm build`: Generate production build with TypeScript and Turbopack checks
- `pnpm start`: Launch production server
- `pnpm lint`: Run Biome linter across all project files
- `pnpm format`: Auto-format all project files with Biome
- `pnpm db:generate`: Generate new Drizzle SQL migration based on schema changes
- `pnpm db:migrate`: Run pending migrations against target database

## 🌐 Deployment via Vercel

1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your portfolio repository and import it.
4. Under **Environment Variables**, provide all variables specified in `.env.example` (including `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, etc.).
5. Ensure your PostgreSQL database permits incoming connections from Vercel serverless IPs (or use a serverless Postgres provider like Neon or Supabase with connection pooling).
6. Click **Deploy**. Vercel will run `pnpm build` and publish your portfolio with full dynamic server-side rendering support.
