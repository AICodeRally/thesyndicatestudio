"""
SPM Comp Plan Architect

Enterprise compensation plan template management system.
"""

from .core import (
    LibraryManager,
    Component,
    TemplateEngine,
    Plan,
    Validator,
    ValidationResult,
    GovernanceScorer,
    RiskScore,
)

__version__ = "0.1.0"
__author__ = "Blue Horizons Group"

__all__ = [
    'LibraryManager',
    'Component',
    'TemplateEngine',
    'Plan',
    'Validator',
    'ValidationResult',
    'GovernanceScorer',
    'RiskScore',
]
