"""Statistical analysis module."""

from .distribution_fitter import DistributionFitter, FitResult
from .correlation import CorrelationAnalyzer

__all__ = [
    'DistributionFitter',
    'FitResult',
    'CorrelationAnalyzer'
]
