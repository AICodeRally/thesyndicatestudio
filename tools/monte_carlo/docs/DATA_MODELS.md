# SPM Monte Carlo - Data Models Design

## Overview

This document defines the data structures, schemas, and models used throughout the SPM Monte Carlo simulation tool.

---

## Table of Contents

1. [Input Data Models](#input-data-models)
2. [Internal Data Models](#internal-data-models)
3. [Output Data Models](#output-data-models)
4. [Excel Schema Specifications](#excel-schema-specifications)
5. [Configuration Models](#configuration-models)
6. [Validation Rules](#validation-rules)

---

## Input Data Models

### 1. Historical Performance Data

**Purpose**: Store historical sales performance metrics for statistical analysis

**Schema**:

| Column Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| rep_id | string | Yes | Unique representative identifier | "REP001" |
| period | date/string | Yes | Time period (YYYY-MM or YYYY-QQ) | "2024-Q1" |
| metric_name | string | Yes | Performance metric name | "quota_attainment_pct" |
| metric_value | float | Yes | Measured value | 1.15 |
| role | string | No | Representative role/segment | "AE-Enterprise" |
| region | string | No | Geographic region | "AMER-West" |

**Example Records**:
```
rep_id,period,metric_name,metric_value,role,region
REP001,2024-Q1,quota_attainment_pct,1.15,AE-Enterprise,AMER-West
REP001,2024-Q1,revenue,450000,AE-Enterprise,AMER-West
REP001,2024-Q1,deals_closed,12,AE-Enterprise,AMER-West
REP002,2024-Q1,quota_attainment_pct,0.87,AE-MM,AMER-East
```

**Validation Rules**:
- `rep_id`: Non-empty string, max 50 characters
- `period`: Valid date format or period string
- `metric_name`: Must match predefined metric list
- `metric_value`: Numeric, can be negative for certain metrics
- At least 12 periods of history per rep recommended

---

### 2. Compensation Plan Structure

**Purpose**: Define tiered commission structures, accelerators, and bonuses

**Schema - Commission Tiers**:

| Column Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| plan_id | string | Yes | Unique plan identifier | "FY25-AE-PLAN" |
| role | string | Yes | Target role for this plan | "AE-Enterprise" |
| tier_sequence | int | Yes | Tier order (1, 2, 3...) | 1 |
| tier_min | float | Yes | Minimum quota attainment (%) | 0.00 |
| tier_max | float | Yes | Maximum quota attainment (%) | 0.75 |
| rate | float | Yes | Commission rate or amount | 0.02 |
| rate_type | string | Yes | "percentage", "flat_dollar", "per_unit" | "percentage" |
| applies_to | string | Yes | "revenue", "gross_profit", "units" | "revenue" |

**Schema - Accelerators/Bonuses**:

| Column Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| plan_id | string | Yes | Plan identifier | "FY25-AE-PLAN" |
| component_type | string | Yes | "accelerator", "bonus", "spiff" | "accelerator" |
| trigger_metric | string | Yes | Metric that triggers payment | "quota_attainment_pct" |
| trigger_threshold | float | Yes | Threshold value | 1.20 |
| payout_type | string | Yes | "multiplier", "flat", "incremental_rate" | "multiplier" |
| payout_value | float | Yes | Multiplier or amount | 1.5 |

**Example Records**:
```
# Commission Tiers
plan_id,role,tier_sequence,tier_min,tier_max,rate,rate_type,applies_to
FY25-AE-PLAN,AE-Enterprise,1,0.00,0.75,0.02,percentage,revenue
FY25-AE-PLAN,AE-Enterprise,2,0.75,1.00,0.05,percentage,revenue
FY25-AE-PLAN,AE-Enterprise,3,1.00,2.00,0.08,percentage,revenue

# Accelerators
plan_id,component_type,trigger_metric,trigger_threshold,payout_type,payout_value
FY25-AE-PLAN,accelerator,quota_attainment_pct,1.20,multiplier,1.5
FY25-AE-PLAN,bonus,annual_quota_attainment,1.00,flat,10000
```

---

### 3. Representative Master Data

**Purpose**: Store information about sales representatives

**Schema**:

| Column Name | Data Type | Required | Description | Example |
|------------|-----------|----------|-------------|---------|
| rep_id | string | Yes | Unique identifier | "REP001" |
| full_name | string | No | Representative name | "Jane Doe" |
| role | string | Yes | Current role | "AE-Enterprise" |
| region | string | No | Geographic assignment | "AMER-West" |
| hire_date | date | No | Start date | "2022-01-15" |
| base_salary | float | Yes | Annual base salary | 80000 |
| quota | float | Yes | Annual quota (revenue) | 1000000 |
| plan_id | string | Yes | Assigned compensation plan | "FY25-AE-PLAN" |
| active | boolean | Yes | Currently active | TRUE |

**Validation Rules**:
- `rep_id`: Unique, non-null
- `role`: Must have corresponding plan
- `base_salary`: Positive number
- `quota`: Positive number

---

### 4. Simulation Parameters

**Purpose**: Configure Monte Carlo simulation settings

**Schema** (typically in config file or UI):

| Parameter | Data Type | Default | Description | Valid Range |
|-----------|-----------|---------|-------------|-------------|
| num_iterations | int | 10000 | Number of simulation runs | 1000 - 100000 |
| random_seed | int | None | Seed for reproducibility | Any int |
| confidence_level | float | 0.95 | For confidence intervals | 0.80 - 0.99 |
| sampling_method | string | "monte_carlo" | Sampling strategy | See list below |
| enable_correlation | bool | True | Use correlation matrix | True/False |
| time_horizon_months | int | 12 | Months to project | 1 - 36 |
| parallel_processing | bool | True | Enable multiprocessing | True/False |
| n_jobs | int | -1 | CPU cores to use (-1 = all) | -1 or 1-N |

**Sampling Methods**:
- `"monte_carlo"`: Standard random sampling
- `"latin_hypercube"`: Stratified LHS sampling
- `"quasi_random"`: Sobol sequences

---

## Internal Data Models

### 5. Fitted Distribution

**Purpose**: Store parameters of fitted probability distributions

**Class Structure**:
```python
@dataclass
class FittedDistribution:
    metric_name: str
    distribution_type: str  # 'normal', 'lognormal', 'beta', etc.
    parameters: Dict[str, float]  # e.g., {'mean': 1.0, 'std': 0.2}
    fit_quality: Dict[str, float]  # e.g., {'ks_statistic': 0.05, 'p_value': 0.12}
    sample_size: int
    data_source: str  # Reference to source data
    created_timestamp: datetime
```

**Example**:
```json
{
  "metric_name": "quota_attainment_pct",
  "distribution_type": "lognormal",
  "parameters": {
    "mean": 0.05,
    "std": 0.25
  },
  "fit_quality": {
    "ks_statistic": 0.042,
    "p_value": 0.23,
    "aic": 156.3
  },
  "sample_size": 480,
  "data_source": "historical_data_2023-2024.xlsx",
  "created_timestamp": "2024-11-20T10:30:00Z"
}
```

---

### 6. Correlation Matrix

**Purpose**: Store correlations between performance metrics

**Structure**:
```python
@dataclass
class CorrelationMatrix:
    metric_names: List[str]
    correlation_matrix: np.ndarray  # Square matrix
    p_values: np.ndarray  # Significance tests
    sample_size: int
```

**Example** (3x3 matrix):
```
Metrics: ['quota_attainment', 'deal_size', 'win_rate']

Correlation Matrix:
           quota_att  deal_size  win_rate
quota_att     1.00      0.45      0.62
deal_size     0.45      1.00      0.31
win_rate      0.62      0.31      1.00

P-values:
           quota_att  deal_size  win_rate
quota_att     0.00      0.001     0.000
deal_size     0.001     0.00      0.012
win_rate      0.000     0.012     0.00
```

---

### 7. Simulation Iteration Result

**Purpose**: Store outcome of a single Monte Carlo iteration

**Class Structure**:
```python
@dataclass
class IterationResult:
    iteration_id: int
    rep_results: List[RepSimulationResult]

    def total_compensation(self) -> float:
        return sum(r.total_compensation for r in self.rep_results)

@dataclass
class RepSimulationResult:
    rep_id: str
    simulated_metrics: Dict[str, float]  # e.g., {'quota_attainment_pct': 1.15}
    compensation_breakdown: CompensationBreakdown
    total_compensation: float
```

**Example**:
```json
{
  "iteration_id": 4237,
  "rep_results": [
    {
      "rep_id": "REP001",
      "simulated_metrics": {
        "quota_attainment_pct": 1.15,
        "revenue": 1150000
      },
      "compensation_breakdown": {
        "base_salary": 80000,
        "tier_1_commission": 0,
        "tier_2_commission": 12500,
        "tier_3_commission": 10000,
        "accelerator": 5000,
        "total_variable": 27500,
        "total_compensation": 107500
      },
      "total_compensation": 107500
    }
  ]
}
```

---

### 8. Compensation Breakdown

**Purpose**: Detailed breakdown of compensation calculation

**Class Structure**:
```python
@dataclass
class CompensationBreakdown:
    base_salary: float
    tier_commissions: Dict[str, float]  # Keyed by tier name
    accelerators: Dict[str, float]
    bonuses: Dict[str, float]
    spiffs: Dict[str, float]
    total_variable: float
    total_compensation: float
    calculation_notes: List[str]  # Audit trail

    def to_dict(self) -> Dict:
        return asdict(self)
```

---

## Output Data Models

### 9. Summary Statistics

**Purpose**: Aggregate statistics across all iterations

**Class Structure**:
```python
@dataclass
class SummaryStatistics:
    metric_name: str
    n_iterations: int
    mean: float
    median: float
    std_dev: float
    min: float
    max: float
    percentiles: Dict[float, float]  # {0.05: val, 0.25: val, ...}
    confidence_interval_95: Tuple[float, float]

    def to_series(self) -> pd.Series:
        """Convert to pandas Series for easy display"""
        pass
```

**Example Output**:
```
Metric: Total Compensation
Iterations: 10,000
Mean: $5,245,000
Median: $5,180,000
Std Dev: $485,000
Min: $3,820,000
Max: $7,120,000

Percentiles:
  5th:  $4,520,000
  25th: $4,920,000
  50th: $5,180,000 (median)
  75th: $5,580,000
  95th: $6,140,000

95% Confidence Interval: [$5,195,000, $5,295,000]
```

---

### 10. Risk Metrics

**Purpose**: Quantify financial risk and exposure

**Class Structure**:
```python
@dataclass
class RiskMetrics:
    metric_name: str
    budget_target: float
    probability_exceed_budget: float
    expected_value: float
    expected_overage: float
    var_95: float  # Value at Risk (95th percentile)
    cvar_95: float  # Conditional VaR (expected value beyond VaR)
    downside_deviation: float
```

**Example**:
```json
{
  "metric_name": "total_compensation",
  "budget_target": 5000000,
  "probability_exceed_budget": 0.68,
  "expected_value": 5245000,
  "expected_overage": 245000,
  "var_95": 6140000,
  "cvar_95": 6450000,
  "downside_deviation": 320000
}
```

---

### 11. Sensitivity Analysis Results

**Purpose**: Show impact of input variable changes on outcomes

**Class Structure**:
```python
@dataclass
class SensitivityResult:
    variable_name: str
    base_case_output: float
    sensitivity_data: List[Tuple[float, float]]  # (input_value, output_value)
    elasticity: float  # % change in output per % change in input
    rank: int  # Importance ranking
```

**Tornado Chart Data**:
```
Variable                    | Impact on Total Comp (± %)
----------------------------|---------------------------
Quota Attainment Std Dev    | -15%          | +18%     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Commission Rate (Tier 3)    | -8%           | +12%     ▓▓▓▓▓▓▓▓▓▓
Deal Size Distribution      | -6%           | +7%      ▓▓▓▓▓▓
Base Salary                 | -3%           | +3%      ▓▓▓
```

---

## Excel Schema Specifications

### Input Excel Workbook Structure

**Recommended Workbook Layout**:

```
Workbook: "SPM_Input_Data.xlsx"
├── Sheet: "HistoricalPerformance"
│   └── Columns: rep_id, period, metric_name, metric_value, role, region
├── Sheet: "CommissionTiers"
│   └── Columns: plan_id, role, tier_sequence, tier_min, tier_max, rate, rate_type, applies_to
├── Sheet: "Accelerators"
│   └── Columns: plan_id, component_type, trigger_metric, trigger_threshold, payout_type, payout_value
├── Sheet: "RepMaster"
│   └── Columns: rep_id, full_name, role, region, hire_date, base_salary, quota, plan_id, active
└── Sheet: "Metadata"
    └── Key-value pairs for workbook version, data period, etc.
```

**Sheet: HistoricalPerformance**
- First row: Header (exact column names)
- Data starts row 2
- No merged cells
- No formulas (values only)
- Date format: YYYY-MM-DD or YYYY-QQ

**Sheet: CommissionTiers**
- Tiers must be contiguous (no gaps)
- tier_max of tier N should equal tier_min of tier N+1
- Sorted by plan_id, then tier_sequence

**Sheet: RepMaster**
- One row per rep
- rep_id must be unique
- All reps in HistoricalPerformance must exist here

---

### Output Excel Workbook Structure

**Generated Workbook Layout**:

```
Workbook: "SPM_Simulation_Results_[timestamp].xlsx"
├── Sheet: "ExecutiveSummary"
│   └── Key metrics, charts, risk summary
├── Sheet: "SummaryStatistics"
│   └── Detailed statistics table
├── Sheet: "RiskMetrics"
│   └── VaR, CVaR, probability tables
├── Sheet: "DistributionCharts"
│   └── Embedded histograms and box plots
├── Sheet: "SensitivityAnalysis"
│   └── Tornado chart and one-way sensitivity tables
├── Sheet: "IterationData" (optional)
│   └── Raw iteration-level results (large)
└── Sheet: "Configuration"
    └── Simulation parameters used
```

---

## Configuration Models

### 12. Simulation Configuration

**YAML Format**:
```yaml
# simulation_config.yaml
metadata:
  name: "FY25 Base Case Simulation"
  description: "Q1-Q4 projection with current plan structure"
  created_by: "analytics_team"
  created_date: "2024-11-20"

data_sources:
  historical_performance: "data/historical_2023-2024.xlsx"
  plan_structure: "data/fy25_plan.xlsx"
  rep_master: "data/rep_roster.xlsx"

simulation:
  iterations: 10000
  random_seed: 42
  sampling_method: "latin_hypercube"
  confidence_level: 0.95
  parallel: true
  n_jobs: -1

distributions:
  auto_fit: true
  goodness_of_fit_threshold: 0.05
  outlier_method: "iqr"
  outlier_action: "remove"

  # Override specific distributions
  overrides:
    quota_attainment_pct:
      type: "lognormal"
      params:
        mean: 0.05
        std: 0.25

correlation:
  enable: true
  minimum_significance: 0.05

risk:
  budget_target: 5000000
  var_confidence: 0.95

output:
  directory: "results/"
  formats: ["excel", "json", "html"]
  include_iteration_data: false
  chart_dpi: 300

logging:
  level: "INFO"
  file: "simulation.log"
```

---

## Validation Rules

### Data Validation Rules Engine

**Rule Types**:

1. **Schema Validation**:
   - Required columns present
   - Column data types match expected
   - No duplicate column names

2. **Domain Validation**:
   - Values within expected ranges
   - Categorical values from allowed list
   - Referential integrity (e.g., rep_id in HistoricalPerformance exists in RepMaster)

3. **Business Logic Validation**:
   - Commission tiers are contiguous
   - Quota attainment >= 0
   - Base salary > 0
   - Tier rates are sensible (warn if > 50%)

4. **Statistical Validation**:
   - Sufficient historical data (recommend 12+ periods)
   - Distribution fit quality (warn if p-value < 0.05)
   - Correlation matrix is positive semi-definite

**Validation Report Structure**:
```python
@dataclass
class ValidationReport:
    is_valid: bool
    errors: List[ValidationError]  # Blocking issues
    warnings: List[ValidationWarning]  # Non-blocking issues
    info: List[ValidationInfo]  # Informational messages

@dataclass
class ValidationError:
    severity: str = "ERROR"
    location: str  # e.g., "Sheet: HistoricalPerformance, Row: 45, Column: metric_value"
    message: str
    suggestion: str  # How to fix
```

**Example Validation Report**:
```
Validation Report: FAILED
Errors: 2
Warnings: 3

ERRORS:
[1] Sheet: CommissionTiers, Rows: 15-16
    Message: Tier gap detected. Tier 2 ends at 0.75, but Tier 3 starts at 0.80.
    Suggestion: Set tier_max of row 15 to 0.80, or tier_min of row 16 to 0.75.

[2] Sheet: RepMaster, Row: 23
    Message: rep_id "REP999" not found in HistoricalPerformance sheet.
    Suggestion: Add historical data for REP999 or remove from RepMaster.

WARNINGS:
[1] Sheet: HistoricalPerformance
    Message: Only 8 periods of data available for rep_id "REP045".
    Suggestion: 12+ periods recommended for robust distribution fitting.

[2] Distribution Fitting: quota_attainment_pct
    Message: Goodness-of-fit test p-value = 0.03 (< 0.05 threshold).
    Suggestion: Review fitted distribution or consider empirical distribution.

[3] Correlation Matrix
    Message: Strong negative correlation (-0.85) detected between win_rate and deal_size.
    Suggestion: Verify this relationship is expected.
```

---

## Data Transformation Pipeline

### Data Flow Transformations

```
Raw Excel Data
  ↓
[1] Load & Parse
  ↓
Pandas DataFrames
  ↓
[2] Validate & Clean
  ↓
Validated DataFrames
  ↓
[3] Pivot & Aggregate (historical metrics by rep/period)
  ↓
Time Series Arrays
  ↓
[4] Fit Distributions
  ↓
FittedDistribution Objects
  ↓
[5] Calculate Correlations
  ↓
Correlation Matrix
  ↓
[6] Sample (Monte Carlo iterations)
  ↓
Simulated Performance Arrays
  ↓
[7] Apply Compensation Rules
  ↓
Compensation Results
  ↓
[8] Aggregate & Analyze
  ↓
Summary Statistics, Risk Metrics
  ↓
[9] Generate Outputs
  ↓
Excel Reports, Charts, JSON
```

---

## Version Control & Metadata

**Data Versioning**:
Each simulation run should capture:
- Input data checksums (MD5/SHA256)
- Configuration file version
- Code version (git commit hash)
- Timestamp
- User/system information

**Reproducibility Record**:
```json
{
  "simulation_id": "sim_20241120_103045",
  "code_version": "1.2.3",
  "git_commit": "a3f5c9d",
  "input_data_checksums": {
    "historical": "5d41402abc4b2a76b9719d911017c592",
    "plan": "7d793037a0760186574b0282f2f435e7"
  },
  "config_file": "config_v3.yaml",
  "random_seed": 42,
  "execution_timestamp": "2024-11-20T10:30:45Z",
  "execution_duration_seconds": 127.3,
  "executed_by": "user@company.com",
  "system_info": {
    "python_version": "3.11.5",
    "numpy_version": "1.25.2",
    "pandas_version": "2.1.0"
  }
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Status**: Design Phase
