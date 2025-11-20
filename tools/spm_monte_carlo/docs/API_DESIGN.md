# SPM Monte Carlo Tool - API Design

## Overview

This document defines the Python API, command-line interface (CLI), and configuration options for the SPM Monte Carlo simulation tool.

---

## Python API

### Design Philosophy
- **Simple and Intuitive:** Common tasks should be one-liners
- **Fluent Interface:** Method chaining for configuration
- **Sensible Defaults:** Works out-of-the-box with minimal config
- **Progressive Disclosure:** Simple API for basic use, detailed control when needed
- **Type Hints:** Full type annotations for IDE support

---

### Quick Start Example

```python
from spm_monte_carlo import MonteCarloSimulator

# Simplest possible usage
sim = MonteCarloSimulator()
results = sim.load_data('data/historical_performance.xlsx') \
             .load_plan('data/compensation_plan.xlsx') \
             .run(iterations=10000)

# Generate report
results.summary()
results.to_excel('output/simulation_results.xlsx')
```

---

### Core Classes

#### 1. MonteCarloSimulator

Main entry point for simulations.

```python
class MonteCarloSimulator:
    """
    Main Monte Carlo simulation orchestrator.

    Example:
        >>> sim = MonteCarloSimulator(seed=42, parallel=True)
        >>> results = sim.load_data('data.xlsx').load_plan('plan.xlsx').run()
    """

    def __init__(
        self,
        seed: Optional[int] = None,
        parallel: bool = True,
        workers: Optional[int] = None,
        sampling_strategy: str = 'monte_carlo'
    ):
        """
        Initialize simulator.

        Args:
            seed: Random seed for reproducibility (default: None)
            parallel: Enable parallel processing (default: True)
            workers: Number of parallel workers (default: CPU count)
            sampling_strategy: 'monte_carlo', 'lhs', or 'quasi_random'
        """
        pass

    def load_data(
        self,
        file_path: str,
        sheet_name: str = 'Performance',
        validate: bool = True
    ) -> 'MonteCarloSimulator':
        """
        Load historical performance data.

        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name to read (default: 'Performance')
            validate: Run validation checks (default: True)

        Returns:
            Self for method chaining

        Raises:
            ValidationError: If data validation fails
            FileNotFoundError: If file doesn't exist
        """
        pass

    def load_plan(
        self,
        file_path: str,
        plan_id: Optional[str] = None
    ) -> 'MonteCarloSimulator':
        """
        Load compensation plan definition.

        Args:
            file_path: Path to Excel file with plan definition
            plan_id: Specific plan ID to use (default: first plan in file)

        Returns:
            Self for method chaining
        """
        pass

    def load_rep_master(
        self,
        file_path: str,
        sheet_name: str = 'Reps'
    ) -> 'MonteCarloSimulator':
        """
        Load rep master data (optional).

        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name to read

        Returns:
            Self for method chaining
        """
        pass

    def fit_distributions(
        self,
        auto: bool = True,
        distributions: Optional[Dict[str, str]] = None,
        test_goodness_of_fit: bool = True
    ) -> 'MonteCarloSimulator':
        """
        Fit probability distributions to data.

        Args:
            auto: Automatically select best-fit distributions (default: True)
            distributions: Manual distribution specifications
                          {'variable': 'dist_type', ...}
            test_goodness_of_fit: Run statistical tests (default: True)

        Returns:
            Self for method chaining
        """
        pass

    def set_correlations(
        self,
        correlation_matrix: Optional[pd.DataFrame] = None,
        auto_detect: bool = True
    ) -> 'MonteCarloSimulator':
        """
        Set or detect correlations between variables.

        Args:
            correlation_matrix: Pre-defined correlation matrix
            auto_detect: Estimate from data if matrix not provided

        Returns:
            Self for method chaining
        """
        pass

    def run(
        self,
        iterations: int = 10000,
        batch_size: Optional[int] = None,
        progress_bar: bool = True
    ) -> 'SimulationResults':
        """
        Execute Monte Carlo simulation.

        Args:
            iterations: Number of simulation runs (default: 10000)
            batch_size: Batch size for memory management (default: auto)
            progress_bar: Show progress bar (default: True)

        Returns:
            SimulationResults object with analysis
        """
        pass
```

---

#### 2. SimulationResults

Container for simulation outputs and analysis.

```python
class SimulationResults:
    """
    Simulation results with built-in analysis methods.

    Attributes:
        scenarios: DataFrame with all simulation scenarios
        summary_stats: Summary statistics (mean, median, percentiles)
        risk_metrics: Risk analysis (VaR, CVaR, etc.)
    """

    @property
    def scenarios(self) -> pd.DataFrame:
        """Full scenario dataset."""
        pass

    @property
    def summary_stats(self) -> pd.DataFrame:
        """Summary statistics."""
        pass

    @property
    def risk_metrics(self) -> Dict[str, float]:
        """Risk metrics dictionary."""
        pass

    def summary(self, percentiles: List[float] = [5, 25, 50, 75, 95, 99]) -> pd.DataFrame:
        """
        Generate summary statistics.

        Args:
            percentiles: Percentiles to include

        Returns:
            DataFrame with summary stats
        """
        pass

    def var(self, confidence: float = 0.95) -> float:
        """
        Calculate Value at Risk.

        Args:
            confidence: Confidence level (default: 0.95)

        Returns:
            VaR value
        """
        pass

    def cvar(self, confidence: float = 0.95) -> float:
        """
        Calculate Conditional Value at Risk.

        Args:
            confidence: Confidence level (default: 0.95)

        Returns:
            CVaR value
        """
        pass

    def prob_exceed(self, threshold: float) -> float:
        """
        Probability of exceeding threshold.

        Args:
            threshold: Budget or threshold value

        Returns:
            Probability (0-1)
        """
        pass

    def sensitivity_analysis(
        self,
        variables: Optional[List[str]] = None,
        method: str = 'correlation'
    ) -> pd.DataFrame:
        """
        Perform sensitivity analysis.

        Args:
            variables: Variables to analyze (default: all)
            method: 'correlation' or 'regression'

        Returns:
            DataFrame with sensitivity metrics
        """
        pass

    def to_excel(
        self,
        file_path: str,
        include_scenarios: bool = True,
        include_charts: bool = True
    ):
        """
        Export results to Excel.

        Args:
            file_path: Output file path
            include_scenarios: Include all scenarios (default: True)
            include_charts: Generate embedded charts (default: True)
        """
        pass

    def to_json(self, file_path: str):
        """Export results to JSON."""
        pass

    def to_csv(self, directory: str):
        """Export results to CSV files (multiple files)."""
        pass

    def plot_distribution(
        self,
        variable: str = 'total_payout',
        bins: int = 50,
        show_percentiles: List[float] = [5, 50, 95]
    ):
        """
        Plot distribution histogram.

        Args:
            variable: Variable to plot
            bins: Number of histogram bins
            show_percentiles: Percentile lines to overlay
        """
        pass

    def plot_tornado(self, top_n: int = 10):
        """
        Plot tornado chart for sensitivity analysis.

        Args:
            top_n: Number of top variables to show
        """
        pass

    def plot_cdf(self, variable: str = 'total_payout'):
        """Plot cumulative distribution function."""
        pass
```

---

#### 3. DataValidator

Standalone validation utility.

```python
class DataValidator:
    """
    Validate input data against schemas.

    Example:
        >>> validator = DataValidator()
        >>> report = validator.validate_file('data.xlsx', 'historical_performance')
        >>> if not report.is_valid:
        ...     print(report.errors)
    """

    @staticmethod
    def validate_file(
        file_path: str,
        schema_type: str,
        strict: bool = False
    ) -> 'ValidationReport':
        """
        Validate Excel file against schema.

        Args:
            file_path: Path to file
            schema_type: 'historical_performance', 'compensation_plan', 'rep_master'
            strict: Fail on warnings (default: False)

        Returns:
            ValidationReport object
        """
        pass

    @staticmethod
    def validate_dataframe(
        df: pd.DataFrame,
        schema_type: str
    ) -> 'ValidationReport':
        """Validate DataFrame against schema."""
        pass
```

---

#### 4. CompensationPlan

Programmatic plan builder (alternative to Excel).

```python
class CompensationPlan:
    """
    Build compensation plans programmatically.

    Example:
        >>> plan = CompensationPlan('2024_Sales')
        >>> plan.add_commission_tier(0, 0.75, rate=0.02)
        >>> plan.add_commission_tier(0.75, 1.0, rate=0.03)
        >>> plan.add_bonus('100% Club', trigger='quota_attainment >= 1.0', payout=5000)
    """

    def __init__(self, plan_id: str, name: Optional[str] = None):
        """Initialize plan."""
        pass

    def add_commission_tier(
        self,
        quota_min: float,
        quota_max: float,
        rate: float,
        rate_type: str = 'percentage',
        applies_to: str = 'total_sales'
    ) -> 'CompensationPlan':
        """Add commission tier."""
        pass

    def add_bonus(
        self,
        name: str,
        trigger: str,
        payout: float,
        frequency: str = 'quarterly'
    ) -> 'CompensationPlan':
        """Add bonus component."""
        pass

    def add_spif(
        self,
        name: str,
        start_date: str,
        end_date: str,
        metric: str,
        target: float,
        payout: float
    ) -> 'CompensationPlan':
        """Add SPIF."""
        pass

    def to_dict(self) -> Dict:
        """Export plan as dictionary."""
        pass

    def to_excel(self, file_path: str):
        """Export plan as Excel file."""
        pass

    @staticmethod
    def from_excel(file_path: str, plan_id: Optional[str] = None) -> 'CompensationPlan':
        """Load plan from Excel."""
        pass
```

---

### Advanced Usage Examples

#### Example 1: Custom Distributions

```python
from spm_monte_carlo import MonteCarloSimulator
from scipy import stats

# Manual distribution specification
sim = MonteCarloSimulator(seed=42)
sim.load_data('data.xlsx')

# Specify distributions manually
sim.fit_distributions(
    auto=False,
    distributions={
        'quota_attainment': 'normal',
        'deal_count': 'gamma',
        'avg_deal_size': 'lognormal'
    }
)

# Or provide custom distribution objects
custom_dist = stats.beta(a=2, b=5, loc=0, scale=1)
sim.set_distribution('quota_attainment', custom_dist)

results = sim.load_plan('plan.xlsx').run()
```

#### Example 2: Latin Hypercube Sampling

```python
# More efficient sampling for fewer iterations
sim = MonteCarloSimulator(
    sampling_strategy='lhs',  # Latin Hypercube Sampling
    seed=42
)

results = sim.load_data('data.xlsx') \
             .load_plan('plan.xlsx') \
             .run(iterations=1000)  # Fewer iterations needed with LHS

print(f"VaR 95%: ${results.var(0.95):,.0f}")
print(f"Expected Payout: ${results.summary_stats['mean']['total_payout']:,.0f}")
```

#### Example 3: Scenario Comparison

```python
# Compare multiple plan designs
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan

# Load data once
data = pd.read_excel('data.xlsx')

# Plan A: Current plan
plan_a = CompensationPlan.from_excel('plan_current.xlsx')
sim_a = MonteCarloSimulator(seed=42).load_data(data)
results_a = sim_a.load_plan(plan_a).run()

# Plan B: Proposed plan
plan_b = CompensationPlan.from_excel('plan_proposed.xlsx')
sim_b = MonteCarloSimulator(seed=42).load_data(data)
results_b = sim_b.load_plan(plan_b).run()

# Compare
comparison = pd.DataFrame({
    'Current Plan': results_a.summary_stats['total_payout'],
    'Proposed Plan': results_b.summary_stats['total_payout']
})
print(comparison)
```

#### Example 4: Per-Rep Analysis

```python
sim = MonteCarloSimulator(seed=42)
results = sim.load_data('data.xlsx') \
             .load_plan('plan.xlsx') \
             .load_rep_master('reps.xlsx') \
             .run()

# Analyze specific rep
rep_results = results.scenarios[results.scenarios['rep_id'] == 'REP001']
print(f"REP001 Mean Payout: ${rep_results['total_payout'].mean():,.0f}")
print(f"REP001 VaR 95%: ${rep_results['total_payout'].quantile(0.95):,.0f}")

# Top performers analysis
top_performers = results.scenarios.groupby('rep_id')['total_payout'].mean() \
                                   .nlargest(10)
print(top_performers)
```

#### Example 5: Custom Analytics

```python
results = sim.run()

# Custom analysis - probability of hitting specific goals
budget = 1_300_000
stretch_goal = 1_500_000

print(f"P(exceed budget): {results.prob_exceed(budget):.2%}")
print(f"P(exceed stretch): {results.prob_exceed(stretch_goal):.2%}")

# Conditional analysis
high_performance = results.scenarios[
    results.scenarios['quota_attainment_avg'] > 1.0
]
print(f"Payout when team exceeds quota: ${high_performance['total_payout'].mean():,.0f}")
```

---

## Command-Line Interface (CLI)

### Installation

```bash
pip install spm-monte-carlo
# or
python setup.py install
```

### Basic Commands

#### 1. Run Simulation

```bash
spm-mc run \
  --data data/historical_performance.xlsx \
  --plan data/compensation_plan.xlsx \
  --output results/ \
  --iterations 10000 \
  --seed 42
```

**Options:**
- `--data, -d`: Historical performance data file (required)
- `--plan, -p`: Compensation plan file (required)
- `--reps, -r`: Rep master file (optional)
- `--output, -o`: Output directory (default: `./results`)
- `--iterations, -n`: Number of iterations (default: 10000)
- `--seed, -s`: Random seed (optional)
- `--parallel`: Enable parallel processing (default: true)
- `--workers, -w`: Number of workers (default: CPU count)
- `--sampling`: Sampling strategy (monte_carlo, lhs, quasi_random)
- `--config, -c`: Configuration file (YAML/JSON)

#### 2. Validate Data

```bash
spm-mc validate \
  --file data/historical_performance.xlsx \
  --type historical_performance \
  --output validation_report.txt
```

**Options:**
- `--file, -f`: File to validate (required)
- `--type, -t`: Schema type (required)
- `--output, -o`: Output report file (optional)
- `--strict`: Fail on warnings

#### 3. Fit Distributions

```bash
spm-mc fit-distributions \
  --data data/historical_performance.xlsx \
  --output distributions.json \
  --plot
```

**Options:**
- `--data, -d`: Historical data file (required)
- `--output, -o`: Output file for distribution parameters
- `--plot`: Generate distribution plots
- `--test-fit`: Run goodness-of-fit tests

#### 4. Generate Report

```bash
spm-mc report \
  --results results/simulation_results.xlsx \
  --format html \
  --output report.html
```

**Options:**
- `--results, -r`: Simulation results file (required)
- `--format, -f`: Report format (html, pdf, markdown)
- `--output, -o`: Output file
- `--include-charts`: Include visualizations

#### 5. Compare Scenarios

```bash
spm-mc compare \
  --results results/plan_a.xlsx results/plan_b.xlsx \
  --labels "Current Plan" "Proposed Plan" \
  --output comparison.xlsx
```

---

### Configuration File

Use YAML or JSON for complex configurations.

#### config.yaml

```yaml
# Simulation configuration
simulation:
  iterations: 10000
  seed: 42
  sampling_strategy: monte_carlo
  parallel: true
  workers: 8

# Input files
data:
  historical_file: data/historical_performance.xlsx
  plan_file: data/compensation_plan.xlsx
  rep_master_file: data/rep_master.xlsx

# Distribution fitting
distributions:
  auto_fit: true
  test_goodness_of_fit: true
  preferred_distributions:
    - normal
    - lognormal
    - gamma
  manual_overrides:
    quota_attainment:
      type: normal
      params:
        loc: 0.95
        scale: 0.15

# Correlation settings
correlations:
  auto_detect: true
  min_correlation: 0.3

# Output configuration
output:
  directory: results/
  format: excel
  include_scenarios: true
  include_charts: true
  percentiles: [5, 25, 50, 75, 95, 99]

# Analysis options
analysis:
  sensitivity_analysis: true
  risk_metrics: true
  per_rep_analysis: true

# Logging
logging:
  level: INFO
  file: spm_monte_carlo.log
```

#### Run with config

```bash
spm-mc run --config config.yaml
```

---

## REST API (Future Enhancement)

For web-based integration.

### Endpoints

#### POST /api/v1/simulate

Run simulation.

**Request:**
```json
{
  "data": "base64_encoded_excel_data",
  "plan": "base64_encoded_plan_data",
  "config": {
    "iterations": 10000,
    "seed": 42
  }
}
```

**Response:**
```json
{
  "simulation_id": "abc123",
  "status": "completed",
  "results": {
    "summary_stats": {...},
    "risk_metrics": {...}
  },
  "download_url": "/api/v1/results/abc123/download"
}
```

#### GET /api/v1/results/{simulation_id}

Get simulation results.

#### POST /api/v1/validate

Validate data file.

---

## Extension Points

### Custom Sampling Strategy

```python
from spm_monte_carlo.sampling import SamplingStrategy

class CustomSampler(SamplingStrategy):
    def sample(self, distribution, n_samples):
        # Implement custom sampling logic
        return custom_samples

# Register and use
sim = MonteCarloSimulator(sampling_strategy=CustomSampler())
```

### Custom Compensation Rule

```python
from spm_monte_carlo.compensation import CompensationRule

class CustomRule(CompensationRule):
    def calculate(self, performance_data):
        # Implement custom logic
        return payout

# Add to plan
plan.add_custom_rule(CustomRule(...))
```

### Custom Analytics

```python
from spm_monte_carlo.analytics import Analyzer

class CustomAnalyzer(Analyzer):
    def analyze(self, results):
        # Custom analysis
        return metrics

# Use with results
custom_metrics = CustomAnalyzer().analyze(results)
```

---

## Error Handling

### Exception Hierarchy

```python
SPMMonteCarloException (base)
├── DataValidationError
│   ├── SchemaValidationError
│   ├── BusinessRuleError
│   └── StatisticalValidationError
├── DistributionFittingError
├── SimulationError
│   ├── ConvergenceError
│   └── MemoryError
└── ConfigurationError
```

### Usage

```python
from spm_monte_carlo.exceptions import DataValidationError

try:
    sim = MonteCarloSimulator()
    sim.load_data('data.xlsx')
except DataValidationError as e:
    print(f"Validation failed: {e}")
    print(f"Errors: {e.errors}")
    print(f"Line numbers: {e.line_numbers}")
```

---

## Type Hints & IDE Support

Full type annotations for IDE autocomplete and type checking.

```python
from typing import Optional, List, Dict, Union
import pandas as pd

def run_simulation(
    data: Union[str, pd.DataFrame],
    plan: Union[str, CompensationPlan],
    iterations: int = 10000,
    seed: Optional[int] = None,
    percentiles: List[float] = [5, 25, 50, 75, 95, 99]
) -> SimulationResults:
    """Full type hints for IDE support."""
    pass
```

---

## Documentation & Help

### In-Code Documentation

```python
# Every public method has detailed docstring
help(MonteCarloSimulator)
help(SimulationResults.var)
```

### CLI Help

```bash
spm-mc --help
spm-mc run --help
spm-mc validate --help
```

---

## Conclusion

This API design provides:
- **Simple interface** for common tasks
- **Powerful options** for advanced users
- **Multiple interfaces** (Python, CLI, future REST API)
- **Extensibility** for custom needs
- **Type safety** and IDE support

Ready for implementation with clear contracts and usage patterns.
