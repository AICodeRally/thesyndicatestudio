---
slug: strategy-to-comp-translation
title: Strategy to Comp Translation
oneLiner: If strategy can't be expressed in comp terms, it won't execute
type: CHECKLIST
channel: PLAN_DESIGN
tags: ["strategy", "translation", "design"]
difficulty: ARCHITECT
timeToApplyMin: 25
---

## Problem Statement

Most strategic plans are written in language that can't be translated into compensation mechanics. "Increase market share" or "improve customer experience" are goals—not behaviors you can pay for.

The gap between strategy language and comp language creates two problems:
1. **Strategy doesn't execute** because reps can't connect actions to payouts
2. **Comp doesn't align** because designers guess at what strategy "probably means"

If you can't write a comp plan component that directly pays for a strategic priority, that priority won't happen at the rep level.

## Mechanism (Why This Happens)

Strategy is written for board decks and annual planning. It's aspirational, high-level, and often qualitative.

Compensation is transactional. It pays for discrete, measurable actions that happen this quarter.

The translation problem:
- **Strategy**: "Become the leader in enterprise SaaS"
- **Comp question**: "What do I pay, to whom, and when?"
- **Gap**: Leadership expects ops to "figure it out"

Without explicit translation, ops defaults to:
- Paying for revenue (easy to measure)
- Treating all revenue equally (simpler math)
- Adding accelerators (because everyone has them)

None of which may align with "enterprise leadership."

## Recommended Actions

### 1. Strategic Priority Decomposition (15 min per priority)

For each strategic priority, answer:

**What behavior drives it?**
- Not "what should happen" (outcome)
- But "what should reps do" (action)

**Example**:
- **Priority**: Expand enterprise accounts
- **Behavior**: Sell multi-year contracts to accounts >$1M ARR
- **Not behavior**: "Focus on enterprise" (too vague)

**Who should do it?**
- Which roles? (AEs, SEs, CSMs?)
- Which segments? (All territories or specific ones?)
- When in the customer lifecycle?

**How do we measure it?**
- Leading indicator (actions taken)
- Lagging indicator (outcomes achieved)
- Both? (You can pay on either or both)

**What's the economic value?**
- Revenue impact (incremental, not total)
- Margin impact (if different from average)
- Lifetime value impact (if multi-year)

### 2. Comp Component Design (Per priority)

Once you have behavior + measurement, design the comp component:

**Component Type**:
- **Quota multiplier**: Pays more for strategic deals (e.g., 1.5x for enterprise)
- **Separate quota**: Tracks strategic metric independently (e.g., 20% of quota = enterprise ARR)
- **Accelerator**: Kicks in when strategic threshold hit (e.g., 150% payout after 3 enterprise deals)
- **SPIFFs**: Short-term focus on strategic launches

**Component Mechanics**:
- **Threshold**: Minimum to qualify (prevents gaming small deals)
- **Cap**: Maximum payout (controls cost)
- **Timing**: When does it pay? (Monthly, quarterly, on close?)

**Component Weighting**:
- How much of total comp? (5% = signal, 25% = real priority)
- Can rep hit quota without it? (If yes, it's optional—is that intended?)

### 3. Translation Test (5 min per component)

Ask a rep to explain the plan component in their own words:
- "What do I need to do to earn this?"
- "How much more will I make if I do it?"
- "What happens if I ignore it?"

If they can't answer clearly, your translation failed.

### 4. Reverse Test (10 min)

Reverse engineer the strategy from the comp plan:
- Give the plan to someone who doesn't know the strategy
- Ask: "What do you think our priorities are?"
- Compare to actual strategic priorities

If they don't match, the plan doesn't encode the strategy.

## Common Pitfalls

**"Strategy is too complex to capture in comp"**
Then strategy is too complex to execute. If you can't pay for it, reps won't know what to do.

**"We'll communicate the strategy separately"**
Communication doesn't override incentives. Reps believe what you pay for, not what you say.

**"Our strategy changes too often for comp to keep up"**
Either your strategy isn't real (annual theater), or your comp cycles are too long (fix that).

**"We added a slide in the comp deck explaining strategy"**
Reps read two things: their paycheck and their quota attainment. If it's not in those numbers, it doesn't exist.

**"We weight strategic deals at 1.1x instead of 1.0x"**
A 10% lift isn't a priority—it's a rounding error. Real priorities need real weight (1.5x+, or separate quota).

## Assumptions

- Reps act on clear economic signals, not strategy memos
- If you can't measure a behavior, you can't pay for it (and shouldn't)
- Comp components must be simple enough to explain in <60 seconds
- Weight = priority (if everything is weighted equally, nothing is prioritized)

## Translation Examples

### Example 1: "Grow Enterprise"
**Strategic Priority**: Become the leader in enterprise accounts

**Translation**:
- **Behavior**: Close deals >$100K ARR with <500 employee companies
- **Measurement**: Count of enterprise deals + ARR from enterprise
- **Comp Component**:
  - 30% of quota = Enterprise ARR (separate quota line)
  - 2x multiplier on enterprise deals
  - Threshold: $100K minimum deal size
  - Timing: Pays on booking (not just pipeline)

**Test**: "If I close $500K total, with $200K from enterprise, how much do I make vs. $500K all SMB?"
- Answer should heavily favor enterprise mix

### Example 2: "Improve Retention"
**Strategic Priority**: Reduce churn in first 12 months

**Translation**:
- **Behavior**: CSMs complete onboarding milestones in first 90 days
- **Measurement**: % of accounts hitting "activated" status by day 90
- **Comp Component**:
  - 20% of CSM comp tied to activation rate
  - Threshold: 70% activation rate (minimum)
  - Accelerator: 150% payout at 90%+ activation
  - Timing: Measured quarterly

**Test**: "If I skip onboarding to close more renewals, what happens to my comp?"
- Answer: You lose 20% of comp (makes onboarding non-optional)

### Example 3: "Launch New Product"
**Strategic Priority**: Get product X to 20% of revenue in Year 1

**Translation**:
- **Behavior**: AEs sell product X in every deal (attach rate)
- **Measurement**: % of deals including product X + Product X ARR
- **Comp Component**:
  - SPIFF: $500 per product X deal (first 2 quarters only)
  - Quota: 15% of total quota = product X ARR (ongoing)
  - Accelerator: 200% payout if product X quota >120%
  - Timing: SPIFF pays monthly, quota pays quarterly

**Test**: "Is it worth selling product X vs. focusing on core product?"
- Answer: Yes in Q1-Q2 (SPIFF makes it clearly worth it), still yes in Q3-Q4 (quota weight ensures it)

## Related Content

**Videos**:
- Episode 2: "Intelligent Sales Strategy"
- Episode 3: "Intelligent Sales Planning"

**Next Counsel**:
- priority-encoding-via-pay
- planning-to-quota-traceability
- payout-curve-behavior-map
