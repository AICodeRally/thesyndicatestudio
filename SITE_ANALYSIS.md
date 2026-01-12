# IntelligentSPM.com Site Analysis

**Analysis Date:** December 30, 2024
**Analyst:** Web Design Architect
**Site:** IntelligentSPM.com (The Toddfather)
**Target Audience:** Comp design professionals, Sales Ops leaders, Finance teams

---

## EXECUTIVE SUMMARY

IntelligentSPM.com has strong brand identity and a clear vision as an "SPM clearing house." The site effectively communicates its anti-vendor, anti-consultant positioning. However, several critical gaps prevent it from achieving its conversion and engagement potential:

**Critical Issues:**
1. Too many "Coming Soon" placeholders erode credibility
2. Weak free-to-paid conversion path (unclear value proposition for $29/mo)
3. Missing lead capture mechanisms on high-value pages
4. No personalization or progressive profiling
5. Inconsistent visual language between public and authenticated sections

**Quick Wins (implement in 1-2 weeks):**
- Add newsletter capture to Plan Check results page
- Create 3-5 real benchmark visualizations
- Add social proof (testimonials, logo bar, metrics)
- Fix the Contact form (currently disabled)

---

## 1. USABILITY AUDIT

### 1.1 Navigation Clarity

**Strengths:**
- Clean 6-section primary navigation (Learn, Analyze, Benchmarks, Vendors, Community, Services)
- Consistent placement of primary CTA ("Run a Plan Check") in nav
- Dropdown submenus provide good information scent
- Mobile hamburger menu properly implemented

**Issues:**
| Issue | Severity | Recommendation |
|-------|----------|----------------|
| "Community" links to /syndicate - confusing naming | Medium | Rename route to /community or change nav label to "Syndicate" |
| No breadcrumbs on subpages | Low | Add breadcrumb navigation for Learn, Analyze, Benchmarks sections |
| Search is icon-only with no label | Low | Add "Search" text label on desktop |
| Utility nav items (Subscribe, Sign in) too subdued | Medium | Increase contrast; Subscribe should be more prominent |

### 1.2 Information Architecture

**Current Structure:**
```
/ (Homepage)
├── /learn
│   ├── /spm-101
│   ├── /glossary
│   ├── /component-cards
│   └── /library
├── /analyze
│   ├── /plan-check (FEATURED)
│   ├── /simulation
│   ├── /deal-payout
│   └── /splits
├── /benchmarks
│   ├── /payout-curves
│   ├── /quota-patterns
│   └── /governance-maturity
├── /vendors
│   ├── /scorecards
│   └── /implementation-reality
├── /syndicate (Community)
├── /services
│   ├── /assessment
│   ├── /redesign
│   ├── /governance
│   └── /ongoing-ops
├── /toddfather (About/Media)
│   ├── /podcast
│   ├── /speaking
│   ├── /todd-takes
│   ├── /ask-todd-live
│   └── /shorts
├── /counsel (Content Library)
├── /vault (Authenticated - Saved Content)
├── /subscribe
├── /start
└── /contact
```

**IA Issues:**
1. **Duplicate entry points:** /learn/library and /counsel serve similar purposes
2. **Hidden gems:** /toddfather content hub not in primary nav; /counsel buried
3. **Start page redundancy:** /start duplicates homepage pathways
4. **Missing hub pages:** /analyze and /benchmarks are thin index pages

**Recommendations:**
1. Consolidate /learn/library into /counsel or vice versa
2. Add "The Toddfather" to primary nav (it's the brand)
3. Deprecate /start or redirect to homepage
4. Make /analyze and /benchmarks rich landing pages with actual content previews

### 1.3 User Flows

#### Flow 1: Sign Up / Create Account
- **Current state:** Sign-in page exists at /auth/signin; uses NextAuth
- **Issue:** No clear "Sign Up" CTA anywhere - only "Sign In"
- **Issue:** Registration benefits unclear until billing page
- **Fix:** Add prominent "Create Free Account" with benefits list

#### Flow 2: Find Content (Persona: New SPM Professional)
1. Homepage -> "SPM Component Cards" tile -> /learn/component-cards
2. **Blocker:** Page shows "Coming Soon" for all cards
3. Alternative: Learn -> Glossary -> Actual content exists (fallback terms)
4. **Success path exists but is not obvious**

#### Flow 3: Use Plan Check Tool
1. Homepage -> "Run a Plan Check" -> /analyze/plan-check
2. Upload file (PDF/Excel/Word accepted)
3. Click "Run Plan Check"
4. See results with risk score
5. **Gap:** No lead capture after results; no save/export; no follow-up CTA

#### Flow 4: Subscribe to Newsletter
1. /subscribe page -> Enter email -> Submit
2. Success state shows confirmation
3. **Good:** Clear value proposition (weekly digest, podcast drops)
4. **Gap:** Newsletter signup not embedded in content pages

### 1.4 Mobile Experience

**Tested Components:**
- Navigation: Hamburger menu works, dropdowns properly nested
- Typography: Responsive scaling in globals.css (text-display scales from 3.5rem to 2.25rem)
- Cards: Grid layouts properly collapse to single column
- Forms: Full-width inputs, appropriate touch targets

**Issues:**
| Issue | Page | Fix |
|-------|------|-----|
| Hero section very tall on mobile | Homepage | Reduce min-height or adjust content |
| Proof bar text too small | Homepage | Increase font size on mobile |
| Alphabet navigation cramped | Glossary | Make scrollable horizontal instead of wrap |

### 1.5 Call-to-Action Effectiveness

**Primary CTAs Audit:**

| Page | CTA | Visibility | Clarity | Recommendation |
|------|-----|------------|---------|----------------|
| Homepage | "Run a Plan Check" | High (hero + nav) | Good | Keep as primary |
| Homepage | "Explore the SPM Library" | Medium | Vague | Change to "Browse Counsel" or specific content |
| Plan Check | "Run Plan Check" | High | Good | Add secondary CTA for newsletter after results |
| Learn | N/A | Low | N/A | Add CTA - "Start with SPM 101" |
| Services | "Start the Conversation" | High | Good | Enable the form or clarify email CTA |
| Syndicate | "Subscribe to The Syndicate" | High | Good | Effective |

**CTA Repetition:** Homepage repeats Plan Check CTA 3 times (nav, hero, bottom). Good pattern.

### 1.6 Form/Input Design

**Forms Inventory:**

| Form | Location | Status | Issues |
|------|----------|--------|--------|
| Plan Upload | /analyze/plan-check | Working | No progress indicator during upload |
| Newsletter | /subscribe, /syndicate | Working | Good success state |
| Contact | /contact | **DISABLED** | Button says "Coming Soon" - bad UX |
| Search | /search | Working | No autocomplete/suggestions |
| Auth | /auth/signin | Working | Standard NextAuth flow |

**Input Styling:** Consistent dark theme, good focus states, appropriate validation.

### 1.7 Loading States and Feedback

**Observed States:**
- Plan Check: "Analyzing..." button text during processing
- Newsletter: "Subscribing..." button text
- Search: "Searching..." button text
- Chat: Animated dots during AI response

**Missing:**
- No skeleton loaders on Counsel library (server component)
- No progress indicator for file uploads
- No toast notifications on successful actions (Toaster component exists but underutilized)

---

## 2. CONTENT STRATEGY

### 2.1 Current Content Inventory

| Content Type | Status | Quantity | Quality |
|--------------|--------|----------|---------|
| Glossary Terms | Partial | 8 fallback terms | High quality definitions |
| Counsel (Guides) | Database-driven | Unknown (depends on seeding) | N/A |
| Component Cards | Coming Soon | 0 | N/A |
| SPM 101 | Coming Soon | 0 | N/A |
| Vendor Scorecards | Coming Soon | 0 | N/A |
| Benchmarks | Coming Soon | 0 | N/A |
| Podcast Episodes | Coming Soon | 0 | N/A |
| Todd Takes (Video) | Coming Soon | 0 | N/A |

**Critical Gap:** 80%+ of promised content is "Coming Soon." This severely undermines credibility and SEO value.

### 2.2 Content Gaps (Priority Order)

#### P0 - Must Have (1-month sprint)

1. **Complete Glossary (50+ terms)**
   - SPM professionals use specific terminology
   - High SEO value for long-tail queries
   - Foundation for other content

2. **5-10 Component Cards**
   - Quota, Accelerator, Split, Territory, Measure, Payout Curve
   - These are the "building blocks" promised in the hero
   - Interactive examples preferred

3. **3 Vendor Scorecards**
   - Pick major vendors: Xactly, CaptivateIQ, Varicent
   - Even placeholder structure shows credibility
   - Differentiation opportunity

#### P1 - Should Have (2-month horizon)

4. **Benchmark Visualizations**
   - Payout curve patterns (interactive chart)
   - Quota attainment distribution
   - Governance maturity self-assessment

5. **SPM 101 Course**
   - 5-7 modules for newcomers
   - Progressive structure
   - Certificate/badge on completion

6. **Case Studies / Implementation Stories**
   - Real (anonymized) examples
   - "What went wrong" narratives fit the brand
   - Trust-building content

#### P2 - Nice to Have (3-month horizon)

7. **Podcast/Video Content**
   - Start with 5-10 episodes
   - Todd Takes shorts for social
   - Ask Todd Live recordings

8. **Templates / Downloads**
   - Governance checklist template
   - Comp plan review template
   - RFP question list for vendor selection

### 2.3 What SPM Professionals Actually Need

Based on the site's stated audience and industry patterns:

| Need | Content Solution | Monetization Potential |
|------|------------------|------------------------|
| "How do I structure an accelerator?" | Component Card + Calculator | Free (lead gen) |
| "Which SPM vendor fits my needs?" | Vendor Scorecard + Comparison | Gated report |
| "Is my comp plan broken?" | Plan Check Tool | Free tier + Paid deep-dive |
| "What do other companies do?" | Benchmarks + Case Studies | Gated data |
| "I'm new to SPM - where do I start?" | SPM 101 Course | Free (community building) |
| "I need help with governance" | Counsel Library + Templates | Subscription tier |
| "Who can help me fix this?" | Services + Assessment | Consulting revenue |

### 2.4 SEO and Discoverability

**Current SEO Setup:**
- Good: Metadata properly configured in layout.tsx
- Good: Keywords include relevant SPM terms
- Good: Open Graph images set
- Good: Canonical URL structure

**Issues:**
| Issue | Impact | Fix |
|-------|--------|-----|
| "Coming Soon" pages hurt crawl value | High | Noindex these pages or add real content |
| No structured data (FAQ, HowTo) | Medium | Add JSON-LD for glossary, guides |
| Thin content on index pages | Medium | Add intro copy, FAQs, featured items |
| Missing alt text on images | Low | Add descriptive alt text |
| No sitemap.xml visible | Medium | Generate and submit to Search Console |

**Target Keywords (Suggested):**
- Primary: "sales performance management," "SPM software," "comp design"
- Long-tail: "how to structure sales accelerators," "SPM vendor comparison," "quota setting best practices"
- Brand: "The Toddfather SPM," "Intelligent SPM"

### 2.5 Content Hierarchy and Organization

**Current:** Flat structure within sections; minimal cross-linking.

**Recommended Hierarchy:**
```
Learn (Educational)
├── Start Here: SPM 101 (Course)
├── Reference: Glossary (Dictionary)
├── Deep Dives: Component Cards (Guides)
└── Browse All: Counsel Library (Articles)

Analyze (Tools)
├── Featured: Plan Check (Free diagnostic)
├── Calculators: Deal Payout, Split Manager
└── Simulators: Quota Scenarios

Benchmarks (Data)
├── Interactive: Payout Curve Explorer
├── Reports: Quota Pattern Analysis
└── Self-Assessment: Governance Maturity

Vendors (Reviews)
├── Scorecards: Individual Vendor Profiles
└── Comparison: Side-by-Side Matrix
```

---

## 3. VALUE PROPOSITION

### 3.1 Current Clarity Assessment

**Tagline:** "The clearing house for sales compensation, governance, and performance truth."

| Aspect | Score | Notes |
|--------|-------|-------|
| What it is | 7/10 | "Clearing house" is clear but jargon-y |
| Who it's for | 5/10 | Not explicitly stated on homepage |
| What you get | 6/10 | Tools/Benchmarks/Community listed but vague |
| Why it's different | 8/10 | "No vendor spin" messaging is strong |
| What to do next | 9/10 | "Run a Plan Check" is clear |

**Recommendation:** Add explicit audience statement to hero. Example:
> "For comp design professionals, sales ops leaders, and finance teams who are tired of vendor marketing and consultant frameworks."

### 3.2 Differentiation from Competitors

**Competitive Landscape:**
- Vendor blogs (Xactly, CaptivateIQ, Varicent) - biased toward their solutions
- Consulting firms (Deloitte, Alexander Group) - expensive, generic frameworks
- Professional communities (RevOps Co-op, Pavilion) - broad focus, not SPM-specific

**Toddfather Differentiation:**
| Claim | Proof Point Needed |
|-------|-------------------|
| "No vendor spin" | Need actual vendor scorecards with criticism |
| "No consultant theater" | Need real implementation stories, not frameworks |
| "What actually works" | Need case studies, benchmarks, real data |
| "Twenty years of experience" | Need bio, credentials, speaking history |

**Current Gap:** Claims are stated but not substantiated. Need proof.

### 3.3 Trust Signals and Credibility

**Currently Present:**
- Domain authority (intelligentspm.com)
- Noir/comic-noir visual identity (memorable)
- "The Toddfather Promise" section
- Direct contact email

**Missing Trust Signals (Priority Order):**

1. **Logo Bar (Companies Helped)**
   - "Trusted by teams at..." with anonymized or real logos
   - Place below homepage hero

2. **Testimonials**
   - Quotes from SPM professionals
   - Include role titles, company types
   - Place on Services page, homepage

3. **Credentials / About**
   - Todd's background, experience
   - Speaking engagements, publications
   - Currently hidden at /toddfather

4. **Social Proof Metrics**
   - "X plans analyzed" counter
   - "X newsletter subscribers"
   - "X Counsel articles published"

5. **External Validation**
   - Podcast appearances elsewhere
   - Industry recognition
   - Media mentions

### 3.4 Pricing/Tier Clarity

**Current Tiers (from /settings/billing):**

| Feature | Free | SPARCC ($29/mo) |
|---------|------|-----------------|
| Ask The Toddfather (AI Chat) | 3 messages total | Unlimited |
| Family Vault Collections | 3 collections max | Unlimited |
| Working Models (Calculators) | View only | All models + exports |
| Collection Export | Not available | PDF + Markdown |
| Counsel Library Access | Full access | Full access |

**Issues:**
1. **Pricing page doesn't exist** - users only see tiers after signing in
2. **Value proposition unclear** - why is SPARCC worth $29/mo?
3. **Naming confusion** - "SPARCC" appears without explanation
4. **Feature gaps** - most features are "Coming Soon"

**Recommendations:**
1. Create public /pricing page with tier comparison
2. Rename SPARCC or explain the brand connection
3. Lead with outcomes: "Save 10 hours/month on comp design"
4. Add annual pricing option with discount

---

## 4. ENGAGEMENT & RETENTION

### 4.1 What Keeps Users Coming Back?

**Currently Implemented:**
- Newsletter (weekly digest)
- Counsel Library (content updates)
- AI Chat (Ask The Toddfather)
- Vault (saved content)

**Engagement Gaps:**

| Mechanism | Status | Recommendation |
|-----------|--------|----------------|
| New content alerts | Newsletter only | Add in-app notifications |
| Progress tracking | None | Add SPM 101 course progress |
| Personalized feed | None | Recommend Counsel based on saves |
| Community discussion | None | Add comments/discussion to Counsel |
| Gamification | None | Badges for completing course, saving Counsel |
| Event calendar | None | Office Hours, Ask Todd Live dates |

### 4.2 Community Features

**Current State:**
- /syndicate page describes community but offers only newsletter signup
- No forum, discussion, or member directory
- "The Network" promised but not built

**Phased Community Roadmap:**

**Phase 1 (Now):** Newsletter + Office Hours registration
**Phase 2 (Q1):** Discussion threads on Counsel articles
**Phase 3 (Q2):** Member directory (opt-in)
**Phase 4 (Q3):** Private Slack/Discord integration

### 4.3 Personalization Opportunities

**Data Already Collected:**
- User account (email, tier)
- Saved Counsel (interests)
- Chat history (questions asked)
- Vault collections (organized content)

**Personalization Roadmap:**

1. **Homepage personalization** (logged-in users)
   - "Continue where you left off" section
   - "Recommended for you" based on saves

2. **Counsel recommendations**
   - "Related Counsel" on article pages
   - "Because you saved X" suggestions

3. **Progressive profiling**
   - Onboarding quiz: Role, company size, SPM maturity
   - Tailor content recommendations

4. **Triggered emails**
   - "New Counsel in your saved topics"
   - "Complete your collection" nudges

### 4.4 Email/Notification Strategy

**Current:** Newsletter opt-in, no transactional emails observed.

**Recommended Email Program:**

| Email Type | Trigger | Content |
|------------|---------|---------|
| Welcome | Account creation | What you can do, quick links |
| Weekly Digest | Thursday AM | New Counsel, featured tools |
| Inactivity | 14 days no login | "Here's what you missed" |
| Usage milestone | 10 Counsel saved | "You're building expertise" |
| Upgrade nudge | Free tier limit hit | Value of SPARCC |
| Office Hours reminder | 24h before | Event details, add to calendar |

---

## 5. CONVERSION OPTIMIZATION

### 5.1 Free-to-Paid Conversion Path

**Current Funnel:**
1. Anonymous -> Plan Check (working)
2. Anonymous -> Newsletter (working)
3. Anonymous -> Account creation (unclear CTA)
4. Free Account -> Use AI Chat (3 messages)
5. Hit limit -> Upgrade prompt (working)
6. Upgrade -> Stripe checkout (working)

**Conversion Issues:**

| Stage | Issue | Fix |
|-------|-------|-----|
| 2->3 | No transition from newsletter to account | Add "Create account to save Counsel" |
| 3->4 | Free account value unclear | Onboarding flow showing features |
| 4->5 | 3 messages very limiting | Increase to 10 or add weekly reset |
| 5->6 | Upgrade value not compelling | Show usage stats, what you'd unlock |

### 5.2 Lead Capture Opportunities

**Currently Captured:**
- Newsletter signups (/subscribe, /syndicate)
- Account creation (/auth/signin)

**Missing Lead Capture Points:**

| Page | Opportunity | Capture Method |
|------|-------------|----------------|
| /analyze/plan-check (results) | High intent | "Email me my full report" |
| /learn/glossary | Educational | "Get the complete glossary PDF" |
| /benchmarks | Data seekers | "Download benchmark report" |
| /vendors | Evaluators | "Get vendor comparison matrix" |
| Blog/Counsel articles | Content readers | In-line newsletter CTA |
| Exit intent | All pages | Modal with lead magnet |

**Lead Magnet Ideas:**
1. "The 10 Comp Plan Red Flags Checklist" (PDF)
2. "SPM Vendor Selection RFP Template" (Google Doc)
3. "Governance Maturity Self-Assessment" (Interactive)
4. "Accelerator Design Cheat Sheet" (One-pager)

### 5.3 Friction Points in User Journey

**Identified Friction:**

| Journey | Friction Point | Severity | Fix |
|---------|---------------|----------|-----|
| Plan Check | No account required - good! | N/A | Keep frictionless |
| Plan Check | No email capture after results | High | Add "Email my results" |
| Plan Check | No clear next step after results | High | Add "Talk to Todd" CTA |
| Account creation | No visible signup CTA | High | Add "Create Free Account" button |
| Upgrade | Must find /settings/billing | Medium | Add upgrade prompts in-context |
| Counsel save | Requires account | Low | Appropriate gate |
| Contact form | Disabled | High | Enable or remove |

### 5.4 Conversion Rate Optimization Recommendations

**A/B Test Ideas:**

1. **Hero CTA text:** "Run a Plan Check" vs "Check Your Plan Free" vs "Upload Your Comp Plan"
2. **Pricing page:** Single SPARCC tier vs Free/Pro/Enterprise
3. **Lead magnet:** PDF download vs Interactive tool
4. **Social proof:** Logo bar vs Testimonials vs Metrics
5. **Newsletter CTA:** "Subscribe" vs "Join The Syndicate" vs "Get Weekly SPM Reality"

**Tracking Requirements:**
- Plan Check uploads (completion rate)
- Newsletter signups (by source)
- Account creations (funnel step)
- Upgrade conversions (by trigger)
- Counsel saves (engagement depth)

---

## 6. SPM-SPECIFIC RECOMMENDATIONS

### 6.1 What Comp Design Professionals Actually Want

Based on industry research and the site's positioning:

| Need | Intensity | Current State | Gap |
|------|-----------|---------------|-----|
| "Am I doing this right?" validation | Very High | Plan Check exists | Need more specific feedback |
| Peer benchmarks ("what do others do?") | Very High | Coming Soon | Critical gap |
| Vendor truth (beyond demos) | High | Coming Soon | Huge differentiation opportunity |
| Quick reference (terms, formulas) | High | Glossary exists | Expand significantly |
| Templates/starting points | Medium | None | Add downloadable templates |
| Community of peers | Medium | Newsletter only | Phased community build |
| Expert help (consulting) | Variable | Services exist | Enable contact form |

### 6.2 Pain Points in the SPM World

**Top Pain Points (and content opportunities):**

1. **"My accelerator is breaking forecasting"**
   - Content: "Why Accelerators Hurt More Than Help" essay
   - Tool: Accelerator Impact Calculator
   - Counsel: How to design accelerators that don't distort behavior

2. **"We can't get credits right (splits, overlays)"**
   - Content: Component Card on Splits
   - Tool: Split Manager simulation
   - Counsel: Credit allocation decision framework

3. **"Our vendor implementation is failing"**
   - Content: Vendor Scorecards with implementation reality
   - Counsel: "What to do when your SPM rollout is dying"
   - Services: Assessment offering

4. **"Finance and Sales are fighting about comp"**
   - Content: Governance Maturity model
   - Counsel: "How to build a comp governance committee"
   - Tool: Governance self-assessment

5. **"We're evaluating vendors and drowning in demos"**
   - Content: Vendor comparison matrix
   - Tool: Vendor fit assessment
   - Lead magnet: RFP template

### 6.3 Must-Have Features

**P0 - Launch Blockers (Without these, credibility suffers):**

1. **Real content in "Coming Soon" sections**
   - At minimum: 5 Component Cards, 3 Vendor Scorecards, 1 Benchmark viz

2. **Working contact form**
   - Cannot offer services with disabled contact

3. **Visible pricing page**
   - Transparency builds trust

4. **Social proof**
   - Logo bar, testimonials, or metrics

**P1 - Growth Enablers:**

5. **Lead capture on Plan Check results**
6. **SPM 101 course (free, ungated)**
7. **Interactive benchmark visualizations**
8. **Downloadable templates/checklists**

**P2 - Retention/Monetization:**

9. **Personalized Counsel recommendations**
10. **Community discussion on articles**
11. **Progress tracking / certificates**
12. **Premium tier with exclusive content**

### 6.4 Competitive Landscape Considerations

**Direct Competitors:**
- None with this exact positioning (SPM-focused clearing house)
- This is a blue ocean opportunity

**Indirect Competitors:**
| Competitor | Strength | Toddfather Counter |
|------------|----------|-------------------|
| Vendor blogs | SEO, production value | Unbiased perspective |
| Alexander Group | Research credibility | Practitioner voice |
| RevOps communities | Network effects | SPM depth |
| Comp consultants | Relationships | Scalable content |

**Competitive Moats to Build:**
1. **Content library depth** - Be the Wikipedia of SPM
2. **Tool stickiness** - Plan Check as habit
3. **Community** - Peer network lock-in
4. **Brand personality** - "The Toddfather" is memorable

---

## 7. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)

**Week 1: Critical Fixes**
- [ ] Enable contact form or add Calendly embed
- [ ] Create /pricing page with tier comparison
- [ ] Add newsletter signup to Plan Check results page
- [ ] Add logo bar placeholder to homepage

**Week 2: Content Sprint**
- [ ] Write 5 Component Cards (Quota, Accelerator, Split, Territory, Measure)
- [ ] Expand Glossary to 25 terms
- [ ] Create 1 interactive benchmark (Payout Curve explorer)

**Week 3: Trust Building**
- [ ] Add 3 testimonials (or request from network)
- [ ] Create "About Todd" bio section on /toddfather
- [ ] Add "Plans Analyzed" counter (even if small number)

**Week 4: Conversion Optimization**
- [ ] Add "Create Free Account" CTA to nav
- [ ] Implement exit intent lead capture
- [ ] Create first lead magnet (Comp Plan Red Flags Checklist)

### Phase 2: Growth (Months 2-3)

**Month 2:**
- [ ] Launch 3 Vendor Scorecards (Xactly, CaptivateIQ, Varicent)
- [ ] Create SPM 101 course (5 modules)
- [ ] Build Governance Maturity self-assessment
- [ ] Implement personalized Counsel recommendations

**Month 3:**
- [ ] Add discussion/comments to Counsel
- [ ] Launch Ask Todd Live monthly series
- [ ] Create 10 Todd Takes videos
- [ ] Build advanced Plan Check with detailed reports

### Phase 3: Monetization (Months 4-6)

- [ ] Launch tiered pricing (Free / Pro / Enterprise)
- [ ] Create gated premium content
- [ ] Build consulting pipeline from content
- [ ] Add certification/badge program

---

## 8. METRICS TO TRACK

### Engagement Metrics
- Plan Check uploads per week
- Newsletter open rate / click rate
- Counsel pages per session
- Vault saves per user
- AI Chat messages per user

### Conversion Metrics
- Visitor -> Newsletter signup rate
- Visitor -> Account creation rate
- Free -> Paid conversion rate
- Plan Check -> Contact form rate

### Content Metrics
- Top Counsel by views
- Search queries (what people want)
- Glossary term lookups
- Time on page by content type

### Business Metrics
- MRR from subscriptions
- Consulting inquiry volume
- Newsletter list growth
- Organic search traffic

---

## APPENDIX: DESIGN QA CHECKLIST

Running the standard QA checklist against current state:

- [x] One primary CTA per page, repeated 2-4 times - **PASS** (Plan Check)
- [ ] H1 is outcome-based, not feature-based - **PARTIAL** (some pages)
- [ ] Proof appears above mid-scroll - **FAIL** (no logos/testimonials)
- [x] Sections are scannable - **PASS** (good use of cards)
- [x] Mobile layout sanity - **PASS** (responsive)
- [x] Accessibility: contrast, focus order, semantic headings - **PASS**
- [ ] No invented claims - **FAIL** (many "Coming Soon" promises)

---

*Analysis complete. This document should be used as the foundation for a prioritized sprint plan.*
