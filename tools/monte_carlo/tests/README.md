# Tests Directory

This directory will contain comprehensive test suites for the SPM Monte Carlo simulation tool.

## Test Structure

```
tests/
├── __init__.py
├── conftest.py                     # Shared pytest fixtures
│
├── unit/                           # Unit tests (fast, isolated)
│   ├── __init__.py
│   ├── test_excel_loader.py
│   ├── test_data_validator.py
│   ├── test_distribution_fitter.py
│   ├── test_monte_carlo_engine.py
│   ├── test_compensation_engine.py
│   ├── test_statistical_analyzer.py
│   └── test_risk_analyzer.py
│
├── integration/                    # Integration tests (slower, multi-component)
│   ├── __init__.py
│   ├── test_end_to_end_workflow.py
│   ├── test_excel_to_simulation.py
│   └── test_simulation_to_report.py
│
├── validation/                     # Validation tests (known outcomes)
│   ├── __init__.py
│   ├── test_known_scenarios.py    # Compare to manually calculated results
│   └── test_distribution_sampling.py  # Statistical validation
│
├── performance/                    # Performance benchmarks
│   ├── __init__.py
│   ├── test_simulation_speed.py
│   └── test_memory_usage.py
│
└── fixtures/                       # Test data and fixtures
    ├── sample_historical_data.xlsx
    ├── sample_plan_structure.xlsx
    ├── test_config.yaml
    └── expected_results/
        └── baseline_simulation_results.json
```

## Testing Strategy

### 1. Unit Tests

**Purpose**: Test individual functions and classes in isolation

**Characteristics**:
- Fast execution (< 1 second per test)
- No external dependencies (files, network)
- Use mocks and stubs for dependencies
- Test edge cases and error conditions

**Example**:
```python
"""test_distribution_fitter.py"""

import pytest
import numpy as np
from src.statistical_analysis.distribution_fitter import DistributionFitter

class TestDistributionFitter:

    @pytest.fixture
    def normal_data(self):
        """Generate normally distributed data"""
        np.random.seed(42)
        return np.random.normal(loc=100, scale=15, size=1000)

    def test_fit_normal_distribution(self, normal_data):
        """Test fitting a normal distribution to normal data"""
        fitter = DistributionFitter()
        result = fitter.fit_distribution(normal_data, 'normal')

        assert result.distribution_type == 'normal'
        assert 95 < result.parameters['mean'] < 105  # Close to true mean of 100
        assert 12 < result.parameters['std'] < 18    # Close to true std of 15
        assert result.gof_pvalue > 0.05  # Good fit

    def test_auto_fit_selects_best(self, normal_data):
        """Test that auto-fit selects the best distribution"""
        fitter = DistributionFitter()
        results = fitter.auto_fit(normal_data)

        assert len(results) > 0
        assert results[0].distribution_type == 'normal'  # Should rank normal first

    def test_fit_with_insufficient_data(self):
        """Test handling of insufficient data"""
        fitter = DistributionFitter()
        small_data = np.array([1, 2, 3])

        with pytest.raises(ValueError, match="Insufficient data"):
            fitter.fit_distribution(small_data, 'normal')
```

### 2. Integration Tests

**Purpose**: Test multiple components working together

**Characteristics**:
- Moderate execution time (seconds to minutes)
- May use test fixtures (files)
- Test realistic workflows
- Verify data flow between components

**Example**:
```python
"""test_end_to_end_workflow.py"""

import pytest
from pathlib import Path
from src.api import MonteCarloSimulator

class TestEndToEndWorkflow:

    @pytest.fixture
    def test_data_path(self):
        return Path(__file__).parent.parent / "fixtures" / "sample_historical_data.xlsx"

    def test_complete_simulation_workflow(self, test_data_path):
        """Test full workflow from data load to results"""
        # Initialize simulator
        simulator = MonteCarloSimulator()

        # Load data
        simulator.load_data(test_data_path)

        # Configure
        simulator.configure(iterations=1000, seed=42)

        # Run simulation
        results = simulator.run()

        # Verify results
        assert results is not None
        assert results.n_iterations == 1000
        assert results.summary_stats['mean'] > 0

        # Verify reproducibility (same seed should give same results)
        simulator2 = MonteCarloSimulator()
        simulator2.load_data(test_data_path)
        simulator2.configure(iterations=1000, seed=42)
        results2 = simulator2.run()

        assert abs(results.summary_stats['mean'] - results2.summary_stats['mean']) < 1e-6
```

### 3. Validation Tests

**Purpose**: Verify correctness against known outcomes

**Characteristics**:
- Compare simulation results to manually calculated values
- Statistical validation of sampling methods
- Regression tests (results shouldn't change unexpectedly)

**Example**:
```python
"""test_known_scenarios.py"""

import pytest
from src.api import MonteCarloSimulator

class TestKnownScenarios:

    def test_deterministic_scenario(self):
        """Test with zero variance (deterministic outcome)"""
        # If all reps have exactly 100% quota attainment,
        # compensation should be exactly calculable

        simulator = MonteCarloSimulator()
        # ... setup with deterministic distributions ...

        results = simulator.run(iterations=100)

        # All iterations should produce identical results
        assert results.std_dev < 1e-6
        assert abs(results.mean - EXPECTED_VALUE) < 1e-6

    def test_simple_normal_distribution(self):
        """Test that mean of simulated normal distribution matches input"""
        simulator = MonteCarloSimulator()
        # ... setup with known normal distribution (mean=100, std=10) ...

        results = simulator.run(iterations=10000)

        # Law of large numbers: sample mean should approach population mean
        assert abs(results.mean - 100) < 1  # Within 1 unit
        assert abs(results.std_dev - 10) < 0.5  # Within 0.5 units
```

### 4. Performance Tests

**Purpose**: Ensure acceptable execution time and memory usage

**Example**:
```python
"""test_simulation_speed.py"""

import pytest
import time
from src.api import MonteCarloSimulator

class TestPerformance:

    def test_simulation_speed_10k_iterations(self, benchmark_data):
        """Verify 10k iterations complete within acceptable time"""
        simulator = MonteCarloSimulator()
        simulator.load_data(benchmark_data)
        simulator.configure(iterations=10000, parallel=False)

        start = time.time()
        results = simulator.run()
        duration = time.time() - start

        # Should complete in under 30 seconds on standard hardware
        assert duration < 30, f"Simulation took {duration:.1f}s, expected < 30s"

    def test_parallel_speedup(self, benchmark_data):
        """Verify parallel processing provides speedup"""
        simulator_serial = MonteCarloSimulator()
        simulator_serial.load_data(benchmark_data)
        simulator_serial.configure(iterations=10000, parallel=False)

        simulator_parallel = MonteCarloSimulator()
        simulator_parallel.load_data(benchmark_data)
        simulator_parallel.configure(iterations=10000, parallel=True, n_jobs=4)

        start_serial = time.time()
        simulator_serial.run()
        duration_serial = time.time() - start_serial

        start_parallel = time.time()
        simulator_parallel.run()
        duration_parallel = time.time() - start_parallel

        # Parallel should be at least 2x faster with 4 cores
        speedup = duration_serial / duration_parallel
        assert speedup > 2.0, f"Speedup {speedup:.2f}x, expected > 2x"
```

## Test Fixtures

### Shared Fixtures (`conftest.py`)

```python
"""conftest.py - Shared pytest fixtures"""

import pytest
import numpy as np
import pandas as pd
from pathlib import Path

@pytest.fixture
def sample_historical_data():
    """Generate sample historical performance data"""
    np.random.seed(42)
    data = {
        'rep_id': ['REP001'] * 12 + ['REP002'] * 12,
        'period': ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4'] * 6,
        'metric_name': ['quota_attainment_pct'] * 24,
        'metric_value': np.random.lognormal(0, 0.2, 24)
    }
    return pd.DataFrame(data)

@pytest.fixture
def sample_plan_structure():
    """Generate sample compensation plan"""
    data = {
        'plan_id': ['PLAN-A'] * 3,
        'role': ['AE'] * 3,
        'tier_sequence': [1, 2, 3],
        'tier_min': [0.0, 0.75, 1.0],
        'tier_max': [0.75, 1.0, 2.0],
        'rate': [0.02, 0.05, 0.08],
        'rate_type': ['percentage'] * 3,
        'applies_to': ['revenue'] * 3
    }
    return pd.DataFrame(data)

@pytest.fixture
def temp_output_dir(tmp_path):
    """Provide a temporary directory for test outputs"""
    output_dir = tmp_path / "test_output"
    output_dir.mkdir()
    return output_dir
```

## Running Tests

### Run All Tests
```bash
pytest
```

### Run Specific Test Suite
```bash
pytest tests/unit/                  # Only unit tests
pytest tests/integration/           # Only integration tests
pytest tests/validation/            # Only validation tests
```

### Run with Coverage
```bash
pytest --cov=src --cov-report=html
```

### Run Performance Benchmarks
```bash
pytest tests/performance/ -v --tb=short
```

### Run in Parallel (faster)
```bash
pytest -n auto  # Requires pytest-xdist
```

## Code Coverage Goals

- **Overall Coverage**: > 80%
- **Core Modules** (simulation, compensation, statistical_analysis): > 90%
- **Critical Paths** (main workflows): 100%

## Continuous Integration

Tests will run automatically on:
- Every commit (fast unit tests only)
- Pull requests (full test suite)
- Nightly builds (including performance benchmarks)

## Test Data

Test fixtures should:
1. Be small (fast to load)
2. Cover edge cases
3. Be version controlled (in `fixtures/` directory)
4. Include both valid and invalid data for error handling tests

**Example Fixture Files**:
- `sample_historical_data.xlsx`: 3 reps, 12 months, 5 metrics
- `sample_plan_structure.xlsx`: 2 plans, 3 tiers each
- `invalid_data_missing_columns.xlsx`: Missing required columns (for error testing)
- `invalid_data_wrong_types.xlsx`: Wrong data types (for validation testing)

## Status

**Current Phase**: Design
**Implementation**: Pending

Once implemented, aim for:
- 100+ unit tests
- 20+ integration tests
- 10+ validation tests
- 5+ performance benchmarks
