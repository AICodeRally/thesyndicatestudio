"""Data schemas for validation."""

from typing import Dict, Any, List

# Historical Performance Schema
HISTORICAL_PERFORMANCE_SCHEMA = {
    'required_columns': [
        'rep_id',
        'period',
        'quota',
        'actual_sales'
    ],
    'optional_columns': [
        'quota_attainment',
        'deal_count',
        'avg_deal_size',
        'territory',
        'segment',
        'product_line'
    ],
    'column_types': {
        'rep_id': 'string',
        'period': 'string',  # Can be date or string like "2024-01" or "2024-Q1"
        'quota': 'numeric',
        'actual_sales': 'numeric',
        'quota_attainment': 'numeric',
        'deal_count': 'integer',
        'avg_deal_size': 'numeric',
        'territory': 'string',
        'segment': 'string',
        'product_line': 'string'
    },
    'constraints': {
        'quota': {'min': 0, 'exclusive_min': True},
        'actual_sales': {'min': 0},
        'quota_attainment': {'min': 0},
        'deal_count': {'min': 0},
        'avg_deal_size': {'min': 0}
    }
}

# Compensation Plan Schema - Plan Overview
PLAN_OVERVIEW_SCHEMA = {
    'required_columns': [
        'plan_id',
        'plan_name',
        'effective_date',
        'frequency'
    ],
    'optional_columns': [
        'end_date',
        'target_incentive'
    ],
    'column_types': {
        'plan_id': 'string',
        'plan_name': 'string',
        'effective_date': 'date',
        'end_date': 'date',
        'frequency': 'string',
        'target_incentive': 'numeric'
    },
    'constraints': {
        'frequency': {'allowed_values': ['monthly', 'quarterly', 'annual']},
        'target_incentive': {'min': 0}
    }
}

# Commission Tiers Schema
COMMISSION_TIERS_SCHEMA = {
    'required_columns': [
        'plan_id',
        'tier_name',
        'quota_min',
        'quota_max',
        'rate_type',
        'rate_value',
        'applies_to'
    ],
    'column_types': {
        'plan_id': 'string',
        'tier_name': 'string',
        'quota_min': 'numeric',
        'quota_max': 'numeric',
        'rate_type': 'string',
        'rate_value': 'numeric',
        'applies_to': 'string'
    },
    'constraints': {
        'quota_min': {'min': 0},
        'quota_max': {'min': 0},
        'rate_type': {'allowed_values': ['percentage', 'flat']},
        'rate_value': {'min': 0},
        'applies_to': {'allowed_values': ['quota', 'total_sales', 'incremental_sales']}
    }
}

# Bonuses Schema
BONUSES_SCHEMA = {
    'required_columns': [
        'plan_id',
        'bonus_name',
        'trigger_type',
        'trigger_metric',
        'trigger_value',
        'trigger_condition',
        'payout_type',
        'payout_value',
        'frequency'
    ],
    'column_types': {
        'plan_id': 'string',
        'bonus_name': 'string',
        'trigger_type': 'string',
        'trigger_metric': 'string',
        'trigger_value': 'numeric',
        'trigger_condition': 'string',
        'payout_type': 'string',
        'payout_value': 'mixed',  # Can be numeric or string (formula)
        'frequency': 'string'
    },
    'constraints': {
        'trigger_type': {'allowed_values': ['quota_threshold', 'metric_threshold']},
        'trigger_condition': {'allowed_values': ['>', '>=', '<', '<=', '==']},
        'payout_type': {'allowed_values': ['flat', 'formula']},
        'frequency': {'allowed_values': ['monthly', 'quarterly', 'annual']}
    }
}

# Rep Master Schema
REP_MASTER_SCHEMA = {
    'required_columns': [
        'rep_id',
        'quota_current',
        'plan_id'
    ],
    'optional_columns': [
        'rep_name',
        'hire_date',
        'tenure_years',
        'territory',
        'segment',
        'role',
        'manager_id',
        'cost_center'
    ],
    'column_types': {
        'rep_id': 'string',
        'rep_name': 'string',
        'hire_date': 'date',
        'tenure_years': 'numeric',
        'territory': 'string',
        'segment': 'string',
        'role': 'string',
        'manager_id': 'string',
        'quota_current': 'numeric',
        'plan_id': 'string',
        'cost_center': 'string'
    },
    'constraints': {
        'quota_current': {'min': 0, 'exclusive_min': True},
        'tenure_years': {'min': 0}
    }
}

# Combined Compensation Plan Schema
COMPENSATION_PLAN_SCHEMA = {
    'Plan_Overview': PLAN_OVERVIEW_SCHEMA,
    'Commission_Tiers': COMMISSION_TIERS_SCHEMA,
    'Bonuses': BONUSES_SCHEMA
}


def get_schema(schema_type: str) -> Dict[str, Any]:
    """
    Get schema by type name.

    Args:
        schema_type: One of 'historical_performance', 'compensation_plan', 'rep_master'

    Returns:
        Schema dictionary

    Raises:
        ValueError: If schema type is unknown
    """
    schemas = {
        'historical_performance': HISTORICAL_PERFORMANCE_SCHEMA,
        'compensation_plan': COMPENSATION_PLAN_SCHEMA,
        'rep_master': REP_MASTER_SCHEMA
    }

    if schema_type not in schemas:
        raise ValueError(f"Unknown schema type: {schema_type}. "
                        f"Must be one of {list(schemas.keys())}")

    return schemas[schema_type]
