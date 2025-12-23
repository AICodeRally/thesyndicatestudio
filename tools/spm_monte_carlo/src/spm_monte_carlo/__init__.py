"""
SPM Monte Carlo - Sales Performance Management Monte Carlo Simulation Tool

A production-grade tool for analyzing compensation variability and risk.
"""

__version__ = '0.1.0'
__author__ = 'Prizym-ai'

from .simulation.simulator import MonteCarloSimulator
from .simulation.results import SimulationResults
from .data.validator import DataValidator
from .compensation.plan import CompensationPlan
from .exceptions.exceptions import (
    SPMMonteCarloException,
    DataValidationError,
    DistributionFittingError,
    SimulationError,
    ConfigurationError
)

__all__ = [
    'MonteCarloSimulator',
    'SimulationResults',
    'DataValidator',
    'CompensationPlan',
    'SPMMonteCarloException',
    'DataValidationError',
    'DistributionFittingError',
    'SimulationError',
    'ConfigurationError'
]
