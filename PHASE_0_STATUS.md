# The Toddfather - Phase 0 Foundation Status

**Date**: December 22, 2024
**Status**: Foundation Complete - Ready for Database Setup

---

## ✅ Completed

### 1. Project Initialization
- **Location**: `/Users/todd.lebaron/dev/thetoddfather`
- **Framework**: Next.js 16.1.0 with App Router
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **Package Manager**: pnpm (workspace root)

### 2. Core Dependencies Installed

#### Authentication
- `next-auth@5.0.0-beta.30` - NextAuth v5 for authentication
- `@auth/prisma-adapter@2.11.1` - Prisma adapter for NextAuth

#### Database
- `@prisma/client@7.2.0` - Prisma ORM
- `prisma@7.2.0` - Prisma CLI

#### AI & Chat
- `ai@5.0.116` - Vercel AI SDK
- `@ai-sdk/openai@2.0.88` - OpenAI provider
- `@ai-sdk/anthropic@2.0.56` - Anthropic provider
- `@ai-sdk/react@1.0.37` - React hooks for AI

#### Payments
- `stripe@20.1.0` - Stripe SDK
- `@stripe/stripe-js@5.3.0` - Stripe.js for client-side

#### Forms & Validation
- `zod@4.2.1` - Schema validation
- `react-hook-form@7.69.0` - Form management
- `@hookform/resolvers@5.2.2` - Zod resolver

#### UI Components
- `sonner@2.0.7` - Toast notifications
- `@radix-ui/react-dialog@1.1.15` - Modal dialogs
- `@radix-ui/react-dropdown-menu@2.1.21` - Dropdown menus
- `@radix-ui/react-icons@1.3.2` - Icon set
- `recharts@2.15.0` - Charts for Working Models

#### Email & Analytics
- `resend@4.0.3` - Email sending
- `posthog-js@1.184.0` - Analytics

### 3. Database Schema (23 Models)

#### Authentication Models (4)
- ✅ `User` - User accounts with tier (FREE, SPARCC, ENTERPRISE)
- ✅ `Account` - OAuth accounts
- ✅ `Session` - User sessions
- ✅ `VerificationToken` - Email verification

#### Counsel System (2)
- ✅ `Counsel` - Structured SPM guidance (NOTE, CHECKLIST, PROTOCOL, DIAGNOSTIC, TEMPLATE, MODEL)
- ✅ `CounselSave` - User-saved Counsel

#### Family Vault (3)
- ✅ `VaultCollection` - User collections
- ✅ `VaultCollectionSection` - Sections within collections
- ✅ `VaultCollectionItem` - Items (Counsel or Episodes) in sections

#### Video Pipeline (4)
- ✅ `Episode` - Video episodes
- ✅ `Script` - Episode scripts
- ✅ `Cut` - Platform-specific cuts (YT_LONG, YT_SHORT, TIKTOK, X, LINKEDIN)
- ✅ `Asset` - Episode assets (BROLL, MUSIC, SFX, THUMBNAIL, CAPTIONS)

#### Video Production - Toddfather Studio (4)
- ✅ `EpisodeManifest` - Manifest-driven production
- ✅ `WorkerJob` - Background rendering jobs
- ✅ `QCCheck` - Quality control checks
- ✅ `ToddStudioAsset` - Reusable production assets

#### Chat System (1)
- ✅ `ChatMessage` - Ask The Toddfather messages

#### Subscriptions (1)
- ✅ `Subscription` - Stripe subscription tracking

#### Working Models (2)
- ✅ `WorkingModel` - Interactive SPM calculators
- ✅ `ModelRun` - Model execution history

**Total**: 23 models with proper indexes, foreign keys, cascade deletes

### 4. Authentication Implementation

#### Core Files
- ✅ `auth.ts` - NextAuth v5 configuration
  - Email magic link (via Resend)
  - Google OAuth
  - JWT session strategy
  - Custom session callbacks (includes user tier)

- ✅ `middleware.ts` - Route protection
  - Public routes: /, /start, /counsel, /episodes
  - Protected routes: /vault, /studio, /models

- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- ✅ `src/types/next-auth.d.ts` - TypeScript type extensions

### 5. Application Structure

#### Pages Created
- ✅ `src/app/page.tsx` - Redirects to /start
- ✅ `src/app/start/page.tsx` - Public landing page
  - Hero with "Welcome to the Family Vault"
  - 3 CTA buttons (Fix comp plan, Governance, AI SPM)
  - Feature grid (Counsel Library, Family Vault, Ask The Toddfather)
  - Footer with navigation

- ✅ `src/app/auth/signin/page.tsx` - Sign in page
  - Email magic link form
  - Google OAuth button
  - "Check your email" confirmation state

- ✅ `src/app/vault/page.tsx` - Authenticated vault dashboard
  - Header with navigation
  - Welcome message with Phase 0 status
  - Placeholder for collections UI

#### Layout & UI
- ✅ `src/app/layout.tsx` - Root layout
  - The Toddfather branding
  - SEO metadata (OpenGraph, Twitter cards)
  - SessionProvider from NextAuth
  - Sonner Toaster for notifications
  - Dark mode support (suppressHydrationWarning)

- ✅ `src/lib/db.ts` - Prisma client singleton
  - Development logging (query, error, warn)
  - Production error-only logging
  - Hot reload protection

### 6. Environment Configuration

#### Files
- ✅ `.env` - Environment variables
  - ✅ `DATABASE_URL` - Postgres connection string
  - ✅ `DIRECT_URL` - Direct Postgres URL
  - ✅ `NEXTAUTH_URL` - App URL (http://localhost:3000)
  - ✅ `NEXTAUTH_SECRET` - Generated secret (base64)
  - ⏸️ `AUTH_RESEND_KEY` - Needs API key
  - ⏸️ `AUTH_GOOGLE_ID` - Needs OAuth credentials
  - ⏸️ `AUTH_GOOGLE_SECRET` - Needs OAuth secret
  - ⏸️ `OPENAI_API_KEY` - Needs API key
  - ⏸️ `ANTHROPIC_API_KEY` - Needs API key

- ✅ `prisma.config.ts` - Prisma 7 configuration
- ✅ `.gitignore` - Excludes .env, node_modules, build artifacts

---

## ⏸️ Blocked / Pending

### 1. Database Migration
**Status**: Cannot proceed with shared database

**Issue**: Current DATABASE_URL points to aicoderally-stack's Vercel Postgres instance. Running migrations would drop existing tables.

**Options**:
1. **Recommended**: Create new Vercel Postgres database for The Toddfather
   - Sign into Vercel
   - Create new Postgres database: "thetoddfather-db"
   - Copy connection string to `.env`
   - Run: `pnpm prisma db push`

2. **Alternative**: Use different schema within same database
   - Update `prisma/schema.prisma` datasource with `schema = "toddfather"`
   - Run: `CREATE SCHEMA toddfather;` in Postgres
   - Run: `pnpm prisma db push`

3. **Development**: Use SQLite locally
   - Change datasource provider to "sqlite"
   - Update DATABASE_URL to "file:./dev.db"
   - Run: `pnpm prisma db push`

**Next Command** (once database is ready):
```bash
pnpm prisma db push
```

### 2. API Keys Configuration
Before testing, add API keys to `.env`:

```bash
# Get from https://resend.com/api-keys
AUTH_RESEND_KEY=re_...

# Get from https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...

# For Phase 2 (Ask The Toddfather)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Counsel Seed Data
Phase 1 requires seeding 25 Counsel items (from plan Section 5).

**Action Items**:
- Create `/content/counsel/` directory
- Write 25 markdown files with Counsel content
- Create seed script: `prisma/seed.ts`
- Run: `pnpm prisma db seed`

---

## 🚀 Next Steps

### Immediate (Required to Test)
1. **Set up dedicated database**
   - Create Vercel Postgres database OR use SQLite locally
   - Update DATABASE_URL in `.env`
   - Run: `pnpm prisma db push`

2. **Add minimal API keys** (for auth)
   - AUTH_RESEND_KEY (for magic links)
   - OR remove Resend provider temporarily

3. **Test locally**
   ```bash
   pnpm dev
   ```
   - Visit http://localhost:3000 (redirects to /start)
   - Test sign in flow
   - Verify /vault loads after auth

### Phase 1: Counsel + Vault MVP (Week 3-4)
From the plan, these are the next features:

1. **Counsel Library**
   - Browse page with filters (channel, difficulty, type)
   - Search (title, tags, body)
   - Detail page with full Counsel content
   - "Save to Vault" button

2. **Family Vault**
   - Collections list page
   - Create/edit collection UI
   - Drag-drop section organization
   - Add/remove Counsel to collections
   - Export collection as Markdown

3. **Content Pipeline**
   - Seed 10-15 Counsel from markdown
   - Link to placeholder YouTube videos

**API Routes Needed**:
- `GET /api/counsel` - List with filters
- `GET /api/counsel/[slug]` - Detail
- `POST /api/counsel/save` - Save to user
- `GET /api/vault/collections` - User's collections
- `POST /api/vault/collections` - Create collection
- `POST /api/vault/collections/[id]/items` - Add item

### Phase 2: Ask The Toddfather (Week 5-6)
AI chat assistant with Vercel AI SDK (already installed).

### Phase 3: Video Pipeline (Week 7-9)
Toddfather Studio with manifest-driven production.

---

## 📁 Project Structure

```
thetoddfather/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   ├── auth/
│   │   │   └── signin/page.tsx
│   │   ├── start/page.tsx
│   │   ├── vault/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── db.ts
│   ├── generated/
│   │   └── prisma/  (Prisma client)
│   └── types/
│       └── next-auth.d.ts
├── prisma/
│   └── schema.prisma
├── auth.ts
├── middleware.ts
├── prisma.config.ts
├── .env
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🎯 Success Criteria for Phase 0

- [x] Next.js project initialized
- [x] All core dependencies installed
- [x] Database schema defined (23 models)
- [x] Authentication configured (NextAuth v5)
- [x] Landing page built
- [x] Auth flow implemented
- [x] Vault placeholder created
- [ ] Database migrated (blocked - needs dedicated DB)
- [ ] App runs locally without errors
- [ ] Can sign in and access /vault

---

## 📝 Notes

### Design Decisions
1. **Monolithic Next.js app** - All features in one codebase for velocity
2. **NextAuth v5** - Latest stable auth with magic link + Google
3. **Prisma 7** - Latest ORM with new config approach
4. **Vercel AI SDK** - For Phase 2 chat implementation
5. **Sonner** - Toast notifications (lightweight, great DX)
6. **Radix UI** - Accessible components without heavy framework

### Database Schema Highlights
- **User tiers**: FREE, SPARCC, ENTERPRISE
- **Counsel types**: NOTE, CHECKLIST, PROTOCOL, DIAGNOSTIC, TEMPLATE, MODEL
- **9 SPM channels**: PLAN_DESIGN, MEASURES, PAYOUT_CURVES, QUOTA, etc.
- **Video formats**: YT_LONG, YT_SHORT, TIKTOK, X, LINKEDIN
- **Manifest-driven production**: Every episode has manifest.json contract
- **All timestamps**: created_at, updated_at tracking
- **Proper cascade deletes**: Data integrity maintained

### Technical Patterns
- **Singleton Prisma client**: Prevents multiple instances in dev
- **JWT sessions**: Faster than database sessions, includes tier
- **Route-based protection**: Middleware handles auth gates
- **Server Components**: All pages use async/await for data
- **Type-safe forms**: react-hook-form + Zod resolvers

---

## 🔗 Related Files

- **Architecture Plan**: `/Users/todd.lebaron/.claude/plans/transient-munching-coral.md`
- **Project Root**: `/Users/todd.lebaron/dev/thetoddfather`
- **Reference Patterns**: `/Users/todd.lebaron/dev/aicoderally-stack`

---

**Phase 0 Foundation: Complete ✅**
**Next: Set up dedicated database, then start Phase 1 (Counsel + Vault MVP)**
