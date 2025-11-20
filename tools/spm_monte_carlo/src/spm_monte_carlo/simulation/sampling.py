"""Sampling strategies for Monte Carlo simulation."""

import numpy as np
from abc import ABC, abstractmethod
from typing import Any, Optional
from scipy.stats import qmc
import logging

logger = logging.getLogger(__name__)


class SamplingStrategy(ABC):
    """Abstract base class for sampling strategies."""

    @abstractmethod
    def sample(self, distribution: Any, n_samples: int, seed: Optional[int] = None) -> np.ndarray:
        """
        Generate samples from a distribution.

        Args:
            distribution: scipy.stats distribution object
            n_samples: Number of samples to generate
            seed: Random seed

        Returns:
            Array of samples
        """
        pass


class MonteCarloSampling(SamplingStrategy):
    """Standard Monte Carlo sampling (random sampling)."""

    def sample(self, distribution: Any, n_samples: int, seed: Optional[int] = None) -> np.ndarray:
        """
        Generate random samples.

        Args:
            distribution: scipy.stats distribution object
            n_samples: Number of samples
            seed: Random seed

        Returns:
            Random samples
        """
        if seed is not None:
            np.random.seed(seed)

        samples = distribution.rvs(size=n_samples)
        logger.debug(f"Generated {n_samples} Monte Carlo samples")
        return samples


class LatinHypercubeSampling(SamplingStrategy):
    """Latin Hypercube Sampling for better space coverage."""

    def sample(self, distribution: Any, n_samples: int, seed: Optional[int] = None) -> np.ndarray:
        """
        Generate Latin Hypercube samples.

        Args:
            distribution: scipy.stats distribution object
            n_samples: Number of samples
            seed: Random seed

        Returns:
            LHS samples
        """
        # Generate LHS uniform samples [0, 1]
        sampler = qmc.LatinHypercube(d=1, seed=seed)
        uniform_samples = sampler.random(n=n_samples).flatten()

        # Transform to target distribution using inverse CDF
        samples = distribution.ppf(uniform_samples)

        logger.debug(f"Generated {n_samples} Latin Hypercube samples")
        return samples


class QuasiRandomSampling(SamplingStrategy):
    """Quasi-random sampling using Sobol sequences."""

    def sample(self, distribution: Any, n_samples: int, seed: Optional[int] = None) -> np.ndarray:
        """
        Generate quasi-random samples using Sobol sequence.

        Args:
            distribution: scipy.stats distribution object
            n_samples: Number of samples
            seed: Random seed

        Returns:
            Quasi-random samples
        """
        # Generate Sobol sequence
        sampler = qmc.Sobol(d=1, scramble=True, seed=seed)
        uniform_samples = sampler.random(n=n_samples).flatten()

        # Transform to target distribution
        samples = distribution.ppf(uniform_samples)

        logger.debug(f"Generated {n_samples} Sobol quasi-random samples")
        return samples


class MultivariateSampler:
    """Sample multiple correlated variables."""

    def __init__(
        self,
        distributions: dict,
        correlation_matrix: Optional[np.ndarray] = None,
        sampling_strategy: SamplingStrategy = None
    ):
        """
        Initialize multivariate sampler.

        Args:
            distributions: Dict of {variable_name: distribution}
            correlation_matrix: Correlation matrix (None = independent)
            sampling_strategy: Sampling strategy to use
        """
        self.distributions = distributions
        self.correlation_matrix = correlation_matrix
        self.sampling_strategy = sampling_strategy or MonteCarloSampling()
        self.variable_names = list(distributions.keys())

    def sample(self, n_samples: int, seed: Optional[int] = None) -> np.ndarray:
        """
        Generate multivariate samples.

        Args:
            n_samples: Number of samples
            seed: Random seed

        Returns:
            Array of shape (n_samples, n_variables)
        """
        n_vars = len(self.distributions)

        if seed is not None:
            np.random.seed(seed)

        # Generate independent samples for each variable
        samples = np.zeros((n_samples, n_vars))

        for i, (var_name, dist) in enumerate(self.distributions.items()):
            # Use different seed for each variable to maintain independence
            var_seed = seed + i if seed is not None else None
            samples[:, i] = self.sampling_strategy.sample(dist, n_samples, var_seed)

        # Apply correlation if specified
        if self.correlation_matrix is not None:
            from ..statistics.correlation import CorrelationAnalyzer

            # Convert to standard normal
            standard_normal = np.zeros_like(samples)
            for i in range(n_vars):
                # Convert to uniform [0,1]
                uniform = self.distributions[self.variable_names[i]].cdf(samples[:, i])
                # Convert to standard normal
                from scipy.stats import norm
                standard_normal[:, i] = norm.ppf(uniform)

            # Apply correlation using Cholesky
            try:
                L = np.linalg.cholesky(self.correlation_matrix)
                correlated_normal = standard_normal @ L.T
            except np.linalg.LinAlgError:
                # Fix matrix and retry
                logger.warning("Correlation matrix not positive definite, adjusting...")
                fixed_corr = CorrelationAnalyzer.nearest_positive_definite(
                    self.correlation_matrix
                )
                L = np.linalg.cholesky(fixed_corr)
                correlated_normal = standard_normal @ L.T

            # Convert back to original distributions
            for i in range(n_vars):
                # Convert to uniform [0,1]
                from scipy.stats import norm
                uniform = norm.cdf(correlated_normal[:, i])
                # Convert to target distribution
                samples[:, i] = self.distributions[self.variable_names[i]].ppf(uniform)

            logger.info(f"Applied correlation to {n_vars} variables")

        return samples


def get_sampling_strategy(strategy_name: str) -> SamplingStrategy:
    """
    Get sampling strategy by name.

    Args:
        strategy_name: 'monte_carlo', 'lhs', or 'quasi_random'

    Returns:
        SamplingStrategy instance

    Raises:
        ValueError: If strategy name is unknown
    """
    strategies = {
        'monte_carlo': MonteCarloSampling,
        'lhs': LatinHypercubeSampling,
        'latin_hypercube': LatinHypercubeSampling,
        'quasi_random': QuasiRandomSampling,
        'sobol': QuasiRandomSampling
    }

    if strategy_name not in strategies:
        raise ValueError(
            f"Unknown sampling strategy: {strategy_name}. "
            f"Must be one of {list(strategies.keys())}"
        )

    return strategies[strategy_name]()
