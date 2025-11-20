# SPM Monte Carlo Tool - API & Interface Design

## Overview

This document describes the user-facing APIs and interfaces for the SPM Monte Carlo simulation tool, including:
1. Python API (programmatic access)
2. Command-Line Interface (CLI)
3. Configuration file formats
4. Extension points for customization

---

## Table of Contents

1. [Python API](#python-api)
2. [Command-Line Interface](#command-line-interface)
3. [Configuration Files](#configuration-files)
4. [Extension Points](#extension-points)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)

---

## Python API

### Core Class: MonteCarloSimulator

**Primary interface for programmatic access**

```python
class MonteCarloSimulator:
    """
    Main interface for SPM Monte Carlo simulations.

    Provides high-level API for:
    - Loading data from Excel files
    - Configuring simulation parameters
    - Running simulations
    - Accessing and exporting results

    Example:
        >>> simulator = MonteCarloSimulator()
        >>> simulator.load_data('historical.xlsx', 'plan.xlsx')
        >>> simulator.configure(iterations=10000, seed=42)
        >>> results = simulator.run()
        >>> results.export('output.xlsx')
    """

    def __init__(self, config_file: Optional[Path] = None):
        """
        Initialize the simulator.

        Args:
            config_file: Optional path to configuration file (YAML/JSON)
        """

    def load_data(
        self,
        historical_file: Union[str, Path],
        plan_file: Union[str, Path],
        rep_file: Optional[Union[str, Path]] = None
    ) -> None:
        """
        Load input data from Excel files.

        Args:
            historical_file: Path to historical performance data
            plan_file: Path to compensation plan structure
            rep_file: Optional path to rep master data

        Raises:
            DataLoadError: If files cannot be loaded
            ValidationError: If data doesn't match expected schema
        """

    def load_config(self, config_file: Union[str, Path]) -> None:
        """
        Load configuration from YAML or JSON file.

        Args:
            config_file: Path to configuration file

        Raises:
            ConfigurationError: If config is invalid
        """

    def configure(
        self,
        iterations: int = 10000,
        seed: Optional[int] = None,
        sampling_method: str = 'monte_carlo',
        parallel: bool = True,
        n_jobs: int = -1,
        **kwargs
    ) -> None:
        """
        Configure simulation parameters.

        Args:
            iterations: Number of Monte Carlo iterations (default: 10000)
            seed: Random seed for reproducibility (default: None)
            sampling_method: 'monte_carlo', 'latin_hypercube', or 'quasi_random'
            parallel: Enable parallel processing (default: True)
            n_jobs: Number of CPU cores to use, -1 for all (default: -1)
            **kwargs: Additional configuration options

        Raises:
            ValueError: If parameters are invalid
        """

    def fit_distributions(
        self,
        auto_fit: bool = True,
        distribution_overrides: Optional[Dict[str, str]] = None
    ) -> Dict[str, FittedDistribution]:
        """
        Fit probability distributions to historical data.

        Args:
            auto_fit: Automatically select best-fit distributions
            distribution_overrides: Manual distribution specifications

        Returns:
            Dictionary mapping metric names to fitted distributions

        Raises:
            DistributionFittingError: If fitting fails
        """

    def run(
        self,
        progress_callback: Optional[Callable[[int, int], None]] = None
    ) -> SimulationResults:
        """
        Execute the Monte Carlo simulation.

        Args:
            progress_callback: Optional callback for progress updates
                               Called with (current_iteration, total_iterations)

        Returns:
            SimulationResults object containing all results

        Raises:
            SimulationError: If simulation fails
        """

    def get_distributions(self) -> Dict[str, FittedDistribution]:
        """Get fitted distributions (must call fit_distributions first)"""

    def get_correlation_matrix(self) -> np.ndarray:
        """Get correlation matrix of historical data"""

    def validate_data(self) -> ValidationReport:
        """
        Validate loaded data without running simulation.

        Returns:
            Validation report with errors, warnings, and info
        """
```

---

### Results Classes

#### SimulationResults

```python
class SimulationResults:
    """
    Container for simulation results with analysis methods.

    Attributes:
        n_iterations: Number of iterations run
        summary_stats: Summary statistics dictionary
        risk_metrics: Risk analysis results
        config: Configuration used for this run
        timestamp: When simulation was run
    """

    def summary_statistics(
        self,
        metric: str = 'total_compensation',
        groupby: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Get summary statistics for specified metric.

        Args:
            metric: Metric to summarize (default: 'total_compensation')
            groupby: Optional grouping ('role', 'region', etc.)

        Returns:
            DataFrame with mean, median, std, percentiles
        """

    def risk_analysis(
        self,
        budget_target: Optional[float] = None,
        confidence_level: float = 0.95
    ) -> RiskMetrics:
        """
        Perform risk analysis on results.

        Args:
            budget_target: Budget threshold for risk calculations
            confidence_level: Confidence level for VaR (default: 0.95)

        Returns:
            RiskMetrics object
        """

    def sensitivity_analysis(
        self,
        variables: Optional[List[str]] = None
    ) -> SensitivityResults:
        """
        Perform sensitivity analysis (requires re-running simulations).

        Args:
            variables: Variables to analyze (default: all)

        Returns:
            SensitivityResults with tornado chart data
        """

    def plot_distributions(
        self,
        metrics: Optional[List[str]] = None,
        show: bool = True,
        save_path: Optional[Path] = None
    ) -> List[Figure]:
        """
        Generate distribution plots.

        Args:
            metrics: Metrics to plot (default: key metrics)
            show: Display plots immediately
            save_path: Optional path to save plots

        Returns:
            List of matplotlib Figure objects
        """

    def plot_box_plots(
        self,
        groupby: str,
        metric: str = 'total_compensation'
    ) -> Figure:
        """Generate box plots grouped by specified dimension"""

    def plot_tornado(
        self,
        sensitivity_results: Optional[SensitivityResults] = None
    ) -> Figure:
        """Generate tornado chart for sensitivity analysis"""

    def export(
        self,
        output_path: Union[str, Path],
        format: str = 'excel',
        include_raw_data: bool = False
    ) -> None:
        """
        Export results to file.

        Args:
            output_path: Output file path
            format: 'excel', 'json', or 'html'
            include_raw_data: Include iteration-level data (large)

        Raises:
            IOError: If export fails
        """

    def to_dataframe(
        self,
        level: str = 'summary'
    ) -> pd.DataFrame:
        """
        Convert results to DataFrame.

        Args:
            level: 'summary', 'iteration', or 'rep'

        Returns:
            DataFrame with requested data
        """

    def compare_to(
        self,
        other: 'SimulationResults',
        name_self: str = 'Scenario A',
        name_other: str = 'Scenario B'
    ) -> ComparisonReport:
        """
        Compare this result to another simulation.

        Args:
            other: Another SimulationResults object
            name_self: Label for this scenario
            name_other: Label for other scenario

        Returns:
            ComparisonReport with side-by-side analysis
        """

    @property
    def mean(self) -> float:
        """Mean total compensation"""

    @property
    def median(self) -> float:
        """Median total compensation"""

    @property
    def std_dev(self) -> float:
        """Standard deviation"""

    @property
    def var_95(self) -> float:
        """Value at Risk (95th percentile)"""

    @property
    def cvar_95(self) -> float:
        """Conditional VaR"""
```

---

### Utility Classes

#### FittedDistribution

```python
class FittedDistribution:
    """
    Represents a fitted probability distribution.

    Attributes:
        distribution_type: Type of distribution ('normal', 'lognormal', etc.)
        parameters: Dictionary of distribution parameters
        fit_quality: Goodness-of-fit statistics
    """

    def sample(self, n: int, seed: Optional[int] = None) -> np.ndarray:
        """Generate random samples from this distribution"""

    def pdf(self, x: np.ndarray) -> np.ndarray:
        """Probability density function"""

    def cdf(self, x: np.ndarray) -> np.ndarray:
        """Cumulative distribution function"""

    def plot(self, data: Optional[np.ndarray] = None) -> Figure:
        """Plot distribution (optionally with original data overlay)"""

    def to_dict(self) -> Dict:
        """Export as dictionary (for serialization)"""

    @classmethod
    def from_dict(cls, data: Dict) -> 'FittedDistribution':
        """Load from dictionary"""
```

---

#### ValidationReport

```python
class ValidationReport:
    """
    Data validation report.

    Attributes:
        is_valid: Overall validation status
        errors: List of blocking errors
        warnings: List of non-blocking warnings
        info: List of informational messages
    """

    def print(self) -> None:
        """Print formatted report to console"""

    def to_dataframe(self) -> pd.DataFrame:
        """Convert to DataFrame for further analysis"""

    def export(self, path: Union[str, Path]) -> None:
        """Export report to file"""
```

---

## Command-Line Interface

### Basic Usage

```bash
# Run simulation with config file
spm-monte-carlo --config simulation_config.yaml

# Run with explicit parameters
spm-monte-carlo \
  --historical data/historical.xlsx \
  --plan data/plan.xlsx \
  --iterations 10000 \
  --seed 42 \
  --output results.xlsx

# Validate data without running
spm-monte-carlo --historical data/historical.xlsx --plan data/plan.xlsx --validate

# Compare multiple scenarios
spm-monte-carlo --compare scenario1.yaml scenario2.yaml scenario3.yaml
```

---

### CLI Command Specification

```bash
spm-monte-carlo [OPTIONS]

Options:
  # Input data
  --historical PATH         Path to historical data Excel file
  --plan PATH              Path to plan structure Excel file
  --rep-master PATH        Path to rep master data Excel file (optional)
  --config PATH            Path to configuration YAML/JSON file

  # Simulation parameters
  --iterations INT         Number of Monte Carlo iterations [default: 10000]
  --seed INT               Random seed for reproducibility
  --sampling-method TEXT   Sampling method: monte_carlo, latin_hypercube, quasi_random
                          [default: monte_carlo]
  --parallel / --no-parallel  Enable parallel processing [default: parallel]
  --jobs INT               Number of CPU cores (-1 for all) [default: -1]

  # Distribution fitting
  --auto-fit / --no-auto-fit  Automatically fit distributions [default: auto-fit]
  --distribution-override KEY=VALUE  Override distribution for specific metric
                                     (can be repeated)

  # Output
  --output PATH            Output file path [default: results.xlsx]
  --format TEXT            Output format: excel, json, html [default: excel]
  --include-raw            Include iteration-level raw data
  --charts / --no-charts   Generate charts [default: charts]

  # Validation
  --validate               Validate data without running simulation
  --verbose / -v           Verbose logging
  --quiet / -q             Suppress output except errors

  # Scenario comparison
  --compare PATH ...       Compare multiple scenario config files

  # Help
  --help                   Show this message and exit
  --version                Show version and exit

Examples:
  # Basic usage
  spm-monte-carlo --config config.yaml

  # Custom parameters
  spm-monte-carlo --historical data.xlsx --plan plan.xlsx --iterations 50000 --seed 42

  # Validate only
  spm-monte-carlo --historical data.xlsx --plan plan.xlsx --validate

  # Override distribution
  spm-monte-carlo --config config.yaml --distribution-override quota_attainment_pct=lognormal

  # Compare scenarios
  spm-monte-carlo --compare base_case.yaml optimistic.yaml pessimistic.yaml
```

---

### CLI Exit Codes

```
0   - Success
1   - General error
2   - Configuration error
3   - Data validation error
4   - Simulation error
5   - Output/export error
```

---

## Configuration Files

### YAML Configuration Schema

```yaml
# Metadata (optional)
metadata:
  name: string                # Human-readable name
  description: string         # Description
  created_by: string          # Creator
  created_date: date          # Creation date

# Data sources
data_sources:
  historical_performance: path        # Required
  plan_structure: path                # Required
  rep_master: path                    # Optional

# Simulation parameters
simulation:
  iterations: int                     # Default: 10000
  random_seed: int | null             # Default: null
  sampling_method: enum               # monte_carlo | latin_hypercube | quasi_random
  confidence_level: float             # Default: 0.95
  parallel: bool                      # Default: true
  n_jobs: int                         # Default: -1 (all cores)
  time_horizon_months: int            # For projections (default: 12)

# Distribution fitting
distributions:
  auto_fit: bool                      # Default: true
  goodness_of_fit_threshold: float    # Default: 0.05
  outlier_detection: enum             # iqr | zscore | none
  outlier_handling: enum              # remove | cap | keep

  # Manual overrides
  overrides:
    metric_name:
      type: string                    # Distribution type
      params:                         # Parameters (depends on type)
        mean: float
        std: float

# Correlation settings
correlation:
  enable: bool                        # Default: true
  minimum_significance: float         # Default: 0.05
  method: enum                        # pearson | spearman

# Risk analysis
risk:
  budget_target: float | null         # Budget for risk calculations
  var_confidence: float               # Default: 0.95
  additional_thresholds:              # Optional additional VaR levels
    - 0.99

# Output settings
output:
  directory: path                     # Output directory
  formats: list[string]               # [excel, json, html]
  include_iteration_data: bool        # Default: false
  chart_dpi: int                      # Default: 300

# Visualization
visualization:
  style: string                       # matplotlib style
  color_palette: string               # Color palette name
  figure_size: [width, height]        # Default: [10, 6]

# Logging
logging:
  level: enum                         # DEBUG | INFO | WARNING | ERROR
  file: path | null                   # Log file path
  console: bool                       # Log to console (default: true)

# Advanced options
advanced:
  memory_limit_gb: float | null       # Memory limit
  checkpoint_interval: int | null     # Save checkpoints every N iterations
  resume_from_checkpoint: path | null # Resume from checkpoint file
```

---

### JSON Configuration

Same structure as YAML, but in JSON format:

```json
{
  "metadata": {
    "name": "Basic Simulation",
    "description": "FY25 base case projection"
  },
  "data_sources": {
    "historical_performance": "data/historical.xlsx",
    "plan_structure": "data/plan.xlsx"
  },
  "simulation": {
    "iterations": 10000,
    "random_seed": 42,
    "parallel": true
  },
  "output": {
    "directory": "results/",
    "formats": ["excel"]
  }
}
```

---

## Extension Points

### Custom Distributions

Users can define custom distribution classes:

```python
from spm_monte_carlo.distributions import BaseDistribution

class CustomDistribution(BaseDistribution):
    """User-defined distribution"""

    def __init__(self, **params):
        super().__init__()
        self.params = params

    def sample(self, n: int, seed: Optional[int] = None) -> np.ndarray:
        """Generate random samples"""
        # Custom sampling logic
        return samples

    def pdf(self, x: np.ndarray) -> np.ndarray:
        """Probability density function"""
        # Custom PDF logic
        return densities

    def fit(self, data: np.ndarray) -> Dict[str, float]:
        """Fit parameters to data"""
        # Custom fitting logic
        return params

# Register custom distribution
from spm_monte_carlo import register_distribution
register_distribution('my_custom_dist', CustomDistribution)

# Use in simulation
simulator.configure(
    distribution_overrides={'quota_attainment': 'my_custom_dist'}
)
```

---

### Custom Compensation Rules

Extend the compensation rule engine:

```python
from spm_monte_carlo.compensation import CompensationRule

class CustomRule(CompensationRule):
    """User-defined compensation rule"""

    def apply(self, context: CompensationContext) -> float:
        """
        Calculate compensation based on custom logic.

        Args:
            context: Contains performance data, plan parameters, etc.

        Returns:
            Compensation amount for this rule
        """
        # Custom calculation
        return amount

# Register rule
from spm_monte_carlo import register_compensation_rule
register_compensation_rule('my_custom_rule', CustomRule)
```

---

### Custom Analytics

Add custom analysis functions:

```python
from spm_monte_carlo.analytics import Analyzer

class CustomAnalyzer(Analyzer):
    """User-defined analyzer"""

    def analyze(self, results: SimulationResults) -> Dict:
        """
        Perform custom analysis on results.

        Args:
            results: Simulation results

        Returns:
            Dictionary with analysis results
        """
        # Custom analysis logic
        return analysis_results

# Use with results
analyzer = CustomAnalyzer()
custom_results = analyzer.analyze(results)
```

---

### Callbacks and Hooks

#### Progress Callback

```python
def progress_callback(current: int, total: int):
    """Called during simulation with progress updates"""
    percent = 100 * current / total
    print(f"Progress: {percent:.1f}% ({current}/{total})")

simulator.run(progress_callback=progress_callback)
```

#### Pre/Post Processing Hooks

```python
def pre_simulation_hook(config: SimulationConfig):
    """Called before simulation starts"""
    print(f"Starting simulation with {config.iterations} iterations")
    # Modify config if needed
    return config

def post_simulation_hook(results: SimulationResults):
    """Called after simulation completes"""
    print(f"Simulation complete: mean = ${results.mean:,.0f}")
    # Custom processing
    return results

simulator.register_hook('pre_simulation', pre_simulation_hook)
simulator.register_hook('post_simulation', post_simulation_hook)
```

---

## Error Handling

### Exception Hierarchy

```python
SPMMonteCarloError (base)
├── ConfigurationError
│   ├── InvalidConfigError
│   └── MissingConfigError
├── DataError
│   ├── DataLoadError
│   ├── DataValidationError
│   │   ├── SchemaValidationError
│   │   └── DataQualityError
│   └── DataExportError
├── SimulationError
│   ├── DistributionFittingError
│   ├── ConvergenceError
│   └── ComputationError
└── ReportGenerationError
```

### Error Handling Best Practices

```python
from spm_monte_carlo import MonteCarloSimulator, DataValidationError

try:
    simulator = MonteCarloSimulator()
    simulator.load_data('historical.xlsx', 'plan.xlsx')

    # Validate before running
    validation = simulator.validate_data()
    if not validation.is_valid:
        print("Data validation failed:")
        validation.print()
        exit(1)

    results = simulator.run()

except DataValidationError as e:
    print(f"Validation error: {e}")
    print(f"Location: {e.location}")
    print(f"Suggestion: {e.suggestion}")

except SimulationError as e:
    print(f"Simulation failed: {e}")
    # Check if partial results are available
    if e.partial_results:
        print("Partial results available for debugging")

except Exception as e:
    print(f"Unexpected error: {e}")
    # Log for debugging
```

---

## Usage Examples

### Example 1: Basic Usage

```python
from spm_monte_carlo import MonteCarloSimulator

# Initialize
sim = MonteCarloSimulator()

# Load data
sim.load_data('historical.xlsx', 'plan.xlsx')

# Configure
sim.configure(iterations=10000, seed=42)

# Run
results = sim.run()

# View results
print(f"Mean: ${results.mean:,.0f}")
print(f"95% VaR: ${results.var_95:,.0f}")

# Export
results.export('results.xlsx')
```

---

### Example 2: Custom Configuration

```python
from spm_monte_carlo import MonteCarloSimulator

sim = MonteCarloSimulator()
sim.load_data('historical.xlsx', 'plan.xlsx')

# Advanced configuration
sim.configure(
    iterations=50000,
    seed=42,
    sampling_method='latin_hypercube',  # Better convergence
    parallel=True,
    n_jobs=8
)

# Custom distribution overrides
sim.fit_distributions(
    auto_fit=True,
    distribution_overrides={
        'quota_attainment_pct': 'lognormal',
        'deal_size': 'gamma'
    }
)

# Run with progress tracking
def show_progress(current, total):
    if current % 1000 == 0:
        print(f"Completed {current}/{total} iterations")

results = sim.run(progress_callback=show_progress)
```

---

### Example 3: Scenario Comparison

```python
from spm_monte_carlo import MonteCarloSimulator

# Run scenario A (current plan)
sim_a = MonteCarloSimulator()
sim_a.load_config('scenario_a.yaml')
results_a = sim_a.run()

# Run scenario B (proposed plan)
sim_b = MonteCarloSimulator()
sim_b.load_config('scenario_b.yaml')
results_b = sim_b.run()

# Compare
comparison = results_a.compare_to(results_b,
                                  name_self='Current Plan',
                                  name_other='Proposed Plan')

print(comparison.summary())
comparison.plot()
comparison.export('scenario_comparison.xlsx')
```

---

### Example 4: Sensitivity Analysis

```python
from spm_monte_carlo import MonteCarloSimulator

sim = MonteCarloSimulator()
sim.load_data('historical.xlsx', 'plan.xlsx')
sim.configure(iterations=10000, seed=42)

results = sim.run()

# Perform sensitivity analysis
sensitivity = results.sensitivity_analysis(
    variables=['quota_attainment_pct', 'commission_rate', 'base_salary']
)

# View tornado chart
sensitivity.plot_tornado()

# Export sensitivity data
sensitivity.to_dataframe().to_csv('sensitivity_analysis.csv')
```

---

### Example 5: Batch Processing

```python
from spm_monte_carlo import MonteCarloSimulator
from pathlib import Path

scenarios = {
    'base_case': 'configs/base.yaml',
    'optimistic': 'configs/optimistic.yaml',
    'pessimistic': 'configs/pessimistic.yaml'
}

results = {}
for name, config_file in scenarios.items():
    print(f"Running {name}...")
    sim = MonteCarloSimulator()
    sim.load_config(config_file)
    results[name] = sim.run()

# Generate comparison report
from spm_monte_carlo.analytics import MultiScenarioComparison

comparison = MultiScenarioComparison(results)
comparison.generate_report('multi_scenario_report.xlsx')
comparison.plot_all_scenarios('scenarios_comparison.png')
```

---

## API Versioning

**Current Version**: 1.0.0 (design phase)

**Versioning Policy**:
- **Major version** (X.0.0): Breaking API changes
- **Minor version** (1.X.0): New features, backward compatible
- **Patch version** (1.0.X): Bug fixes, backward compatible

**Deprecation Policy**:
- Deprecated features will be marked with warnings
- Deprecated features will be maintained for at least 2 minor versions
- Migration guides will be provided for breaking changes

---

## Performance Considerations

### API Performance Tips

1. **Use configuration files** for complex setups (faster than many API calls)
2. **Enable parallel processing** for large simulations
3. **Use Latin Hypercube Sampling** for faster convergence
4. **Disable iteration data export** unless needed (saves memory/time)
5. **Reuse simulator objects** for multiple runs (caches fitted distributions)

### Recommended Iteration Counts

- **Quick test**: 1,000 iterations (~5 seconds)
- **Standard analysis**: 10,000 iterations (~30 seconds)
- **High accuracy**: 50,000+ iterations (several minutes)
- **Publication quality**: 100,000+ iterations (10+ minutes)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Status**: Design Phase
