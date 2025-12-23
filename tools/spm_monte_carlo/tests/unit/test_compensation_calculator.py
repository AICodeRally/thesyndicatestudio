"""Unit tests for compensation calculator."""

import pytest
import pandas as pd

from spm_monte_carlo.compensation.plan import CompensationPlan
from spm_monte_carlo.compensation.engine import CompensationEngine


class TestCompensationCalculator:
    """Test suite for compensation calculations."""

    def test_simple_commission_calculation(self):
        """Test basic commission with single tier."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_commission_tier(0, 10, rate=0.05, applies_to='total_sales')

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [80000]
        })

        results = engine.calculate(performance)

        # 5% of $100,000 = $5,000
        assert results.loc[0, 'commission'] == pytest.approx(5000)

    def test_tiered_commission_calculation(self):
        """Test tiered commission structure."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_commission_tier(0, 0.75, rate=0.02, applies_to='total_sales')
        plan.add_commission_tier(0.75, 1.0, rate=0.03, applies_to='total_sales')
        plan.add_commission_tier(1.0, 10, rate=0.05, applies_to='total_sales')

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000]
        })

        results = engine.calculate(performance)

        # 0-75k @ 2% = 1,500
        # 75k-100k @ 3% = 750
        # Total = 2,250
        assert results.loc[0, 'commission'] == pytest.approx(2250)

    def test_quota_based_bonus(self):
        """Test quota attainment bonus."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_bonus('100% Club', 'quota_attainment >= 1.0', 5000)

        engine = CompensationEngine(plan)

        # Rep who hit quota
        perf_hit = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000]
        })
        results_hit = engine.calculate(perf_hit)
        assert results_hit.loc[0, 'bonuses'] == 5000

        # Rep who missed quota
        perf_miss = pd.DataFrame({
            'rep_id': ['REP002'],
            'actual_sales': [90000],
            'quota': [100000]
        })
        results_miss = engine.calculate(perf_miss)
        assert results_miss.loc[0, 'bonuses'] == 0

    def test_complex_multi_component_plan(self, sample_compensation_plan):
        """Test plan with multiple components."""
        engine = CompensationEngine(sample_compensation_plan)

        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000]
        })

        results = engine.calculate(performance)

        # Should have commission and bonus
        assert results.loc[0, 'commission'] > 0
        assert results.loc[0, 'bonuses'] == 5000  # 100% Club
        assert results.loc[0, 'total_payout'] > 5000
