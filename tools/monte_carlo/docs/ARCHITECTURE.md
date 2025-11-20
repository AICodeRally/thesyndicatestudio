# SPM Monte Carlo Tool - Architecture Design

## Table of Contents
1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow](#data-flow)
4. [Module Specifications](#module-specifications)
5. [Design Patterns](#design-patterns)
6. [Performance Considerations](#performance-considerations)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                      │
│  (CLI, Python API, Configuration Files)                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      Orchestration Layer                          │
│  - SimulationOrchestrator (main controller)                      │
│  - Configuration Manager                                          │
│  - Logging & Error Handling                                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                     Core Processing Layer                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Data       │  │  Statistical │  │   Monte      │          │
│  │  Ingestion   │─▶│   Analysis   │─▶│   Carlo      │          │
│  │              │  │              │  │   Engine     │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                   │
│  ┌──────────────┐  ┌──────────────┐         │                  │
│  │ Compensation │◀─│   Analytics  │◀────────┘                  │
│  │  Calculator  │  │   & Reporting│                             │
│  └──────────────┘  └──────┬───────┘                             │
│                           │                                      │
│  ┌────────────────────────▼─────────────┐                       │
│  │     Visualization Module             │                       │
│  └──────────────────────────────────────┘                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      Data Access Layer                            │
│  - Excel Reader/Writer                                            │
│  - File System Operations                                         │
│  - Cache Management                                               │
└───────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Modularity**: Components can be developed, tested, and modified independently
3. **Extensibility**: Easy to add new distribution types, compensation rules, or analytics
4. **Performance**: Vectorized operations, parallel processing, efficient memory usage
5. **Testability**: Clear interfaces enable comprehensive unit and integration testing

---

## Component Architecture

### 1. Data Ingestion Module

**Location**: `src/data_ingestion/`

**Classes**:

```
ExcelDataLoader
├── __init__(file_path: str)
├── load_sheet(sheet_name: str) -> DataFrame
├── validate_schema(df: DataFrame, schema: Schema) -> ValidationResult
└── get_available_sheets() -> List[str]

DataValidator
├── validate_required_columns(df: DataFrame, required: List[str]) -> bool
├── validate_data_types(df: DataFrame, type_map: Dict) -> ValidationResult
├── validate_ranges(df: DataFrame, range_constraints: Dict) -> ValidationResult
└── check_missing_data(df: DataFrame) -> MissingDataReport

SchemaManager
├── load_schema(schema_file: str) -> Schema
├── get_default_schema() -> Schema
└── validate_custom_schema(schema: Dict) -> bool
```

**Data Flow**:
1. User specifies Excel file path
2. ExcelDataLoader opens file and enumerates sheets
3. For each required sheet:
   - Load into DataFrame
   - Validate against schema
   - Report errors or warnings
4. Return validated DataFrames or error report

**Error Handling**:
- File not found: Clear error message with path
- Invalid Excel format: Suggest supported formats
- Schema mismatch: Show expected vs. actual columns
- Data quality issues: Detailed report with row/column references

---

### 2. Statistical Analysis Engine

**Location**: `src/statistical_analysis/`

**Classes**:

```
DistributionFitter
├── fit_distribution(data: ndarray, dist_type: str) -> FittedDistribution
├── auto_fit(data: ndarray) -> List[FittedDistribution]  # Try multiple, rank by fit
├── goodness_of_fit_test(data: ndarray, dist: FittedDistribution) -> GoFResult
└── plot_fit_comparison(data: ndarray, distributions: List[FittedDistribution])

FittedDistribution
├── distribution_type: str
├── parameters: Dict[str, float]
├── gof_statistic: float
├── gof_pvalue: float
├── sample(n: int, seed: int = None) -> ndarray
└── pdf(x: ndarray) -> ndarray

CorrelationAnalyzer
├── calculate_correlation_matrix(df: DataFrame) -> ndarray
├── test_correlation_significance(corr_matrix: ndarray, n: int) -> ndarray
├── generate_correlated_samples(distributions: List[FittedDistribution],
│                                corr_matrix: ndarray,
│                                n: int) -> ndarray
└── plot_correlation_heatmap(corr_matrix: ndarray, labels: List[str])

OutlierDetector
├── detect_outliers(data: ndarray, method: str = 'iqr') -> ndarray
├── remove_outliers(data: ndarray, mask: ndarray) -> ndarray
└── report_outliers(data: ndarray, mask: ndarray) -> OutlierReport
```

**Supported Distributions**:
- Normal (Gaussian)
- Log-normal
- Beta
- Gamma
- Uniform
- Triangular
- Empirical (non-parametric)

**Goodness-of-Fit Tests**:
- Kolmogorov-Smirnov test
- Anderson-Darling test
- Chi-squared test

**Correlation Handling**:
- Pearson correlation coefficient
- Cholesky decomposition for multivariate sampling
- Copula methods (future enhancement)

---

### 3. Monte Carlo Simulation Engine

**Location**: `src/simulation/`

**Classes**:

```
MonteCarloSimulator
├── __init__(config: SimulationConfig)
├── initialize(distributions: Dict[str, FittedDistribution],
│              corr_matrix: ndarray)
├── run_simulation(n_iterations: int) -> SimulationResults
├── run_single_iteration(iteration_id: int) -> IterationResult
└── get_progress() -> ProgressReport

SimulationConfig
├── n_iterations: int
├── random_seed: int
├── parallel: bool
├── n_jobs: int
├── sampling_method: str  # 'monte_carlo', 'latin_hypercube', 'quasi_random'
└── batch_size: int

SimulationResults
├── iteration_results: List[IterationResult]
├── summary_stats: Dict[str, StatSummary]
├── to_dataframe() -> DataFrame
└── save(output_path: str)

IterationResult
├── iteration_id: int
├── rep_results: List[RepResult]
└── aggregated_metrics: Dict[str, float]

RepResult
├── rep_id: str
├── simulated_performance: Dict[str, float]
├── calculated_compensation: CompensationBreakdown
└── total_compensation: float

SamplingStrategy (Abstract Base Class)
├── MonteCarloSampler
├── LatinHypercubeSampler
└── QuasiRandomSampler (Sobol sequences)
```

**Sampling Strategies**:

1. **Standard Monte Carlo**: Pure random sampling
   - Pros: Simple, unbiased
   - Cons: Requires many iterations for convergence

2. **Latin Hypercube Sampling**: Stratified sampling
   - Pros: Better coverage with fewer samples
   - Cons: More complex implementation

3. **Quasi-Random (Sobol)**: Deterministic low-discrepancy sequences
   - Pros: Excellent coverage, faster convergence
   - Cons: Doesn't integrate well with correlation

**Parallel Processing**:
```python
def run_simulation_parallel(self, n_iterations: int) -> SimulationResults:
    """
    Distributes iterations across multiple CPU cores
    """
    with multiprocessing.Pool(processes=self.config.n_jobs) as pool:
        iteration_ids = range(n_iterations)
        results = pool.map(self.run_single_iteration, iteration_ids)
    return self.aggregate_results(results)
```

---

### 4. Compensation Calculator

**Location**: `src/compensation/`

**Classes**:

```
CompensationEngine
├── __init__(plan_structure: PlanStructure)
├── calculate(rep_performance: Dict[str, float], rep_role: str) -> CompensationBreakdown
├── apply_tier_logic(performance: float, tiers: List[Tier]) -> float
├── apply_accelerators(base_comp: float, performance: float) -> float
└── apply_caps_and_floors(comp: float, limits: Limits) -> float

PlanStructure
├── load_from_dataframe(df: DataFrame) -> PlanStructure
├── get_plan_for_role(role: str) -> RolePlan
└── validate() -> ValidationResult

RolePlan
├── role: str
├── base_salary: float
├── tiers: List[Tier]
├── accelerators: List[Accelerator]
├── spiffs: List[SPIFF]
├── caps: Dict[str, float]
└── floors: Dict[str, float]

Tier
├── min_performance: float
├── max_performance: float
├── rate: float
├── rate_type: str  # 'percentage', 'flat_per_dollar', 'flat_amount'
└── calculate(performance: float, revenue: float) -> float

CompensationBreakdown
├── base_salary: float
├── tier_commissions: Dict[str, float]
├── accelerators: Dict[str, float]
├── spiffs: Dict[str, float]
├── total_variable: float
├── total_compensation: float
└── to_dict() -> Dict
```

**Rule Engine Design**:

The compensation calculator uses a flexible rule engine that can be configured via data rather than hardcoded logic:

```python
class CompensationRule(ABC):
    @abstractmethod
    def apply(self, context: CompensationContext) -> float:
        pass

class TierRule(CompensationRule):
    def apply(self, context: CompensationContext) -> float:
        performance_pct = context.performance / context.quota
        for tier in context.tiers:
            if tier.min <= performance_pct < tier.max:
                return self.calculate_tier_comp(tier, context)
        return 0.0

class AcceleratorRule(CompensationRule):
    def apply(self, context: CompensationContext) -> float:
        if context.performance_pct > self.threshold:
            multiplier = 1.0 + (context.performance_pct - self.threshold) * self.rate
            return context.base_commission * (multiplier - 1.0)
        return 0.0
```

This allows new rule types to be added without modifying existing code.

---

### 5. Analytics & Reporting Module

**Location**: `src/analytics/`

**Classes**:

```
StatisticalAnalyzer
├── calculate_summary_stats(data: ndarray) -> SummaryStats
├── calculate_percentiles(data: ndarray, percentiles: List[float]) -> Dict
├── calculate_confidence_interval(data: ndarray, confidence: float = 0.95) -> Tuple
└── calculate_moments(data: ndarray) -> Moments

SummaryStats
├── mean: float
├── median: float
├── mode: float
├── std_dev: float
├── variance: float
├── skewness: float
├── kurtosis: float
└── to_dict() -> Dict

RiskAnalyzer
├── calculate_var(data: ndarray, confidence: float = 0.95) -> float
├── calculate_cvar(data: ndarray, confidence: float = 0.95) -> float
├── probability_exceeds_threshold(data: ndarray, threshold: float) -> float
├── expected_shortfall(data: ndarray, threshold: float) -> float
└── risk_decomposition(results: SimulationResults) -> RiskDecomposition

SensitivityAnalyzer
├── tornado_analysis(simulator: MonteCarloSimulator,
│                    variables: List[str]) -> TornadoChart
├── one_way_sensitivity(simulator: MonteCarloSimulator,
│                       variable: str,
│                       range: Tuple[float, float]) -> DataFrame
└── scenario_comparison(results_list: List[SimulationResults],
│                       scenario_names: List[str]) -> ComparisonReport

ReportGenerator
├── generate_summary_report(results: SimulationResults) -> Report
├── generate_risk_report(risk_analysis: RiskAnalysis) -> Report
├── export_to_excel(report: Report, output_path: str)
└── export_to_json(report: Report, output_path: str)
```

**Key Metrics**:

1. **Central Tendency**:
   - Mean, median, mode
   - Weighted averages by role/region

2. **Dispersion**:
   - Standard deviation, variance
   - Coefficient of variation
   - Interquartile range

3. **Risk Metrics**:
   - VaR (Value at Risk): 95th, 99th percentile
   - CVaR (Conditional VaR): Expected value beyond VaR
   - Probability of exceeding budget by X%

4. **Efficiency Metrics**:
   - Expected compensation ratio (comp / revenue)
   - Cost per dollar of revenue
   - Incentive effectiveness

---

### 6. Visualization Module

**Location**: `src/visualization/`

**Classes**:

```
ChartGenerator
├── plot_distribution(data: ndarray, fitted_dist: FittedDistribution = None) -> Figure
├── plot_box_violin(data_dict: Dict[str, ndarray]) -> Figure
├── plot_scatter(x: ndarray, y: ndarray, labels: Tuple[str, str]) -> Figure
├── plot_tornado(sensitivity_results: DataFrame) -> Figure
└── plot_time_series(data: DataFrame, confidence_bands: bool = True) -> Figure

InteractiveDashboard
├── create_dashboard(results: SimulationResults) -> DashApp
├── add_distribution_explorer(app: DashApp, results: SimulationResults)
├── add_scenario_comparison(app: DashApp, scenarios: List[SimulationResults])
└── run(port: int = 8050)

StyleManager
├── get_color_palette() -> List[str]
├── apply_theme(fig: Figure) -> Figure
└── export_publication_quality(fig: Figure, output_path: str, dpi: int = 300)
```

**Visualization Types**:

1. **Distribution Plots**:
   - Histograms with KDE overlay
   - Q-Q plots for normality checks
   - Box plots and violin plots

2. **Comparison Charts**:
   - Side-by-side distributions (scenarios)
   - Tornado charts (sensitivity)
   - Waterfall charts (compensation breakdown)

3. **Risk Visualizations**:
   - Fan charts (time-series with confidence bands)
   - Risk heatmaps
   - Probability density overlays with VaR thresholds

4. **Interactive Elements** (Plotly):
   - Sliders for parameter adjustment
   - Hover tooltips with detailed information
   - Zoom, pan, and selection tools

---

## Data Flow

### End-to-End Simulation Workflow

```
1. User Input
   ↓
2. Configuration Loading
   ├─ Excel file paths
   ├─ Simulation parameters
   └─ Plan structure
   ↓
3. Data Validation
   ├─ Schema checks
   ├─ Data quality validation
   └─ Error reporting (if issues found) ──→ EXIT
   ↓
4. Statistical Analysis
   ├─ Fit distributions to historical data
   ├─ Calculate correlation matrix
   └─ User review/override
   ↓
5. Simulation Initialization
   ├─ Set random seed
   ├─ Initialize samplers
   └─ Load compensation rules
   ↓
6. Monte Carlo Execution (Loop: N iterations)
   ├─ Sample from distributions
   ├─ Apply correlations
   ├─ Calculate compensation for each rep
   └─ Store iteration results
   ↓
7. Results Aggregation
   ├─ Calculate summary statistics
   ├─ Compute risk metrics
   └─ Prepare data for visualization
   ↓
8. Analysis & Reporting
   ├─ Generate visualizations
   ├─ Create Excel report
   └─ Export results
   ↓
9. Output Delivery
   └─ Present results to user
```

### Data Structures Flow

```
Excel File → DataFrame → Validated Data → FittedDistributions
                                               ↓
                                        Sampled Values
                                               ↓
                                        Rep Performance
                                               ↓
                                       Compensation Rules
                                               ↓
                                    Calculated Compensation
                                               ↓
                                      Iteration Results
                                               ↓
                                    Aggregated Statistics
                                               ↓
                                   Report + Visualizations
```

---

## Module Specifications

### Configuration Management

**Configuration Hierarchy**:
1. Default configuration (embedded in code)
2. Global configuration file (~/.spm_monte_carlo/config.yaml)
3. Project configuration file (./config.yaml)
4. Command-line arguments (highest priority)

**Configuration Schema**:
```yaml
simulation:
  iterations: 10000
  seed: 42
  parallel: true
  n_jobs: -1  # -1 means use all available cores
  sampling_method: 'latin_hypercube'

data:
  historical_file: 'data/historical.xlsx'
  plan_file: 'data/plan_structure.xlsx'
  output_dir: 'results/'

distributions:
  auto_fit: true
  goodness_of_fit_threshold: 0.05
  outlier_detection: 'iqr'
  outlier_handling: 'remove'  # or 'cap'

risk:
  var_confidence: 0.95
  budget_threshold: 5000000

visualization:
  dpi: 300
  style: 'seaborn-v0_8-darkgrid'
  color_palette: 'Set2'

logging:
  level: 'INFO'
  file: 'simulation.log'
```

### Error Handling Strategy

**Error Categories**:

1. **User Errors** (clear, actionable messages):
   - File not found
   - Invalid configuration
   - Schema mismatch

2. **Data Errors** (detailed reports):
   - Missing required columns
   - Invalid data types
   - Out-of-range values

3. **Computation Errors** (graceful degradation):
   - Distribution fitting failures
   - Numerical instability
   - Memory limitations

4. **System Errors** (technical details):
   - I/O errors
   - Permission issues
   - Dependency problems

**Exception Hierarchy**:
```python
SPMMonteCarloError (base)
├── ConfigurationError
├── DataValidationError
│   ├── SchemaValidationError
│   └── DataQualityError
├── SimulationError
│   ├── DistributionFittingError
│   └── ConvergenceError
└── ReportGenerationError
```

### Logging Strategy

**Log Levels**:
- **DEBUG**: Detailed diagnostic information
- **INFO**: Confirmation of expected behavior
- **WARNING**: Indication of potential issues
- **ERROR**: Serious problems that may cause failure
- **CRITICAL**: System-level failures

**Logging Points**:
1. Start/end of major operations
2. Validation checkpoints
3. Iteration progress (every N iterations)
4. Warning conditions (e.g., poor distribution fit)
5. Error conditions with full context

---

## Design Patterns

### 1. Strategy Pattern (Sampling Methods)

```python
class SamplingStrategy(ABC):
    @abstractmethod
    def sample(self, distributions: List[Distribution], n: int) -> ndarray:
        pass

class MonteCarloSampler(SamplingStrategy):
    def sample(self, distributions: List[Distribution], n: int) -> ndarray:
        # Pure random sampling
        pass

class LatinHypercubeSampler(SamplingStrategy):
    def sample(self, distributions: List[Distribution], n: int) -> ndarray:
        # LHS implementation
        pass

# Usage:
sampler = LatinHypercubeSampler()  # Easily swappable
samples = sampler.sample(distributions, n_iterations)
```

### 2. Factory Pattern (Distribution Creation)

```python
class DistributionFactory:
    @staticmethod
    def create(dist_type: str, params: Dict) -> Distribution:
        if dist_type == 'normal':
            return NormalDistribution(**params)
        elif dist_type == 'lognormal':
            return LogNormalDistribution(**params)
        # ... etc.
        else:
            raise ValueError(f"Unknown distribution type: {dist_type}")

# Usage:
dist = DistributionFactory.create('lognormal', {'mean': 0, 'std': 0.5})
```

### 3. Builder Pattern (Report Generation)

```python
class ReportBuilder:
    def __init__(self):
        self.report = Report()

    def add_summary_stats(self, stats: SummaryStats):
        self.report.sections.append(SummarySection(stats))
        return self

    def add_visualizations(self, charts: List[Figure]):
        self.report.sections.append(VisualizationSection(charts))
        return self

    def add_risk_analysis(self, risk: RiskAnalysis):
        self.report.sections.append(RiskSection(risk))
        return self

    def build(self) -> Report:
        return self.report

# Usage:
report = (ReportBuilder()
          .add_summary_stats(stats)
          .add_visualizations(charts)
          .add_risk_analysis(risk)
          .build())
```

### 4. Pipeline Pattern (Data Processing)

```python
class ProcessingPipeline:
    def __init__(self):
        self.steps = []

    def add_step(self, step: ProcessingStep):
        self.steps.append(step)
        return self

    def execute(self, data: Any) -> Any:
        result = data
        for step in self.steps:
            result = step.process(result)
        return result

# Usage:
pipeline = (ProcessingPipeline()
            .add_step(LoadDataStep())
            .add_step(ValidateDataStep())
            .add_step(FitDistributionsStep())
            .add_step(RunSimulationStep())
            .add_step(GenerateReportStep()))

results = pipeline.execute(config)
```

---

## Performance Considerations

### Memory Management

**Challenge**: Large simulations generate massive datasets
- 10,000 iterations × 1,000 reps × 20 metrics = 200M data points

**Strategies**:

1. **Streaming Processing**:
   ```python
   # Don't store all iteration results in memory
   def run_simulation_streaming(self):
       aggregator = IncrementalStatsAggregator()
       for i in range(self.n_iterations):
           result = self.run_iteration(i)
           aggregator.update(result)  # Update running statistics
           # result is garbage collected
       return aggregator.get_final_stats()
   ```

2. **Chunked Processing**:
   ```python
   # Process in batches
   chunk_size = 1000
   for chunk_start in range(0, n_iterations, chunk_size):
       chunk_end = min(chunk_start + chunk_size, n_iterations)
       chunk_results = self.run_iterations_batch(chunk_start, chunk_end)
       self.save_chunk(chunk_results)
   ```

3. **Sparse Storage**:
   - Only store percentiles and summary stats by default
   - Optionally store full results if user specifies

### Computational Optimization

**Vectorization** (NumPy):
```python
# Slow (loop-based):
for i in range(n):
    results[i] = calculate_compensation(performance[i])

# Fast (vectorized):
results = calculate_compensation_vectorized(performance)  # NumPy arrays
```

**Parallel Processing**:
```python
# Multiprocessing for CPU-bound tasks
with Pool(processes=cpu_count()) as pool:
    results = pool.map(run_iteration, iteration_ids)

# Consider: Dask for distributed computing (future enhancement)
```

**Caching**:
```python
# Cache expensive computations
@lru_cache(maxsize=1000)
def calculate_tier_rate(performance: float, tier_config: TierConfig) -> float:
    # Expensive calculation
    pass
```

### Profiling & Benchmarking

**Key Metrics to Track**:
- Iterations per second
- Memory usage peak
- Time per module (profiling breakdown)

**Target Performance**:
- 10,000 iterations, 100 reps: < 30 seconds
- 100,000 iterations, 1,000 reps: < 10 minutes (with parallelization)

---

## Future Architecture Enhancements

### Phase 2: Cloud-Native Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Web Interface (React)                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    API Gateway (FastAPI/Flask)                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      Task Queue (Celery)                         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│             Distributed Workers (AWS Lambda/K8s)                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│          Results Storage (S3/Cloud Storage + Database)           │
└───────────────────────────────────────────────────────────────────┘
```

### Phase 3: Machine Learning Integration

- **Predictive Modeling**: Forecast future performance distributions
- **Anomaly Detection**: Identify unusual simulation outcomes
- **Optimization Engine**: Find optimal compensation plan parameters

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Status**: Design Phase
