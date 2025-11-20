# SPM Monte Carlo Tool - Architecture Design

## Overview

This document outlines the architecture for a production-grade Monte Carlo simulation tool designed specifically for Sales Performance Management (SPM) compensation analysis.

## Core Architecture

The system follows a modular, pipeline-based architecture with six main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SPM Monte Carlo System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐    ┌────────────────┐    ┌──────────────┐   │
│  │ Data Ingestion│───▶│  Statistical   │───▶│ Monte Carlo  │   │
│  │    Module     │    │    Analysis    │    │  Simulation  │   │
│  └───────────────┘    │     Engine     │    │    Engine    │   │
│         │             └────────────────┘    └──────────────┘   │
│         │                                           │           │
│         ▼                                           ▼           │
│  ┌───────────────┐    ┌────────────────┐    ┌──────────────┐   │
│  │  Validation   │    │ Compensation   │    │  Analytics   │   │
│  │    Rules      │    │   Calculator   │───▶│ & Reporting  │   │
│  └───────────────┘    └────────────────┘    └──────────────┘   │
│                                                     │           │
│                                                     ▼           │
│                              ┌────────────────────────────┐     │
│                              │   Visualization Module     │     │
│                              └────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Data Ingestion Module

**Purpose:** Load, parse, and validate input data from Excel files.

**Responsibilities:**
- Excel file reading (support for .xlsx, .xls, .xlsm)
- Schema validation against defined templates
- Data type conversion and normalization
- Missing data detection and handling
- Multi-sheet workbook processing

**Key Classes:**
- `ExcelDataLoader` - Main loader with pluggable readers
- `DataValidator` - Schema and business rule validation
- `DataNormalizer` - Type conversion and cleaning

**Technologies:**
- openpyxl (primary Excel reader)
- pandas (data manipulation)
- Custom validation framework

**Error Handling:**
- Detailed validation error reports
- Row-level error tracking
- Automatic type inference with override options

---

### 2. Statistical Analysis Engine

**Purpose:** Analyze historical data and fit probability distributions.

**Responsibilities:**
- Descriptive statistics calculation
- Distribution fitting (auto-detection and manual specification)
- Goodness-of-fit testing (K-S test, Chi-square, Anderson-Darling)
- Correlation matrix estimation
- Outlier detection and treatment

**Key Classes:**
- `DistributionFitter` - Fits and selects best distribution
- `CorrelationAnalyzer` - Analyzes dependencies between variables
- `StatisticalSummary` - Generates descriptive statistics

**Supported Distributions:**
- Normal (Gaussian)
- Log-normal
- Beta
- Gamma
- Uniform
- Triangular
- Custom empirical distributions

**Technologies:**
- scipy.stats (distribution fitting)
- NumPy (statistical computations)
- Custom goodness-of-fit framework

---

### 3. Monte Carlo Simulation Engine

**Purpose:** Generate simulated scenarios using statistical models.

**Responsibilities:**
- Random sampling from fitted distributions
- Correlation preservation using Cholesky decomposition
- Multiple sampling strategies
- Parallel simulation execution
- Reproducibility via seed management

**Key Classes:**
- `MonteCarloSimulator` - Main simulation orchestrator
- `SamplingStrategy` - Strategy pattern for different sampling methods
  - `MonteCarloSampling` - Standard random sampling
  - `LatinHypercubeSampling` - Stratified sampling for efficiency
  - `QuasiRandomSampling` - Low-discrepancy sequences (Sobol, Halton)
- `CorrelationHandler` - Maintains variable correlations

**Design Pattern:** Strategy Pattern for sampling methods

**Performance Optimizations:**
- Vectorized operations (NumPy)
- Parallel processing (multiprocessing/joblib)
- Memory-efficient batch processing
- Progress tracking for long simulations

**Configuration:**
- Number of simulations (default: 10,000)
- Random seed for reproducibility
- Batch size for memory management
- Parallel worker count

---

### 4. Compensation Calculator

**Purpose:** Apply compensation rules to simulated performance data.

**Responsibilities:**
- Flexible rule engine for diverse compensation structures
- Tiered commission calculations
- Accelerators and decelerators
- Bonus and SPIF calculations
- Quota attainment logic
- Multi-component plan support

**Key Classes:**
- `CompensationEngine` - Main calculation orchestrator
- `RuleParser` - Parses compensation plan definitions
- `TierCalculator` - Handles tiered structures
- `FormulaEvaluator` - Evaluates custom formulas
- `PlanComponent` - Individual compensation component (commission, bonus, etc.)

**Design Pattern:** Builder Pattern for plan construction, Strategy Pattern for calculation methods

**Rule Definition:**
- Data-driven (YAML/JSON configuration)
- Not hardcoded in source code
- Support for complex conditional logic
- Variable substitution and lookups

**Example Plan Components:**
- Base commission rates with tiers
- Quota-based accelerators (>100% → 1.5x rate)
- Quarterly bonuses
- SPIFs (Sales Performance Incentive Funds)
- Draw against commission
- Caps and floors

---

### 5. Analytics & Reporting Module

**Purpose:** Generate insights and risk metrics from simulation results.

**Responsibilities:**
- Summary statistics (mean, median, std dev, percentiles)
- Risk metrics calculation
- Sensitivity analysis
- Scenario comparison
- Budget impact analysis
- Export to Excel and other formats

**Key Classes:**
- `RiskAnalyzer` - Calculates risk metrics
- `SensitivityAnalyzer` - Tornado charts and parameter sensitivity
- `ScenarioComparator` - Compares multiple scenarios
- `ReportGenerator` - Creates formatted reports

**Risk Metrics:**
- **Value at Risk (VaR):** Percentile-based risk measure
  - VaR95: 95th percentile of payout distribution
  - VaR99: 99th percentile
- **Conditional Value at Risk (CVaR):** Expected value beyond VaR
- **Probability of Exceeding Budget:** P(total payout > budget)
- **Budget Utilization Distribution:** Expected spend vs. budget

**Sensitivity Analysis:**
- Tornado charts: Impact of each input variable
- One-at-a-time (OAT) sensitivity
- Correlation with output metrics
- Parameter ranking by influence

**Output Formats:**
- Excel workbooks with multiple sheets
- CSV files
- JSON (for API integration)
- HTML reports with visualizations

---

### 6. Visualization Module

**Purpose:** Create charts, graphs, and dashboards.

**Responsibilities:**
- Distribution plots (histograms, KDE)
- Box plots and violin plots
- Tornado charts for sensitivity
- Cumulative distribution functions
- Time-series plots (if applicable)
- Interactive dashboards (optional)

**Key Classes:**
- `ChartFactory` - Factory pattern for chart creation
- `Dashboard` - Multi-chart layouts
- `StyleManager` - Consistent styling

**Chart Types:**
- Histogram with fitted distribution overlay
- Box plot by scenario
- Tornado chart for sensitivity
- CDF plot with percentile markers
- Scatter plot matrix for correlations
- Heatmap for correlation matrix

**Technologies:**
- matplotlib (core plotting)
- seaborn (statistical visualizations)
- plotly (interactive charts - optional)

---

## Design Patterns

### 1. Strategy Pattern
**Used in:** Sampling strategies, calculation methods

```python
class SamplingStrategy(ABC):
    @abstractmethod
    def sample(self, distribution, n_samples):
        pass

class MonteCarloSampling(SamplingStrategy):
    def sample(self, distribution, n_samples):
        return distribution.rvs(size=n_samples)

class LatinHypercubeSampling(SamplingStrategy):
    def sample(self, distribution, n_samples):
        # LHS implementation
        pass
```

### 2. Factory Pattern
**Used in:** Distribution creation, chart creation

```python
class DistributionFactory:
    @staticmethod
    def create(dist_type: str, params: dict):
        if dist_type == 'normal':
            return scipy.stats.norm(**params)
        elif dist_type == 'lognormal':
            return scipy.stats.lognorm(**params)
        # ...
```

### 3. Builder Pattern
**Used in:** Compensation plan construction, simulation configuration

```python
class SimulationBuilder:
    def with_data(self, data):
        self.data = data
        return self

    def with_plan(self, plan):
        self.plan = plan
        return self

    def with_iterations(self, n):
        self.iterations = n
        return self

    def build(self):
        return MonteCarloSimulator(self.data, self.plan, self.iterations)
```

### 4. Pipeline Pattern
**Used in:** Data processing workflow

```python
class Pipeline:
    def __init__(self):
        self.steps = []

    def add_step(self, step):
        self.steps.append(step)
        return self

    def execute(self, data):
        result = data
        for step in self.steps:
            result = step.process(result)
        return result
```

---

## Performance Considerations

### Vectorization
- Use NumPy arrays instead of Python lists
- Broadcast operations across entire datasets
- Avoid Python loops for numerical operations

### Parallel Processing
- Distribute simulation iterations across CPU cores
- Use `multiprocessing` or `joblib` for parallelization
- Batch results to minimize inter-process communication

### Memory Management
- Stream large Excel files in chunks
- Process simulations in batches
- Release memory after each batch
- Use memory-efficient data types (float32 vs float64 where appropriate)

### Caching
- Cache fitted distributions
- Cache intermediate calculation results
- Memoize expensive function calls

---

## Error Handling & Logging

### Validation Errors
- Collect all validation errors before failing
- Provide line numbers and field names
- Suggest corrections where possible

### Runtime Errors
- Graceful degradation for non-critical failures
- Detailed error messages with context
- Option to continue simulation with warnings

### Logging
- Configurable log levels (DEBUG, INFO, WARNING, ERROR)
- Separate logs for different modules
- Performance metrics logging
- Audit trail for simulation parameters

---

## Extensibility Points

### Custom Distributions
Users can plug in custom distribution classes:
```python
class CustomDistribution:
    def rvs(self, size):
        # Custom sampling logic
        pass

    def pdf(self, x):
        # Probability density function
        pass
```

### Custom Compensation Rules
Users can define custom rule types:
```python
class CustomRule:
    def calculate(self, performance_data):
        # Custom calculation logic
        pass
```

### Custom Analytics
Users can add custom analysis modules:
```python
class CustomAnalyzer:
    def analyze(self, simulation_results):
        # Custom analysis logic
        pass
```

---

## Configuration Management

### Config File Structure (YAML)
```yaml
simulation:
  iterations: 10000
  seed: 42
  sampling_strategy: monte_carlo
  parallel: true
  workers: 4

data:
  historical_file: data/historical_performance.xlsx
  plan_file: data/comp_plan.xlsx
  rep_master_file: data/rep_master.xlsx

distributions:
  auto_fit: true
  preferred_distributions:
    - normal
    - lognormal
    - gamma

output:
  format: excel
  path: results/
  charts: true
  percentiles: [5, 25, 50, 75, 95, 99]
```

---

## Security & Data Privacy

### Data Handling
- No external data transmission (runs locally)
- Secure file access permissions
- Option to anonymize rep identifiers in outputs

### Input Validation
- Prevent code injection via Excel formulas
- Sanitize all string inputs
- Validate numeric ranges

---

## Testing Strategy Integration

The architecture supports multiple testing levels:
- **Unit Tests:** Each component tested in isolation
- **Integration Tests:** Pipeline workflow validation
- **Validation Tests:** Known outcomes verification
- **Performance Tests:** Benchmarking and profiling

---

## Future Enhancements

### Phase 2 Features
- Web-based dashboard (Flask/Django)
- Database integration (PostgreSQL)
- RESTful API for remote execution
- Real-time data integration

### Advanced Analytics
- Machine learning for performance prediction
- Optimization algorithms for plan design
- What-if scenario builder with UI
- Automated plan comparison and recommendation

---

## Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Language | Python 3.8+ |
| Numerical Computing | NumPy, SciPy |
| Data Manipulation | Pandas |
| Excel I/O | openpyxl, xlsxwriter |
| Visualization | matplotlib, seaborn |
| Testing | pytest |
| Parallelization | multiprocessing, joblib |
| Configuration | YAML (PyYAML) |
| Logging | Python logging module |

---

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable, and extensible SPM Monte Carlo simulation tool. The modular design allows for incremental development and testing, while the use of established design patterns ensures code quality and flexibility.
