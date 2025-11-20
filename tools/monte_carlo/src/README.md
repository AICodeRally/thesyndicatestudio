# Source Code Directory

This directory will contain the implementation of the SPM Monte Carlo simulation tool.

## Planned Module Structure

```
src/
├── __init__.py
├── cli.py                          # Command-line interface
├── api.py                          # Python API entry points
│
├── data_ingestion/
│   ├── __init__.py
│   ├── excel_loader.py             # Excel file reading
│   ├── data_validator.py           # Schema and data validation
│   └── schema_manager.py           # Schema definitions
│
├── statistical_analysis/
│   ├── __init__.py
│   ├── distribution_fitter.py      # Fit probability distributions
│   ├── distributions.py            # Distribution classes
│   ├── correlation_analyzer.py     # Correlation analysis
│   └── outlier_detector.py         # Outlier detection
│
├── simulation/
│   ├── __init__.py
│   ├── monte_carlo_engine.py       # Main simulation engine
│   ├── sampling_strategies.py      # MC, LHS, Quasi-random
│   └── simulation_config.py        # Configuration models
│
├── compensation/
│   ├── __init__.py
│   ├── compensation_engine.py      # Main calculator
│   ├── plan_structure.py           # Plan data models
│   ├── rules_engine.py             # Flexible rule evaluation
│   └── tier_calculator.py          # Tier-specific logic
│
├── analytics/
│   ├── __init__.py
│   ├── statistical_analyzer.py     # Summary statistics
│   ├── risk_analyzer.py            # VaR, CVaR, risk metrics
│   ├── sensitivity_analyzer.py     # Tornado charts, sensitivity
│   └── report_generator.py         # Report creation
│
├── visualization/
│   ├── __init__.py
│   ├── chart_generator.py          # Static charts (matplotlib)
│   ├── interactive_dashboard.py    # Interactive (Plotly/Dash)
│   └── style_manager.py            # Consistent styling
│
└── utils/
    ├── __init__.py
    ├── config_loader.py            # YAML/JSON config loading
    ├── logging_config.py           # Logging setup
    ├── exceptions.py               # Custom exception classes
    └── helpers.py                  # Utility functions
```

## Design Principles

Each module should:
1. Have a single, clear responsibility
2. Expose a clean, documented API
3. Be independently testable
4. Follow Python best practices (PEP 8, type hints)
5. Include comprehensive docstrings

## Development Guidelines

- **Type Hints**: Use type hints for all function signatures
- **Docstrings**: Google-style docstrings for all public functions/classes
- **Error Handling**: Use custom exceptions from `utils/exceptions.py`
- **Logging**: Use the configured logger, not print statements
- **Configuration**: Load from config files, not hardcoded values
- **Performance**: Prefer vectorized NumPy operations over loops

## Example Module Template

```python
"""
Module: data_ingestion/excel_loader.py

Loads and parses Excel files containing SPM data.
"""

from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd
from openpyxl import load_workbook

from ..utils.exceptions import DataLoadError
from ..utils.logging_config import get_logger

logger = get_logger(__name__)


class ExcelDataLoader:
    """
    Loads SPM data from Excel workbooks.

    Supports multiple sheets and validates file format.
    """

    def __init__(self, file_path: Path):
        """
        Initialize the Excel data loader.

        Args:
            file_path: Path to the Excel file

        Raises:
            DataLoadError: If file doesn't exist or is invalid format
        """
        self.file_path = file_path
        self._validate_file()

    def _validate_file(self) -> None:
        """Validate that the file exists and is readable."""
        if not self.file_path.exists():
            raise DataLoadError(f"File not found: {self.file_path}")
        # Additional validation...

    def load_sheet(self, sheet_name: str) -> pd.DataFrame:
        """
        Load a specific sheet as a DataFrame.

        Args:
            sheet_name: Name of the sheet to load

        Returns:
            DataFrame containing the sheet data

        Raises:
            DataLoadError: If sheet doesn't exist
        """
        logger.info(f"Loading sheet: {sheet_name}")
        try:
            df = pd.read_excel(self.file_path, sheet_name=sheet_name)
            logger.info(f"Loaded {len(df)} rows from {sheet_name}")
            return df
        except Exception as e:
            raise DataLoadError(f"Failed to load sheet {sheet_name}: {e}")

    # ... additional methods
```

## Status

**Current Phase**: Design
**Implementation**: Pending

See `../docs/ARCHITECTURE.md` for detailed design specifications.
