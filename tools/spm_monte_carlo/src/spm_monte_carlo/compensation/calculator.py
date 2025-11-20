"""Compensation calculation utilities."""

import pandas as pd
import numpy as np
from typing import List
import logging

from .plan import CommissionTier, Bonus

logger = logging.getLogger(__name__)


class TierCalculator:
    """Calculate tiered commissions."""

    @staticmethod
    def calculate(
        performance: pd.DataFrame,
        tiers: List[CommissionTier]
    ) -> pd.Series:
        """
        Calculate commission based on tiered structure.

        Args:
            performance: DataFrame with performance data
            tiers: List of commission tiers

        Returns:
            Series with commission amounts
        """
        # Ensure we have required columns
        required_cols = ['actual_sales', 'quota']
        for col in required_cols:
            if col not in performance.columns:
                raise ValueError(f"Missing required column: {col}")

        # Calculate quota attainment
        quota_attainment = performance['actual_sales'] / performance['quota']

        # Initialize commission
        commission = pd.Series(0.0, index=performance.index)

        # Sort tiers by quota_min
        sorted_tiers = sorted(tiers, key=lambda t: t.quota_min)

        for tier in sorted_tiers:
            # Find rows in this tier range
            in_tier = (quota_attainment > tier.quota_min) & (quota_attainment <= tier.quota_max)

            if not in_tier.any():
                continue

            # Calculate base for this tier
            if tier.applies_to == 'total_sales':
                # Commission on total sales within tier range
                tier_min_sales = performance['quota'] * tier.quota_min
                tier_max_sales = performance['quota'] * tier.quota_max

                # Sales in this tier
                sales_in_tier = np.minimum(
                    performance['actual_sales'] - tier_min_sales,
                    tier_max_sales - tier_min_sales
                ).clip(lower=0)

                if tier.rate_type == 'percentage':
                    tier_commission = sales_in_tier * tier.rate_value
                else:  # flat
                    tier_commission = pd.Series(tier.rate_value, index=performance.index)

                commission[in_tier] += tier_commission[in_tier]

            elif tier.applies_to == 'quota':
                # Commission on quota amount
                if tier.rate_type == 'percentage':
                    tier_commission = performance['quota'] * tier.rate_value
                else:
                    tier_commission = pd.Series(tier.rate_value, index=performance.index)

                commission[in_tier] += tier_commission[in_tier]

            logger.debug(f"Calculated {tier.tier_name} for {in_tier.sum()} reps")

        return commission


class BonusCalculator:
    """Calculate bonuses based on triggers."""

    @staticmethod
    def calculate(
        performance: pd.DataFrame,
        bonuses: List[Bonus]
    ) -> pd.Series:
        """
        Calculate bonuses based on trigger conditions.

        Args:
            performance: DataFrame with performance data
            bonuses: List of bonus definitions

        Returns:
            Series with bonus amounts
        """
        # Initialize bonus
        total_bonus = pd.Series(0.0, index=performance.index)

        for bonus in bonuses:
            # Check if metric exists
            if bonus.trigger_metric not in performance.columns:
                # Try to calculate it
                if bonus.trigger_metric == 'quota_attainment':
                    if 'actual_sales' in performance.columns and 'quota' in performance.columns:
                        metric_values = performance['actual_sales'] / performance['quota']
                    else:
                        logger.warning(
                            f"Cannot calculate {bonus.trigger_metric} for bonus {bonus.bonus_name}"
                        )
                        continue
                else:
                    logger.warning(
                        f"Metric '{bonus.trigger_metric}' not found for bonus {bonus.bonus_name}"
                    )
                    continue
            else:
                metric_values = performance[bonus.trigger_metric]

            # Evaluate trigger condition
            if bonus.trigger_condition == '>=':
                triggered = metric_values >= bonus.trigger_value
            elif bonus.trigger_condition == '>':
                triggered = metric_values > bonus.trigger_value
            elif bonus.trigger_condition == '<=':
                triggered = metric_values <= bonus.trigger_value
            elif bonus.trigger_condition == '<':
                triggered = metric_values < bonus.trigger_value
            elif bonus.trigger_condition == '==':
                triggered = metric_values == bonus.trigger_value
            else:
                logger.warning(f"Unknown trigger condition: {bonus.trigger_condition}")
                continue

            # Apply payout
            if triggered.any():
                if bonus.payout_type == 'flat':
                    total_bonus[triggered] += bonus.payout_value
                else:
                    # Formula-based payout (simplified for now)
                    total_bonus[triggered] += bonus.payout_value

                logger.debug(f"Applied bonus '{bonus.bonus_name}' to {triggered.sum()} reps")

        return total_bonus


class SPIFCalculator:
    """Calculate SPIFs."""

    @staticmethod
    def calculate(performance: pd.DataFrame, spifs: List) -> pd.Series:
        """
        Calculate SPIF payouts.

        Args:
            performance: DataFrame with performance data
            spifs: List of SPIF definitions

        Returns:
            Series with SPIF amounts
        """
        total_spif = pd.Series(0.0, index=performance.index)

        for spif in spifs:
            if spif.metric not in performance.columns:
                logger.warning(f"Metric '{spif.metric}' not found for SPIF {spif.spif_name}")
                continue

            # Check if target is met
            met_target = performance[spif.metric] >= spif.target

            if met_target.any():
                total_spif[met_target] += spif.payout
                logger.debug(f"Applied SPIF '{spif.spif_name}' to {met_target.sum()} reps")

        return total_spif
