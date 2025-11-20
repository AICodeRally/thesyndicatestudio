# SPM Monte Carlo Tool - Examples & Templates

## Overview

This directory contains example data files, Jupyter notebooks, Python scripts, and configuration templates to help you get started with the SPM Monte Carlo simulation tool.

---

## Directory Structure

```
examples/
├── data/                           # Sample data files
│   ├── historical_performance.xlsx # Example historical data
│   ├── compensation_plan.xlsx      # Example comp plan
│   ├── rep_master.xlsx             # Example rep data
│   └── templates/                  # Empty templates
│       ├── historical_template.xlsx
│       ├── plan_template.xlsx
│       └── rep_master_template.xlsx
│
├── notebooks/                      # Jupyter notebooks
│   ├── 01_basic_simulation.ipynb
│   ├── 02_custom_distributions.ipynb
│   ├── 03_sensitivity_analysis.ipynb
│   ├── 04_scenario_comparison.ipynb
│   └── 05_advanced_analytics.ipynb
│
├── scripts/                        # Python scripts
│   ├── simple_simulation.py
│   ├── batch_simulations.py
│   ├── plan_comparison.py
│   └── generate_report.py
│
└── configs/                        # Configuration files
    ├── basic_config.yaml
    ├── advanced_config.yaml
    └── custom_distributions.yaml
```

---

## Quick Start

### 1. Basic Simulation

```python
from spm_monte_carlo import MonteCarloSimulator

# Load example data
sim = MonteCarloSimulator(seed=42)
results = sim.load_data('examples/data/historical_performance.xlsx') \
             .load_plan('examples/data/compensation_plan.xlsx') \
             .run(iterations=10000)

# View summary
print(results.summary())

# Export results
results.to_excel('output/my_first_simulation.xlsx')
```

---

## Sample Data Files

### 1. Historical Performance Data

**File:** `data/historical_performance.xlsx`

**Description:** 50 sales reps with 24 months of performance history (Jan 2023 - Dec 2024)

**Key Metrics:**
- Quota attainment: Mean = 95%, Std Dev = 15%
- Deal count: Mean = 10 deals/month
- Average deal size: $8,500

**Use Cases:**
- Basic simulation testing
- Learning the tool
- Validation of calculations

---

### 2. Compensation Plan

**File:** `data/compensation_plan.xlsx`

**Description:** Multi-tiered commission plan with bonuses and accelerators

**Plan Structure:**
```
Commission Tiers:
- 0-75% quota: 2.0% commission
- 75-100% quota: 3.0% commission
- 100-125% quota: 4.5% commission (accelerator)
- 125%+ quota: 6.0% commission (super accelerator)

Bonuses:
- 100% Club: $5,000 quarterly bonus for hitting quota
- President's Club: $10,000 annual bonus for 110%+ average

SPIFs:
- Q1 Cloud Push: $2,500 for 10+ cloud deals
```

---

### 3. Rep Master Data

**File:** `data/rep_master.xlsx`

**Description:** Rep attributes, territories, and quotas

**Segments:**
- 25 Enterprise reps (quota: $150k/month)
- 25 SMB reps (quota: $75k/month)

**Territories:**
- WEST, EAST, CENTRAL, SOUTH (distributed evenly)

---

## Templates

### Empty Templates for Your Data

Located in `data/templates/`, these are blank Excel files with:
- Correct column headers
- Data validation rules
- Helper notes
- Example rows (can be deleted)

**Usage:**
1. Copy template to your working directory
2. Fill in your data
3. Delete example rows
4. Save and use with the tool

---

## Jupyter Notebooks

### Notebook 1: Basic Simulation

**File:** `notebooks/01_basic_simulation.ipynb`

**Topics Covered:**
- Loading data from Excel
- Running a simple Monte Carlo simulation
- Understanding the results
- Generating summary statistics
- Creating basic visualizations

**Learning Objectives:**
- Understand the simulation workflow
- Interpret percentile outputs
- Calculate risk metrics (VaR, CVaR)
- Export results to Excel

**Time:** 15-20 minutes

---

### Notebook 2: Custom Distributions

**File:** `notebooks/02_custom_distributions.ipynb`

**Topics Covered:**
- Automatic distribution fitting
- Manual distribution specification
- Goodness-of-fit testing
- Comparing different distributions
- Handling outliers

**Learning Objectives:**
- Fit probability distributions to data
- Evaluate distribution fit quality
- Override auto-fitted distributions
- Use custom distribution parameters

**Time:** 20-25 minutes

---

### Notebook 3: Sensitivity Analysis

**File:** `notebooks/03_sensitivity_analysis.ipynb`

**Topics Covered:**
- Tornado charts
- Variable importance ranking
- Correlation analysis
- What-if scenarios
- Parameter sweeps

**Learning Objectives:**
- Identify key drivers of compensation variability
- Understand input-output relationships
- Test parameter sensitivity
- Create tornado charts

**Time:** 25-30 minutes

---

### Notebook 4: Scenario Comparison

**File:** `notebooks/04_scenario_comparison.ipynb`

**Topics Covered:**
- Comparing multiple compensation plans
- Side-by-side analysis
- Cost vs. performance trade-offs
- Plan optimization insights

**Learning Objectives:**
- Compare current vs. proposed plans
- Quantify financial impact of plan changes
- Evaluate risk differences
- Make data-driven plan decisions

**Time:** 30-35 minutes

---

### Notebook 5: Advanced Analytics

**File:** `notebooks/05_advanced_analytics.ipynb`

**Topics Covered:**
- Per-rep analysis
- Cohort comparisons (territory, segment, tenure)
- Budget planning and forecasting
- Custom analytics and metrics
- Integration with other tools

**Learning Objectives:**
- Perform granular rep-level analysis
- Compare performance across segments
- Build custom analytics pipelines
- Export for further analysis

**Time:** 35-40 minutes

---

## Python Scripts

### Script 1: Simple Simulation

**File:** `scripts/simple_simulation.py`

**Purpose:** Minimal working example

```python
#!/usr/bin/env python3
"""
Simple Monte Carlo simulation example.

Usage:
    python simple_simulation.py
"""

from spm_monte_carlo import MonteCarloSimulator

def main():
    # Initialize simulator
    sim = MonteCarloSimulator(seed=42, parallel=True)

    # Load data
    print("Loading data...")
    sim.load_data('../data/historical_performance.xlsx')
    sim.load_plan('../data/compensation_plan.xlsx')

    # Run simulation
    print("Running simulation with 10,000 iterations...")
    results = sim.run(iterations=10000)

    # Display summary
    print("\nSimulation Results:")
    print(results.summary())

    # Calculate risk metrics
    print(f"\nValue at Risk (95%): ${results.var(0.95):,.0f}")
    print(f"Expected Total Payout: ${results.summary_stats['mean']['total_payout']:,.0f}")

    # Export
    print("\nExporting results...")
    results.to_excel('output/simulation_results.xlsx')
    print("Done!")

if __name__ == '__main__':
    main()
```

---

### Script 2: Batch Simulations

**File:** `scripts/batch_simulations.py`

**Purpose:** Run multiple simulations with different parameters

```python
#!/usr/bin/env python3
"""
Batch simulation runner for parameter sweeps.

Usage:
    python batch_simulations.py
"""

from spm_monte_carlo import MonteCarloSimulator
import pandas as pd

def run_batch_simulations():
    """Run simulations with different iteration counts."""

    iteration_counts = [1000, 5000, 10000, 50000]
    results_summary = []

    for n_iter in iteration_counts:
        print(f"Running {n_iter} iterations...")

        sim = MonteCarloSimulator(seed=42)
        sim.load_data('../data/historical_performance.xlsx')
        sim.load_plan('../data/compensation_plan.xlsx')

        results = sim.run(iterations=n_iter)

        results_summary.append({
            'iterations': n_iter,
            'mean_payout': results.summary_stats['mean']['total_payout'],
            'var_95': results.var(0.95),
            'cvar_95': results.cvar(0.95)
        })

    # Compare results
    df = pd.DataFrame(results_summary)
    print("\nBatch Simulation Results:")
    print(df)

    df.to_excel('output/batch_results.xlsx', index=False)

if __name__ == '__main__':
    run_batch_simulations()
```

---

### Script 3: Plan Comparison

**File:** `scripts/plan_comparison.py`

**Purpose:** Compare multiple compensation plans

```python
#!/usr/bin/env python3
"""
Compare multiple compensation plan scenarios.

Usage:
    python plan_comparison.py plan1.xlsx plan2.xlsx plan3.xlsx
"""

import sys
from spm_monte_carlo import MonteCarloSimulator
import pandas as pd

def compare_plans(plan_files):
    """Compare multiple plans against same historical data."""

    data_file = '../data/historical_performance.xlsx'
    comparison_results = []

    for plan_file in plan_files:
        print(f"Simulating {plan_file}...")

        sim = MonteCarloSimulator(seed=42)
        sim.load_data(data_file)
        sim.load_plan(plan_file)

        results = sim.run(iterations=10000)

        comparison_results.append({
            'plan': plan_file,
            'mean_payout': results.summary_stats['mean']['total_payout'],
            'median_payout': results.summary_stats['median']['total_payout'],
            'std_dev': results.summary_stats['std']['total_payout'],
            'var_95': results.var(0.95),
            'prob_exceed_budget': results.prob_exceed(1_300_000)
        })

    # Display comparison
    df = pd.DataFrame(comparison_results)
    print("\nPlan Comparison:")
    print(df)

    df.to_excel('output/plan_comparison.xlsx', index=False)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python plan_comparison.py plan1.xlsx plan2.xlsx ...")
        sys.exit(1)

    compare_plans(sys.argv[1:])
```

---

### Script 4: Generate Report

**File:** `scripts/generate_report.py`

**Purpose:** Generate comprehensive analysis report

```python
#!/usr/bin/env python3
"""
Generate comprehensive simulation report with charts.

Usage:
    python generate_report.py
"""

from spm_monte_carlo import MonteCarloSimulator
import matplotlib.pyplot as plt

def generate_report():
    """Create full analysis report."""

    # Run simulation
    print("Running simulation...")
    sim = MonteCarloSimulator(seed=42, parallel=True)
    results = sim.load_data('../data/historical_performance.xlsx') \
                 .load_plan('../data/compensation_plan.xlsx') \
                 .run(iterations=10000)

    # Export Excel
    print("Generating Excel report...")
    results.to_excel('output/full_report.xlsx', include_charts=True)

    # Generate charts
    print("Creating visualizations...")

    # Distribution plot
    plt.figure(figsize=(10, 6))
    results.plot_distribution('total_payout')
    plt.savefig('output/distribution_plot.png', dpi=300, bbox_inches='tight')
    plt.close()

    # Tornado chart
    plt.figure(figsize=(10, 8))
    results.plot_tornado(top_n=10)
    plt.savefig('output/tornado_chart.png', dpi=300, bbox_inches='tight')
    plt.close()

    # CDF plot
    plt.figure(figsize=(10, 6))
    results.plot_cdf('total_payout')
    plt.savefig('output/cdf_plot.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("Report generation complete!")
    print("Files created:")
    print("  - output/full_report.xlsx")
    print("  - output/distribution_plot.png")
    print("  - output/tornado_chart.png")
    print("  - output/cdf_plot.png")

if __name__ == '__main__':
    generate_report()
```

---

## Configuration Files

### Basic Configuration

**File:** `configs/basic_config.yaml`

```yaml
# Basic simulation configuration
simulation:
  iterations: 10000
  seed: 42
  parallel: true

data:
  historical_file: ../data/historical_performance.xlsx
  plan_file: ../data/compensation_plan.xlsx

distributions:
  auto_fit: true

output:
  directory: output/
  format: excel
  percentiles: [5, 25, 50, 75, 95, 99]
```

**Usage:**
```bash
spm-mc run --config configs/basic_config.yaml
```

---

### Advanced Configuration

**File:** `configs/advanced_config.yaml`

```yaml
simulation:
  iterations: 50000
  seed: 42
  sampling_strategy: lhs  # Latin Hypercube Sampling
  parallel: true
  workers: 8

data:
  historical_file: ../data/historical_performance.xlsx
  plan_file: ../data/compensation_plan.xlsx
  rep_master_file: ../data/rep_master.xlsx

distributions:
  auto_fit: true
  test_goodness_of_fit: true
  preferred_distributions:
    - normal
    - lognormal
    - gamma
    - beta

correlations:
  auto_detect: true
  min_correlation: 0.25

output:
  directory: output/advanced/
  format: excel
  include_scenarios: true
  include_charts: true
  percentiles: [1, 5, 10, 25, 50, 75, 90, 95, 99]

analysis:
  sensitivity_analysis: true
  risk_metrics: true
  per_rep_analysis: true
  budget_threshold: 1300000

logging:
  level: INFO
  file: simulation.log
```

---

### Custom Distributions Configuration

**File:** `configs/custom_distributions.yaml`

```yaml
simulation:
  iterations: 10000
  seed: 42

data:
  historical_file: ../data/historical_performance.xlsx
  plan_file: ../data/compensation_plan.xlsx

distributions:
  auto_fit: false
  manual_overrides:
    quota_attainment:
      type: beta
      params:
        a: 5
        b: 2
        loc: 0.5
        scale: 0.5

    deal_count:
      type: gamma
      params:
        a: 5.2
        loc: 0
        scale: 2.1

    avg_deal_size:
      type: lognormal
      params:
        s: 0.5
        loc: 0
        scale: 8500

output:
  directory: output/custom_dist/
```

---

## Common Use Cases

### Use Case 1: Budget Planning

**Goal:** Estimate compensation budget with confidence intervals

**Approach:**
1. Load historical performance data
2. Run simulation with 10,000+ iterations
3. Extract percentiles (50th, 95th, 99th)
4. Set budget at 95th percentile for 95% confidence

**Notebook:** `01_basic_simulation.ipynb`

---

### Use Case 2: Plan Redesign

**Goal:** Compare current plan vs. proposed modifications

**Approach:**
1. Create two plan files (current and proposed)
2. Run simulations on same historical data
3. Compare mean payout, variance, and risk metrics
4. Assess cost-benefit trade-offs

**Script:** `scripts/plan_comparison.py`

---

### Use Case 3: Risk Assessment

**Goal:** Understand compensation variability and tail risk

**Approach:**
1. Run simulation with large iteration count
2. Calculate VaR and CVaR at various confidence levels
3. Analyze probability of exceeding budget
4. Generate tornado chart for key drivers

**Notebook:** `03_sensitivity_analysis.ipynb`

---

### Use Case 4: Rep Segmentation

**Goal:** Analyze compensation by rep segment (territory, role, etc.)

**Approach:**
1. Include rep master data with segment attributes
2. Run full simulation
3. Group results by segment
4. Compare distributions across groups

**Notebook:** `05_advanced_analytics.ipynb`

---

## Tips & Best Practices

### Data Quality
- Ensure at least 12 months of historical data per rep
- Check for and handle outliers
- Validate data before running large simulations

### Iteration Count
- 1,000 iterations: Quick testing
- 10,000 iterations: Standard analysis
- 50,000+ iterations: High precision / critical decisions

### Sampling Strategy
- Monte Carlo: General purpose, most common
- Latin Hypercube: More efficient, fewer iterations needed
- Quasi-Random: Best for high-dimensional problems

### Performance
- Enable parallel processing for large simulations
- Use batch processing for very large datasets
- Monitor memory usage with 100k+ iterations

---

## Getting Help

### Resources
- Main README: `../README.md`
- Architecture: `../docs/ARCHITECTURE.md`
- API Documentation: `../docs/API_DESIGN.md`
- Data Models: `../docs/DATA_MODELS.md`

### Support
- GitHub Issues: [Report bugs or request features]
- Documentation: [Full API reference]

---

## Next Steps

1. Start with `notebooks/01_basic_simulation.ipynb`
2. Try running `scripts/simple_simulation.py`
3. Experiment with your own data using templates
4. Explore advanced features in later notebooks
5. Customize configurations for your use case

Happy simulating!
