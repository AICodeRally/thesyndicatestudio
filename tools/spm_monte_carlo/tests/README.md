# SPM Monte Carlo Tool - Testing Strategy

## Overview

Comprehensive testing strategy to ensure accuracy, reliability, and performance of the Monte Carlo simulation tool.

---

## Testing Pyramid

```
                    ┌──────────────┐
                    │  Validation  │  (Known outcomes)
                    │    Tests     │
                    └──────────────┘
                   ┌────────────────┐
                   │  Integration   │  (End-to-end workflows)
                   │     Tests      │
                   └────────────────┘
              ┌──────────────────────┐
              │     Unit Tests       │  (Component isolation)
              └──────────────────────┘
         ┌───────────────────────────────┐
         │    Performance Benchmarks     │  (Speed & memory)
         └───────────────────────────────┘
```

---

## Test Categories

### 1. Unit Tests

**Purpose:** Test individual components in isolation

**Framework:** pytest

**Coverage Target:** >90%

**Location:** `tests/unit/`

#### Test Files Structure

```
tests/unit/
├── test_data_loader.py
├── test_validator.py
├── test_distribution_fitter.py
├── test_monte_carlo_engine.py
├── test_compensation_calculator.py
├── test_analytics.py
└── test_visualization.py
```

#### Example Unit Tests

```python
# tests/unit/test_distribution_fitter.py
import pytest
import numpy as np
from scipy import stats
from spm_monte_carlo.statistics import DistributionFitter

class TestDistributionFitter:
    """Test suite for distribution fitting."""

    def test_normal_distribution_fitting(self):
        """Test fitting a normal distribution."""
        # Generate known normal data
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
        # Log-normal data
        np.random.seed(42)
        data = np.random.lognormal(mean=4.6, sigma=0.5, size=1000)

        fitter = DistributionFitter()
        result = fitter.auto_fit(data, candidates=['normal', 'lognormal', 'gamma'])

        # Should select lognormal as best fit
        assert result.selected_distribution == 'lognormal'
        assert result.goodness_of_fit['p_value'] > 0.05

    def test_goodness_of_fit_tests(self):
        """Test goodness-of-fit statistical tests."""
        np.random.seed(42)
        data = np.random.normal(0, 1, 1000)

        fitter = DistributionFitter()
        result = fitter.fit(data, distribution_type='normal')

        # Should have KS test results
        assert 'ks_statistic' in result.goodness_of_fit
        assert 'p_value' in result.goodness_of_fit
        assert 0 <= result.goodness_of_fit['p_value'] <= 1

    def test_insufficient_data_error(self):
        """Test error handling for insufficient data."""
        data = np.array([1, 2, 3])  # Too few points

        fitter = DistributionFitter()
        with pytest.raises(ValueError, match="Insufficient data"):
            fitter.fit(data)

    def test_outlier_handling(self):
        """Test outlier detection and treatment."""
        data = np.random.normal(100, 15, 1000)
        data = np.append(data, [500, 600, -200])  # Add outliers

        fitter = DistributionFitter()
        result_with_outliers = fitter.fit(data, remove_outliers=False)
        result_without_outliers = fitter.fit(data, remove_outliers=True)

        # Without outliers should have better fit
        assert result_without_outliers.goodness_of_fit['p_value'] > \
               result_with_outliers.goodness_of_fit['p_value']
```

```python
# tests/unit/test_compensation_calculator.py
import pytest
import pandas as pd
from spm_monte_carlo.compensation import CompensationEngine, CompensationPlan

class TestCompensationCalculator:
    """Test suite for compensation calculations."""

    def test_simple_commission_calculation(self):
        """Test basic commission with single tier."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_commission_tier(0, 10, rate=0.05, applies_to='total_sales')

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [80000]
        })

        results = engine.calculate(performance)

        # 5% of $100,000 = $5,000
        assert results.loc[0, 'commission'] == 5000

    def test_tiered_commission_calculation(self):
        """Test tiered commission structure."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_commission_tier(0, 0.75, rate=0.02, applies_to='total_sales')
        plan.add_commission_tier(0.75, 1.0, rate=0.03, applies_to='total_sales')
        plan.add_commission_tier(1.0, 10, rate=0.05, applies_to='total_sales')

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000]
        })

        results = engine.calculate(performance)

        # 0-75k @ 2% = 1,500
        # 75k-100k @ 3% = 750
        # Total = 2,250
        assert results.loc[0, 'commission'] == 2250

    def test_quota_based_bonus(self):
        """Test quota attainment bonus."""
        plan = CompensationPlan('TEST_PLAN')
        plan.add_bonus(
            name='100% Club',
            trigger='quota_attainment >= 1.0',
            payout=5000
        )

        engine = CompensationEngine(plan)

        # Rep who hit quota
        perf_hit = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000]
        })
        results_hit = engine.calculate(perf_hit)
        assert results_hit.loc[0, 'bonuses'] == 5000

        # Rep who missed quota
        perf_miss = pd.DataFrame({
            'rep_id': ['REP002'],
            'actual_sales': [90000],
            'quota': [100000]
        })
        results_miss = engine.calculate(perf_miss)
        assert results_miss.loc[0, 'bonuses'] == 0

    def test_accelerator_logic(self):
        """Test commission accelerators above quota."""
        plan = CompensationPlan('TEST_PLAN')
        # Higher rate above 100% quota
        plan.add_commission_tier(0, 1.0, rate=0.03, applies_to='total_sales')
        plan.add_commission_tier(1.0, 10, rate=0.06, applies_to='total_sales')

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [150000],
            'quota': [100000]
        })

        results = engine.calculate(performance)

        # 0-100k @ 3% = 3,000
        # 100k-150k @ 6% = 3,000
        # Total = 6,000
        assert results.loc[0, 'commission'] == 6000

    def test_complex_multi_component_plan(self):
        """Test plan with multiple components."""
        plan = CompensationPlan('COMPLEX_PLAN')
        plan.add_commission_tier(0, 10, rate=0.04)
        plan.add_bonus('Quarterly Bonus', 'quota_attainment >= 0.9', 2000)
        plan.add_spif('SPIF_Q1', '2024-01-01', '2024-03-31',
                      metric='deals', target=10, payout=1000)

        engine = CompensationEngine(plan)
        performance = pd.DataFrame({
            'rep_id': ['REP001'],
            'actual_sales': [100000],
            'quota': [100000],
            'deals': [12],
            'period': ['2024-Q1']
        })

        results = engine.calculate(performance)

        # Commission: 4% * 100k = 4,000
        # Bonus: 2,000 (hit 90% quota)
        # SPIF: 1,000 (12 deals > 10 target)
        # Total: 7,000
        assert results.loc[0, 'total_payout'] == 7000
```

---

### 2. Integration Tests

**Purpose:** Test end-to-end workflows

**Location:** `tests/integration/`

#### Test Scenarios

```python
# tests/integration/test_full_simulation.py
import pytest
from spm_monte_carlo import MonteCarloSimulator

class TestFullSimulation:
    """Integration tests for complete simulation workflows."""

    def test_basic_simulation_workflow(self, sample_data_files):
        """Test complete simulation from data load to results."""
        sim = MonteCarloSimulator(seed=42)

        results = sim.load_data(sample_data_files['historical']) \
                     .load_plan(sample_data_files['plan']) \
                     .run(iterations=1000)

        # Verify results structure
        assert results.scenarios is not None
        assert len(results.scenarios) == 1000
        assert 'total_payout' in results.scenarios.columns

        # Verify summary stats exist
        summary = results.summary()
        assert 'mean' in summary.index
        assert 'median' in summary.index

        # Verify risk metrics
        var95 = results.var(0.95)
        assert var95 > 0

    def test_simulation_with_correlations(self, sample_data_files):
        """Test simulation preserving correlations."""
        sim = MonteCarloSimulator(seed=42)

        results = sim.load_data(sample_data_files['historical']) \
                     .set_correlations(auto_detect=True) \
                     .load_plan(sample_data_files['plan']) \
                     .run(iterations=5000)

        # Verify correlations are preserved
        scenarios = results.scenarios
        corr_quota_deals = scenarios['quota_attainment'].corr(
            scenarios['deal_count']
        )

        # Should maintain positive correlation
        assert corr_quota_deals > 0.3

    def test_parallel_execution(self, sample_data_files):
        """Test parallel processing produces same results as serial."""
        # Serial execution
        sim_serial = MonteCarloSimulator(seed=42, parallel=False)
        results_serial = sim_serial.load_data(sample_data_files['historical']) \
                                    .load_plan(sample_data_files['plan']) \
                                    .run(iterations=1000)

        # Parallel execution
        sim_parallel = MonteCarloSimulator(seed=42, parallel=True, workers=4)
        results_parallel = sim_parallel.load_data(sample_data_files['historical']) \
                                        .load_plan(sample_data_files['plan']) \
                                        .run(iterations=1000)

        # Results should be identical with same seed
        assert results_serial.summary_stats['mean'].equals(
            results_parallel.summary_stats['mean']
        )

    def test_excel_output_roundtrip(self, sample_data_files, tmp_path):
        """Test saving and loading Excel results."""
        sim = MonteCarloSimulator(seed=42)
        results = sim.load_data(sample_data_files['historical']) \
                     .load_plan(sample_data_files['plan']) \
                     .run(iterations=1000)

        # Save to Excel
        output_file = tmp_path / "results.xlsx"
        results.to_excel(str(output_file))

        # Verify file was created
        assert output_file.exists()

        # Verify sheets exist
        import pandas as pd
        xl = pd.ExcelFile(output_file)
        assert 'Summary_Statistics' in xl.sheet_names
        assert 'Risk_Metrics' in xl.sheet_names
```

---

### 3. Validation Tests

**Purpose:** Test against known outcomes

**Location:** `tests/validation/`

#### Known Outcome Tests

```python
# tests/validation/test_known_outcomes.py
import pytest
import numpy as np
from spm_monte_carlo import MonteCarloSimulator

class TestKnownOutcomes:
    """Validate against analytically solvable cases."""

    def test_deterministic_scenario(self):
        """Test with zero variance (deterministic outcome)."""
        # Create data with zero variance
        # All reps always hit exactly 100% quota
        # Known commission: 3% of quota = $3,000 per rep
        # 50 reps = $150,000 total

        sim = MonteCarloSimulator(seed=42)
        # ... load deterministic data ...
        results = sim.run(iterations=1000)

        # Mean should equal known value
        assert results.summary_stats['mean']['total_payout'] == pytest.approx(150000, rel=0.01)

        # Variance should be near zero
        assert results.summary_stats['std']['total_payout'] < 100

    def test_uniform_distribution_known_stats(self):
        """Test uniform distribution yields correct statistics."""
        # Uniform(0, 100) has known mean=50, variance=833.33
        # With 1000 reps, total should have mean=50,000

        sim = MonteCarloSimulator(seed=42)
        # ... load uniform distribution data ...
        results = sim.run(iterations=10000)

        # Check mean is close to theoretical
        assert results.summary_stats['mean']['total_payout'] == pytest.approx(50000, rel=0.02)

    def test_simple_tiered_plan_calculation(self):
        """Test simple tiered plan with hand-calculated result."""
        # 2-tier plan:
        # 0-50%: 1% commission
        # 50-100%: 2% commission
        #
        # If all reps hit exactly 75% quota ($75k on $100k quota):
        # Tier 1: 50% * 100k * 1% = $500
        # Tier 2: 25% * 100k * 2% = $500
        # Total per rep: $1,000
        # 20 reps: $20,000 total

        sim = MonteCarloSimulator(seed=42)
        # ... load specific scenario ...
        results = sim.run(iterations=1000)

        assert results.summary_stats['mean']['total_payout'] == pytest.approx(20000, rel=0.01)

    def test_monte_carlo_convergence(self):
        """Test that more iterations converge to true mean."""
        sim = MonteCarloSimulator(seed=42)
        # ... load data with known theoretical mean ...

        # Run with different iteration counts
        results_100 = sim.run(iterations=100)
        results_1000 = sim.run(iterations=1000)
        results_10000 = sim.run(iterations=10000)

        # Error should decrease with more iterations
        known_mean = 250000  # Theoretical mean
        error_100 = abs(results_100.summary_stats['mean']['total_payout'] - known_mean)
        error_1000 = abs(results_1000.summary_stats['mean']['total_payout'] - known_mean)
        error_10000 = abs(results_10000.summary_stats['mean']['total_payout'] - known_mean)

        assert error_10000 < error_1000 < error_100

    def test_correlation_preservation(self):
        """Test that correlations are preserved in simulations."""
        # Generate data with known correlation (0.7)
        np.random.seed(42)
        n = 1000
        x = np.random.normal(0, 1, n)
        y = 0.7 * x + np.sqrt(1 - 0.7**2) * np.random.normal(0, 1, n)

        # Verify input correlation
        assert np.corrcoef(x, y)[0, 1] == pytest.approx(0.7, abs=0.05)

        # Run simulation
        # ... simulation preserving correlation ...

        # Output correlation should match
        # assert output_corr == pytest.approx(0.7, abs=0.1)
```

---

### 4. Performance Benchmarks

**Purpose:** Ensure acceptable speed and memory usage

**Location:** `tests/performance/`

#### Benchmark Tests

```python
# tests/performance/test_benchmarks.py
import pytest
import time
import psutil
import os
from spm_monte_carlo import MonteCarloSimulator

class TestPerformance:
    """Performance benchmarking tests."""

    def test_simulation_speed(self, large_dataset):
        """Benchmark simulation execution time."""
        sim = MonteCarloSimulator(seed=42, parallel=True)
        sim.load_data(large_dataset['historical'])
        sim.load_plan(large_dataset['plan'])

        start_time = time.time()
        results = sim.run(iterations=10000)
        elapsed_time = time.time() - start_time

        # Should complete 10k iterations in under 30 seconds
        assert elapsed_time < 30, f"Simulation took {elapsed_time:.2f}s (expected <30s)"

        print(f"Simulation speed: {10000/elapsed_time:.0f} iterations/second")

    def test_memory_usage(self, large_dataset):
        """Benchmark memory consumption."""
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB

        sim = MonteCarloSimulator(seed=42)
        sim.load_data(large_dataset['historical'])
        results = sim.run(iterations=10000)

        peak_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_used = peak_memory - initial_memory

        # Should use less than 500 MB for 10k iterations
        assert memory_used < 500, f"Memory usage: {memory_used:.0f}MB (expected <500MB)"

        print(f"Memory used: {memory_used:.0f} MB")

    def test_parallel_speedup(self, large_dataset):
        """Test parallel execution speedup."""
        # Serial
        sim_serial = MonteCarloSimulator(seed=42, parallel=False)
        sim_serial.load_data(large_dataset['historical'])
        sim_serial.load_plan(large_dataset['plan'])

        start = time.time()
        sim_serial.run(iterations=5000)
        serial_time = time.time() - start

        # Parallel (4 workers)
        sim_parallel = MonteCarloSimulator(seed=42, parallel=True, workers=4)
        sim_parallel.load_data(large_dataset['historical'])
        sim_parallel.load_plan(large_dataset['plan'])

        start = time.time()
        sim_parallel.run(iterations=5000)
        parallel_time = time.time() - start

        speedup = serial_time / parallel_time
        print(f"Speedup: {speedup:.2f}x")

        # Should see at least 2x speedup with 4 workers
        assert speedup > 2.0

    def test_large_scale_simulation(self):
        """Test with very large iteration count."""
        sim = MonteCarloSimulator(seed=42, parallel=True)
        # ... load data ...

        start = time.time()
        results = sim.run(iterations=100000)  # 100k iterations
        elapsed = time.time() - start

        print(f"100k iterations: {elapsed:.2f}s ({100000/elapsed:.0f} iter/s)")

        # Should handle 100k iterations
        assert len(results.scenarios) == 100000
```

---

## Test Data & Fixtures

### Pytest Fixtures

```python
# tests/conftest.py
import pytest
import pandas as pd
import numpy as np
from pathlib import Path

@pytest.fixture
def sample_data_files(tmp_path):
    """Generate sample Excel files for testing."""
    # Historical performance data
    np.random.seed(42)
    n_reps = 50
    n_periods = 24

    historical_data = []
    for rep_id in range(1, n_reps + 1):
        for period in range(1, n_periods + 1):
            historical_data.append({
                'rep_id': f'REP{rep_id:03d}',
                'period': f'2023-{period:02d}' if period <= 12 else f'2024-{period-12:02d}',
                'quota': 100000,
                'actual_sales': np.random.normal(95000, 15000),
                'deal_count': int(np.random.gamma(5, 2)),
                'avg_deal_size': np.random.lognormal(9.8, 0.5)
            })

    df_historical = pd.DataFrame(historical_data)
    historical_file = tmp_path / 'historical_performance.xlsx'
    df_historical.to_excel(historical_file, index=False, sheet_name='Performance')

    # Compensation plan
    plan_overview = pd.DataFrame({
        'plan_id': ['PLAN_2024'],
        'plan_name': ['2024 Test Plan'],
        'effective_date': ['2024-01-01'],
        'frequency': ['monthly']
    })

    commission_tiers = pd.DataFrame({
        'plan_id': ['PLAN_2024', 'PLAN_2024', 'PLAN_2024'],
        'tier_name': ['Tier 1', 'Tier 2', 'Tier 3'],
        'quota_min': [0, 0.75, 1.0],
        'quota_max': [0.75, 1.0, 10.0],
        'rate_type': ['percentage', 'percentage', 'percentage'],
        'rate_value': [0.02, 0.03, 0.05],
        'applies_to': ['total_sales', 'total_sales', 'total_sales']
    })

    plan_file = tmp_path / 'compensation_plan.xlsx'
    with pd.ExcelWriter(plan_file) as writer:
        plan_overview.to_excel(writer, sheet_name='Plan_Overview', index=False)
        commission_tiers.to_excel(writer, sheet_name='Commission_Tiers', index=False)

    return {
        'historical': str(historical_file),
        'plan': str(plan_file)
    }

@pytest.fixture
def large_dataset(tmp_path):
    """Generate large dataset for performance testing."""
    # 200 reps, 36 periods = 7,200 rows
    # ... similar to above but larger ...
    pass
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        python-version: [3.8, 3.9, '3.10', '3.11']

    steps:
    - uses: actions/checkout@v2

    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}

    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov

    - name: Run unit tests
      run: pytest tests/unit/ -v --cov

    - name: Run integration tests
      run: pytest tests/integration/ -v

    - name: Run validation tests
      run: pytest tests/validation/ -v

    - name: Upload coverage
      uses: codecov/codecov-action@v2
```

---

## Test Execution

### Run all tests
```bash
pytest
```

### Run specific category
```bash
pytest tests/unit/
pytest tests/integration/
pytest tests/validation/
pytest tests/performance/
```

### Run with coverage
```bash
pytest --cov=spm_monte_carlo --cov-report=html
```

### Run performance benchmarks
```bash
pytest tests/performance/ -v --benchmark
```

---

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Data Ingestion | 95% |
| Statistical Analysis | 90% |
| Monte Carlo Engine | 95% |
| Compensation Calculator | 98% |
| Analytics & Reporting | 85% |
| Visualization | 70% |
| **Overall** | **>90%** |

---

## Testing Checklist

Before each release:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All validation tests pass
- [ ] Performance benchmarks meet targets
- [ ] Code coverage > 90%
- [ ] No critical security vulnerabilities
- [ ] Documentation updated
- [ ] Example notebooks run successfully

---

## Conclusion

This comprehensive testing strategy ensures:
- **Accuracy** through validation tests
- **Reliability** through extensive unit and integration tests
- **Performance** through benchmarking
- **Maintainability** through high code coverage

Ready for implementation with clear test specifications and expected outcomes.
