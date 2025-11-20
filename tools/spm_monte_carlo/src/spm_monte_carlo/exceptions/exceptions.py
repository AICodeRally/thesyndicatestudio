"""Exception hierarchy for SPM Monte Carlo tool."""

from typing import List, Dict, Any, Optional


class SPMMonteCarloException(Exception):
    """Base exception for all SPM Monte Carlo errors."""
    pass


class DataValidationError(SPMMonteCarloException):
    """Base class for data validation errors."""

    def __init__(
        self,
        message: str,
        errors: Optional[List[Dict[str, Any]]] = None,
        line_numbers: Optional[List[int]] = None
    ):
        """
        Initialize validation error.

        Args:
            message: Error message
            errors: List of error details
            line_numbers: Line numbers where errors occurred
        """
        super().__init__(message)
        self.errors = errors or []
        self.line_numbers = line_numbers or []


class SchemaValidationError(DataValidationError):
    """Schema validation failed (wrong columns, data types, etc.)."""
    pass


class BusinessRuleError(DataValidationError):
    """Business rule validation failed (invalid values, constraints, etc.)."""
    pass


class StatisticalValidationError(DataValidationError):
    """Statistical validation failed (insufficient data, outliers, etc.)."""
    pass


class DistributionFittingError(SPMMonteCarloException):
    """Error during distribution fitting."""
    pass


class SimulationError(SPMMonteCarloException):
    """Error during Monte Carlo simulation."""
    pass


class ConvergenceError(SimulationError):
    """Simulation failed to converge."""
    pass


class ConfigurationError(SPMMonteCarloException):
    """Invalid configuration."""
    pass
