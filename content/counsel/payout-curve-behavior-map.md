---
slug: payout-curve-behavior-map
title: Payout Curve Behavior Map
oneLiner: Curves don't just pay—they shape risk appetite, timing, and discounting
type: NOTE
channel: PAYOUT_CURVES
tags: ["curves", "behavior", "risk", "timing"]
difficulty: OPERATOR
timeToApplyMin: 20
---

## Problem Statement

Most comp teams design payout curves thinking only about cost: "What should we pay at 80%, 100%, 120%?"

But curves don't just determine cost—they encode behavior. Every curve shape sends signals about:
- **Risk appetite**: Should reps chase big deals or play it safe?
- **Timing**: When should deals close (early quarter, end of quarter)?
- **Discounting**: When is it worth cutting price to close?
- **Effort allocation**: Should reps focus on pipe generation or closing?

If you design curves for cost, you get surprising behavior. If you design curves for behavior, you control cost *and* outcomes.

## Mechanism (Why This Happens)

A payout curve is a behavior function. It answers: "How much do I get paid for incremental effort?"

Reps solve a daily optimization problem:
- **Effort** = Time, risk, political capital, discounting
- **Return** = Payout increment from that effort
- **Decision** = Do more of high-return activities, avoid low-return activities

The curve shape controls which activities have high return.

### Curve Shape → Behavior Map

**Linear (1:1 payout at all attainment levels)**:
- Behavior: Reps are indifferent to attainment level
- Risk appetite: Neutral (big deal = small deal on per-dollar basis)
- Timing: No incentive to pull deals forward or delay
- Use case: You want consistent, predictable effort

**Decelerating (higher payout rate at lower attainment)**:
- Behavior: Reps prioritize getting to threshold, then coast
- Risk appetite: Risk-averse (secure base payout, avoid stretch)
- Timing: Pull deals forward to secure early payout
- Use case: You need minimum performance from everyone

**Accelerating (higher payout rate at higher attainment)**:
- Behavior: Reps push for maximum attainment
- Risk appetite: Risk-seeking (big deals worth the effort)
- Timing: End-of-period deal pushes
- Use case: You want top performers to go all-out

**Step function (payout jumps at thresholds)**:
- Behavior: Reps game thresholds (pull deals to hit tier, sandbag to protect next tier)
- Risk appetite: Extreme (all-or-nothing at threshold)
- Timing: Massive end-of-period concentration
- Use case: Rare (only for binary outcomes like President's Club)

### Key Inflection Points

Reps optimize around curve inflection points:

**Threshold (payout starts)**:
- Below threshold = zero incremental value → reps give up or sandbag
- Example: 70% threshold → rep at 65% stops trying (can't hit 70%)

**Quota (100% attainment)**:
- If curve flattens at quota → reps stop at 100%
- If curve accelerates at quota → reps push past 100%

**Cap (payout ends)**:
- Reps stop at cap (why work for free?)
- Reps sandbag near cap (delay deals to next period)

## Recommended Actions

### 1. Map Your Current Curve to Behavior (15 min)

Plot your payout curve (attainment % vs. payout %).

Identify inflection points:
- Where does payout start? (threshold)
- Where does slope change? (accelerators/decelerators)
- Where does payout cap? (if at all)

For each inflection point, ask:
- **What behavior does this create?**
- **Is that behavior intended?**
- **What's the cost if reps game this point?**

Example:
- Curve: 50% threshold, linear to 100%, 2x accelerator >100%, cap at 200%
- Behaviors:
  - Reps at 45% give up (can't hit 50%)
  - Reps at 95% push hard (linear payout, almost there)
  - Reps at 100% push harder (2x accelerator kicks in)
  - Reps at 190% sandbag (don't want to hit cap and lose deals)

### 2. Behavior-First Curve Design (30 min)

Instead of "What should we pay?", ask "What behavior do we want?"

**Step 1: Define desired behaviors**
- Risk appetite: Should reps take big swings or play it safe?
- Timing: When should deals close (evenly or end-loaded)?
- Stretch: Should top performers go all-out or coast after quota?

**Step 2: Map behaviors to curve shapes**
- Want consistent effort? → Linear curve
- Want everyone to hit base? → Decelerating curve (front-loaded)
- Want top performers to maximize? → Accelerating curve (back-loaded)
- Want no gaming? → Avoid thresholds and caps

**Step 3: Set inflection points**
- Threshold: Only if you need a quality gate (e.g., "70% minimum or you're underperforming")
- Accelerator: Only if you want stretch behavior (e.g., "125%+ is exceptional, pay 2x")
- Cap: Only if cost control is more important than maximizing output (rare)

**Step 4: Test the curve**
Model 3 rep scenarios:
- Rep at 60% attainment (underperformer)
- Rep at 100% attainment (solid performer)
- Rep at 150% attainment (top performer)

For each, calculate:
- Incremental payout for next deal
- Does that match desired behavior?

### 3. Timing Behavior Analysis (Per curve)

Curves control when deals close. Map it:

**Linear curve**:
- Incremental value is constant throughout period
- Reps spread effort evenly (no end-of-quarter push)

**Accelerating curve (starts >100%)**:
- Incremental value increases as quarter progresses
- Reps backload deals to hit accelerator
- Expect Q3/Q4 weighted revenue (80%+ of quota in last month)

**Threshold-based curve**:
- Incremental value spikes near threshold
- Reps time deals to hit threshold exactly
- Expect "just barely made it" phenomenon (lots of reps at 100-105%)

**Test**: Look at historical close dates. Do they cluster? Where?
- If 60% of deals close in last 2 weeks → curve is creating timing pressure
- If deals spread evenly → curve is timing-neutral

### 4. Discount Behavior Analysis (Per curve)

Curves control when discounting is worth it.

**Math**: Discount is worth it if:
```
(Payout with discount) > (Expected payout without discount × Probability of close)
```

Example:
- Deal: $100K at list price, payout = $10K
- Discount: 20% → $80K, payout = $8K
- Probability: 50% close at list, 90% close with discount
- Decision: Discount if $8K > ($10K × 50%) → $8K > $5K → Yes, discount

**Curve impact**:
- **Low payout rate** (e.g., 50% at-risk) → discounting less attractive
- **High payout rate** (e.g., 150% accelerator) → discounting very attractive
- **Near threshold** → heavy discounting to secure payout

**Test**: If rep is at 95% attainment, one deal away from threshold at 100%, how much would they discount to close it?
- Answer: A LOT (threshold is binary, discount is marginal)

### 5. Risk Appetite Test (Per curve)

Curves control whether reps chase big deals or play it safe.

**Linear curve**: Risk-neutral
- Big deal = 10 small deals (same effort, same return per dollar)
- Reps choose based on close probability, not deal size

**Accelerating curve**: Risk-seeking
- Big deal can hit accelerator → disproportionate return
- Reps chase whales (high risk, high reward)

**Decelerating curve**: Risk-averse
- Big deal might overshoot → wasted effort
- Reps avoid risk, secure base payout

**Test**: Track deal size distribution by attainment level
- If reps >100% chase bigger deals → accelerator is working
- If reps >100% chase same-size deals → accelerator too weak

## Common Pitfalls

**"We added an accelerator to drive stretch"**
If accelerator kicks in at 120%, and only 10% of reps hit 120%, it's not driving behavior—it's just a cost.

**"We capped at 200% to control cost"**
You just told reps to stop working at 200%. If they hit it in November, December revenue drops to zero.

**"Linear is boring, let's add some excitement"**
Excitement = gaming. Linear is clean because it doesn't create arbitrage opportunities.

**"We pay 2x at 150% because top performers deserve it"**
Do you want to *reward* top performers (pay more for same work), or *drive* top performers (pay for incremental work)? Accelerators should be marginal, not retroactive.

**"Our curve has 5 tiers to be precise"**
Five tiers = five gaming opportunities. Simplicity beats precision.

## Curve Design Anti-Patterns

❌ **Threshold + Cap**
- Reps below threshold give up
- Reps near cap sandbag
- Effective payout window is narrow
- Fix: Remove threshold OR cap (ideally both)

❌ **Steep accelerator at 100%**
- Example: 50% payout at 99%, 150% payout at 101%
- Reps sandbag at 95% to ensure hitting 100%
- Fix: Gradual slope (no cliffs)

❌ **Multiple accelerators**
- Example: 1.5x at 110%, 2x at 130%, 2.5x at 150%
- Reps optimize for tiers, not revenue
- Fix: Single accelerator with smooth slope

❌ **Decelerator after quota**
- Example: 100% payout up to quota, 75% payout after
- Reps stop at quota (why work for less?)
- Fix: Never pay less per dollar above quota

## Example Curves and Behavior

### Curve A: Pure Linear (1:1)
```
Attainment → Payout
0%  → 0%
50% → 50%
100% → 100%
150% → 150%
```
**Behavior**: Consistent effort, no gaming, timing-neutral
**Use case**: Transactional sales, volume-driven roles

### Curve B: Threshold + Linear
```
Attainment → Payout
0-70%   → 0%
70%     → 50%
100%    → 100%
150%    → 150%
```
**Behavior**: Push to hit 70%, then linear
**Problem**: Reps at 60% give up, reps sandbag at 65% to ensure hitting 70%
**Use case**: Roles where <70% = unacceptable

### Curve C: Linear + Accelerator
```
Attainment → Payout
0%   → 0%
100% → 100%
125% → 150% (2x slope from 100-125%)
150% → 200%
```
**Behavior**: Steady to quota, push hard after quota
**Use case**: Want top performers to maximize

### Curve D: Decelerating
```
Attainment → Payout
0%   → 0%
50%  → 75%  (1.5x slope)
100% → 100% (1x slope)
150% → 125% (0.5x slope)
```
**Behavior**: Front-loaded effort, coast after quota
**Use case**: Want minimum acceptable performance from everyone

## Related Content

**Videos**:
- Episode 6: "Intelligent Sales Performance"
- Episode 12: "Accelerator Timing Effects"

**Next Counsel**:
- accelerator-timing-effects
- cap-and-decel-side-effects
- certainty-vs-upside-tradeoff
