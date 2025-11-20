"""Pytest configuration and fixtures."""

import pytest
import pandas as pd
import numpy as np
from pathlib import Path


@pytest.fixture
def sample_historical_data():
    """Generate sample historical performance data."""
    np.random.seed(42)

    n_reps = 10
    n_periods = 12

    data = []
    for rep_id in range(1, n_reps + 1):
        for period in range(1, n_periods + 1):
            data.append({
                'rep_id': f'REP{rep_id:03d}',
                'period': f'2024-{period:02d}',
                'quota': 100000,
                'actual_sales': np.random.normal(95000, 15000),
                'deal_count': int(np.random.gamma(5, 2)),
                'avg_deal_size': np.random.lognormal(9.8, 0.5)
            })

    df = pd.DataFrame(data)
    df['quota_attainment'] = df['actual_sales'] / df['quota']

    return df


@pytest.fixture
def sample_compensation_plan():
    """Create sample compensation plan."""
    from spm_monte_carlo.compensation.plan import CompensationPlan

    plan = CompensationPlan('TEST_PLAN', 'Test Commission Plan')

    # Add commission tiers
    plan.add_commission_tier(0, 0.75, rate=0.02, tier_name='Tier 1')
    plan.add_commission_tier(0.75, 1.0, rate=0.03, tier_name='Tier 2')
    plan.add_commission_tier(1.0, 1.25, rate=0.045, tier_name='Tier 3')
    plan.add_commission_tier(1.25, 10.0, rate=0.06, tier_name='Tier 4')

    # Add bonus
    plan.add_bonus('100% Club', 'quota_attainment >= 1.0', 5000, 'quarterly')

    return plan


@pytest.fixture
def tmp_excel_file(tmp_path, sample_historical_data):
    """Create temporary Excel file with sample data."""
    file_path = tmp_path / 'test_data.xlsx'
    sample_historical_data.to_excel(file_path, sheet_name='Performance', index=False)
    return file_path
