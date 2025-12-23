"""Compensation calculation engine."""

import pandas as pd
from typing import Optional
import logging

from .plan import CompensationPlan
from .calculator import TierCalculator, BonusCalculator, SPIFCalculator

logger = logging.getLogger(__name__)


class CompensationEngine:
    """Main compensation calculation orchestrator."""

    def __init__(self, plan: CompensationPlan):
        """
        Initialize engine with compensation plan.

        Args:
            plan: CompensationPlan instance
        """
        self.plan = plan
        self.tier_calculator = TierCalculator()
        self.bonus_calculator = BonusCalculator()
        self.spif_calculator = SPIFCalculator()

    def calculate(self, performance: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate total compensation for performance data.

        Args:
            performance: DataFrame with performance metrics
                        Must include: rep_id, actual_sales, quota

        Returns:
            DataFrame with compensation breakdown
        """
        logger.info(f"Calculating compensation for {len(performance)} reps")

        # Create result DataFrame
        results = performance.copy()

        # Ensure quota_attainment is calculated
        if 'quota_attainment' not in results.columns:
            results['quota_attainment'] = results['actual_sales'] / results['quota']

        # Calculate commission
        if self.plan.commission_tiers:
            results['commission'] = self.tier_calculator.calculate(
                performance, self.plan.commission_tiers
            )
        else:
            results['commission'] = 0.0

        # Calculate bonuses
        if self.plan.bonuses:
            results['bonuses'] = self.bonus_calculator.calculate(
                performance, self.plan.bonuses
            )
        else:
            results['bonuses'] = 0.0

        # Calculate SPIFs
        if self.plan.spifs:
            results['spifs'] = self.spif_calculator.calculate(
                performance, self.plan.spifs
            )
        else:
            results['spifs'] = 0.0

        # Total payout
        results['total_payout'] = (
            results['commission'] +
            results['bonuses'] +
            results.get('spifs', 0.0)
        )

        logger.info(
            f"Total payout: ${results['total_payout'].sum():,.0f} "
            f"(Avg: ${results['total_payout'].mean():,.0f})"
        )

        return results

    def calculate_batch(
        self,
        scenarios: pd.DataFrame,
        group_by: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Calculate compensation for multiple scenarios.

        Args:
            scenarios: DataFrame with multiple scenarios
            group_by: Column to group by (e.g., 'scenario_id')

        Returns:
            DataFrame with compensation for all scenarios
        """
        if group_by and group_by in scenarios.columns:
            # Process each scenario separately
            results_list = []

            for scenario_id, group in scenarios.groupby(group_by):
                scenario_results = self.calculate(group)
                scenario_results[group_by] = scenario_id
                results_list.append(scenario_results)

            return pd.concat(results_list, ignore_index=True)
        else:
            # Process all at once
            return self.calculate(scenarios)

    def __repr__(self) -> str:
        """String representation."""
        return f"CompensationEngine(plan='{self.plan.plan_id}')"
