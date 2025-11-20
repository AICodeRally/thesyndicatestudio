"""Compensation plan definition and builder."""

import pandas as pd
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
import logging

logger = logging.getLogger(__name__)


@dataclass
class CommissionTier:
    """Commission tier definition."""
    tier_name: str
    quota_min: float
    quota_max: float
    rate_value: float
    rate_type: str = 'percentage'
    applies_to: str = 'total_sales'


@dataclass
class Bonus:
    """Bonus definition."""
    bonus_name: str
    trigger_metric: str
    trigger_value: float
    trigger_condition: str
    payout_value: float
    payout_type: str = 'flat'
    frequency: str = 'quarterly'


@dataclass
class SPIF:
    """SPIF (Sales Performance Incentive Fund) definition."""
    spif_name: str
    metric: str
    target: float
    payout: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eligible_reps: str = 'ALL'


class CompensationPlan:
    """Compensation plan builder and container."""

    def __init__(self, plan_id: str, name: Optional[str] = None):
        """
        Initialize compensation plan.

        Args:
            plan_id: Unique plan identifier
            name: Plan name (optional)
        """
        self.plan_id = plan_id
        self.name = name or plan_id
        self.commission_tiers: List[CommissionTier] = []
        self.bonuses: List[Bonus] = []
        self.spifs: List[SPIF] = []
        self.metadata: Dict[str, Any] = {}

    def add_commission_tier(
        self,
        quota_min: float,
        quota_max: float,
        rate: float,
        tier_name: Optional[str] = None,
        rate_type: str = 'percentage',
        applies_to: str = 'total_sales'
    ) -> 'CompensationPlan':
        """
        Add a commission tier.

        Args:
            quota_min: Minimum quota % for tier
            quota_max: Maximum quota % for tier
            rate: Commission rate
            tier_name: Tier identifier
            rate_type: 'percentage' or 'flat'
            applies_to: 'quota', 'total_sales', or 'incremental_sales'

        Returns:
            Self for method chaining
        """
        if tier_name is None:
            tier_name = f"Tier {len(self.commission_tiers) + 1}"

        tier = CommissionTier(
            tier_name=tier_name,
            quota_min=quota_min,
            quota_max=quota_max,
            rate_value=rate,
            rate_type=rate_type,
            applies_to=applies_to
        )

        self.commission_tiers.append(tier)
        logger.info(f"Added commission tier: {tier_name}")

        return self

    def add_bonus(
        self,
        name: str,
        trigger: str,
        payout: float,
        frequency: str = 'quarterly'
    ) -> 'CompensationPlan':
        """
        Add a bonus component.

        Args:
            name: Bonus name
            trigger: Trigger expression (e.g., "quota_attainment >= 1.0")
            payout: Payout amount
            frequency: 'monthly', 'quarterly', or 'annual'

        Returns:
            Self for method chaining
        """
        # Parse trigger expression
        parts = trigger.split()
        if len(parts) >= 3:
            metric = parts[0]
            condition = parts[1]
            value = float(parts[2])
        else:
            raise ValueError(f"Invalid trigger expression: {trigger}")

        bonus = Bonus(
            bonus_name=name,
            trigger_metric=metric,
            trigger_value=value,
            trigger_condition=condition,
            payout_value=payout,
            frequency=frequency
        )

        self.bonuses.append(bonus)
        logger.info(f"Added bonus: {name}")

        return self

    def add_spif(
        self,
        name: str,
        metric: str,
        target: float,
        payout: float,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> 'CompensationPlan':
        """
        Add a SPIF.

        Args:
            name: SPIF name
            metric: Metric to measure
            target: Target value
            payout: Payout amount
            start_date: Start date (optional)
            end_date: End date (optional)

        Returns:
            Self for method chaining
        """
        spif = SPIF(
            spif_name=name,
            metric=metric,
            target=target,
            payout=payout,
            start_date=start_date,
            end_date=end_date
        )

        self.spifs.append(spif)
        logger.info(f"Added SPIF: {name}")

        return self

    def to_dict(self) -> Dict[str, Any]:
        """Export plan as dictionary."""
        return {
            'plan_id': self.plan_id,
            'name': self.name,
            'commission_tiers': [vars(tier) for tier in self.commission_tiers],
            'bonuses': [vars(bonus) for bonus in self.bonuses],
            'spifs': [vars(spif) for spif in self.spifs],
            'metadata': self.metadata
        }

    def to_excel(self, file_path: str):
        """Export plan to Excel file."""
        with pd.ExcelWriter(file_path, engine='xlsxwriter') as writer:
            # Plan overview
            overview = pd.DataFrame([{
                'plan_id': self.plan_id,
                'plan_name': self.name
            }])
            overview.to_excel(writer, sheet_name='Plan_Overview', index=False)

            # Commission tiers
            if self.commission_tiers:
                tiers_df = pd.DataFrame([vars(tier) for tier in self.commission_tiers])
                tiers_df.insert(0, 'plan_id', self.plan_id)
                tiers_df.to_excel(writer, sheet_name='Commission_Tiers', index=False)

            # Bonuses
            if self.bonuses:
                bonuses_df = pd.DataFrame([vars(bonus) for bonus in self.bonuses])
                bonuses_df.insert(0, 'plan_id', self.plan_id)
                bonuses_df.to_excel(writer, sheet_name='Bonuses', index=False)

            # SPIFs
            if self.spifs:
                spifs_df = pd.DataFrame([vars(spif) for spif in self.spifs])
                spifs_df.to_excel(writer, sheet_name='SPIFs', index=False)

        logger.info(f"Exported plan to {file_path}")

    @staticmethod
    def from_excel(file_path: str, plan_id: Optional[str] = None) -> 'CompensationPlan':
        """
        Load plan from Excel file.

        Args:
            file_path: Path to Excel file
            plan_id: Specific plan ID to load (None = first plan)

        Returns:
            CompensationPlan instance
        """
        from ..data.loader import ExcelDataLoader

        # Load plan data
        plan_data = ExcelDataLoader.load_compensation_plan(file_path, plan_id)

        # Get plan overview
        overview = plan_data['overview'].iloc[0]
        plan = CompensationPlan(
            plan_id=overview['plan_id'],
            name=overview.get('plan_name', overview['plan_id'])
        )

        # Load commission tiers
        if 'commission_tiers' in plan_data:
            for _, row in plan_data['commission_tiers'].iterrows():
                plan.add_commission_tier(
                    quota_min=row['quota_min'],
                    quota_max=row['quota_max'],
                    rate=row['rate_value'],
                    tier_name=row['tier_name'],
                    rate_type=row['rate_type'],
                    applies_to=row['applies_to']
                )

        # Load bonuses
        if 'bonuses' in plan_data:
            for _, row in plan_data['bonuses'].iterrows():
                trigger = f"{row['trigger_metric']} {row['trigger_condition']} {row['trigger_value']}"
                plan.add_bonus(
                    name=row['bonus_name'],
                    trigger=trigger,
                    payout=row['payout_value'],
                    frequency=row['frequency']
                )

        logger.info(f"Loaded plan '{plan.plan_id}' from {file_path}")

        return plan

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"CompensationPlan(plan_id='{self.plan_id}', "
            f"tiers={len(self.commission_tiers)}, "
            f"bonuses={len(self.bonuses)}, "
            f"spifs={len(self.spifs)})"
        )
