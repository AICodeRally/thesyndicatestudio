# The Family Vault — MVP Specification

## Overview

**The Family Vault** is the free account surface where people collect, organize, customize, and share Counsel.

It's not a storage locker. It's a personal knowledge system for SPM professionals to gather, apply, and defend their comp decisions.

---

## Value Prop

> "Create a free Family Vault to collect and organize Toddfather Counsel."

What you get:
- Save Counsel you've learned from videos and Ask The Toddfather
- Organize by your own collections
- Add your own notes and context
- Export to share with team, legal, or finance
- Get recommended next Counsel based on what you've saved
- Ask The Toddfather questions about any Counsel you've collected

---

## Mental Model

Think of The Family Vault as:
- **Not:** a generic note-taking app or folder storage
- **Not:** just a bookmarking tool
- **Is:** a curated knowledge base for SPM decision-making
- **Is:** audit-ready, shareable, and context-aware

---

## Authentication & Onboarding

### Sign Up / First Run (60 seconds)

1. **Landing:** "Create a free Family Vault"
   - Email only (for now)
   - Password or OAuth (Google/Microsoft)

2. **Minimal Profile:**
   - What's your role? (Comp Ops / Comp Manager / Finance / Sales Ops / Other)
   - Company size? (optional, for recommendations)
   - Skip if impatient (can fill later)

3. **Welcome:**
   - "Your Vault is ready. Here's your first Counsel: [latest popular item]"
   - "Collect Counsel from videos, Ask The Toddfather, and community threads."
   - "Everything you save is yours — searchable, shareable, exportable."

---

## Core Pages (MVP)

### 1. `/vault/collections`
**Your organized Counsel library.**

**Layout:**
- Left sidebar: Collections (My Collection, Plan Design Cleanup, Governance Review, etc.)
- Main area: Grid or list of Counsel cards

**Per Counsel Card Shows:**
- Title + one-liner
- Type badge (CHECKLIST, PROTOCOL, etc.)
- Channel tag (QUOTA, GOVERNANCE, etc.)
- 2-3 key tags
- Time to apply (15 min, 1 hour, etc.)
- "Your notes" preview (if you've added context)
- Buttons:
  - View (opens full Counsel page)
  - Remove from collection
  - Ask The Toddfather about this

**Sort/Filter:**
- By date saved
- By type (show only checklists, etc.)
- By channel
- By difficulty
- Search (title + one-liner + your notes)

**Bulk Actions:**
- Select multiple → Export selected as PDF/MD
- Select multiple → Share collection (email link)

---

### 2. `/vault/counsel/:slug`
**View one Counsel with context.**

**Layout:**

**Header:**
- Title
- One-liner
- Type + Channel + Difficulty badges
- "Save to collection" button
- "Share this Counsel" (copy link / email)
- "Ask about this Counsel" CTA

**Main Content:**
- Full Counsel markdown rendered beautifully
- Sidebars:
  - Your notes (if you've added any)
  - Related Counsel (2-3 linked items)
  - Video this came from (if tagged)

**Bottom Actions:**
- Add to collection (dropdown to pick which)
- Export (PDF / MD with your notes included)
- Ask The Toddfather (context-aware chat)

**Comments (Post-MVP, but designed for it):**
- "Ask a follow-up?" → Routes to Ask The Toddfather with Counsel context
- Disable general comments (keep it focused)

---

### 3. `/vault/ask`
**Ask The Toddfather with Counsel context.**

**If accessed from a Counsel page:**
- Context-prefilled: "Regarding [Counsel Title]..."
- Prompt: "What would you like to ask The Toddfather about this?"

**If accessed standalone:**
- "Ask The Toddfather anything about SPM design, governance, or operations."
- Input: "Your question..."
- Plus: "Which Counsel topics are you asking about?" (checkbox filter)

**Response:**
- "Here's what The Toddfather says:"
- Answer + related Counsel (2-3 recommendations)
- "Save this Counsel?" → One-click add to collection
- "Want a related topic?" → Suggest next watch (video)

---

### 4. `/vault/collections/new` or `/vault/organize`
**Manage your collections (create, rename, delete).**

**Collections are:**
- Personal folders (not shared by default)
- Examples: "Plan Design Cleanup", "Governance Review", "Q4 SPIFF Design"
- Can be shared as a read-only link

**UI:**
- List all your collections
- Create new (modal → name + description)
- Rename, delete, export (per collection)
- Share collection (generates read-only link)

---

### 5. `/vault/export`
**Export your Counsel library (Power feature).**

**Export Options:**
- Selected Counsel (PDF or MD)
- Entire collection (PDF or MD)
- Evidence bundle (audit-ready format with notes + references)

**Formats:**
- **PDF:** Readable, printable, shareable with non-technical folks
- **Markdown:** For copying into wikis, documentation, or emails
- **Evidence Bundle:** Includes your notes, dates saved, video sources, and reasoning (for disputes)

**Naming/Organization:**
- Auto-named by collection
- Option to include/exclude your notes
- Option to include/exclude video references

---

## Recommended Next Counsel (Algorithm)

**Goal:** Keep people in the loop. Suggest the next thing they should learn.

**Logic:**

1. **Based on what you've saved:**
   - You saved a PROTOCOL on Quota Relief?
   - Recommend: CHECKLIST on Quota Fairness
   - Recommend: DIAGNOSTIC on Quota Risks

2. **Based on your role:**
   - You're a Comp Manager?
   - Suggest: PROTOCOL and TEMPLATE types
   - De-prioritize: Deep architect stuff

3. **Based on gaps:**
   - You've saved nothing on Governance?
   - Recommend: "Governance Maturity Diagnostic"

4. **Based on trending:**
   - High save rate on X topic?
   - Show related items

**Implementation:**
- "Next Counsel" card on home (1-3 recommendations)
- "Similar Counsel" on each Counsel page
- Email digest option: "Weekly recommended Counsel based on your interests"

---

## Email Integrations (MVP Only)

**Invitation:**
- When someone registers, send them:
  - "Welcome to The Family Vault"
  - "Here's your first Counsel"
  - "Collect more from [latest video]"

**Weekly Digest (Opt-in):**
- 1-2 trending Counsel from community
- 1-2 recommended based on your saves
- Link to new Ask Todd Live session

**Share Notification:**
- When someone shares a collection with you:
  - "Your colleague sent you [Collection Name] - 12 Counsel items"
  - Link to view

---

## Mobile Experience (Important)

The Family Vault should work beautifully on mobile because:
- People save Counsel from videos watched on phone
- People access during meetings while checking comp logic
- Exports go to email (read on phone)

**Mobile-first:**
- Stack layout (no sidebars)
- Full-width cards
- Fast search
- One-tap add to collection
- Share via native mobile share

---

## V2 Features (Post-MVP, but plan for them)

These aren't MVP, but the schema should support them:

### "Apply This to My Plan" Wizard
- Start with a PROTOCOL Counsel (e.g., "Quota Relief Process")
- Guided Q&A: "How many reps affected? What's your timeline?"
- Output: Custom version tailored to their plan

### Simple Calculators (Embedded)
- Payout curve sanity check
- Draw payback scenarios
- Quota relief delta
- All launched from relevant Counsel

### Evidence Bundle Generator
- Select Counsel + your notes + assumptions
- System generates: audit-ready PDF with citations
- Perfect for: disputes, finance review, legal sign-off

### Collections as Templates
- "Publish this collection as a template"
- Others can fork it ("Use this template in my Vault")
- Creates a community of best-practice bundles

---

## Data Model (Minimal)

```typescript
// User
User {
  id: UUID
  email: string
  role: "COMP_OPS" | "MANAGER" | "FINANCE" | "SALES_OPS" | "OTHER"
  companySize: string (optional)
  createdAt: Date
}

// Collection
Collection {
  id: UUID
  userId: UUID
  name: string (e.g., "Plan Design Cleanup")
  description: string (optional)
  isPublic: boolean (default: false)
  shareToken: string (if public)
  createdAt: Date
  updatedAt: Date
}

// SavedCounsel (pivot table)
SavedCounsel {
  id: UUID
  userId: UUID
  counselSlug: string (reference to /content/counsel/[slug].md)
  collectionId: UUID (optional, can be in "Unsorted")
  userNotes: string (their context)
  savedAt: Date
  lastViewedAt: Date (for recommendations)
}

// Counsel (sourced from /content/counsel/*.md)
// Already exists as markdown files with frontmatter schema
```

---

## Key CTA Copy (No Cringe)

**Save Counsel:**
- "Save this to your Family Vault" (simple, clear)
- [Button] Add to Collection

**Create Vault:**
- "Create a free Family Vault" (not "Start your journey")
- "Collect Counsel from The Toddfather"

**Export:**
- "Export for your team" (not "download")
- "Export as PDF for sharing with Legal"

**Share:**
- "Share this collection" (not "spread the word")
- "Send this Counsel to a colleague"

**Recommend:**
- "Next Counsel to learn" (not "suggested for you")
- "Related: [Title]"

---

## Success Metrics (Track These)

**Usage:**
- % of viewers who create a Vault
- Avg Counsel saved per user
- % who save 3+ Counsel
- Repeat visit rate (within 7 days)

**Engagement:**
- Avg time in Vault per session
- Search volume (what are people looking for?)
- Export rate (% who export)
- Ask about Counsel (% who use Ask The Toddfather feature)

**Conversion to Services:**
- "Request SPM Help" clicks from Vault
- % of vault users who request a consultation

**Community:**
- Collections shared (public or with team)
- Notes-per-Counsel (engagement depth)

---

## Launch Checklist

**MVP Launch:**
- [ ] Auth system (email + password, no OAuth yet)
- [ ] Collections CRUD
- [ ] Save/unsave Counsel workflow
- [ ] View single Counsel page with context
- [ ] Search/filter (by channel, type, difficulty, text)
- [ ] Export (PDF of selected Counsel)
- [ ] Share collection (read-only link)
- [ ] Basic email (welcome + weekly digest opt-in)
- [ ] Mobile responsive

**Post-Launch V1.1:**
- [ ] Ask The Toddfather integration (context-aware chat)
- [ ] Recommended Counsel algorithm
- [ ] User notes feature
- [ ] Email share (send collection to teammate)

**V2:**
- [ ] "Apply This to My Plan" wizard
- [ ] Embedded calculators
- [ ] Evidence bundle generator
- [ ] Community collections (template library)

---

## Security & Privacy (Important)

**Defaults:**
- Collections are private by default
- Users must explicitly share
- No usage data shared with others
- No selling Vault data to vendors

**Compliance:**
- GDPR: Users can export/delete their data
- SOC2: Audit logging on sensitive actions
- No tracking pixels (privacy-first)

This is trust infrastructure. Treat it as such.
