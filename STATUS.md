# The Toddfather - Current Status

**Date**: December 22, 2024

---

## ✅ PHASE 0 COMPLETE

### Foundation Built (10/10 tasks)
1. ✅ Next.js 16 project initialized at `~/dev/thetoddfather`
2. ✅ Core dependencies installed (auth, database, AI, payments, UI)
3. ✅ **SQLite database** configured for local development
4. ✅ Complete database schema (23 models) pushed successfully
5. ✅ NextAuth v5 authentication configured (magic link + Google OAuth)
6. ✅ Root layout with metadata and Toaster
7. ✅ Landing page at `/start` - "Welcome to the Family Vault"
8. ✅ Sign in page at `/auth/signin`
9. ✅ Vault dashboard at `/vault` (protected route)
10. ✅ Prisma client generated

---

## 📊 Database Schema (23 Models)

### ✅ Authentication (4 models)
- User (with tier: FREE/SPARCC/ENTERPRISE)
- Account, Session, VerificationToken

### ✅ Counsel System (2 models)
- Counsel (6 types, 9 channels, 3 difficulty levels)
- CounselSave

### ✅ Family Vault (3 models)
- VaultCollection
- VaultCollectionSection
- VaultCollectionItem

### ✅ Video Pipeline (4 models)
- Episode, Script, Cut, Asset

### ✅ Video Production (4 models)
- EpisodeManifest, WorkerJob, QCCheck, ToddStudioAsset

### ✅ Chat System (1 model)
- ChatMessage

### ✅ Subscriptions (1 model)
- Subscription (Stripe)

### ✅ Working Models (2 models)
- WorkingModel, ModelRun

---

## 🔧 Current Setup

### Local Development
- **Database**: SQLite (`file:./dev.db`)
- **Schema**: Adapted for SQLite (Json instead of String[], no @db.Text)
- **Dev Server**: Ready to run on port 3000

### Production Strategy
When deploying to Vercel:
1. Create Vercel Postgres database
2. Update `DATABASE_URL` in Vercel environment
3. Schema works for both SQLite (local) and PostgreSQL (production)

### Environment Variables
**Configured:**
- ✅ DATABASE_URL (SQLite)
- ✅ NEXTAUTH_URL
- ✅ NEXTAUTH_SECRET

**Needs API Keys:**
- ⏸️ AUTH_RESEND_KEY (for magic link emails)
- ⏸️ AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET (for Google OAuth)
- ⏸️ OPENAI_API_KEY (for Phase 2 chat)
- ⏸️ ANTHROPIC_API_KEY (for Phase 2 chat)

---

## 🚀 Ready for Phase 1

### Next: Counsel + Vault MVP

**Week 3-4 Deliverables:**

1. **Counsel Library** (`/counsel`)
   - Browse page with filters (channel, difficulty, type)
   - Search functionality
   - Detail page with full Counsel content
   - "Save to Vault" button (requires auth)

2. **Vault Collections** (`/vault`)
   - Collections list view
   - Create/edit collection UI
   - Section organization (drag-drop)
   - Add/remove Counsel items
   - Export as Markdown

3. **Content Seed**
   - Create `/content/counsel/` directory
   - Write 10-15 Counsel markdown files
   - Create seed script (`prisma/seed.ts`)
   - Seed command: `pnpm prisma db seed`

### API Routes to Build
```
GET    /api/counsel              # List with filters
GET    /api/counsel/[slug]       # Detail
POST   /api/counsel/save         # Save to user
GET    /api/vault/collections    # User's collections
POST   /api/vault/collections    # Create collection
POST   /api/vault/collections/[id]/items  # Add item
DELETE /api/vault/collections/[id]        # Delete
PATCH  /api/vault/collections/[id]        # Update
```

### UI Components Needed
```
src/components/
├── counsel/
│   ├── CounselCard.tsx       # Grid item
│   ├── CounselDetail.tsx     # Full view
│   ├── CounselFilters.tsx    # Sidebar
│   └── SaveButton.tsx        # Save to Vault
├── vault/
│   ├── CollectionCard.tsx    # Collection summary
│   ├── CollectionEditor.tsx  # Drag-drop organizer
│   ├── SectionList.tsx       # Sections UI
│   └── ExportButton.tsx      # Export to Markdown
└── ui/
    ├── Badge.tsx             # For types, channels
    ├── Button.tsx            # CTA buttons
    ├── Card.tsx              # Container
    └── Input.tsx             # Forms
```

---

## 📝 25 Counsel Seed Items (From Plan)

### Strategy Layer (3)
1. intelligent-sales-foundation
2. strategy-to-comp-translation
3. priority-encoding-via-pay

### Planning Layer (4)
4. planning-assumptions-smell-test
5. capacity-model-failure-modes
6. quota-inflation-early-warning
7. planning-to-quota-traceability

### Enablement Layer (3)
8. enablement-to-payout-alignment
9. certainty-vs-upside-tradeoff
10. why-reps-ignore-training

### Performance Layer (5)
11. payout-curve-behavior-map
12. accelerator-timing-effects
13. cap-and-decel-side-effects
14. draw-program-guardrails
15. deal-velocity-illusions

### Governance Layer (5)
16. exception-handling-protocol
17. dispute-proof-evidence-bundle
18. auditability-checklist
19. quota-relief-protocol
20. territory-move-fairness-shim

### AI × SPM Layer (3)
21. where-ai-helps-hurts-spm
22. human-override-not-optional
23. insight-vs-reporting

### Operations Layer (2)
24. crediting-ambiguity-kills-trust
25. signal-vs-noise-sales-data

---

## 🎯 Immediate Next Steps

1. **Test the app locally**
   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```

2. **Create first Counsel item**
   - Create `content/counsel/intelligent-sales-foundation.md`
   - Write seed script to import it

3. **Build Counsel API**
   - Start with `GET /api/counsel`
   - Add filtering logic

4. **Build Counsel browse page**
   - Grid layout
   - Filter sidebar
   - Search box

---

## 📚 Documentation

- **Architecture Plan**: `~/.claude/plans/transient-munching-coral.md` (1,700+ lines)
- **Phase 0 Status**: `/Users/todd.lebaron/dev/thetoddfather/PHASE_0_STATUS.md`
- **This Status**: `/Users/todd.lebaron/dev/thetoddfather/STATUS.md`

---

## 🔗 Key Files

### Core Configuration
- `prisma/schema.prisma` - Database schema (SQLite-compatible)
- `auth.ts` - NextAuth v5 config
- `middleware.ts` - Route protection
- `src/lib/db.ts` - Prisma client singleton

### Pages
- `src/app/start/page.tsx` - Landing page
- `src/app/auth/signin/page.tsx` - Sign in
- `src/app/vault/page.tsx` - Vault dashboard

### Environment
- `.env` - Local environment variables
- `prisma.config.ts` - Prisma 7 configuration

---

**Status**: Foundation complete, ready to build Counsel library 🚀
