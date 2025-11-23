# Quota Planning & Territory Analysis

## Overview

This document describes capabilities for quota setting, territory design, capacity planning, and alignment analysis for SPM analysts.

---

## Table of Contents

1. [Quota Planning](#quota-planning)
2. [Territory Analysis](#territory-analysis)
3. [Capacity Planning](#capacity-planning)
4. [Alignment Analysis](#alignment-analysis)
5. [Coverage Optimization](#coverage-optimization)
6. [Performance Prediction](#performance-prediction)

---

## Quota Planning

### 1.1 Top-Down Quota Allocation

**Purpose**: Distribute company goals to individual reps

**Methodology**:
- Start with company revenue target
- Allocate to regions/segments
- Distribute to teams
- Assign to individual reps

```python
from spm_monte_carlo.quota_planning import TopDownQuotaPlanner

planner = TopDownQuotaPlanner()

# Set company target
planner.set_company_target(
    revenue=100_000_000,
    fiscal_year=2025
)

# Define allocation rules
planner.configure_allocation(
    method='weighted',  # or 'equal', 'historical', 'market_based'
    weights={
        'historical_performance': 0.40,
        'territory_potential': 0.30,
        'strategic_priority': 0.20,
        'tenure_adjustment': 0.10
    }
)

# Allocate to regions
regional_quotas = planner.allocate_to_regions(
    regions=['AMER', 'EMEA', 'APAC'],
    regional_weights={'AMER': 0.50, 'EMEA': 0.30, 'APAC': 0.20}
)

# Allocate to reps
rep_quotas = planner.allocate_to_reps(
    reps=rep_master_data,
    constraints={
        'min_quota': 500_000,
        'max_quota': 3_000_000,
        'fairness_threshold': 0.15  # Max 15% deviation from fair share
    }
)

# Review allocation
allocation_summary = planner.summarize()
print(allocation_summary)

# Export
planner.export('fy2025_quota_allocation.xlsx')
```

**Allocation Methods**:
1. **Equal**: Same quota for all reps (simple but not realistic)
2. **Weighted**: Based on multiple factors (most common)
3. **Historical**: Proportional to past performance
4. **Market-based**: Based on territory TAM/potential
5. **Hybrid**: Combination of methods

---

### 1.2 Bottom-Up Quota Planning

**Purpose**: Build quotas from opportunity/account level up

```python
from spm_monte_carlo.quota_planning import BottomUpQuotaPlanner

bottom_up = BottomUpQuotaPlanner()

# Load account/opportunity data
bottom_up.load_accounts('accounts.xlsx')
bottom_up.load_opportunities('opportunities.xlsx')

# Calculate territory potential
territory_potential = bottom_up.calculate_potential(
    methods=['account_based', 'historical_win_rate', 'pipeline_weighted']
)

# Assign realistic targets
quotas = bottom_up.calculate_quotas(
    target_attainment=0.90,  # Expect 90% average attainment
    risk_adjustment=0.10,    # 10% buffer for uncertainty
    ramping_new_hires=True
)

# Compare to top-down
comparison = bottom_up.compare_to_top_down(top_down_quotas)
comparison.plot_variance()
```

---

### 1.3 Quota Attainability Analysis

**Purpose**: Assess if quotas are realistic

```python
from spm_monte_carlo.quota_planning import AttainabilityAnalyzer

analyzer = AttainabilityAnalyzer()

# Load proposed quotas
analyzer.load_quotas(proposed_quotas)

# Analyze against historical data
attainability = analyzer.analyze(
    historical_data=historical_performance,
    market_data=market_conditions,
    territory_data=territory_assignments
)

# Generate report
report = attainability.generate_report()
print(f"Expected average attainment: {report.expected_avg_attainment:.1%}")
print(f"% of reps likely to hit quota: {report.pct_likely_to_hit:.1%}")
print(f"Risk score: {report.risk_score}/10")

# Identify problem quotas
problem_quotas = attainability.identify_problems(
    threshold='below_70_pct_probability'
)

for pq in problem_quotas:
    print(f"Rep {pq.rep_id}: Quota ${pq.quota:,.0f}")
    print(f"  Estimated attainment probability: {pq.probability:.1%}")
    print(f"  Recommended adjustment: {pq.recommended_adjustment:+.1%}")
```

**Attainability Metrics**:
- **Expected average attainment**: Mean predicted attainment %
- **Probability distribution**: Likelihood of various attainment levels
- **Risk score**: Composite measure of quota difficulty
- **Fairness index**: Variation in quota difficulty across reps

---

### 1.4 Monte Carlo Quota Testing

**Purpose**: Simulate outcomes under proposed quotas

```python
from spm_monte_carlo.quota_planning import QuotaSimulator

sim = QuotaSimulator()

# Test proposed quotas
sim.load_quotas(proposed_quotas)
sim.load_performance_distributions(historical_distributions)

# Run simulation
results = sim.run_simulation(
    iterations=10_000,
    include_compensation=True,
    include_revenue_impact=True
)

# Analyze results
print(f"Expected revenue: ${results.expected_revenue:,.0f}")
print(f"Expected comp cost: ${results.expected_compensation:,.0f}")
print(f"Expected comp ratio: {results.expected_comp_ratio:.2%}")
print(f"Probability of revenue miss: {results.prob_revenue_miss:.1%}")

# Sensitivity analysis
sensitivity = sim.quota_sensitivity_analysis(
    quota_adjustments=[-10, -5, 0, +5, +10]  # % changes
)
sensitivity.plot()
```

---

## Territory Analysis

### 2.1 Territory Scoring

**Purpose**: Quantify territory quality/potential

```python
from spm_monte_carlo.territory import TerritoryScorer

scorer = TerritoryScorer()

# Define scoring criteria
scorer.configure_criteria({
    'tam': {  # Total Addressable Market
        'weight': 0.30,
        'data_source': 'market_size_data.xlsx'
    },
    'account_count': {
        'weight': 0.20,
        'data_source': 'account_assignments.xlsx'
    },
    'install_base': {
        'weight': 0.15,
        'data_source': 'customer_data.xlsx'
    },
    'growth_rate': {
        'weight': 0.15,
        'data_source': 'market_trends.xlsx'
    },
    'competition': {
        'weight': 0.10,
        'data_source': 'competitive_analysis.xlsx',
        'inverse': True  # Higher competition = lower score
    },
    'maturity': {
        'weight': 0.10,
        'data_source': 'territory_maturity.xlsx'
    }
})

# Calculate scores
territory_scores = scorer.calculate_scores(territories)

# Normalize scores
territory_scores_normalized = scorer.normalize(
    method='z_score',  # or 'min_max', 'percentile'
    mean=100,
    std=15
)

# Visualize
scorer.plot_score_distribution()
scorer.plot_heatmap(geography='US_states')

# Export
territory_scores.to_excel('territory_scores.xlsx')
```

**Scoring Components**:
- **TAM (Total Addressable Market)**: Revenue potential
- **Account count**: Number of target accounts
- **Install base**: Existing customer base
- **Growth rate**: Market growth trajectory
- **Competition**: Competitive intensity
- **Maturity**: Territory development stage
- **Accessibility**: Ease of covering (geography, language, etc.)

---

### 2.2 Territory Balancing

**Purpose**: Create fair, balanced territory assignments

```python
from spm_monte_carlo.territory import TerritoryBalancer

balancer = TerritoryBalancer()

# Load current territories
balancer.load_territories(current_territories)

# Set balancing objectives
balancer.set_objectives({
    'minimize_variance': 0.40,  # Equal opportunity
    'minimize_disruption': 0.30,  # Limit account moves
    'maximize_coverage': 0.20,  # No gaps
    'respect_relationships': 0.10  # Preserve key relationships
})

# Set constraints
balancer.set_constraints({
    'min_accounts_per_territory': 30,
    'max_accounts_per_territory': 100,
    'geographic_contiguity': True,
    'preserve_key_accounts': True
})

# Optimize
new_territories = balancer.optimize(
    method='genetic_algorithm',  # or 'linear_programming', 'simulated_annealing'
    iterations=1000
)

# Compare before/after
comparison = balancer.compare(current_territories, new_territories)
comparison.show_improvements()

# Generate change report
changes = balancer.generate_change_report()
print(f"Accounts reassigned: {changes.accounts_moved}")
print(f"Variance reduction: {changes.variance_reduction:.1%}")
print(f"Fairness improvement: {changes.fairness_improvement:.1%}")
```

**Balancing Algorithms**:
- **Genetic Algorithm**: Good for complex, multi-objective problems
- **Linear Programming**: Optimal for linear constraints
- **Simulated Annealing**: Escapes local optima
- **Greedy Algorithm**: Fast, approximate solution

---

### 2.3 Territory Coverage Analysis

**Purpose**: Identify coverage gaps and overlaps

```python
from spm_monte_carlo.territory import CoverageAnalyzer

coverage = CoverageAnalyzer()

# Load territory assignments
coverage.load_assignments(territory_assignments)

# Analyze coverage
analysis = coverage.analyze(
    account_data=accounts,
    geographic_data=geography
)

# Identify gaps
gaps = analysis.find_gaps()
print(f"Uncovered accounts: {len(gaps.uncovered_accounts)}")
print(f"Underserved regions: {gaps.underserved_regions}")

# Identify overlaps
overlaps = analysis.find_overlaps()
print(f"Overlapping territories: {len(overlaps.conflicts)}")

# Visualize
coverage.plot_map(
    show_gaps=True,
    show_overlaps=True,
    color_by='territory_score'
)

# Recommend adjustments
recommendations = coverage.recommend_adjustments()
```

---

### 2.4 Territory Performance Prediction

**Purpose**: Predict revenue potential by territory

```python
from spm_monte_carlo.territory import TerritoryPredictor

predictor = TerritoryPredictor()

# Train model
predictor.train(
    features=[
        'territory_score',
        'account_count',
        'tam',
        'prior_year_revenue',
        'rep_tenure',
        'competitive_index'
    ],
    target='revenue',
    historical_data=historical_performance
)

# Predict for next year
predictions = predictor.predict(
    territories=territory_assignments_2025,
    confidence_level=0.90
)

# Results
for territory, pred in predictions.items():
    print(f"Territory {territory}:")
    print(f"  Expected revenue: ${pred.expected:,.0f}")
    print(f"  90% CI: [${pred.lower:,.0f}, ${pred.upper:,.0f}]")
    print(f"  Risk score: {pred.risk_score}/10")

# Use in quota planning
quota_planner.use_territory_predictions(predictions)
```

---

## Capacity Planning

### 3.1 Headcount Planning

**Purpose**: Determine optimal sales force size

```python
from spm_monte_carlo.capacity import HeadcountPlanner

hc_planner = HeadcountPlanner()

# Set revenue target
hc_planner.set_target(revenue=120_000_000)

# Configure assumptions
hc_planner.configure(
    avg_quota_per_rep=1_200_000,
    expected_attainment=0.85,
    ramp_time_months=6,
    attrition_rate=0.15,
    plan_year=2025
)

# Calculate required headcount
hc_plan = hc_planner.calculate()

print(f"Starting headcount: {hc_plan.starting_hc}")
print(f"Required ending headcount: {hc_plan.ending_hc}")
print(f"Gross hires needed: {hc_plan.gross_hires}")
print(f"  - Backfill (attrition): {hc_plan.backfill_hires}")
print(f"  - Growth: {hc_plan.growth_hires}")
print(f"Average headcount (for planning): {hc_plan.average_hc}")

# Monte Carlo simulation
hc_uncertainty = hc_planner.simulate_uncertainty(
    iterations=10_000,
    vary=['attainment', 'attrition', 'ramp_time']
)

hc_uncertainty.plot_distribution()
```

---

### 3.2 Ramping Analysis

**Purpose**: Model impact of new hires ramping to productivity

```python
from spm_monte_carlo.capacity import RampingAnalyzer

ramp = RampingAnalyzer()

# Define ramping curve
ramp.define_curve(
    model='s_curve',
    parameters={
        'month_1': 0.20,   # 20% of full productivity
        'month_3': 0.50,
        'month_6': 0.85,
        'month_12': 1.00   # Full productivity
    }
)

# Analyze hiring plan
hiring_plan = [
    {'month': '2025-01', 'hires': 5},
    {'month': '2025-02', 'hires': 3},
    {'month': '2025-03', 'hires': 4},
    # ...
]

impact = ramp.analyze_hiring_plan(
    plan=hiring_plan,
    quota_per_rep=1_200_000
)

# Results
impact.plot_effective_capacity()
impact.plot_productivity_buildup()

print(f"Q1 effective capacity: {impact.q1_effective_capacity:.0f} rep equivalents")
print(f"Full year capacity: {impact.annual_effective_capacity:.0f} rep equivalents")
```

---

### 3.3 Attrition Impact Analysis

**Purpose**: Model effect of turnover on capacity

```python
from spm_monte_carlo.capacity import AttritionAnalyzer

attrition = AttritionAnalyzer()

# Configure attrition assumptions
attrition.configure(
    annual_rate=0.15,
    seasonality=True,  # Higher in Q4, Q1
    timing_distribution='uniform',  # When during year people leave
    replacement_time=2  # months to backfill
)

# Analyze impact
impact = attrition.analyze_impact(
    starting_headcount=100,
    fiscal_year=2025
)

print(f"Expected departures: {impact.expected_departures:.1f}")
print(f"Average vacancy duration: {impact.avg_vacancy_days:.0f} days")
print(f"Lost capacity (rep-months): {impact.lost_capacity:.1f}")
print(f"Revenue impact: ${impact.revenue_impact:,.0f}")

# Mitigation strategies
mitigation = attrition.evaluate_mitigation({
    'faster_hiring': {'replacement_time': 1.5},
    'retention_bonus': {'attrition_rate': 0.12},
    'overhire': {'buffer': 0.05}  # Hire 5% extra
})

mitigation.compare_strategies()
```

---

## Alignment Analysis

### 4.1 Quota-Territory Alignment

**Purpose**: Ensure quotas match territory potential

```python
from spm_monte_carlo.alignment import QuotaTerritoryAlignment

alignment = QuotaTerritoryAlignment()

# Load data
alignment.load_quotas(quotas_2025)
alignment.load_territory_scores(territory_scores)

# Analyze alignment
analysis = alignment.analyze()

# Results
print(f"Correlation (quota vs. territory score): {analysis.correlation:.3f}")
print(f"Misalignment index: {analysis.misalignment_index:.2f}")

# Identify misalignments
misaligned = analysis.find_misalignments(threshold=0.20)  # >20% off

for item in misaligned:
    print(f"Rep {item.rep_id}:")
    print(f"  Territory score: {item.territory_score:.0f}")
    print(f"  Quota: ${item.quota:,.0f}")
    print(f"  Implied difficulty: {item.difficulty:.1%} vs. average")
    print(f"  Recommended adjustment: {item.recommended_adjustment:+.1%}")

# Visualize
alignment.plot_scatter(
    x='territory_score',
    y='quota',
    show_trendline=True,
    highlight_outliers=True
)
```

---

### 4.2 Pay-Performance Alignment

**Purpose**: Verify compensation correlates with performance

```python
from spm_monte_carlo.alignment import PayPerformanceAlignment

pay_perf = PayPerformanceAlignment()

# Load data
pay_perf.load_performance(performance_data)
pay_perf.load_compensation(compensation_data)

# Calculate correlation
correlation = pay_perf.calculate_correlation(
    performance_metric='quota_attainment_pct',
    compensation_metric='total_cash_comp'
)

print(f"Pay-performance correlation: {correlation.coefficient:.3f}")
print(f"P-value: {correlation.p_value:.4f}")

# Analyze by segment
by_role = pay_perf.analyze_by_segment('role')
by_tenure = pay_perf.analyze_by_segment('tenure_band')

# Identify outliers (high pay, low performance or vice versa)
outliers = pay_perf.find_outliers()

for outlier in outliers:
    print(f"Rep {outlier.rep_id}:")
    print(f"  Performance percentile: {outlier.performance_pct:.0f}")
    print(f"  Pay percentile: {outlier.pay_pct:.0f}")
    print(f"  Type: {outlier.type}")  # 'overpaid' or 'underpaid'

# Visualize
pay_perf.plot_scatter(
    show_regression=True,
    color_by='role'
)
```

---

### 4.3 Fairness & Equity Analysis

**Purpose**: Ensure equitable treatment

```python
from spm_monte_carlo.alignment import FairnessAnalyzer

fairness = FairnessAnalyzer()

# Load data
fairness.load_data(
    quotas=quotas,
    territories=territories,
    compensation=compensation,
    demographics=demographics  # For equity analysis
)

# Gini coefficient (inequality measure)
gini = fairness.calculate_gini(metric='quota_difficulty')
print(f"Quota difficulty Gini coefficient: {gini:.3f}")
# 0 = perfect equality, 1 = perfect inequality

# Analyze equity
equity = fairness.analyze_equity(
    protected_classes=['gender', 'ethnicity'],
    metrics=['quota_difficulty', 'compensation', 'territory_score']
)

for protected_class in equity.results:
    print(f"\n{protected_class}:")
    for group, stats in equity.results[protected_class].items():
        print(f"  {group}: {stats}")

# Statistical tests
tests = fairness.run_statistical_tests()
if tests.has_significant_differences:
    print("Warning: Statistically significant differences detected")
    print(tests.details)

# Recommendations
recommendations = fairness.generate_recommendations()
```

---

## Coverage Optimization

### 5.1 Multi-Objective Territory Design

**Purpose**: Optimize territories across multiple goals

```python
from spm_monte_carlo.optimization import TerritoryOptimizer

optimizer = TerritoryOptimizer()

# Define objectives
optimizer.add_objective('balance', weight=0.35)      # Equal opportunity
optimizer.add_objective('coverage', weight=0.25)     # No gaps
optimizer.add_objective('compactness', weight=0.20)  # Geographic efficiency
optimizer.add_objective('stability', weight=0.20)    # Minimize disruption

# Define constraints
optimizer.add_constraint('min_accounts', value=25)
optimizer.add_constraint('max_accounts', value=100)
optimizer.add_constraint('contiguity', value=True)

# Optimize
optimal_territories = optimizer.optimize(
    current_territories=current,
    accounts=account_data,
    iterations=5000
)

# Evaluate solution
evaluation = optimizer.evaluate_solution(optimal_territories)
print(f"Balance score: {evaluation.balance_score:.2f}")
print(f"Coverage score: {evaluation.coverage_score:.2f}")
print(f"Accounts to reassign: {evaluation.accounts_moved}")

# Visualize
optimizer.plot_before_after()
optimizer.plot_pareto_frontier()
```

---

### 5.2 Account Assignment Optimization

**Purpose**: Optimally assign accounts to reps

```python
from spm_monte_carlo.optimization import AccountAssignmentOptimizer

account_opt = AccountAssignmentOptimizer()

# Load data
account_opt.load_accounts(accounts)
account_opt.load_reps(reps)

# Configure scoring
account_opt.configure_scoring({
    'rep_account_fit': 0.30,        # Product expertise, industry match
    'relationship_strength': 0.25,   # Existing relationships
    'geographic_proximity': 0.20,    # Travel efficiency
    'workload_balance': 0.15,        # Fair distribution
    'opportunity_size': 0.10         # Strategic importance
})

# Optimize assignments
new_assignments = account_opt.optimize()

# Generate change report
changes = account_opt.generate_change_report(
    current=current_assignments,
    proposed=new_assignments
)

print(f"Accounts reassigned: {changes.count}")
print(f"Expected win rate improvement: {changes.win_rate_improvement:+.2%}")
print(f"Revenue at risk: ${changes.revenue_at_risk:,.0f}")

# Approve changes
account_opt.export_changes('account_reassignments.xlsx')
```

---

## Performance Prediction

### 6.1 Rep Performance Forecasting

**Purpose**: Predict individual rep outcomes

```python
from spm_monte_carlo.forecasting import RepPerformanceForecaster

forecaster = RepPerformanceForecaster()

# Train model
forecaster.train(
    features=[
        'prior_year_attainment',
        'tenure_months',
        'territory_score',
        'quota_growth_rate',
        'product_mix',
        'seasonality_index'
    ],
    historical_data=historical_data
)

# Forecast next period
forecast = forecaster.predict(
    reps=rep_roster_2025,
    include_confidence_intervals=True
)

# Results
for rep in forecast:
    print(f"{rep.rep_name}:")
    print(f"  Expected attainment: {rep.predicted_attainment:.1%}")
    print(f"  90% CI: [{rep.ci_lower:.1%}, {rep.ci_upper:.1%}]")
    print(f"  Risk tier: {rep.risk_tier}")  # Low, Medium, High

# Aggregate forecast
print(f"\nTotal team forecast: ${forecast.total_revenue:,.0f}")
print(f"Average attainment: {forecast.avg_attainment:.1%}")
```

---

### 6.2 Scenario Planning

**Purpose**: Plan for different future states

```python
from spm_monte_carlo.scenario_planning import ScenarioPlanner

planner = ScenarioPlanner()

# Define scenarios
planner.add_scenario(
    name='Base Case',
    assumptions={
        'market_growth': 0.05,
        'win_rate': 0.25,
        'avg_deal_size': 150_000,
        'sales_cycle': 90
    }
)

planner.add_scenario(
    name='Optimistic',
    assumptions={
        'market_growth': 0.10,
        'win_rate': 0.30,
        'avg_deal_size': 175_000,
        'sales_cycle': 75
    }
)

planner.add_scenario(
    name='Pessimistic',
    assumptions={
        'market_growth': 0.00,
        'win_rate': 0.20,
        'avg_deal_size': 125_000,
        'sales_cycle': 120
    }
)

# Run scenarios
results = planner.run_all_scenarios(
    quota_plan=quotas_2025,
    compensation_plan=plan_2025
)

# Compare
comparison = results.compare()
comparison.plot_tornado()  # Show scenario impact range

# Decision support
recommendation = planner.recommend(
    criteria={
        'maximize_expected_value': 0.40,
        'minimize_downside_risk': 0.35,
        'maximize_upside_potential': 0.25
    }
)
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Status**: Design Phase - Quota & Territory Features
