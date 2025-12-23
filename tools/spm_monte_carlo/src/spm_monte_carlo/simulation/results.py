"""Simulation results container and analysis."""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class SimulationResults:
    """Container for simulation results with built-in analysis methods."""

    def __init__(self, scenarios: pd.DataFrame):
        """
        Initialize results.

        Args:
            scenarios: DataFrame with all simulation scenarios
        """
        self._scenarios = scenarios
        self._summary_stats = None
        self._risk_metrics = None

    @property
    def scenarios(self) -> pd.DataFrame:
        """Full scenario dataset."""
        return self._scenarios

    @property
    def summary_stats(self) -> pd.DataFrame:
        """Summary statistics (computed on first access)."""
        if self._summary_stats is None:
            self._summary_stats = self._compute_summary_stats()
        return self._summary_stats

    @property
    def risk_metrics(self) -> Dict[str, float]:
        """Risk metrics (computed on first access)."""
        if self._risk_metrics is None:
            self._risk_metrics = self._compute_risk_metrics()
        return self._risk_metrics

    def summary(self, percentiles: List[float] = [5, 25, 50, 75, 95, 99]) -> pd.DataFrame:
        """
        Generate summary statistics.

        Args:
            percentiles: Percentiles to include

        Returns:
            DataFrame with summary stats
        """
        # Select numeric columns
        numeric_cols = self._scenarios.select_dtypes(include=[np.number]).columns

        summary_data = {}

        for col in numeric_cols:
            stats = {
                'mean': self._scenarios[col].mean(),
                'median': self._scenarios[col].median(),
                'std': self._scenarios[col].std(),
                'min': self._scenarios[col].min(),
                'max': self._scenarios[col].max()
            }

            # Add percentiles
            for p in percentiles:
                stats[f'p{p}'] = self._scenarios[col].quantile(p / 100)

            summary_data[col] = stats

        return pd.DataFrame(summary_data).T

    def var(self, confidence: float = 0.95, variable: str = 'total_payout') -> float:
        """
        Calculate Value at Risk.

        Args:
            confidence: Confidence level (default: 0.95)
            variable: Variable to analyze

        Returns:
            VaR value
        """
        if variable not in self._scenarios.columns:
            raise ValueError(f"Variable '{variable}' not found in scenarios")

        var_value = self._scenarios[variable].quantile(confidence)
        return float(var_value)

    def cvar(self, confidence: float = 0.95, variable: str = 'total_payout') -> float:
        """
        Calculate Conditional Value at Risk (expected value beyond VaR).

        Args:
            confidence: Confidence level (default: 0.95)
            variable: Variable to analyze

        Returns:
            CVaR value
        """
        if variable not in self._scenarios.columns:
            raise ValueError(f"Variable '{variable}' not found in scenarios")

        var_threshold = self.var(confidence, variable)
        tail_values = self._scenarios[self._scenarios[variable] >= var_threshold][variable]

        cvar_value = tail_values.mean()
        return float(cvar_value)

    def prob_exceed(self, threshold: float, variable: str = 'total_payout') -> float:
        """
        Probability of exceeding threshold.

        Args:
            threshold: Threshold value
            variable: Variable to analyze

        Returns:
            Probability (0-1)
        """
        if variable not in self._scenarios.columns:
            raise ValueError(f"Variable '{variable}' not found in scenarios")

        exceed = (self._scenarios[variable] > threshold).sum()
        probability = exceed / len(self._scenarios)

        return float(probability)

    def sensitivity_analysis(
        self,
        output_variable: str = 'total_payout',
        input_variables: Optional[List[str]] = None,
        method: str = 'correlation'
    ) -> pd.DataFrame:
        """
        Perform sensitivity analysis.

        Args:
            output_variable: Output variable to analyze
            input_variables: Input variables (None = all numeric)
            method: 'correlation' or 'regression'

        Returns:
            DataFrame with sensitivity metrics
        """
        if output_variable not in self._scenarios.columns:
            raise ValueError(f"Output variable '{output_variable}' not found")

        if input_variables is None:
            # Use all numeric columns except output
            input_variables = [
                col for col in self._scenarios.select_dtypes(include=[np.number]).columns
                if col != output_variable
            ]

        if method == 'correlation':
            # Calculate correlations
            correlations = {}
            for var in input_variables:
                if var in self._scenarios.columns:
                    corr = self._scenarios[var].corr(self._scenarios[output_variable])
                    correlations[var] = abs(corr)

            # Sort by absolute correlation
            sensitivity_df = pd.DataFrame({
                'variable': list(correlations.keys()),
                'correlation': list(correlations.values())
            }).sort_values('correlation', ascending=False)

            return sensitivity_df

        else:
            raise NotImplementedError(f"Method '{method}' not implemented")

    def to_excel(
        self,
        file_path: str,
        include_scenarios: bool = True,
        include_charts: bool = False
    ):
        """
        Export results to Excel.

        Args:
            file_path: Output file path
            include_scenarios: Include all scenarios
            include_charts: Generate embedded charts
        """
        logger.info(f"Exporting results to {file_path}")

        with pd.ExcelWriter(file_path, engine='xlsxwriter') as writer:
            # Summary statistics
            summary = self.summary()
            summary.to_excel(writer, sheet_name='Summary_Statistics')

            # Risk metrics
            risk_df = pd.DataFrame([self.risk_metrics])
            risk_df.to_excel(writer, sheet_name='Risk_Metrics', index=False)

            # Sensitivity analysis (if possible)
            try:
                sensitivity = self.sensitivity_analysis()
                sensitivity.to_excel(writer, sheet_name='Sensitivity_Analysis', index=False)
            except Exception as e:
                logger.warning(f"Could not generate sensitivity analysis: {e}")

            # All scenarios (optional)
            if include_scenarios:
                self._scenarios.to_excel(writer, sheet_name='All_Scenarios', index=False)

            logger.info(f"Exported results to {file_path}")

    def to_json(self, file_path: str):
        """Export results to JSON."""
        import json

        output = {
            'summary_stats': self.summary().to_dict(),
            'risk_metrics': self.risk_metrics,
            'n_scenarios': len(self._scenarios)
        }

        with open(file_path, 'w') as f:
            json.dump(output, f, indent=2, default=str)

        logger.info(f"Exported results to {file_path}")

    def to_csv(self, directory: str):
        """Export results to CSV files."""
        from pathlib import Path

        dir_path = Path(directory)
        dir_path.mkdir(parents=True, exist_ok=True)

        # Summary
        self.summary().to_csv(dir_path / 'summary_statistics.csv')

        # Scenarios
        self._scenarios.to_csv(dir_path / 'scenarios.csv', index=False)

        logger.info(f"Exported results to {directory}")

    def plot_distribution(
        self,
        variable: str = 'total_payout',
        bins: int = 50,
        show_percentiles: List[float] = [5, 50, 95]
    ):
        """
        Plot distribution histogram.

        Args:
            variable: Variable to plot
            bins: Number of histogram bins
            show_percentiles: Percentile lines to overlay
        """
        import matplotlib.pyplot as plt

        if variable not in self._scenarios.columns:
            raise ValueError(f"Variable '{variable}' not found")

        fig, ax = plt.subplots(figsize=(10, 6))

        # Histogram
        ax.hist(self._scenarios[variable], bins=bins, alpha=0.7, edgecolor='black')

        # Percentile lines
        for p in show_percentiles:
            value = self._scenarios[variable].quantile(p / 100)
            ax.axvline(value, color='red', linestyle='--', linewidth=2,
                      label=f'P{p}: {value:,.0f}')

        ax.set_xlabel(variable)
        ax.set_ylabel('Frequency')
        ax.set_title(f'Distribution of {variable}')
        ax.legend()
        ax.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.show()

    def plot_tornado(self, output_variable: str = 'total_payout', top_n: int = 10):
        """
        Plot tornado chart for sensitivity analysis.

        Args:
            output_variable: Output variable
            top_n: Number of top variables to show
        """
        import matplotlib.pyplot as plt

        sensitivity = self.sensitivity_analysis(output_variable=output_variable)
        top_vars = sensitivity.head(top_n)

        fig, ax = plt.subplots(figsize=(10, 8))

        y_pos = np.arange(len(top_vars))
        ax.barh(y_pos, top_vars['correlation'], align='center')
        ax.set_yticks(y_pos)
        ax.set_yticklabels(top_vars['variable'])
        ax.invert_yaxis()
        ax.set_xlabel('Absolute Correlation')
        ax.set_title(f'Sensitivity Analysis - {output_variable}')
        ax.grid(True, alpha=0.3, axis='x')

        plt.tight_layout()
        plt.show()

    def plot_cdf(self, variable: str = 'total_payout'):
        """Plot cumulative distribution function."""
        import matplotlib.pyplot as plt

        if variable not in self._scenarios.columns:
            raise ValueError(f"Variable '{variable}' not found")

        sorted_data = np.sort(self._scenarios[variable])
        cdf = np.arange(1, len(sorted_data) + 1) / len(sorted_data)

        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(sorted_data, cdf, linewidth=2)
        ax.set_xlabel(variable)
        ax.set_ylabel('Cumulative Probability')
        ax.set_title(f'CDF of {variable}')
        ax.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.show()

    def _compute_summary_stats(self) -> pd.DataFrame:
        """Compute summary statistics."""
        return self.summary()

    def _compute_risk_metrics(self) -> Dict[str, float]:
        """Compute risk metrics."""
        if 'total_payout' not in self._scenarios.columns:
            return {}

        return {
            'expected_payout': float(self._scenarios['total_payout'].mean()),
            'median_payout': float(self._scenarios['total_payout'].median()),
            'std_dev': float(self._scenarios['total_payout'].std()),
            'var_95': self.var(0.95),
            'var_99': self.var(0.99),
            'cvar_95': self.cvar(0.95),
            'cvar_99': self.cvar(0.99),
            'min_payout': float(self._scenarios['total_payout'].min()),
            'max_payout': float(self._scenarios['total_payout'].max()),
            'coefficient_of_variation': float(
                self._scenarios['total_payout'].std() / self._scenarios['total_payout'].mean()
            )
        }
