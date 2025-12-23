"""Distribution fitting utilities."""

import numpy as np
import pandas as pd
from scipy import stats
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
import logging

from ..exceptions import DistributionFittingError

logger = logging.getLogger(__name__)


@dataclass
class FitResult:
    """Result of distribution fitting."""

    distribution_name: str
    distribution: Any  # scipy.stats distribution
    params: Dict[str, float]
    goodness_of_fit: Dict[str, float]
    selected_distribution: Optional[str] = None


class DistributionFitter:
    """Fit probability distributions to data."""

    SUPPORTED_DISTRIBUTIONS = {
        'normal': stats.norm,
        'lognormal': stats.lognorm,
        'gamma': stats.gamma,
        'beta': stats.beta,
        'uniform': stats.uniform,
        'triangular': stats.triang
    }

    def __init__(self, min_data_points: int = 30):
        """
        Initialize fitter.

        Args:
            min_data_points: Minimum data points required for fitting
        """
        self.min_data_points = min_data_points

    def fit(
        self,
        data: np.ndarray,
        distribution_type: str = 'normal',
        remove_outliers: bool = False,
        test_fit: bool = True
    ) -> FitResult:
        """
        Fit a specific distribution to data.

        Args:
            data: Data array
            distribution_type: Distribution family to fit
            remove_outliers: Remove outliers before fitting
            test_fit: Run goodness-of-fit test

        Returns:
            FitResult

        Raises:
            DistributionFittingError: If fitting fails
            ValueError: If insufficient data
        """
        # Validate data
        data = self._validate_data(data)

        if len(data) < self.min_data_points:
            raise ValueError(
                f"Insufficient data: {len(data)} points "
                f"(minimum: {self.min_data_points})"
            )

        # Remove outliers if requested
        if remove_outliers:
            data = self._remove_outliers(data)

        # Get distribution class
        if distribution_type not in self.SUPPORTED_DISTRIBUTIONS:
            raise ValueError(
                f"Unsupported distribution: {distribution_type}. "
                f"Must be one of {list(self.SUPPORTED_DISTRIBUTIONS.keys())}"
            )

        dist_class = self.SUPPORTED_DISTRIBUTIONS[distribution_type]

        # Fit distribution
        try:
            params = dist_class.fit(data)
            logger.info(f"Fitted {distribution_type} distribution: {params}")

            # Create distribution object
            distribution = dist_class(*params)

            # Extract parameter names
            param_names = self._get_param_names(dist_class, params)

            # Goodness of fit test
            gof = {}
            if test_fit:
                gof = self._test_goodness_of_fit(data, distribution)

            return FitResult(
                distribution_name=distribution_type,
                distribution=distribution,
                params=param_names,
                goodness_of_fit=gof
            )

        except Exception as e:
            raise DistributionFittingError(
                f"Failed to fit {distribution_type} distribution: {str(e)}"
            ) from e

    def auto_fit(
        self,
        data: np.ndarray,
        candidates: Optional[List[str]] = None,
        remove_outliers: bool = False
    ) -> FitResult:
        """
        Automatically select best-fitting distribution.

        Args:
            data: Data array
            candidates: List of distributions to try (None = all)
            remove_outliers: Remove outliers before fitting

        Returns:
            FitResult with best-fit distribution
        """
        if candidates is None:
            candidates = list(self.SUPPORTED_DISTRIBUTIONS.keys())

        logger.info(f"Auto-fitting distributions: {candidates}")

        best_fit = None
        best_pvalue = -1

        for dist_type in candidates:
            try:
                result = self.fit(
                    data,
                    distribution_type=dist_type,
                    remove_outliers=remove_outliers,
                    test_fit=True
                )

                p_value = result.goodness_of_fit.get('p_value', 0)

                if p_value > best_pvalue:
                    best_pvalue = p_value
                    best_fit = result
                    logger.info(f"{dist_type}: p-value = {p_value:.4f}")

            except Exception as e:
                logger.warning(f"Failed to fit {dist_type}: {e}")
                continue

        if best_fit is None:
            raise DistributionFittingError("Failed to fit any distribution")

        best_fit.selected_distribution = best_fit.distribution_name
        logger.info(f"Best fit: {best_fit.distribution_name} (p={best_pvalue:.4f})")

        return best_fit

    def _validate_data(self, data: np.ndarray) -> np.ndarray:
        """Validate and clean data."""
        data = np.asarray(data).flatten()

        # Remove NaN and inf
        data = data[np.isfinite(data)]

        if len(data) == 0:
            raise ValueError("No valid data points after removing NaN/inf")

        return data

    def _remove_outliers(self, data: np.ndarray, n_std: float = 3.0) -> np.ndarray:
        """Remove outliers beyond n standard deviations."""
        mean = np.mean(data)
        std = np.std(data)

        mask = np.abs(data - mean) <= n_std * std
        cleaned = data[mask]

        removed = len(data) - len(cleaned)
        if removed > 0:
            logger.info(f"Removed {removed} outliers (>{n_std} std dev)")

        return cleaned

    def _test_goodness_of_fit(
        self,
        data: np.ndarray,
        distribution: Any
    ) -> Dict[str, float]:
        """
        Perform Kolmogorov-Smirnov goodness-of-fit test.

        Args:
            data: Observed data
            distribution: Fitted distribution

        Returns:
            Dictionary with test statistics
        """
        # K-S test
        ks_stat, p_value = stats.kstest(data, distribution.cdf)

        return {
            'ks_statistic': float(ks_stat),
            'p_value': float(p_value),
            'n_samples': len(data)
        }

    def _get_param_names(
        self,
        dist_class: Any,
        params: tuple
    ) -> Dict[str, float]:
        """Extract parameter names and values."""
        # For scipy distributions, parameters are typically (shape, loc, scale)
        # This is a simplified mapping

        param_dict = {}

        if dist_class == stats.norm:
            param_dict = {'loc': params[0], 'scale': params[1]}
        elif dist_class == stats.lognorm:
            param_dict = {'s': params[0], 'loc': params[1], 'scale': params[2]}
        elif dist_class == stats.gamma:
            param_dict = {'a': params[0], 'loc': params[1], 'scale': params[2]}
        elif dist_class == stats.beta:
            param_dict = {'a': params[0], 'b': params[1], 'loc': params[2], 'scale': params[3]}
        elif dist_class == stats.uniform:
            param_dict = {'loc': params[0], 'scale': params[1]}
        elif dist_class == stats.triang:
            param_dict = {'c': params[0], 'loc': params[1], 'scale': params[2]}
        else:
            # Generic fallback
            for i, val in enumerate(params):
                param_dict[f'param_{i}'] = val

        return param_dict

    def fit_variable(
        self,
        df: pd.DataFrame,
        variable: str,
        distribution_type: Optional[str] = None,
        auto: bool = True
    ) -> FitResult:
        """
        Fit distribution to a DataFrame column.

        Args:
            df: DataFrame containing data
            variable: Column name
            distribution_type: Specific distribution to fit (None = auto)
            auto: Use auto-fit if distribution_type is None

        Returns:
            FitResult
        """
        if variable not in df.columns:
            raise ValueError(f"Variable '{variable}' not found in DataFrame")

        data = df[variable].dropna().values

        if distribution_type:
            return self.fit(data, distribution_type=distribution_type)
        elif auto:
            return self.auto_fit(data)
        else:
            return self.fit(data, distribution_type='normal')
