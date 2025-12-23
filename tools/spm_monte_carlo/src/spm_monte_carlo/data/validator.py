"""Data validation utilities."""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
import logging

from ..exceptions import (
    DataValidationError,
    SchemaValidationError,
    BusinessRuleError,
    StatisticalValidationError
)
from .schemas import get_schema

logger = logging.getLogger(__name__)


@dataclass
class ValidationReport:
    """Validation report containing errors and warnings."""

    is_valid: bool = True
    errors: List[Dict[str, Any]] = field(default_factory=list)
    warnings: List[Dict[str, Any]] = field(default_factory=list)
    schema_type: Optional[str] = None

    def add_error(
        self,
        level: str,
        category: str,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ):
        """Add an error or warning to the report."""
        entry = {
            'level': level,
            'category': category,
            'message': message,
            'details': details or {}
        }

        if level == 'error':
            self.errors.append(entry)
            self.is_valid = False
        elif level == 'warning':
            self.warnings.append(entry)

    def __str__(self) -> str:
        """Generate readable report string."""
        lines = []
        lines.append("=" * 60)
        lines.append("Data Validation Report")
        lines.append("=" * 60)

        if self.schema_type:
            lines.append(f"Schema Type: {self.schema_type}")

        lines.append(f"Status: {'PASSED' if self.is_valid else 'FAILED'}")
        lines.append(f"Errors: {len(self.errors)}")
        lines.append(f"Warnings: {len(self.warnings)}")
        lines.append("")

        if self.errors:
            lines.append("ERRORS:")
            lines.append("-" * 60)
            for i, error in enumerate(self.errors, 1):
                lines.append(f"{i}. [{error['category']}] {error['message']}")
                if error['details']:
                    for key, value in error['details'].items():
                        lines.append(f"   {key}: {value}")
            lines.append("")

        if self.warnings:
            lines.append("WARNINGS:")
            lines.append("-" * 60)
            for i, warning in enumerate(self.warnings, 1):
                lines.append(f"{i}. [{warning['category']}] {warning['message']}")
                if warning['details']:
                    for key, value in warning['details'].items():
                        lines.append(f"   {key}: {value}")
            lines.append("")

        lines.append("=" * 60)
        return "\n".join(lines)


class DataValidator:
    """Validate data against defined schemas."""

    @staticmethod
    def validate_dataframe(
        df: pd.DataFrame,
        schema_type: str,
        strict: bool = False
    ) -> ValidationReport:
        """
        Validate DataFrame against schema.

        Args:
            df: DataFrame to validate
            schema_type: Schema type ('historical_performance', 'rep_master', etc.)
            strict: Fail on warnings if True

        Returns:
            ValidationReport
        """
        logger.info(f"Validating DataFrame against {schema_type} schema")

        report = ValidationReport(schema_type=schema_type)
        schema = get_schema(schema_type)

        # Schema validation
        DataValidator._validate_schema(df, schema, report)

        # Business rule validation
        if schema_type == 'historical_performance':
            DataValidator._validate_historical_performance(df, report)
        elif schema_type == 'rep_master':
            DataValidator._validate_rep_master(df, report)

        # Statistical validation
        DataValidator._validate_statistical(df, schema_type, report)

        if strict and report.warnings:
            report.is_valid = False

        logger.info(f"Validation complete: {'PASSED' if report.is_valid else 'FAILED'}")
        return report

    @staticmethod
    def validate_file(
        file_path: str,
        schema_type: str,
        sheet_name: Optional[str] = None,
        strict: bool = False
    ) -> ValidationReport:
        """
        Validate Excel file against schema.

        Args:
            file_path: Path to Excel file
            schema_type: Schema type
            sheet_name: Sheet name to validate
            strict: Fail on warnings if True

        Returns:
            ValidationReport
        """
        from .loader import ExcelDataLoader

        if schema_type == 'historical_performance':
            df = ExcelDataLoader.load_historical_performance(
                file_path, sheet_name or 'Performance'
            )
        elif schema_type == 'rep_master':
            df = ExcelDataLoader.load_rep_master(
                file_path, sheet_name or 'Reps'
            )
        else:
            df = ExcelDataLoader.load_dataframe(file_path, sheet_name or 0)

        return DataValidator.validate_dataframe(df, schema_type, strict)

    @staticmethod
    def _validate_schema(
        df: pd.DataFrame,
        schema: Dict[str, Any],
        report: ValidationReport
    ):
        """Validate schema (columns, types)."""
        # Check required columns
        required = schema.get('required_columns', [])
        missing_cols = set(required) - set(df.columns)

        if missing_cols:
            report.add_error(
                'error',
                'schema',
                f"Missing required columns: {', '.join(missing_cols)}"
            )

        # Check for unexpected columns
        all_expected = required + schema.get('optional_columns', [])
        unexpected_cols = set(df.columns) - set(all_expected)

        if unexpected_cols:
            report.add_error(
                'warning',
                'schema',
                f"Unexpected columns found: {', '.join(unexpected_cols)}"
            )

        # Type checking (basic)
        column_types = schema.get('column_types', {})
        for col, expected_type in column_types.items():
            if col not in df.columns:
                continue

            if expected_type == 'numeric':
                if not pd.api.types.is_numeric_dtype(df[col]):
                    report.add_error(
                        'error',
                        'schema',
                        f"Column '{col}' should be numeric but is {df[col].dtype}"
                    )
            elif expected_type == 'integer':
                if not pd.api.types.is_integer_dtype(df[col]):
                    report.add_error(
                        'warning',
                        'schema',
                        f"Column '{col}' should be integer but is {df[col].dtype}"
                    )

    @staticmethod
    def _validate_historical_performance(
        df: pd.DataFrame,
        report: ValidationReport
    ):
        """Validate historical performance business rules."""
        # Check for duplicates
        if 'rep_id' in df.columns and 'period' in df.columns:
            duplicates = df.duplicated(subset=['rep_id', 'period'], keep=False)
            if duplicates.any():
                dup_count = duplicates.sum()
                report.add_error(
                    'error',
                    'business_rule',
                    f"Found {dup_count} duplicate (rep_id, period) combinations"
                )

        # Validate quota > 0
        if 'quota' in df.columns:
            invalid_quota = df['quota'] <= 0
            if invalid_quota.any():
                report.add_error(
                    'error',
                    'business_rule',
                    f"Found {invalid_quota.sum()} rows with quota <= 0"
                )

        # Validate actual_sales >= 0
        if 'actual_sales' in df.columns:
            invalid_sales = df['actual_sales'] < 0
            if invalid_sales.any():
                report.add_error(
                    'error',
                    'business_rule',
                    f"Found {invalid_sales.sum()} rows with negative actual_sales"
                )

        # Check quota_attainment calculation
        if all(col in df.columns for col in ['quota_attainment', 'actual_sales', 'quota']):
            calculated = df['actual_sales'] / df['quota']
            mismatch = ~np.isclose(df['quota_attainment'], calculated, rtol=0.01)
            if mismatch.any():
                report.add_error(
                    'warning',
                    'business_rule',
                    f"Found {mismatch.sum()} rows where quota_attainment doesn't match actual_sales/quota"
                )

    @staticmethod
    def _validate_rep_master(
        df: pd.DataFrame,
        report: ValidationReport
    ):
        """Validate rep master business rules."""
        # Check for duplicate rep_ids
        if 'rep_id' in df.columns:
            duplicates = df['rep_id'].duplicated()
            if duplicates.any():
                report.add_error(
                    'error',
                    'business_rule',
                    f"Found {duplicates.sum()} duplicate rep_ids"
                )

        # Validate quota_current > 0
        if 'quota_current' in df.columns:
            invalid_quota = df['quota_current'] <= 0
            if invalid_quota.any():
                report.add_error(
                    'error',
                    'business_rule',
                    f"Found {invalid_quota.sum()} rows with quota_current <= 0"
                )

    @staticmethod
    def _validate_statistical(
        df: pd.DataFrame,
        schema_type: str,
        report: ValidationReport
    ):
        """Statistical validation (data sufficiency, outliers)."""
        if schema_type == 'historical_performance':
            # Check for sufficient data per rep
            if 'rep_id' in df.columns and 'period' in df.columns:
                periods_per_rep = df.groupby('rep_id')['period'].count()
                insufficient = periods_per_rep < 12

                if insufficient.any():
                    count = insufficient.sum()
                    report.add_error(
                        'warning',
                        'statistical',
                        f"{count} reps have fewer than 12 periods of data (recommended minimum)"
                    )

            # Check for outliers in quota_attainment
            if 'quota_attainment' in df.columns:
                mean = df['quota_attainment'].mean()
                std = df['quota_attainment'].std()
                outliers = np.abs(df['quota_attainment'] - mean) > 3 * std

                if outliers.any():
                    outlier_values = df.loc[outliers, 'quota_attainment'].tolist()
                    report.add_error(
                        'warning',
                        'statistical',
                        f"Found {outliers.sum()} outliers in quota_attainment (>3 std dev)",
                        {'outlier_values': outlier_values[:10]}  # Show first 10
                    )

        # Check for excessive missing data
        missing_pct = df.isnull().sum() / len(df) * 100
        high_missing = missing_pct[missing_pct > 20]

        if len(high_missing) > 0:
            report.add_error(
                'warning',
                'statistical',
                f"Columns with >20% missing data: {high_missing.to_dict()}"
            )
