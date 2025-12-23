#!/usr/bin/env python3
"""
Simple Monte Carlo simulation example.

This example demonstrates the basic usage of the SPM Monte Carlo tool.
"""

import pandas as pd
import numpy as np
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan


def generate_sample_data():
    """Generate sample historical performance data."""
    np.random.seed(42)

    n_reps = 50
    n_periods = 24

    print(f"Generating sample data: {n_reps} reps, {n_periods} periods...")

    data = []
    for rep_id in range(1, n_reps + 1):
        for period in range(1, n_periods + 1):
            data.append({
                'rep_id': f'REP{rep_id:03d}',
                'period': f'2023-{period:02d}' if period <= 12 else f'2024-{period-12:02d}',
                'quota': 100000,
                'actual_sales': max(0, np.random.normal(95000, 15000)),
                'deal_count': int(max(1, np.random.gamma(5, 2))),
                'avg_deal_size': np.random.lognormal(9.8, 0.5)
            })

    df = pd.DataFrame(data)
    df['quota_attainment'] = df['actual_sales'] / df['quota']

    print(f"Generated {len(df)} performance records")
    return df


def create_sample_plan():
    """Create sample compensation plan."""
    print("Creating compensation plan...")

    plan = CompensationPlan('2024_SALES', '2024 Sales Commission Plan')

    # Add commission tiers
    plan.add_commission_tier(0, 0.75, rate=0.02, tier_name='Tier 1')
    plan.add_commission_tier(0.75, 1.0, rate=0.03, tier_name='Tier 2')
    plan.add_commission_tier(1.0, 1.25, rate=0.045, tier_name='Tier 3 (Accelerator)')
    plan.add_commission_tier(1.25, 10.0, rate=0.06, tier_name='Tier 4 (Super Accelerator)')

    # Add bonuses
    plan.add_bonus('100% Club Bonus', 'quota_attainment >= 1.0', 5000, 'quarterly')
    plan.add_bonus('President\'s Club', 'quota_attainment >= 1.1', 10000, 'annual')

    print(f"Created plan with {len(plan.commission_tiers)} tiers and {len(plan.bonuses)} bonuses")
    return plan


def main():
    """Run simple Monte Carlo simulation."""
    print("=" * 70)
    print("SPM Monte Carlo Simulation - Simple Example")
    print("=" * 70)
    print()

    # Generate sample data
    historical_data = generate_sample_data()
    plan = create_sample_plan()

    print()
    print("-" * 70)
    print("Running Monte Carlo Simulation")
    print("-" * 70)

    # Initialize simulator
    sim = MonteCarloSimulator(seed=42, sampling_strategy='monte_carlo')

    # Run simulation
    print("Loading data and fitting distributions...")
    results = sim.load_data(historical_data) \
                 .load_plan(plan) \
                 .fit_distributions(auto=True) \
                 .run(iterations=10000)

    print()
    print("=" * 70)
    print("Simulation Results")
    print("=" * 70)
    print()

    # Display summary statistics
    summary = results.summary(percentiles=[5, 25, 50, 75, 95, 99])
    print("Summary Statistics (Total Payout):")
    print("-" * 70)
    if 'total_payout' in summary.index:
        payout_stats = summary.loc['total_payout']
        print(f"  Mean:          ${payout_stats['mean']:>15,.0f}")
        print(f"  Median:        ${payout_stats['median']:>15,.0f}")
        print(f"  Std Dev:       ${payout_stats['std']:>15,.0f}")
        print(f"  Min:           ${payout_stats['min']:>15,.0f}")
        print(f"  Max:           ${payout_stats['max']:>15,.0f}")
        print()
        print("Percentiles:")
        print(f"    5th:         ${payout_stats.get('p5', 0):>15,.0f}")
        print(f"   25th:         ${payout_stats.get('p25', 0):>15,.0f}")
        print(f"   50th:         ${payout_stats.get('p50', 0):>15,.0f}")
        print(f"   75th:         ${payout_stats.get('p75', 0):>15,.0f}")
        print(f"   95th:         ${payout_stats.get('p95', 0):>15,.0f}")
        print(f"   99th:         ${payout_stats.get('p99', 0):>15,.0f}")

    print()
    print("Risk Metrics:")
    print("-" * 70)

    # Calculate risk metrics
    var95 = results.var(0.95)
    var99 = results.var(0.99)
    cvar95 = results.cvar(0.95)

    print(f"  VaR (95%):     ${var95:>15,.0f}")
    print(f"  VaR (99%):     ${var99:>15,.0f}")
    print(f"  CVaR (95%):    ${cvar95:>15,.0f}")

    # Budget analysis
    budget = 1_300_000
    prob_exceed = results.prob_exceed(budget)

    print()
    print(f"Budget Analysis (Budget = ${budget:,}):")
    print("-" * 70)
    print(f"  Probability of exceeding budget: {prob_exceed:.2%}")
    print(f"  Expected budget cushion: ${budget - summary.loc['total_payout', 'mean']:>15,.0f}")

    print()
    print("=" * 70)
    print("Simulation Complete!")
    print("=" * 70)


if __name__ == '__main__':
    main()
