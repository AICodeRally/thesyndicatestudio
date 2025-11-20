# Examples Directory

This directory will contain example data files, notebooks, and usage scenarios for the SPM Monte Carlo simulation tool.

## Planned Structure

```
examples/
├── README.md                       # This file
│
├── data/                           # Sample data files
│   ├── basic_scenario/
│   │   ├── historical_data.xlsx    # Simple historical performance
│   │   ├── plan_structure.xlsx     # Basic tiered plan
│   │   └── rep_master.xlsx         # Representative roster
│   │
│   ├── complex_scenario/
│   │   ├── historical_data.xlsx    # Multiple roles, regions
│   │   ├── plan_structure.xlsx     # Complex matrix plan
│   │   └── rep_master.xlsx         # Large sales team
│   │
│   └── templates/
│       ├── historical_data_template.xlsx  # Empty template with headers
│       └── plan_structure_template.xlsx   # Empty template with headers
│
├── notebooks/                      # Jupyter notebooks
│   ├── 01_basic_usage.ipynb        # Getting started tutorial
│   ├── 02_distribution_analysis.ipynb  # Understanding distributions
│   ├── 03_scenario_comparison.ipynb    # Comparing plan alternatives
│   ├── 04_sensitivity_analysis.ipynb   # Identifying key drivers
│   └── 05_custom_distributions.ipynb   # Advanced customization
│
├── scripts/                        # Example Python scripts
│   ├── basic_simulation.py         # Simplest possible example
│   ├── batch_simulations.py        # Running multiple scenarios
│   ├── custom_reports.py           # Generating custom outputs
│   └── api_integration.py          # Integration with other systems
│
└── configs/                        # Example configuration files
    ├── basic_config.yaml
    ├── high_accuracy_config.yaml   # High iteration count
    └── quick_test_config.yaml      # Fast execution for testing
```

## Example Scenarios

### 1. Basic Scenario

**Use Case**: Simple quota-based compensation plan

**Data Characteristics**:
- 10 sales representatives
- 12 months of historical data
- Single role (Account Executive)
- 3-tier commission structure
- No accelerators or bonuses

**Files**:
- `data/basic_scenario/historical_data.xlsx`
- `data/basic_scenario/plan_structure.xlsx`
- `data/basic_scenario/rep_master.xlsx`

**Expected Outcomes**:
- Total compensation: $1.2M - $1.5M (95% CI)
- Mean quota attainment: 95%
- Clear tiered distribution in results

---

### 2. Complex Scenario

**Use Case**: Multi-role, multi-region sales organization

**Data Characteristics**:
- 100 sales representatives
- 24 months of historical data
- 5 roles (SDR, AE-MM, AE-Enterprise, Manager, Director)
- 4 regions (AMER, EMEA, APAC, LATAM)
- Complex plan with accelerators, bonuses, and SPIFs
- Role-based and team-based components

**Files**:
- `data/complex_scenario/historical_data.xlsx`
- `data/complex_scenario/plan_structure.xlsx`
- `data/complex_scenario/rep_master.xlsx`

**Expected Outcomes**:
- Total compensation: $15M - $20M (95% CI)
- Regional variance analysis
- Role-based performance distributions

---

### 3. Scenario Comparison

**Use Case**: Compare current plan vs. proposed changes

**Scenarios**:
- **Scenario A (Current)**: 3-tier structure, accelerator at 120%
- **Scenario B (Proposed)**: 4-tier structure, accelerator at 110%
- **Scenario C (Alternative)**: Flatter tiers, higher base commission

**Analysis**:
- Expected cost difference
- Impact on top/middle/bottom performers
- Risk profile changes

---

## Jupyter Notebooks

### Notebook 1: Basic Usage (`01_basic_usage.ipynb`)

**Topics Covered**:
1. Installing dependencies
2. Loading sample data
3. Running a basic simulation
4. Interpreting results
5. Generating a simple report

**Code Outline**:
```python
# 1. Setup
from spm_monte_carlo import MonteCarloSimulator

# 2. Load data
simulator = MonteCarloSimulator()
simulator.load_data('data/basic_scenario/historical_data.xlsx',
                    'data/basic_scenario/plan_structure.xlsx')

# 3. Configure and run
simulator.configure(iterations=10000, seed=42)
results = simulator.run()

# 4. View results
print(results.summary_statistics())
results.plot_distributions()

# 5. Export
results.export('output/basic_results.xlsx')
```

---

### Notebook 2: Distribution Analysis (`02_distribution_analysis.ipynb`)

**Topics Covered**:
1. Understanding performance distributions
2. Fitting distributions to historical data
3. Goodness-of-fit testing
4. Comparing different distribution types
5. Manual distribution override

**Visualizations**:
- Histograms with fitted distributions
- Q-Q plots
- Goodness-of-fit comparison table
- Impact of distribution choice on outcomes

---

### Notebook 3: Scenario Comparison (`03_scenario_comparison.ipynb`)

**Topics Covered**:
1. Setting up multiple scenarios
2. Running parallel simulations
3. Side-by-side comparison
4. Identifying trade-offs
5. Stakeholder presentation

**Visualizations**:
- Overlaid distribution plots
- Cost comparison charts
- Winner/loser analysis
- Risk comparison (VaR, CVaR)

---

### Notebook 4: Sensitivity Analysis (`04_sensitivity_analysis.ipynb`)

**Topics Covered**:
1. One-way sensitivity analysis
2. Tornado charts
3. Identifying key drivers
4. Monte Carlo sensitivity (varying distributions)
5. Action recommendations

**Outputs**:
- Tornado chart of key variables
- Elasticity table
- "What-if" scenarios
- Priority ranking for plan design

---

### Notebook 5: Custom Distributions (`05_custom_distributions.ipynb`)

**Topics Covered**:
1. When to use custom distributions
2. Empirical distributions from data
3. Mixture models
4. Truncated distributions
5. Expert judgment incorporation

**Advanced Topics**:
- Copula methods for complex correlations
- Time-varying distributions
- Regime-switching models

---

## Python Scripts

### Script 1: Basic Simulation (`basic_simulation.py`)

**Purpose**: Minimal working example

```python
#!/usr/bin/env python3
"""
Basic SPM Monte Carlo Simulation Example

Usage:
    python basic_simulation.py
"""

from spm_monte_carlo import MonteCarloSimulator

def main():
    # Initialize
    simulator = MonteCarloSimulator()

    # Load data
    print("Loading data...")
    simulator.load_data(
        historical_file='data/basic_scenario/historical_data.xlsx',
        plan_file='data/basic_scenario/plan_structure.xlsx',
        rep_file='data/basic_scenario/rep_master.xlsx'
    )

    # Configure simulation
    print("Configuring simulation...")
    simulator.configure(
        iterations=10000,
        seed=42,
        parallel=True
    )

    # Run
    print("Running simulation...")
    results = simulator.run()

    # Display summary
    print("\n" + "="*60)
    print("SIMULATION RESULTS")
    print("="*60)
    print(f"Total Compensation:")
    print(f"  Mean:   ${results.mean:,.0f}")
    print(f"  Median: ${results.median:,.0f}")
    print(f"  Std:    ${results.std_dev:,.0f}")
    print(f"  95% CI: [${results.ci_lower:,.0f}, ${results.ci_upper:,.0f}]")
    print()
    print(f"Risk Metrics:")
    print(f"  VaR (95%):  ${results.var_95:,.0f}")
    print(f"  CVaR (95%): ${results.cvar_95:,.0f}")
    print()

    # Export
    output_file = 'output/basic_simulation_results.xlsx'
    print(f"Exporting results to {output_file}...")
    results.export(output_file)
    print("Done!")

if __name__ == '__main__':
    main()
```

---

### Script 2: Batch Simulations (`batch_simulations.py`)

**Purpose**: Run multiple scenarios in sequence

```python
#!/usr/bin/env python3
"""
Batch Simulation Runner

Runs multiple scenarios and generates a comparison report.

Usage:
    python batch_simulations.py --config configs/scenarios.yaml
"""

import argparse
from pathlib import Path
from spm_monte_carlo import MonteCarloSimulator
from spm_monte_carlo.analytics import ScenarioComparison

def run_scenario(config_file: Path):
    """Run a single scenario from config file"""
    simulator = MonteCarloSimulator()
    simulator.load_config(config_file)
    return simulator.run()

def main():
    parser = argparse.ArgumentParser(description='Run batch simulations')
    parser.add_argument('--config', required=True, help='Scenarios config file')
    args = parser.parse_args()

    # Load scenario configurations
    scenarios = load_scenarios(args.config)

    # Run each scenario
    results = {}
    for name, config_file in scenarios.items():
        print(f"Running scenario: {name}")
        results[name] = run_scenario(config_file)

    # Generate comparison report
    print("\nGenerating comparison report...")
    comparison = ScenarioComparison(results)
    comparison.generate_report('output/scenario_comparison.xlsx')
    comparison.plot_comparison('output/scenario_comparison.png')

    print("Batch simulation complete!")

if __name__ == '__main__':
    main()
```

---

### Script 3: Custom Reports (`custom_reports.py`)

**Purpose**: Generate custom formatted reports

**Features**:
- Company branding
- Executive summary format
- Custom metrics
- Automated distribution via email

---

### Script 4: API Integration (`api_integration.py`)

**Purpose**: Integrate with external systems

**Example Integrations**:
- Pull data from Salesforce
- Push results to BI tool (Tableau, Power BI)
- Trigger from CI/CD pipeline
- Scheduled execution (cron/Airflow)

---

## Configuration Files

### Basic Config (`configs/basic_config.yaml`)

```yaml
metadata:
  name: "Basic Simulation"
  description: "Standard 10,000 iteration simulation"

data_sources:
  historical_performance: "data/basic_scenario/historical_data.xlsx"
  plan_structure: "data/basic_scenario/plan_structure.xlsx"
  rep_master: "data/basic_scenario/rep_master.xlsx"

simulation:
  iterations: 10000
  random_seed: 42
  sampling_method: "monte_carlo"
  parallel: true

output:
  directory: "output/"
  formats: ["excel"]
```

---

### High Accuracy Config (`configs/high_accuracy_config.yaml`)

```yaml
metadata:
  name: "High Accuracy Simulation"
  description: "100,000 iterations for maximum precision"

simulation:
  iterations: 100000
  sampling_method: "latin_hypercube"  # Better convergence
  parallel: true
  n_jobs: -1  # Use all cores

distributions:
  auto_fit: true
  goodness_of_fit_threshold: 0.01  # Stricter fit requirement

output:
  include_iteration_data: true  # Save all iteration results
```

---

### Quick Test Config (`configs/quick_test_config.yaml`)

```yaml
metadata:
  name: "Quick Test"
  description: "Fast execution for testing"

simulation:
  iterations: 1000  # Fewer iterations
  parallel: false   # Single-threaded for easier debugging

logging:
  level: "DEBUG"    # Verbose logging
```

---

## Data Templates

### Historical Data Template

**File**: `data/templates/historical_data_template.xlsx`

**Sheets**:
1. **Instructions**: How to fill out the template
2. **HistoricalPerformance**: Empty table with required columns
3. **MetricDefinitions**: Glossary of metric names

**Required Columns**:
- rep_id
- period
- metric_name
- metric_value

**Example Metrics**:
- quota_attainment_pct
- revenue
- deals_closed
- average_deal_size
- win_rate

---

### Plan Structure Template

**File**: `data/templates/plan_structure_template.xlsx`

**Sheets**:
1. **Instructions**: How to define compensation plans
2. **CommissionTiers**: Tiered commission structure
3. **Accelerators**: Accelerator definitions
4. **Bonuses**: Bonus and SPIFF definitions

---

## Running the Examples

### Setup

```bash
# Install the package
pip install -e .

# Install notebook dependencies
pip install jupyter matplotlib

# Navigate to examples
cd examples/
```

### Run a Script

```bash
python scripts/basic_simulation.py
```

### Launch Notebooks

```bash
jupyter notebook notebooks/01_basic_usage.ipynb
```

### Use a Config File

```bash
python -m spm_monte_carlo --config configs/basic_config.yaml
```

---

## Learning Path

**Beginner**:
1. Run `scripts/basic_simulation.py`
2. Open `notebooks/01_basic_usage.ipynb`
3. Modify basic scenario data
4. Experiment with iteration count

**Intermediate**:
1. Work through `notebooks/02_distribution_analysis.ipynb`
2. Try scenario comparison
3. Create custom configuration files
4. Run batch simulations

**Advanced**:
1. Custom distribution implementations
2. Sensitivity analysis and optimization
3. API integration with external systems
4. Large-scale parallel simulations

---

## Status

**Current Phase**: Design
**Implementation**: Pending

Once implemented, this directory will contain:
- 5+ Jupyter notebooks
- 4+ Python scripts
- 2+ complete example scenarios
- Excel templates
- Sample configuration files
