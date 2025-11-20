"""Unit tests for distribution fitting."""

import pytest
import numpy as np
from scipy import stats

from spm_monte_carlo.statistics import DistributionFitter


class TestDistributionFitter:
    """Test suite for DistributionFitter."""

    def test_normal_distribution_fitting(self):
        """Test fitting a normal distribution."""
        np.random.seed(42)
        data = np.random.normal(loc=100, scale=15, size=1000)

        fitter = DistributionFitter()
        result = fitter.fit(data, distribution_type='normal')

        # Check parameters are close to known values
        assert result.params['loc'] == pytest.approx(100, abs=2)
        assert result.params['scale'] == pytest.approx(15, abs=2)
        assert result.goodness_of_fit['p_value'] > 0.05

    def test_auto_distribution_selection(self):
        """Test automatic distribution selection."""
        np.random.seed(42)
        data = np.random.lognormal(mean=4.6, sigma=0.5, size=1000)

        fitter = DistributionFitter()
        result = fitter.auto_fit(data, candidates=['normal', 'lognormal', 'gamma'])

        # Should select lognormal as best fit
        assert result.selected_distribution == 'lognormal'
        assert result.goodness_of_fit['p_value'] > 0.01

    def test_insufficient_data_error(self):
        """Test error handling for insufficient data."""
        data = np.array([1, 2, 3])  # Too few points

        fitter = DistributionFitter(min_data_points=30)
        with pytest.raises(ValueError, match="Insufficient data"):
            fitter.fit(data)

    def test_outlier_removal(self):
        """Test outlier detection and treatment."""
        data = np.random.normal(100, 15, 1000)
        data = np.append(data, [500, 600, -200])  # Add outliers

        fitter = DistributionFitter()
        result_with_outliers = fitter.fit(data, remove_outliers=False)
        result_without_outliers = fitter.fit(data, remove_outliers=True)

        # Without outliers should have better fit (lower std dev)
        assert result_without_outliers.params['scale'] < result_with_outliers.params['scale']
