# 🎯 SPM Comp Plan Architect

**Enterprise-Grade Compensation Plan Template Management System**

Build, validate, and manage compensation plans using reusable components with intelligent assembly, governance scoring, and professional Excel output.

---

## 🚀 Overview

The Comp Plan Architect is a template management system that helps SPM professionals:

- ✅ **Build** compensation plans from reusable component libraries
- ✅ **Validate** business rules, compliance, and governance requirements
- ✅ **Export** to professional Excel workbooks (Mac & PC compatible)
- ✅ **Compare** plans to analyze differences and financial impact
- ✅ **Score** governance risk across your plan portfolio
- ✅ **Track** versions and changes with full audit trail

---

## 🏗️ Architecture

```
comp_plan_architect/
├── core/                    # Core engines
│   ├── library_manager.py   # Component CRUD operations
│   ├── template_engine.py   # Plan assembly & rendering
│   ├── validator.py         # Business rules validation
│   ├── version_control.py   # Version tracking
│   └── governance_scorer.py # Risk scoring
│
├── data/                    # Data storage
│   ├── library/            # Component library (JSON)
│   ├── templates/          # Plan templates
│   └── plans/              # Active, archive, draft plans
│
├── exporters/              # Export engines
│   ├── excel_exporter.py   # Rich Excel with formatting
│   ├── word_exporter.py    # Policy documents
│   └── pdf_exporter.py     # Locked versions
│
├── analytics/              # Analysis tools
│   ├── plan_comparison.py  # Compare two plans
│   ├── gap_analyzer.py     # Find missing components
│   └── impact_simulator.py # Change impact modeling
│
└── utils/                  # Utilities
    ├── nlp_parser.py       # Extract from existing docs
    └── diff_engine.py      # Track changes
```

---

## 🎯 Key Features

### **1. Component Library**
- Pre-built library of 30+ common comp plan components
- Categories: Eligibility, Measures, Rates, Governance, Definitions
- Version controlled with usage analytics
- Smart search and filtering

### **2. Template Assembly**
- Drag-and-drop component selection
- Auto-numbering and section hierarchy
- Dependency resolution (auto-include required components)
- Conflict detection (flag incompatible combinations)
- Gap analysis (identify missing sections)

### **3. Validation Engine**
- **Business Rules**: Logical consistency checks
- **Compliance**: FLSA, SOX, GDPR flags
- **Financial**: Uncapped commission warnings
- **Governance**: 100-point risk scoring

### **4. Excel Integration**
- Professional formatted workbooks
- Multiple tabs: Summary, Full Policy, Components, Scorecard
- Interactive TOC with hyperlinks
- Works in Excel for Mac & PC
- Python engine + VBA interface

### **5. Plan Comparison**
- Side-by-side component diff
- Highlight policy language changes
- Financial impact analysis
- Governance score delta

### **6. Version Control**
- Git-style change tracking
- Full audit trail (who, when, why)
- Rollback capability
- Approval workflows

---

## 📦 Installation

```bash
cd tools/comp_plan_architect
pip install -e .
```

**Dependencies:**
- Python 3.11+
- pandas, openpyxl, python-docx
- xlwings (for Excel integration)

---

## 🎬 Quick Start

### **Option 1: Python API**

```python
from comp_plan_architect import LibraryManager, TemplateEngine, ExcelExporter

# Load component library
library = LibraryManager()

# Create new plan
plan = TemplateEngine.create_plan(
    name="FY25 Enterprise AE Plan",
    components=[
        "ELIG_001",  # SDR Eligibility
        "QUOTA_002", # Annual Quota
        "RATE_TIER_001", # Tiered rates
        "ACCEL_100", # 100% accelerator
    ]
)

# Validate
validation = plan.validate()
print(f"Risk Score: {validation.governance_score}/100")

# Export to Excel
exporter = ExcelExporter()
exporter.export(plan, "FY25_AE_Plan.xlsx")
```

### **Option 2: Excel Interface**

1. Open `CompPlanArchitect.xlsm`
2. Browse component library
3. Select components for your plan
4. Click "Generate Plan"
5. Review formatted output in new workbook

---

## 📚 Component Library Schema

Each component includes:

```json
{
  "component_id": "ELIG_001",
  "category": "Eligibility",
  "name": "SDR Eligibility - Standard",
  "version": "3.2",
  "policy_text": {
    "short": "Must be in active SDR role for 90+ days",
    "detailed": "Full policy language...",
    "legal": "Legal disclaimer text..."
  },
  "metadata": {
    "industry": ["SaaS", "Tech"],
    "plan_types": ["New Hire", "Standard"],
    "compliance_flags": ["FLSA_exempt"]
  },
  "validation_rules": {
    "requires": ["territory_assignment"],
    "conflicts_with": ["contractor_terms"]
  },
  "governance_impact": {
    "financial_risk": 2,
    "complexity": 3,
    "compliance_risk": 1
  }
}
```

---

## 🎯 Governance Scoring

**100-Point Risk Assessment Framework:**

| Category | Weight | Criteria |
|----------|--------|----------|
| **Financial Exposure** | 30 pts | Uncapped payouts, accelerators, SPIFs |
| **Complexity** | 25 pts | Number of components, calculation steps |
| **Compliance Risk** | 25 pts | FLSA, SOX, regulatory flags |
| **Operational Risk** | 20 pts | Data dependencies, system integration |

**Risk Levels:**
- 0-40: Low Risk ✅
- 41-70: Medium Risk ⚠️
- 71-100: High Risk 🚨

---

## 🔄 Plan Comparison

Compare any two plans to see:

```python
from comp_plan_architect.analytics import PlanComparison

comparison = PlanComparison(plan_2024, plan_2025)

print(comparison.summary())
# Components Added: 3
# Components Removed: 1
# Components Modified: 5
# Governance Score Delta: +8 points (higher risk)
# Estimated Cost Impact: +12% at 100% attainment

comparison.export_diff("FY24_vs_FY25_Comparison.xlsx")
```

---

## 📊 Export Options

### **Excel Export** (Primary)
- Multi-tab workbook
- Professional formatting
- Interactive TOC
- Governance scorecard
- Component details
- Change log

### **Word Export**
- Policy document format
- Auto-generated TOC
- Headers/footers
- Track changes mode

### **PDF Export**
- Locked final version
- Digital signature ready
- Watermarks (Draft/Final)

---

## 🧪 Examples

See `examples/` directory:

- `build_simple_plan.py` - Create basic AE plan
- `validate_existing_plan.py` - Load and validate
- `compare_fy24_fy25.py` - Compare two years
- `export_all_formats.py` - Generate Excel, Word, PDF

---

## 🎓 Use Cases

### **1. Annual Plan Updates**
- Clone last year's plan
- Update components (e.g., new quota methodology)
- Compare to see changes
- Validate governance score
- Export for approval

### **2. New Role Compensation**
- Browse library for similar roles
- Select applicable components
- Customize policy language
- Run validation
- Generate draft plan

### **3. Governance Audit**
- Load all active plans
- Run governance scoring
- Identify high-risk plans
- Generate executive summary

### **4. Compliance Review**
- Filter components by compliance flag
- Review FLSA exemption requirements
- Validate SOX controls
- Export compliance report

---

## 🔧 Configuration

`config.yaml`:

```yaml
library:
  path: "data/library/components.json"
  auto_backup: true
  version_retention: 10

validation:
  strict_mode: true
  governance_threshold: 70  # Warn if score > 70
  required_sections:
    - "Overview"
    - "Eligibility"
    - "Measures"
    - "Payment Terms"

export:
  excel:
    default_format: "professional"
    include_toc: true
    include_scorecard: true
  word:
    template: "templates/policy_template.docx"
```

---

## 🚦 Roadmap

### **Phase 1: MVP** ✅ (Current)
- Component library CRUD
- Template assembly
- Excel export
- Basic validation

### **Phase 2: Intelligence** (Next)
- AI component suggestions
- Document parser (extract from existing plans)
- Smart gap analysis
- Monte Carlo cost simulation

### **Phase 3: Collaboration**
- Multi-user support
- Approval workflows
- Comment threads
- Version control UI

### **Phase 4: Scale**
- REST API
- Integration connectors (Xactly, Varicent)
- Component marketplace
- Analytics dashboard

---

## 📖 Documentation

- [Component Library Guide](docs/COMPONENT_LIBRARY.md)
- [Template Assembly Guide](docs/TEMPLATE_ASSEMBLY.md)
- [Validation Rules](docs/VALIDATION.md)
- [Governance Scoring](docs/GOVERNANCE_SCORING.md)
- [Excel Integration](docs/EXCEL_INTEGRATION.md)
- [API Reference](docs/API_REFERENCE.md)

---

## 💡 Philosophy

**"Compensation plans should be:**
- **Consistent** - Reuse proven components
- **Compliant** - Built-in governance checks
- **Clear** - Professional documentation
- **Comparable** - Easy to track changes
- **Collaborative** - Stakeholder input workflow"

---

## 🤝 Integration with Other SPM Tools

- **SPM Monte Carlo**: Cost simulation of plan scenarios
- **SPM Risk Analyzer**: Deep financial exposure analysis
- **SPM Catalog Extractor**: Import components from existing docs

---

## 📞 Support

- **Documentation**: See `docs/` folder
- **Examples**: See `examples/` folder
- **Issues**: Contact todd@bluehorizons.com

---

## 📄 License

Proprietary - Blue Horizons Group
For client use only.

---

**Built with ❤️ for SPM Professionals**

*Making compensation plans less painful, one component at a time.* 🎯💰
