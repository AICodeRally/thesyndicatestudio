# SPM Monte Carlo Tool - Data Models

## Overview

This document defines the data schemas, validation rules, and file formats for the SPM Monte Carlo simulation tool.

---

## Input Data Models

The system expects three primary input files:

1. **Historical Performance Data** - Past sales rep performance
2. **Compensation Plan Definition** - Rules and structure for comp calculations
3. **Rep Master Data** - Sales rep attributes and segments

---

## 1. Historical Performance Data

### Excel Template: `historical_performance.xlsx`

#### Sheet: "Performance"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| rep_id | String | Yes | Unique representative identifier | "REP001" |
| period | Date/String | Yes | Time period (YYYY-MM or YYYY-Qn) | "2024-01" or "2024-Q1" |
| quota | Decimal | Yes | Assigned sales quota | 100000.00 |
| actual_sales | Decimal | Yes | Actual sales achieved | 95000.00 |
| quota_attainment | Decimal | No | % of quota achieved (auto-calc if missing) | 0.95 |
| deal_count | Integer | No | Number of deals closed | 12 |
| avg_deal_size | Decimal | No | Average deal size | 7916.67 |
| territory | String | No | Territory identifier | "WEST" |
| segment | String | No | Customer segment | "ENTERPRISE" |
| product_line | String | No | Primary product line | "CLOUD" |

#### Validation Rules:
- `rep_id`: Non-empty, max 50 characters
- `period`: Valid date format or Q1-Q4 format
- `quota`: Positive number
- `actual_sales`: Non-negative number
- `quota_attainment`: If present, must match `actual_sales / quota`
- No duplicate `(rep_id, period)` combinations

#### Minimum Data Requirements:
- At least 12 periods per rep (1 year monthly or 4 quarters)
- At least 10 reps for meaningful statistical analysis
- Recommended: 24+ periods for robust distribution fitting

---

## 2. Compensation Plan Definition

### Excel Template: `compensation_plan.xlsx`

#### Sheet: "Plan_Overview"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| plan_id | String | Yes | Unique plan identifier | "PLAN_2024_SALES" |
| plan_name | String | Yes | Descriptive plan name | "2024 Sales Commission" |
| effective_date | Date | Yes | Plan start date | "2024-01-01" |
| end_date | Date | No | Plan end date | "2024-12-31" |
| frequency | String | Yes | Payout frequency (monthly, quarterly, annual) | "monthly" |
| target_incentive | Decimal | No | Target total incentive at 100% quota | 50000.00 |

#### Sheet: "Commission_Tiers"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| plan_id | String | Yes | Links to Plan_Overview | "PLAN_2024_SALES" |
| tier_name | String | Yes | Tier identifier | "Tier 1" |
| quota_min | Decimal | Yes | Minimum quota % for tier | 0.00 |
| quota_max | Decimal | Yes | Maximum quota % for tier | 0.75 |
| rate_type | String | Yes | "percentage" or "flat" | "percentage" |
| rate_value | Decimal | Yes | Commission rate | 0.02 (2%) |
| applies_to | String | Yes | "quota" or "total_sales" | "total_sales" |

**Example Tiered Structure:**
| Tier | Quota Min | Quota Max | Rate | Applies To |
|------|-----------|-----------|------|------------|
| 1 | 0% | 75% | 2.0% | total_sales |
| 2 | 75% | 100% | 3.0% | total_sales |
| 3 | 100% | 125% | 4.5% | total_sales |
| 4 | 125% | 999% | 6.0% | total_sales |

#### Sheet: "Bonuses"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| plan_id | String | Yes | Links to Plan_Overview | "PLAN_2024_SALES" |
| bonus_name | String | Yes | Bonus identifier | "Quarterly Accelerator" |
| trigger_type | String | Yes | "quota_threshold" or "metric_threshold" | "quota_threshold" |
| trigger_metric | String | Yes | Metric name | "quota_attainment" |
| trigger_value | Decimal | Yes | Threshold value | 1.0 (100%) |
| trigger_condition | String | Yes | ">", ">=", "<", "<=", "==" | ">=" |
| payout_type | String | Yes | "flat" or "formula" | "flat" |
| payout_value | Decimal/String | Yes | Amount or formula | 5000.00 |
| frequency | String | Yes | "monthly", "quarterly", "annual" | "quarterly" |

#### Sheet: "SPIFs" (Sales Performance Incentive Funds)

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| spif_id | String | Yes | SPIF identifier | "SPIF_Q1_CLOUD" |
| spif_name | String | Yes | Descriptive name | "Q1 Cloud Product Push" |
| start_date | Date | Yes | SPIF start date | "2024-01-01" |
| end_date | Date | Yes | SPIF end date | "2024-03-31" |
| metric | String | Yes | Metric to measure | "cloud_sales" |
| target | Decimal | Yes | Target value | 50000.00 |
| payout | Decimal | Yes | Payout amount | 2500.00 |
| eligible_reps | String | No | Comma-separated rep_ids or "ALL" | "ALL" |

#### Validation Rules:
- All `plan_id` in sub-sheets must exist in Plan_Overview
- Commission tiers must not have gaps or overlaps
- `quota_min` < `quota_max` for each tier
- Tier ranges must cover 0% to at least 200% quota
- Bonus trigger_metric must be a valid field name
- Date ranges must be valid (start < end)

---

## 3. Rep Master Data

### Excel Template: `rep_master.xlsx`

#### Sheet: "Reps"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| rep_id | String | Yes | Unique representative identifier | "REP001" |
| rep_name | String | No | Representative name (optional for privacy) | "John Doe" |
| hire_date | Date | No | Hire date | "2020-06-15" |
| tenure_years | Decimal | No | Years of tenure | 3.5 |
| territory | String | No | Territory assignment | "WEST" |
| segment | String | No | Customer segment focus | "ENTERPRISE" |
| role | String | No | Sales role | "AE" (Account Executive) |
| manager_id | String | No | Manager rep_id | "MGR001" |
| quota_current | Decimal | Yes | Current period quota | 100000.00 |
| plan_id | String | Yes | Assigned comp plan | "PLAN_2024_SALES" |
| cost_center | String | No | Cost center code | "CC-SALES-01" |

#### Validation Rules:
- `rep_id`: Unique, non-empty
- `plan_id`: Must exist in Compensation Plan
- `quota_current`: Positive number
- `tenure_years`: Non-negative
- All `rep_id` values must have corresponding historical performance data

---

## Distribution Configuration

### Excel Template: `distribution_config.xlsx` (Optional)

Allows users to manually specify distributions instead of auto-fitting.

#### Sheet: "Distributions"

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| variable_name | String | Yes | Variable to model | "quota_attainment" |
| distribution_type | String | Yes | Distribution family | "normal" |
| param1_name | String | Yes | First parameter name | "loc" (mean) |
| param1_value | Decimal | Yes | First parameter value | 0.95 |
| param2_name | String | No | Second parameter name | "scale" (std dev) |
| param2_value | Decimal | No | Second parameter value | 0.15 |
| param3_name | String | No | Third parameter name | - |
| param3_value | Decimal | No | Third parameter value | - |

**Supported Distribution Types:**
- `normal` - Parameters: loc (mean), scale (std dev)
- `lognormal` - Parameters: s (shape), loc, scale
- `gamma` - Parameters: a (shape), loc, scale
- `beta` - Parameters: a, b, loc, scale
- `uniform` - Parameters: loc (min), scale (range)
- `triangular` - Parameters: c (mode), loc (min), scale (range)

---

## Correlation Matrix (Optional)

### Excel Template: `correlation_matrix.xlsx`

#### Sheet: "Correlations"

|  | quota_attainment | deal_count | avg_deal_size |
|--|------------------|------------|---------------|
| quota_attainment | 1.00 | 0.65 | 0.40 |
| deal_count | 0.65 | 1.00 | -0.30 |
| avg_deal_size | 0.40 | -0.30 | 1.00 |

- Must be symmetric
- Diagonal must be 1.0
- Values must be between -1 and 1
- Must be positive semi-definite

---

## Output Data Models

### 1. Simulation Results

#### File: `simulation_results.xlsx`

##### Sheet: "Summary_Statistics"

| Metric | Mean | Median | Std Dev | 5th Pct | 25th Pct | 75th Pct | 95th Pct | 99th Pct |
|--------|------|--------|---------|---------|----------|----------|----------|----------|
| Total Payout | 1,250,000 | 1,235,000 | 125,000 | 1,050,000 | 1,180,000 | 1,320,000 | 1,480,000 | 1,550,000 |
| Commission | 950,000 | 945,000 | 95,000 | 800,000 | 895,000 | 1,005,000 | 1,120,000 | 1,180,000 |
| Bonuses | 300,000 | 290,000 | 45,000 | 235,000 | 270,000 | 330,000 | 385,000 | 410,000 |
| Per Rep Avg | 25,000 | 24,700 | 2,500 | 21,000 | 23,600 | 26,400 | 29,600 | 31,000 |

##### Sheet: "Risk_Metrics"

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Budget | 1,300,000 | Planned budget |
| Expected Payout | 1,250,000 | Mean simulation result |
| VaR 95% | 1,480,000 | 95% confident payout won't exceed |
| VaR 99% | 1,550,000 | 99% confident payout won't exceed |
| CVaR 95% | 1,510,000 | Expected payout if exceeding VaR95 |
| P(Exceed Budget) | 0.18 | 18% chance of exceeding budget |
| Budget Cushion | 50,000 | Expected budget - actual |
| Coefficient of Variation | 0.10 | Std dev / Mean (risk ratio) |

##### Sheet: "Sensitivity_Analysis"

| Input Variable | Correlation with Output | Tornado Chart Rank |
|----------------|--------------------------|-------------------|
| quota_attainment | 0.92 | 1 |
| deal_count | 0.45 | 2 |
| avg_deal_size | 0.38 | 3 |
| territory | 0.15 | 4 |

##### Sheet: "Scenario_Details"

| Scenario # | Total Payout | Commission | Bonuses | SPIFs | Quota Attainment Avg |
|------------|--------------|------------|---------|-------|---------------------|
| 1 | 1,245,000 | 945,000 | 295,000 | 5,000 | 0.96 |
| 2 | 1,198,000 | 920,000 | 273,000 | 5,000 | 0.91 |
| ... | ... | ... | ... | ... | ... |

##### Sheet: "Per_Rep_Results"

| Rep ID | Mean Payout | Median Payout | Std Dev | 5th Pct | 95th Pct | P(>Target) |
|--------|-------------|---------------|---------|---------|----------|------------|
| REP001 | 28,500 | 28,200 | 3,200 | 23,000 | 33,500 | 0.72 |
| REP002 | 22,100 | 21,800 | 2,500 | 18,500 | 26,200 | 0.55 |
| ... | ... | ... | ... | ... | ... | ... |

##### Sheet: "Distribution_Parameters"

| Variable | Distribution Type | Param 1 | Param 2 | Param 3 | Goodness of Fit (p-value) |
|----------|-------------------|---------|---------|---------|---------------------------|
| quota_attainment | normal | μ=0.95 | σ=0.15 | - | 0.42 (good) |
| deal_count | gamma | α=5.2 | β=2.1 | - | 0.38 (good) |
| avg_deal_size | lognormal | μ=9.8 | σ=0.5 | - | 0.55 (good) |

---

### 2. Visualization Outputs

#### Files Generated:
- `distribution_histogram.png` - Histogram of total payout with fitted curve
- `boxplot_by_scenario.png` - Box plots comparing scenarios
- `tornado_chart.png` - Sensitivity analysis tornado chart
- `cdf_plot.png` - Cumulative distribution function with percentile markers
- `correlation_heatmap.png` - Heatmap of input variable correlations

---

## Data Validation Framework

### Validation Levels

#### Level 1: Schema Validation
- Column names match expected schema
- Data types are correct
- Required fields are present
- No extra unexpected columns (warning only)

#### Level 2: Business Rule Validation
- Numeric ranges are sensible (quota > 0, attainment >= 0)
- Dates are in valid ranges
- Foreign key relationships exist (rep_id, plan_id)
- No duplicate keys

#### Level 3: Statistical Validation
- Sufficient data for analysis (min 12 periods)
- No excessive missing data (>20% nulls)
- Outliers flagged for review (>3 std dev)
- Distribution fit quality (p-value > 0.05)

### Validation Output

#### File: `validation_report.txt`

```
Data Validation Report
======================
Generated: 2024-11-20 10:30:00

File: historical_performance.xlsx
Status: PASSED with warnings

Schema Validation: PASSED
- All required columns present
- Data types correct

Business Rule Validation: PASSED
- 50 reps with valid rep_id
- 24 periods per rep
- No duplicate (rep_id, period) combinations
- All quota values > 0

Statistical Validation: PASSED with warnings
- Sufficient data for analysis
- 3 outliers detected in quota_attainment (flagged for review)
  - REP015, 2023-03: 2.45 (245% quota)
  - REP032, 2023-07: 0.05 (5% quota - possible data error?)
  - REP041, 2023-11: 2.89 (289% quota)
- Recommendation: Review outliers before proceeding

File: compensation_plan.xlsx
Status: PASSED

File: rep_master.xlsx
Status: PASSED
```

---

## Data Quality Recommendations

### Historical Performance Data
- **Minimum:** 12 months of data per rep
- **Recommended:** 24+ months for robust distribution fitting
- **Ideal:** 36+ months to capture seasonal patterns and trends

### Missing Data Handling
- **quota_attainment:** Calculate from actual_sales / quota
- **deal_count, avg_deal_size:** Optional - flag if missing, exclude from correlation analysis
- **quota:** Required - cannot proceed without
- **actual_sales:** Required - cannot proceed without

### Outlier Treatment Options
1. **Keep:** Include outliers (realistic rare events)
2. **Cap:** Cap at 3 std dev from mean
3. **Remove:** Exclude from distribution fitting
4. **Transform:** Apply log transformation

---

## Example Data Snippets

### Historical Performance (CSV format)
```csv
rep_id,period,quota,actual_sales,quota_attainment,deal_count,avg_deal_size,territory,segment
REP001,2023-01,100000,95000,0.95,12,7916.67,WEST,ENTERPRISE
REP001,2023-02,100000,108000,1.08,15,7200.00,WEST,ENTERPRISE
REP001,2023-03,100000,87000,0.87,10,8700.00,WEST,ENTERPRISE
REP002,2023-01,75000,82000,1.09,20,4100.00,EAST,SMB
REP002,2023-02,75000,71000,0.95,18,3944.44,EAST,SMB
```

### Compensation Plan (YAML format - alternative to Excel)
```yaml
plan_overview:
  plan_id: PLAN_2024_SALES
  plan_name: "2024 Sales Commission Plan"
  effective_date: 2024-01-01
  frequency: monthly
  target_incentive: 50000

commission_tiers:
  - tier_name: "Tier 1"
    quota_min: 0.00
    quota_max: 0.75
    rate_type: percentage
    rate_value: 0.02
    applies_to: total_sales

  - tier_name: "Tier 2"
    quota_min: 0.75
    quota_max: 1.00
    rate_type: percentage
    rate_value: 0.03
    applies_to: total_sales

  - tier_name: "Tier 3"
    quota_min: 1.00
    quota_max: 1.25
    rate_type: percentage
    rate_value: 0.045
    applies_to: total_sales

  - tier_name: "Tier 4"
    quota_min: 1.25
    quota_max: 9.99
    rate_type: percentage
    rate_value: 0.06
    applies_to: total_sales

bonuses:
  - bonus_name: "100% Club Bonus"
    trigger_type: quota_threshold
    trigger_metric: quota_attainment
    trigger_value: 1.00
    trigger_condition: ">="
    payout_type: flat
    payout_value: 5000
    frequency: quarterly
```

---

## JSON Schema (for programmatic validation)

```json
{
  "historical_performance": {
    "type": "object",
    "required": ["rep_id", "period", "quota", "actual_sales"],
    "properties": {
      "rep_id": {"type": "string", "maxLength": 50},
      "period": {"type": "string", "pattern": "^\\d{4}-(0[1-9]|1[0-2])$|^\\d{4}-Q[1-4]$"},
      "quota": {"type": "number", "minimum": 0, "exclusiveMinimum": true},
      "actual_sales": {"type": "number", "minimum": 0},
      "quota_attainment": {"type": "number", "minimum": 0},
      "deal_count": {"type": "integer", "minimum": 0},
      "avg_deal_size": {"type": "number", "minimum": 0},
      "territory": {"type": "string"},
      "segment": {"type": "string"},
      "product_line": {"type": "string"}
    }
  }
}
```

---

## Conclusion

These data models provide a comprehensive, flexible framework for SPM Monte Carlo analysis. The validation framework ensures data quality, while the output models deliver actionable insights for compensation planning and risk management.
