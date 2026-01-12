# Counsel Schema Specification

## Overview

**Counsel** is the core reusable SPM artifact in the SPARCC ecosystem.

A Counsel is a structured, actionable piece of SPM guidance that:
- Stems from a Todd Take or Ask Todd Live session
- Is tagged to your SPM framework (channels + tags)
- Can be collected, customized, shared, and applied
- Is audit-ready and explicitly reasoned

---

## Core Fields (Required)

```yaml
# Filename convention: kebab-case-title.md
filename: quota-setting-strategy.md

# Frontmatter (YAML)
slug: quota-setting-strategy          # URL safe, unique
title: Quota Setting Strategy         # Display title
oneLiner: >
  Quotas drive behavior when they're credible—here's how to build ones reps believe
  # One sentence. Punchy. Self-contained. This is the collecting reason.

type: CHECKLIST                       # See Type Taxonomy below
channel: QUOTA                        # See Channel Taxonomy below
tags: [quotas, planning, credibility, attainment]  # 3-5 max
difficulty: OPERATOR                 # OPERATOR | MANAGER | ARCHITECT

# Metadata
timeToApplyMin: 30                    # How many minutes to implement
videoSource: "Todd Takes #12"         # Which video spawned this (optional)
linkedTab: null                       # Cross-reference to another Counsel
createdDate: 2025-12-23
version: 1.0

# Optional (Power features)
subtype: "Ledger-backed"              # OPTIONAL: Ledger-backed | Field-tested | Dispute-safe
evidenceBundle: true                  # Can this be part of an evidence bundle?
applicableSystems: [Xactly, Varicent, Custom] # If system-specific
```

---

## Type Taxonomy

### CHECKLIST
A numbered, checkbox-friendly validation or setup sequence.

**Use when:** You need to guide someone through steps in order.

Example titles:
- "Quota Setting Checklist"
- "Payout Curve Sanity Check"
- "SPIFF Launch Pre-Flight"

Structure:
- Problem statement
- Grouped checklist (Before / During / After)
- Common mistakes
- Worked example

---

### DIAGNOSTIC
A diagnostic framework to identify what's broken in someone's current setup.

**Use when:** You're naming a hidden problem or helping someone assess risk.

Example titles:
- "Territory Design Gotchas"
- "Draw Program Abuse Patterns"
- "Governance Maturity Assessment"

Structure:
- What the problem looks like
- Why it happens (systemic root)
- 3-7 specific warning signs
- Impact if left unfixed
- Next steps (usually a CHECKLIST or PROTOCOL)

---

### PROTOCOL
Step-by-step process for a specific operation.

**Use when:** You're documenting how to do something correctly.

Example titles:
- "Calculation Engine Best Practices"
- "Quota Relief Process"
- "Dispute Resolution Protocol"

Structure:
- Objective & scope
- Prerequisites
- Step-by-step procedure
- Decision trees (if/then)
- Audit trail requirements
- Common pitfalls

---

### TEMPLATE
A reusable artifact: policy, email, calculator, or framework.

**Use when:** People need something they can copy/customize immediately.

Example titles:
- "SPM Governance Framework (Template)"
- "Dispute Appeal Email (Reusable)"
- "Payout Curve Model (Excel Template)"

Structure:
- How to customize this template
- What NOT to change
- Example + blank version
- Download links (md/doc/xlsx)
- Notes on legal/compliance risk

---

### FIELD NOTE
A short, field-tested insight or war story.

**Use when:** You're sharing something you learned the hard way.

Example titles:
- "Why Accelerators Break Forecasting"
- "The Quiet Way Draw Programs Destroy Trust"
- "When Quota Relief Becomes Unfair"

Structure:
- The situation
- What most people get wrong
- What happened
- The takeaway (1-2 sentences)
- How to avoid it

---

## Channel Taxonomy (Framework-aligned)

Every Counsel maps to exactly ONE primary channel. This prevents drift.

```
PLAN_DESIGN         — How to structure a comp plan
MEASURES_CREDITING  — What to measure and how to credit it
PAYOUT_CURVES       — Rates, accelerators, decelerations, caps
QUOTA_TERRITORY     — Quota setting, territory assignment, gaps
DRAWS_SPIFFS        — Draw management, SPIFF governance, payback logic
GOVERNANCE          — Controls, approvals, change management, auditability
DISPUTES_APPEALS    — How reps challenge payouts, resolution process
ICM_OPS             — Data pipeline, calculations, statements, reconciliation
AI_FOR_SPM          — Where AI helps, where it fails, governance of AI
LIBRARY             — Templates, policies, frameworks (meta-channel)
```

---

## Tag Taxonomy

Tags are descriptive, not organizational. Use 3-5 per Counsel.

Categories (examples per category):

**Behavioral:**
incentive-design, behavior-change, rep-motivation, fairness, transparency

**Technical:**
calculation, modeling, data-quality, reconciliation, auditability

**Operational:**
planning, scheduling, process, governance, control

**Risk:**
fairness-risk, audit-risk, dispute-risk, regulatory-risk

**Domain:**
quotas, accelerators, territories, draws, spiffs, policies, exceptions

**Audience:**
comp-ops, finance, legal, sales-leadership, reps

---

## Difficulty Levels

### OPERATOR
"I manage comp day-to-day. I need to do this."

Example:
- Running a quota relief mid-year
- Handling a payout dispute
- Uploading Q4 data

Time to understand: 15-30 min
Time to apply: 30-120 min

---

### MANAGER
"I oversee comp operations. I need to understand AND execute."

Example:
- Setting up a new SPIFF
- Designing territory assignments
- Planning a comp plan overhaul

Time to understand: 30-60 min
Time to apply: 1-3 hours

---

### ARCHITECT
"I design systems. This is foundational."

Example:
- Full governance framework
- Payout curve strategy
- AI integration principles

Time to understand: 1-2 hours
Time to apply: Days-weeks

---

## Subtypes (Optional, but powerful)

### Ledger-backed
This Counsel has explicit math, audit trail, or policy backing.

Use this if:
- There's a calculation or formula
- It's defensible in a dispute
- It requires documentation

Examples:
- "Quota Relief Protocol (Ledger-backed)"
- "Draw Payback Math (Ledger-backed)"

---

### Field-tested
This Counsel is from real experience, not theory.

Use this if:
- You or clients have implemented it
- You've seen it work or fail
- You can cite specific outcomes

Examples:
- "Territory Design Gotchas (Field-tested)"
- "SPIFF Abuse Patterns (Field-tested)"

---

### Dispute-safe
This Counsel helps you create defensible, audit-ready decisions.

Use this if:
- Legal or finance might challenge it
- You need a paper trail
- Reps will ask "Why?"

Examples:
- "Dispute-Proof Payout Evidence Bundle (Dispute-safe)"
- "Quota Relief Justification Template (Dispute-safe)"

---

## File Structure (Example)

```markdown
---
slug: quota-setting-strategy
title: Quota Setting Strategy
oneLiner: Quotas drive behavior when they're credible—here's how to build ones reps believe
type: CHECKLIST
channel: QUOTA_TERRITORY
tags: [quotas, planning, credibility, attainment]
difficulty: OPERATOR
timeToApplyMin: 30
videoSource: null
linkedTab: null
subtype: Ledger-backed
evidenceBundle: true
applicableSystems: []
createdDate: 2025-12-23
version: 1.0
---

## The Core Problem

[Counsel content starts here]

## Checklist

[Structured steps]

## Common Mistakes

[Gotchas]

## Worked Example

[Concrete case]

## Download

[Template links]

---

## Related Counsel

- [Link to related counsel]
```

---

## Publishing Rules

1. **One thing per Counsel.** Don't bundle unrelated concepts.
2. **Make the type obvious.** Someone should know if it's a checklist, protocol, or template in 3 seconds.
3. **Link to one video.** If it came from Todd Takes, cite it. If multiple, it's too broad.
4. **Tag for search.** Tags make Counsel discoverable in the Vault.
5. **Make it moveable.** It should work as a standalone markdown file AND as a web page.

---

## Version History & Updates

When Counsel changes:
- Increment `version` number
- Add changelog at bottom of file
- If major change, consider creating a new Counsel instead
- Archive old versions (don't delete)

Example:
```yaml
version: 1.0  # Initial release
version: 1.1  # Clarified step 3 (Dec 2025)
version: 2.0  # Major restructure + new workflow (Jan 2026)
```

---

## Quality Checklist

Before publishing, a Counsel should pass:

- [ ] **Clarity:** Someone unfamiliar with your voice can follow it
- [ ] **Scope:** It solves one problem, not three
- [ ] **Actionability:** Someone can walk away and DO something
- [ ] **Audit-readiness:** It would hold up in a dispute or audit
- [ ] **Linkage:** It connects to other Counsel or videos
- [ ] **Tagging:** 3-5 tags, one channel, clear difficulty level
- [ ] **Format:** Markdown is clean, headings are clear, lists are scannable

---

## Counsel Generation (from Todd Takes)

When you publish a Todd Take, SPARCC generates 3-7 Counsel artifacts:

**Process:**
1. Upload Todd Take transcript
2. SPARCC identifies actionable insights
3. You approve/edit generated Counsel
4. Each Counsel gets type, channel, tags, difficulty
5. Counsel are published simultaneously with video

**Example:**
- Todd Take: "Why Accelerators Break Forecasting" (6 min)
- Generated Counsel:
  - CHECKLIST: "Accelerator Risk Assessment"
  - DIAGNOSTIC: "How Accelerators Distort Behavior"
  - FIELD NOTE: "The Forecast Cliff Case Study"
  - TEMPLATE: "Safe Accelerator Structure (Template)"

This is why the system works: video attracts → Counsel converts → Vault collects → Community discusses.
