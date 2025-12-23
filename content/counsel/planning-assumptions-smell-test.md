---
slug: planning-assumptions-smell-test
title: Planning Assumptions Smell Test
oneLiner: Planning fails when assumptions are invisible—and reps will arbitrage them
type: CHECKLIST
channel: PLAN_DESIGN
tags: ["planning", "assumptions", "risk"]
difficulty: ARCHITECT
timeToApplyMin: 30
---

## Problem Statement

Every sales plan is built on assumptions. Most are never written down, tested, or defended. When reality diverges from assumptions, three things happen:

1. **Quota becomes unfair** (based on assumptions that don't hold)
2. **Costs explode** (reps find and exploit assumption gaps)
3. **Trust breaks** (reps feel gaslit when you defend bad assumptions)

Hidden assumptions are planning debt. The longer they stay hidden, the more expensive they become.

## Mechanism (Why This Happens)

Planning assumptions fall into three categories:

### Market Assumptions
- TAM/SAM will grow at X%
- Win rate will stay at Y%
- Average deal size is $Z
- Sales cycle is N months

### Capacity Assumptions
- Reps will be fully ramped by month M
- Churn will be <X% per quarter
- Each rep can handle Y accounts
- Coverage model will execute as designed

### Behavioral Assumptions
- Reps will sell the full portfolio (not cherry-pick)
- Discounting will stay within approved bands
- Pipeline will convert at historical rates
- Territory moves won't disrupt Q1

When you build quota on assumption X, but reality delivers X-20%, three outcomes:
- **Quota is missed** (entire team underperforms)
- **Plan is gamed** (reps exploit the gap you created)
- **Exceptions pile up** (you manually fix what planning broke)

The core problem: **assumptions are treated as facts until they're catastrophically wrong**.

## Recommended Actions

### 1. Assumption Inventory (30 min)

Extract every assumption in your current plan. Ask:

**Market assumptions**:
- What market size did we assume?
- What win rate?
- What deal mix (new vs. expansion vs. renewal)?
- What seasonality?

**Capacity assumptions**:
- How many reps, when ramped?
- What productivity per rep?
- What coverage ratio (reps:accounts)?
- What happens if we lose 10% of reps in Q1?

**Behavioral assumptions**:
- Will reps sell products equally?
- Will they follow territory assignments?
- Will they maintain pipeline discipline?
- Will they hit activity metrics?

**Write them all down**. If you can't articulate the assumption, it's not validated—it's a guess.

### 2. Assumption Testing (Per assumption)

For each assumption, run these tests:

**Historical Test**: Has this assumption held in the past 3 years?
- Yes → Probably safe
- No → Why do we think it will now?
- No data → This is a guess, not an assumption

**Sensitivity Test**: If this assumption is 20% wrong, what happens to the plan?
- Nothing meaningful → Assumption doesn't matter (drop it)
- Quota miss <10% → Acceptable risk
- Quota miss >10% → Critical assumption (needs monitoring)
- Plan breaks → Unacceptable risk (redesign required)

**Arbitrage Test**: Can reps exploit this assumption for personal gain?
- Example: "Reps will sell the full portfolio"
- Exploit: "Reps sell only highest-margin products, ignore strategic products"
- If exploit exists → Assumption will fail

**Reality Test**: What would cause this assumption to fail?
- List 3 scenarios
- How likely is each?
- What's the impact of each?

### 3. Assumption Documentation (Required for each assumption)

Don't just list assumptions—defend them.

**Template**:
```
Assumption: [Statement]
Owner: [Who is accountable if this fails]
Historical basis: [3-year data]
Sensitivity: [Impact if 20% wrong]
Known risks: [Top 3 failure modes]
Monitoring: [Leading indicator + review cadence]
Contingency: [If assumption fails, we will...]
```

**Example**:
```
Assumption: Average deal size will be $50K in 2024
Owner: Sales Ops VP
Historical basis: $48K (2023), $46K (2022), $45K (2021) — trending up
Sensitivity: If actual is $40K (-20%), quota miss = 15% across all reps
Known risks:
  1. New competitor entered market with lower pricing
  2. Budget cuts in key verticals (tech, finance)
  3. Strategic push to SMB may lower average deal size
Monitoring: Monthly deal size review, alert if <$45K two months running
Contingency: If deal size drops to $42K by end of Q1, reduce quota 10% for Q2
```

### 4. Assumption Hierarchy (Ongoing)

Not all assumptions are equal. Categorize by risk:

**Tier 1 - Critical (Plan breaks if wrong)**:
- Revenue targets
- Rep productivity
- Win rates
- Quota coverage ratio

Monitor monthly. Build contingencies. Defend in planning.

**Tier 2 - Important (Plan stress if wrong)**:
- Deal mix
- Sales cycle length
- Ramp time
- Territory balance

Monitor quarterly. Have backup plans.

**Tier 3 - Assumptions of convenience (Plan adjusts if wrong)**:
- Seasonality patterns
- Activity metrics
- Product attach rates

Monitor annually. Adjust targets as needed.

**Tier 4 - Nice to have (Doesn't affect outcomes)**:
- Remove from planning. If it doesn't matter, don't track it.

### 5. Assumption Review Cadence

**Pre-planning** (Annual):
- Review last year's assumptions vs. actuals
- Identify which assumptions failed and why
- Update assumption inventory for new plan

**In-quarter** (Monthly):
- Review Tier 1 assumptions vs. actuals
- Alert if variance >10%
- Trigger contingency if variance >20%

**Post-quarter** (Quarterly):
- Review all assumptions vs. actuals
- Document learnings
- Update models for next quarter

## Common Pitfalls

**"We've always planned this way"**
Historical precedent isn't validation. Test whether old assumptions still hold.

**"The data will prove us right"**
That's outcome bias. Bad assumptions can look good in good markets (until they don't).

**"We can't predict the future"**
Correct—so build plans that handle uncertainty, not plans that assume certainty.

**"This assumption came from finance"**
Source doesn't equal truth. Finance assumptions optimize financial models, not sales execution.

**"Reps should just execute the plan"**
Reps will execute *their optimal plan*, which may not be *your plan* if assumptions create exploits.

**"We'll course-correct in-quarter"**
By the time you course-correct, reps have optimized around your bad assumptions (and won't undo behavior).

## Assumptions That Commonly Fail

### "Reps will be fully ramped by month 6"
- Reality: 40% churn before month 6, avg ramp is 8 months
- Impact: Capacity model overstates available selling time
- Fix: Model ramp as S-curve, not step function

### "Pipeline will convert at 25% like last year"
- Reality: Last year had no major competitor, this year does
- Impact: Pipeline targets are 25% too low
- Fix: Stress-test conversion rate assumptions quarterly

### "Reps will sell all products equally"
- Reality: Reps sell what's easiest, ignore what's strategic
- Impact: Revenue mix skews to low-margin products
- Fix: Separate quotas per product or weight strategic products

### "Territory changes won't affect Q1"
- Reality: Reps lose context, relationships reset, pipeline disrupted
- Impact: Q1 underperformance across moved territories
- Fix: Buffer Q1 quota by 10-15% in moved territories

### "Discounting will stay at 10%"
- Reality: Reps will discount to hit quota thresholds
- Impact: Margin erodes, revenue quality drops
- Fix: Cap discounts in comp plan, require approval >10%

## Assumptions vs. Reality Tracker (Template)

| Assumption | Target | Actual (YTD) | Variance | Risk Level | Action |
|------------|--------|--------------|----------|------------|--------|
| Avg deal size | $50K | $42K | -16% | High | Reduce Q2 quota 10% |
| Win rate | 25% | 22% | -12% | Medium | Review competitive losses |
| Ramp time | 6mo | 8.2mo | +37% | High | Adjust capacity model |
| Churn | 15%/yr | 22%/yr | +47% | Critical | Hiring freeze, retention plan |

## Related Content

**Videos**:
- Episode 3: "Intelligent Sales Planning"
- Episode 6: "Intelligent Sales Performance"

**Next Counsel**:
- capacity-model-failure-modes
- quota-inflation-early-warning
- planning-to-quota-traceability
