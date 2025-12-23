---
slug: where-ai-helps-hurts-spm
title: Where AI Helps (and Hurts) SPM
oneLiner: AI amplifies your design—good or bad. Governance decides which.
type: NOTE
channel: AI_SPM
tags: ["ai", "governance", "risk", "opportunity"]
difficulty: INTRO
timeToApplyMin: 15
---

## Problem Statement

Most SPM organizations treat AI as either:
1. **Magic solution** that will fix bad processes
2. **Existential threat** to be avoided

Both are wrong.

AI in SPM is an **amplifier**: it makes good processes faster and bad processes catastrophic. If your comp plan has ambiguity, exceptions, or hidden assumptions, AI will find and exploit them at machine speed.

The question isn't "Should we use AI?" It's "Is our SPM foundation solid enough that AI improves it rather than breaks it?"

## Mechanism (Why This Happens)

AI accelerates three things in SPM:

### 1. Pattern Recognition
**Good**: AI spots trends humans miss (e.g., "Accelerators drive deal stuffing in Q3")
**Bad**: AI optimizes for patterns in bad data (e.g., "Exception approvals correlate with manager favoritism")

If your data is clean and your rules are explicit, AI finds insights.
If your data is messy and your rules are implicit, AI finds exploits.

### 2. Decision Speed
**Good**: AI approves standard exceptions in seconds (vs. days)
**Bad**: AI approves edge cases without understanding context

If your decision logic is codified, AI scales it.
If your decision logic is "we know it when we see it," AI guesses—and guesses wrong.

### 3. Personalization
**Good**: AI tailors comp recommendations to each rep's situation
**Bad**: AI creates 1,000 different interpretations of the same policy

If your policies are universal and explicit, AI applies them consistently.
If your policies are situational and implicit, AI creates chaos.

### Core Truth
AI doesn't fix process problems—it surfaces them at scale.

**Before AI**:
- Ambiguous crediting rule → 10 disputes per quarter
- Manual exception review → slow, inconsistent

**With AI**:
- Ambiguous crediting rule → 100 disputes per quarter (AI scales the ambiguity)
- Automated exception review → fast, wrong (AI scales the inconsistency)

## Recommended Actions

### 1. AI Readiness Audit (30 min)

Before using AI in SPM, audit your foundation:

**Data Quality**:
- Is commission data tied to source transactions?
- Can you trace every payout back to a deal?
- Are there "magic adjustments" in the data?
- Test: Pick random payout, trace to source → if you can't, AI can't either

**Rule Explicitness**:
- Are crediting rules documented as logic (not prose)?
- Can two people read the rule and agree on outcome?
- Test: Give 5 people the same edge case → if you get 5 answers, rule isn't explicit

**Exception Governance**:
- Do exceptions follow a documented approval process?
- Is there an audit trail for every exception?
- Test: How many exceptions were approved last quarter? Who approved them? On what basis?

**Scoring**:
- **All tests pass**: AI will help
- **1-2 tests fail**: AI will be inconsistent (fix before deploying)
- **3+ tests fail**: AI will make things worse (don't deploy)

### 2. High-Value AI Use Cases (Where AI helps)

If foundation is solid, deploy AI here:

**A. Anomaly Detection**:
- Flag unusual payout patterns (e.g., "Rep's payout up 300% but attainment up 10%")
- Alert on exception clusters (e.g., "Manager X approves 80% of exceptions, avg is 20%")
- Warn on crediting conflicts before they become disputes

**Why it works**: AI is better at pattern matching than humans

**B. Scenario Modeling**:
- "If we change accelerator from 150% to 175%, what happens to top performer payouts?"
- "If we add a $50K deal threshold, how many reps lose deals?"
- "If quota increases 10%, what's the impact on attainment distribution?"

**Why it works**: AI runs 1000 scenarios in seconds, humans take weeks

**C. Draft Recommendations**:
- AI suggests exception approval/denial based on past decisions
- AI recommends quota adjustments based on territory changes
- AI drafts crediting logic for complex splits

**Why it works**: AI learns from patterns, but human approves final decision

**D. Auto-Approval of Standard Cases**:
- If exception matches approved template exactly → auto-approve
- If crediting scenario is 100% clear → auto-assign
- If dispute has precedent → auto-resolve

**Why it works**: AI handles volume, humans handle edge cases

### 3. High-Risk AI Use Cases (Where AI hurts)

Never deploy AI here without extreme governance:

**A. Final Decision Authority**:
- AI approves comp exceptions without human review
- AI sets quota without validation
- AI resolves disputes without appeal

**Why it fails**: AI lacks context, empathy, and accountability

**B. Policy Interpretation**:
- AI "interprets" vague policies ("in good faith," "reasonable effort")
- AI applies judgment calls ("was this deal strategic?")
- AI decides gray areas ("does this count as enterprise?")

**Why it fails**: AI can't handle ambiguity—it guesses

**C. Root Cause Analysis**:
- AI identifies "why comp is broken" without understanding business context
- AI recommends "fixes" based on correlation (not causation)

**Why it fails**: AI finds patterns, not causes

### 4. AI Governance Framework

If you deploy AI in SPM, enforce these rules:

**Rule 1: Human Override is Non-Negotiable**
- Every AI decision must be reviewable by a human
- Humans can override AI with documented reason
- Override rate is tracked (if >10%, AI is broken)

**Rule 2: Explainability is Required**
- AI must explain every decision ("Approved because: matches template X")
- If AI can't explain, it can't decide
- "Black box" AI is banned in comp

**Rule 3: Audit Trail is Mandatory**
- Every AI decision logged (what, when, why)
- Every human override logged
- Audit trail is immutable (no deleting history)

**Rule 4: Bias Monitoring**
- Track AI decisions by rep segment (new vs. tenured, region, role)
- Alert if approval rates vary >20% across segments
- If bias detected, disable AI until fixed

**Rule 5: Fallback to Human**
- If AI confidence <80%, escalate to human
- If AI sees a scenario it's never seen, escalate
- Better to be slow and right than fast and wrong

### 5. AI Risk Scorecard (Evaluate each AI use case)

| Risk Factor | Score (1-5) | Notes |
|-------------|-------------|-------|
| Decision is reversible | 5 = easily reversed, 1 = permanent | |
| Explanation is clear | 5 = always explainable, 1 = black box | |
| Human can override | 5 = always, 1 = never | |
| Impact if wrong | 5 = minor, 1 = catastrophic | |
| Historical precedent | 5 = lots of examples, 1 = novel | |

**Scoring**:
- **20-25**: Safe to deploy with monitoring
- **15-19**: Deploy with heavy governance
- **10-14**: Pilot only (no production)
- **<10**: Don't deploy

## Common Pitfalls

**"AI will eliminate exceptions"**
AI doesn't eliminate exceptions—it processes them faster. If you have bad exception governance, AI will approve bad exceptions faster.

**"AI is objective, humans are biased"**
AI learns from human decisions. If past decisions were biased, AI will be biased—at scale.

**"AI will explain itself"**
Most AI systems optimize for accuracy, not explainability. If you can't explain a decision, reps won't trust it (and shouldn't).

**"We need AI to stay competitive"**
You need good SPM to stay competitive. AI without good SPM is just fast chaos.

**"AI can handle the edge cases"**
AI is worst at edge cases (by definition: no historical pattern). Edge cases are where you need humans most.

## AI Maturity Ladder (Where you are vs. where to go)

### Level 1: No AI (Manual SPM)
- All decisions by humans
- Slow, inconsistent, doesn't scale
- **Upgrade**: Automate standard cases only

### Level 2: AI-Assisted (Humans decide, AI suggests)
- AI flags anomalies, suggests decisions
- Humans review and approve
- Scales human judgment
- **Upgrade**: Automate approvals for perfect-match cases

### Level 3: AI-Automated (AI decides standard cases, humans handle exceptions)
- AI approves 80% of cases automatically
- Humans handle 20% edge cases
- Fast, consistent, governed
- **Upgrade**: AI learns from human overrides (closes the loop)

### Level 4: AI-Optimized (AI + humans in feedback loop)
- AI recommends, humans approve, AI learns
- System improves over time
- Full explainability + audit trail
- **This is the target state**

### Level 5: Autonomous AI (Not recommended for SPM)
- AI makes all decisions without human review
- Fast, scalable, unaccountable
- **Don't go here** (comp is too important)

## Where AI Excels in SPM

✅ **Volume processing**: Reviewing 10,000 transactions for crediting errors
✅ **Pattern detection**: Spotting quota sandbagging across 500 reps
✅ **Scenario modeling**: Testing 1,000 comp plan variations
✅ **Consistency checking**: Ensuring rules applied the same way every time
✅ **Anomaly flagging**: Alerting when payouts don't match expected patterns

## Where AI Fails in SPM

❌ **Judgment calls**: "Is this deal strategic enough for exception?"
❌ **Context understanding**: "Why did this rep's territory change mid-quarter?"
❌ **Policy creation**: "What should our new crediting rule be?"
❌ **Empathy**: "This rep is upset about their payout, how do we help?"
❌ **Accountability**: "Who's responsible if AI makes a bad decision?"

## AI + SPM Decision Matrix

| Task | AI Role | Human Role | Governance |
|------|---------|------------|------------|
| Exception triage | Flag matches to templates | Approve/deny edge cases | 100% audit trail |
| Quota setting | Run scenarios | Set final quotas | Human approval required |
| Crediting | Auto-assign clear cases | Resolve conflicts | Override allowed |
| Dispute resolution | Suggest based on precedent | Final decision | Appeal process |
| Anomaly detection | Flag unusual patterns | Investigate root cause | Review flagged cases |
| Policy enforcement | Check compliance | Handle exceptions | Monitor bias |

## The Golden Rule of AI in SPM

**AI should make your comp team faster at being right, not faster at being wrong.**

If AI speeds up bad decisions, it's worse than no AI.
If AI scales good decisions, it's transformative.

The difference is governance.

## Related Content

**Videos**:
- Episode 8: "Intelligent Sales Insights"
- Episode 9: "AI Boundaries in SPM"

**Next Counsel**:
- human-override-not-optional
- insight-vs-reporting
- exception-handling-protocol
