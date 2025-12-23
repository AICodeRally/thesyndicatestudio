# Phase 1 Progress: Counsel + Vault MVP

**Date**: December 22, 2024

---

## ✅ Completed

### 1. Counsel Content Created (5 items)
**Location**: `/content/counsel/`

1. **intelligent-sales-foundation.md**
   - Type: NOTE, Channel: PLAN_DESIGN, Difficulty: INTRO, Time: 10min
   - Foundation piece on aligning strategy, planning, and compensation

2. **strategy-to-comp-translation.md**
   - Type: CHECKLIST, Channel: PLAN_DESIGN, Difficulty: ARCHITECT, Time: 25min
   - How to translate strategy into actionable compensation components

3. **planning-assumptions-smell-test.md**
   - Type: CHECKLIST, Channel: PLAN_DESIGN, Difficulty: ARCHITECT, Time: 30min
   - Framework for testing and validating planning assumptions

4. **payout-curve-behavior-map.md**
   - Type: NOTE, Channel: PAYOUT_CURVES, Difficulty: OPERATOR, Time: 20min
   - How payout curves shape behavior, risk appetite, and timing

5. **where-ai-helps-hurts-spm.md**
   - Type: NOTE, Channel: AI_SPM, Difficulty: INTRO, Time: 15min
   - AI as amplifier - governance framework for AI in SPM

**Structure** (each file has):
- ✅ YAML frontmatter (slug, title, oneLiner, type, channel, tags, difficulty, timeToApplyMin)
- ✅ Problem Statement
- ✅ Mechanism (why this happens)
- ✅ Recommended Actions (step-by-step)
- ✅ Common Pitfalls
- ✅ Assumptions
- ✅ Related Content (videos, next Counsel)

### 2. Seed Script Created
**Location**: `/prisma/seed.ts`

**Features**:
- ✅ Reads markdown files from `/content/counsel/`
- ✅ Parses front matter using gray-matter
- ✅ Extracts sections (Problem Statement, Mechanism, Actions, Pitfalls, Assumptions)
- ✅ Upserts to database (prevents duplicates)
- ✅ Logging for transparency

**Dependencies**:
- ✅ gray-matter installed
- ✅ Package.json updated with seed script

---

## ⏸️ Blocked: Prisma 7 + SQLite Configuration

**Issue**: Prisma 7 requires `adapter` or `accelerateUrl` for PrismaClient constructor.

**Workaround Options**:

### Option A: Use SQLite adapter (Recommended for local dev)
```bash
pnpm add -w @prisma/adapter-libsql
```

Update `src/lib/db.ts`:
```typescript
import { PrismaClient } from './generated/prisma'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const adapter = new PrismaLibSQL(libsql)

export const prisma = new PrismaClient({ adapter })
```

### Option B: Switch to PostgreSQL now
- Create Vercel Postgres database
- Update `.env` with Postgres URL
- Update `prisma/schema.prisma` provider back to `postgresql`
- Run `pnpm prisma db push`

### Option C: Downgrade to Prisma 6 (temporary)
```bash
pnpm add -w @prisma/client@6 prisma@6 -D
```

---

## 🚧 Next Tasks (Once unblocked)

### 1. Run Seed Script
```bash
pnpm seed
# Should import 5 Counsel items into database
```

### 2. Build Counsel API Routes
Create `/src/app/api/counsel/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const channel = searchParams.get('channel')
  const difficulty = searchParams.get('difficulty')
  const type = searchParams.get('type')
  const search = searchParams.get('search')

  const counsel = await prisma.counsel.findMany({
    where: {
      status: 'PUBLISHED',
      ...(channel && { channelPrimary: channel }),
      ...(difficulty && { difficulty }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { oneLiner: { contains: search } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      oneLiner: true,
      type: true,
      channelPrimary: true,
      difficulty: true,
      timeToApplyMin: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ counsel })
}
```

Create `/src/app/api/counsel/[slug]/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const counsel = await prisma.counsel.findUnique({
    where: { slug: params.slug },
  })

  if (!counsel) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ counsel })
}
```

### 3. Build Counsel Browse Page
Create `/src/app/counsel/page.tsx`:
```typescript
import { prisma } from '@/lib/db'
import CounselGrid from '@/components/counsel/CounselGrid'
import CounselFilters from '@/components/counsel/CounselFilters'

export default async function CounselPage({
  searchParams,
}: {
  searchParams: { channel?: string; difficulty?: string; type?: string }
}) {
  const counsel = await prisma.counsel.findMany({
    where: {
      status: 'PUBLISHED',
      ...(searchParams.channel && { channelPrimary: searchParams.channel }),
      ...(searchParams.difficulty && { difficulty: searchParams.difficulty }),
      ...(searchParams.type && { type: searchParams.type }),
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Counsel Library</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <CounselFilters />
          </aside>

          <main className="lg:col-span-3">
            <CounselGrid counsel={counsel} />
          </main>
        </div>
      </div>
    </div>
  )
}
```

### 4. Build UI Components
Create in `/src/components/counsel/`:

- **CounselCard.tsx**: Grid item showing title, one-liner, type badge, channel badge, difficulty, time
- **CounselGrid.tsx**: Responsive grid layout
- **CounselFilters.tsx**: Sidebar with channel, difficulty, type filters
- **CounselDetail.tsx**: Full Counsel view with markdown rendering
- **SaveButton.tsx**: Save to Vault (requires auth)

### 5. Build Counsel Detail Page
Create `/src/app/counsel/[slug]/page.tsx`:
```typescript
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SaveButton from '@/components/counsel/SaveButton'

export default async function CounselDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const counsel = await prisma.counsel.findUnique({
    where: { slug: params.slug },
  })

  if (!counsel) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{counsel.title}</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
            {counsel.oneLiner}
          </p>
          <div className="flex gap-2 mb-4">
            <Badge>{counsel.type}</Badge>
            <Badge>{counsel.channelPrimary}</Badge>
            <Badge>{counsel.difficulty}</Badge>
            <Badge>{counsel.timeToApplyMin}min</Badge>
          </div>
          <SaveButton counselId={counsel.id} />
        </header>

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {counsel.bodyMd}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
```

---

## 📊 Success Metrics

Once Phase 1 is complete, we should have:

- ✅ 5 Counsel items in database
- ✅ Browse page at `/counsel` with filtering
- ✅ Detail page at `/counsel/[slug]` with full content
- ✅ API endpoints for programmatic access
- ✅ Ability to save Counsel to Vault (authenticated users)

---

## 🎯 After Phase 1

### Phase 2: Vault Collections (Week 4)
- Collections list page
- Create/edit collection UI
- Add/remove Counsel to collections
- Organize into sections
- Export as Markdown

### Phase 3: Ask The Toddfather (Week 5-6)
- Chat interface with Vercel AI SDK
- Context-aware responses (knows current Counsel)
- Free tier: 3 messages
- SPARCC tier: Unlimited

---

## 📝 Commands Reference

```bash
# Fix Prisma 7 + SQLite (Option A - Recommended)
pnpm add -w @prisma/adapter-libsql @libsql/client
# Then update src/lib/db.ts with adapter

# Run seed script
pnpm seed

# Start dev server
pnpm dev

# Test Counsel API
curl http://localhost:3000/api/counsel
curl http://localhost:3000/api/counsel?channel=PLAN_DESIGN
curl http://localhost:3000/api/counsel/intelligent-sales-foundation
```

---

**Current Status**: Phase 1 is 60% complete. Once Prisma adapter is added, we can seed data and build the UI.
