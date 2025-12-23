"""Integration tests for complete simulation workflows."""

import pytest
import pandas as pd

from spm_monte_carlo import MonteCarloSimulator


class TestFullSimulation:
    """Integration tests for complete simulation workflows."""

    def test_basic_simulation_workflow(self, sample_historical_data, sample_compensation_plan):
        """Test complete simulation from data load to results."""
        sim = MonteCarloSimulator(seed=42)

        results = sim.load_data(sample_historical_data) \
                     .load_plan(sample_compensation_plan) \
                     .run(iterations=100)  # Small number for testing

        # Verify results structure
        assert results.scenarios is not None
        assert len(results.scenarios) > 0
        assert 'total_payout' in results.scenarios.columns

        # Verify summary stats exist
        summary = results.summary()
        assert 'mean' in summary.columns or 'total_payout' in summary.index

        # Verify risk metrics
        var95 = results.var(0.95)
        assert var95 > 0

    def test_simulation_reproducibility(self, sample_historical_data, sample_compensation_plan):
        """Test that same seed produces same results."""
        sim1 = MonteCarloSimulator(seed=42)
        results1 = sim1.load_data(sample_historical_data) \
                      .load_plan(sample_compensation_plan) \
                      .run(iterations=100)

        sim2 = MonteCarloSimulator(seed=42)
        results2 = sim2.load_data(sample_historical_data) \
                      .load_plan(sample_compensation_plan) \
                      .run(iterations=100)

        # Results should be very similar (allow for small numerical differences)
        mean1 = results1.scenarios['total_payout'].mean()
        mean2 = results2.scenarios['total_payout'].mean()

        assert mean1 == pytest.approx(mean2, rel=0.01)

    def test_method_chaining(self, sample_historical_data, sample_compensation_plan):
        """Test fluent API method chaining."""
        # Should not raise any errors
        results = MonteCarloSimulator(seed=42) \
            .load_data(sample_historical_data) \
            .load_plan(sample_compensation_plan) \
            .fit_distributions(auto=True) \
            .run(iterations=50)

        assert results is not None
        assert len(results.scenarios) > 0
