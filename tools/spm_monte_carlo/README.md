# SPM Monte Carlo Analysis Tool

A production-grade Monte Carlo simulation tool for analyzing Sales Performance Management (SPM) compensation data, forecasting potential outcomes, and optimizing compensation plan design.

## Overview

This tool performs Monte Carlo simulations on SPM data to:
- Analyze variability in compensation outcomes
- Forecast potential payout ranges under different scenarios
- Assess risk and uncertainty in compensation plans
- Model sales performance distributions with statistical rigor
- Evaluate plan design effectiveness
- Support data-driven compensation decisions

## Design Highlights

### 1. Core Architecture

**Six Main Components:**
1. **Data Ingestion Module** - Excel loading, validation, and normalization
2. **Statistical Analysis Engine** - Distribution fitting, correlation analysis, goodness-of-fit testing
3. **Monte Carlo Simulation Engine** - Multiple sampling strategies (Monte Carlo, Latin Hypercube, Quasi-random)
4. **Compensation Calculator** - Flexible rule engine for tiered commissions, bonuses, SPIFs
5. **Analytics & Reporting Module** - Risk metrics (VaR, CVaR), sensitivity analysis
6. **Visualization Module** - Charts, dashboards, distribution plots

**Design Patterns:**
- Strategy Pattern (sampling methods, calculation strategies)
- Factory Pattern (distribution creation, chart generation)
- Builder Pattern (compensation plan construction)
- Pipeline Pattern (data processing workflow)

**Performance:**
- Vectorized operations with NumPy
- Parallel processing support
- Memory-efficient streaming for large datasets

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

---

### 2. Data Models

**Input Schemas:**
- Historical performance data (quota, actual sales, deal metrics)
- Compensation plan definition (tiers, bonuses, SPIFs, accelerators)
- Rep master data (territories, segments, quotas)

**Excel Templates:**
- Detailed specifications with validation rules
- Sample data and empty templates provided
- Support for YAML/JSON alternatives

**Output Models:**
- Summary statistics (mean, median, percentiles)
- Risk metrics (VaR, CVaR, probability of exceeding budget)
- Sensitivity analysis (tornado charts, correlation matrices)
- Per-rep and per-segment analysis

See [docs/DATA_MODELS.md](docs/DATA_MODELS.md) for complete schemas.

---

### 3. API Design

**Python API:**
Clean, intuitive interface with method chaining:

```python
from spm_monte_carlo import MonteCarloSimulator

# Simple usage
sim = MonteCarloSimulator(seed=42)
results = sim.load_data('data/historical.xlsx') \
             .load_plan('data/plan.xlsx') \
             .run(iterations=10000)

print(results.summary())
results.to_excel('output/results.xlsx')
```

**Command-Line Interface:**

```bash
spm-mc run \
  --data data/historical.xlsx \
  --plan data/plan.xlsx \
  --output results/ \
  --iterations 10000 \
  --seed 42
```

**Configuration Files:**
YAML/JSON support for complex setups

**Extension Points:**
- Custom distributions
- Custom compensation rules
- Custom analytics modules

See [docs/API_DESIGN.md](docs/API_DESIGN.md) for complete API reference.

---

### 4. Key Features

**Statistical Capabilities:**
- Auto-fit distributions (Normal, Log-normal, Beta, Gamma, Uniform, Triangular)
- Goodness-of-fit testing (K-S test, Chi-square, Anderson-Darling)
- Correlation matrix handling with Cholesky decomposition
- Multiple sampling strategies for efficiency and accuracy

**Analysis Features:**
- Summary statistics with configurable percentiles
- Risk metrics: VaR (Value at Risk), CVaR (Conditional VaR)
- Probability of exceeding budget thresholds
- Sensitivity analysis with tornado charts
- Scenario comparison (side-by-side plan evaluation)

**Compensation Logic:**
- Tiered commission structures with flexible boundaries
- Accelerators and decelerators based on quota attainment
- Quarterly/annual bonuses with conditional triggers
- SPIFs (Sales Performance Incentive Funds)
- Multi-component plans
- Data-driven rule engine (not hardcoded)

---

### 5. Testing Strategy

Comprehensive testing at multiple levels:

- **Unit Tests** - Fast, isolated component testing (>90% coverage target)
- **Integration Tests** - End-to-end workflow validation
- **Validation Tests** - Known outcome verification
- **Performance Benchmarks** - Speed and memory profiling

See [tests/README.md](tests/README.md) for testing documentation.

---

### 6. Examples & Templates

Provided resources:

- **Sample Data** - 50 reps, 24 months of performance data
- **Example Plans** - Multi-tiered commission with bonuses
- **Jupyter Notebooks** (5 planned):
  1. Basic simulation
  2. Custom distributions
  3. Sensitivity analysis
  4. Scenario comparison
  5. Advanced analytics
- **Python Scripts** - Simple simulation, batch processing, plan comparison
- **Configuration Templates** - Basic, advanced, and custom setups

See [examples/README.md](examples/README.md) for getting started.

---

## Design Philosophy

- **Accuracy First** - Rigorous statistical methods, validated against known outcomes
- **User-Friendly** - Clear APIs, sensible defaults, comprehensive documentation
- **Flexible** - Accommodate diverse compensation plans without code changes
- **Performant** - Vectorized operations, parallel processing, memory-efficient
- **Transparent** - Explain assumptions, show intermediate results, audit trails
- **Reproducible** - Seed control, version tracking, deterministic results

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.8+ |
| Numerical Computing | NumPy, SciPy |
| Data Manipulation | Pandas |
| Excel I/O | openpyxl, xlsxwriter |
| Visualization | matplotlib, seaborn |
| Statistical Analysis | scipy.stats |
| Testing | pytest |
| Parallelization | multiprocessing, joblib |
| Configuration | YAML (PyYAML) |

See [requirements.txt](requirements.txt) for complete dependency list.

---

## Getting Started

### Prerequisites

- Python 3.8+
- pip package manager

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Or install as package (when implemented)
pip install spm-monte-carlo
```

### Quick Start

```python
from spm_monte_carlo import MonteCarloSimulator

# Load example data and run simulation
sim = MonteCarloSimulator(seed=42)
results = sim.load_data('examples/data/historical_performance.xlsx') \
             .load_plan('examples/data/compensation_plan.xlsx') \
             .run(iterations=10000)

# View results
print(results.summary())
print(f"VaR 95%: ${results.var(0.95):,.0f}")
print(f"Expected Payout: ${results.summary_stats['mean']['total_payout']:,.0f}")

# Export
results.to_excel('output/simulation_results.xlsx')
```

### Using the CLI

```bash
# Run simulation
spm-mc run \
  --data examples/data/historical_performance.xlsx \
  --plan examples/data/compensation_plan.xlsx \
  --output results/ \
  --iterations 10000

# Validate data
spm-mc validate \
  --file data/my_data.xlsx \
  --type historical_performance

# Compare plans
spm-mc compare \
  --results plan_a.xlsx plan_b.xlsx \
  --output comparison.xlsx
```

---

## Project Structure

```
spm_monte_carlo/
├── src/                          # Source code
│   ├── data/                     # Data ingestion & validation
│   ├── statistics/               # Distribution fitting & analysis
│   ├── simulation/               # Monte Carlo engine
│   ├── compensation/             # Compensation calculation
│   ├── analytics/                # Risk metrics & reporting
│   └── visualization/            # Charts & dashboards
│
├── tests/                        # Test suite
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── validation/               # Known outcome tests
│   └── performance/              # Benchmarks
│
├── examples/                     # Examples & templates
│   ├── data/                     # Sample data files
│   ├── notebooks/                # Jupyter notebooks
│   ├── scripts/                  # Python scripts
│   └── configs/                  # Configuration files
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── DATA_MODELS.md            # Data schemas
│   └── API_DESIGN.md             # API reference
│
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

---

## Documentation

- **Architecture** - [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
  - Core components and design patterns
  - Performance optimizations
  - Extensibility points

- **Data Models** - [docs/DATA_MODELS.md](docs/DATA_MODELS.md)
  - Input/output schemas
  - Validation rules
  - Excel templates

- **API Design** - [docs/API_DESIGN.md](docs/API_DESIGN.md)
  - Python API reference
  - CLI commands
  - Configuration options

- **Testing** - [tests/README.md](tests/README.md)
  - Testing strategy
  - Coverage goals
  - Benchmark targets

- **Examples** - [examples/README.md](examples/README.md)
  - Getting started guides
  - Jupyter notebooks
  - Use case walkthroughs

---

## Common Use Cases

### 1. Budget Planning
Estimate compensation budget with confidence intervals (95th/99th percentiles)

### 2. Plan Redesign
Compare current vs. proposed plans to quantify financial impact

### 3. Risk Assessment
Calculate VaR, CVaR, and probability of exceeding budget

### 4. Sensitivity Analysis
Identify key drivers of compensation variability with tornado charts

### 5. Rep Segmentation
Analyze payout distributions by territory, role, or tenure

See [examples/README.md](examples/README.md) for detailed walkthroughs.

---

## Development Status

**Current Phase:** Design & Documentation

This repository contains comprehensive design documentation for the SPM Monte Carlo tool:

- ✅ Architecture design complete
- ✅ Data models defined
- ✅ API specifications documented
- ✅ Testing strategy outlined
- ✅ Examples and templates planned

**What's Next:**

Implementation will follow this design foundation, building out:
1. Core data ingestion and validation
2. Statistical analysis engine
3. Monte Carlo simulation engine
4. Compensation calculator
5. Analytics and reporting
6. Visualization module

---

## Contributing

This is a Prizym-ai organization repository. For contributions:
1. Follow the architecture and design patterns documented
2. Maintain >90% test coverage
3. Add examples for new features
4. Update documentation

---

## Future Enhancements

### Phase 2 Features
- Web-based dashboard (Flask/Django)
- Database integration (PostgreSQL)
- RESTful API for remote execution
- Real-time data integration
- Interactive what-if scenario builder

### Advanced Analytics
- Machine learning for performance prediction
- Optimization algorithms for plan design
- Automated plan comparison and recommendations
- Time-series forecasting

---

## License

Prizym-ai

---

## Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Refer to documentation in `docs/`
- Check examples in `examples/`

---

**Ready for implementation!** This comprehensive design provides everything needed to build a production-grade SPM Monte Carlo simulation tool.
