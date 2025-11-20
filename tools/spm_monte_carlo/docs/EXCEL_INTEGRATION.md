# Excel Integration Strategy for SPM Monte Carlo Tool

## Overview

This document outlines strategies for creating an Excel-only version of the SPM Monte Carlo tool for clients who prefer Excel-based workflows.

---

## Option 1: Python Backend + Excel Frontend (RECOMMENDED)

### Architecture

```
┌─────────────────────────────────────────────────┐
│           Excel Workbook (UI)                   │
│  - Input sheets (data, plan)                    │
│  - Configuration panel                          │
│  - Run button                                   │
│  - Results dashboard                            │
└─────────────────┬───────────────────────────────┘
                  │ xlwings or COM
                  ↓
┌─────────────────────────────────────────────────┐
│      Python Monte Carlo Engine                  │
│  (The tool we just built)                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│    Excel Workbook (Results & Charts)            │
└─────────────────────────────────────────────────┘
```

### Implementation with xlwings

**Pros:**
- Keep Python engine (fast, accurate)
- Excel UI (familiar to users)
- Easy to update and maintain
- Can distribute as .xlsm file

**Setup:**

```python
# excel_interface.py
import xlwings as xw
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan

@xw.func
def run_monte_carlo(iterations=10000):
    """Run simulation from Excel."""
    wb = xw.Book.caller()

    # Read data from Excel sheets
    hist_data = wb.sheets['Historical_Data'].range('A1').expand().options(pd.DataFrame, header=True).value

    # Read plan configuration
    plan_sheet = wb.sheets['Plan_Config']
    plan_id = plan_sheet.range('B2').value

    # Build plan from Excel
    plan = CompensationPlan(plan_id)
    tiers = plan_sheet.range('A5').expand().options(pd.DataFrame, header=True).value
    for _, tier in tiers.iterrows():
        plan.add_commission_tier(
            tier['quota_min'],
            tier['quota_max'],
            tier['rate']
        )

    # Run simulation
    sim = MonteCarloSimulator(seed=42)
    results = sim.load_data(hist_data).load_plan(plan).run(iterations=iterations)

    # Write results back to Excel
    results_sheet = wb.sheets['Results']
    results_sheet.range('A1').value = results.summary()

    # Write risk metrics
    results_sheet.range('A20').value = "Risk Metrics"
    results_sheet.range('A21').value = [
        ["VaR 95%", results.var(0.95)],
        ["VaR 99%", results.var(0.99)],
        ["CVaR 95%", results.cvar(0.95)]
    ]

    return "Simulation Complete!"
```

**Excel Setup:**

```vba
' VBA code in Excel workbook
Sub RunSimulation()
    Dim iterations As Integer
    iterations = Range("Config!B5").Value

    ' Call Python function via xlwings
    result = Application.Run("run_monte_carlo", iterations)

    MsgBox result
End Sub
```

**Distribution:**
1. Package as `.xlsm` file with embedded Python
2. Use `xlwings standalone` to create exe
3. Users click button in Excel, Python runs in background

---

## Option 2: Pure Excel/VBA Solution

### Architecture

All logic in VBA - no external dependencies.

**Pros:**
- No Python installation required
- Single Excel file distribution
- Works on any Windows PC with Excel

**Cons:**
- Much slower (VBA is 100-1000x slower than Python)
- Limited to ~1,000 iterations practically
- More code to maintain
- Limited statistical functions

**Implementation:**

```vba
' VBA Module: MonteCarloEngine

Option Explicit

' Main simulation function
Public Function RunMonteCarloSimulation(iterations As Long) As Boolean
    Dim ws_hist As Worksheet
    Dim ws_plan As Worksheet
    Dim ws_results As Worksheet

    Set ws_hist = ThisWorkbook.Sheets("Historical_Data")
    Set ws_plan = ThisWorkbook.Sheets("Plan_Config")
    Set ws_results = ThisWorkbook.Sheets("Results")

    ' Fit distributions (simplified)
    Dim quotaAttainment_mean As Double
    Dim quotaAttainment_stdev As Double

    quotaAttainment_mean = Application.WorksheetFunction.Average(ws_hist.Range("D2:D1000"))
    quotaAttainment_stdev = Application.WorksheetFunction.StDev(ws_hist.Range("D2:D1000"))

    ' Run simulation
    Dim i As Long
    Dim scenario_results() As Double
    ReDim scenario_results(1 To iterations)

    For i = 1 To iterations
        ' Generate random quota attainment (normal distribution)
        Dim qa As Double
        qa = Application.WorksheetFunction.Norm_Inv(Rnd(), quotaAttainment_mean, quotaAttainment_stdev)

        ' Calculate payout
        Dim payout As Double
        payout = CalculatePayout(qa, ws_plan)

        scenario_results(i) = payout

        ' Progress update every 100 iterations
        If i Mod 100 = 0 Then
            Application.StatusBar = "Running simulation: " & i & " of " & iterations
        End If
    Next i

    ' Calculate statistics
    Dim mean_payout As Double
    Dim var95 As Double

    mean_payout = Application.WorksheetFunction.Average(scenario_results)
    var95 = Application.WorksheetFunction.Percentile(scenario_results, 0.95)

    ' Write results
    ws_results.Range("B2").Value = mean_payout
    ws_results.Range("B3").Value = var95

    Application.StatusBar = False
    RunMonteCarloSimulation = True
End Function

' Calculate payout based on tiered structure
Private Function CalculatePayout(qa As Double, ws_plan As Worksheet) As Double
    Dim quota As Double
    Dim actual_sales As Double
    Dim commission As Double

    quota = 100000 ' Could read from config
    actual_sales = quota * qa

    ' Tiered commission logic
    If qa <= 0.75 Then
        commission = actual_sales * 0.02
    ElseIf qa <= 1# Then
        commission = (quota * 0.75 * 0.02) + ((actual_sales - quota * 0.75) * 0.03)
    ElseIf qa <= 1.25 Then
        commission = (quota * 0.75 * 0.02) + (quota * 0.25 * 0.03) + ((actual_sales - quota) * 0.045)
    Else
        commission = (quota * 0.75 * 0.02) + (quota * 0.25 * 0.03) + (quota * 0.25 * 0.045) + ((actual_sales - quota * 1.25) * 0.06)
    End If

    ' Bonus logic
    Dim bonus As Double
    If qa >= 1# Then
        bonus = 5000
    End If

    CalculatePayout = commission + bonus
End Function
```

**Workbook Structure:**
- `Historical_Data` sheet: Input data
- `Plan_Config` sheet: Commission tiers, bonuses
- `Config` sheet: Simulation settings
- `Results` sheet: Output dashboard
- `Charts` sheet: Visualizations

---

## Option 3: Hybrid - Python as Excel Add-in

### Using PyXLL

**Architecture:**
Python functions exposed as Excel formulas.

```python
# Using PyXLL
from pyxll import xl_func
from spm_monte_carlo import MonteCarloSimulator

@xl_func("numpy_array<float> historical_data, int iterations: float")
def SPM_MONTE_CARLO(historical_data, iterations):
    """
    Excel formula: =SPM_MONTE_CARLO(A1:D1000, 10000)
    """
    # Convert Excel range to DataFrame
    df = pd.DataFrame(historical_data)

    # Run simulation
    sim = MonteCarloSimulator()
    results = sim.load_data(df).run(iterations)

    return results.var(0.95)
```

**Usage in Excel:**
```
=SPM_MONTE_CARLO(Historical_Data!A1:D1000, 10000)
=SPM_VAR95(A1:A10000)
```

---

## Option 4: Web-Based Excel Alternative

### Power BI + Python Visual

For modern alternative to Excel:

1. Use Power BI Desktop (free)
2. Embed Python visuals
3. Connect to Excel data
4. Interactive dashboards

---

## Recommended Implementation Plan

### Phase 1: xlwings Version (Week 1-2)

**Why:** Best balance of performance and Excel UX

**Deliverables:**
1. Excel workbook template (`SPM_Monte_Carlo.xlsm`)
2. Input sheets with validation
3. Configuration panel
4. "Run Simulation" button
5. Results dashboard with charts
6. Python backend (already done!)

**File Structure:**
```
SPM_Monte_Carlo_Excel.xlsm
├── VBA Modules
│   └── RunSimulation (calls xlwings)
├── Sheets
│   ├── Dashboard (main interface)
│   ├── Historical_Data (input)
│   ├── Plan_Config (input)
│   ├── Config (settings)
│   ├── Results (output)
│   └── Charts (visualizations)
└── Python Backend
    └── spm_monte_carlo package
```

### Phase 2: Pure VBA Version (Week 3-4)

**Why:** For clients without Python

**Deliverables:**
1. Standalone Excel file
2. Limited to 1,000-5,000 iterations
3. Simplified distribution fitting
4. Core functionality only

### Phase 3: Enterprise Add-in (Month 2)

**Why:** For large organizations

**Options:**
- VSTO (C#) add-in
- Office JavaScript API
- COM server

---

## Quick Start: Build xlwings Version

### 1. Install xlwings

```bash
pip install xlwings
```

### 2. Create Excel Template

```bash
xlwings quickstart SPM_Monte_Carlo
```

### 3. Add Interface Code

Create `spm_excel_interface.py`:

```python
import xlwings as xw
import pandas as pd
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan

def main():
    wb = xw.Book.caller()

    # Get configuration
    config_sheet = wb.sheets['Config']
    iterations = int(config_sheet.range('B2').value)
    seed = int(config_sheet.range('B3').value or 42)

    # Load historical data
    hist_sheet = wb.sheets['Historical_Data']
    hist_data = hist_sheet.range('A1').expand().options(pd.DataFrame, header=True).value

    # Load plan
    plan_sheet = wb.sheets['Plan_Config']
    plan = load_plan_from_excel(plan_sheet)

    # Run simulation
    sim = MonteCarloSimulator(seed=seed)
    results = sim.load_data(hist_data).load_plan(plan).run(iterations=iterations)

    # Write results
    write_results_to_excel(wb, results)

    return "Simulation complete!"

def load_plan_from_excel(sheet):
    """Load compensation plan from Excel sheet."""
    plan_id = sheet.range('B2').value
    plan = CompensationPlan(plan_id)

    # Load tiers
    tiers = sheet.range('A6').expand().options(pd.DataFrame, header=True).value
    for _, row in tiers.iterrows():
        plan.add_commission_tier(
            row['quota_min'],
            row['quota_max'],
            row['rate']
        )

    return plan

def write_results_to_excel(wb, results):
    """Write results to Excel."""
    results_sheet = wb.sheets['Results']

    # Summary stats
    summary = results.summary()
    results_sheet.range('A2').value = summary

    # Risk metrics
    results_sheet.range('A25').value = [
        ['Metric', 'Value'],
        ['VaR 95%', results.var(0.95)],
        ['VaR 99%', results.var(0.99)],
        ['CVaR 95%', results.cvar(0.95)],
        ['Mean Payout', results.scenarios['total_payout'].mean()]
    ]

if __name__ == '__main__':
    xw.Book('SPM_Monte_Carlo.xlsm').set_mock_caller()
    main()
```

### 4. Add Button to Excel

In Excel VBA:
```vba
Sub RunSimulation()
    RunPython "import spm_excel_interface; spm_excel_interface.main()"
End Sub
```

---

## Distribution Strategy

### For xlwings version:

1. **Option A: Python Installer**
   - Distribute `.xlsm` + installer batch file
   - Installer sets up Python environment
   - One-time setup

2. **Option B: Standalone EXE**
   - Use `xlwings standalone`
   - Creates frozen Python exe
   - Excel calls exe (slower but no Python install)

3. **Option C: Server Deployment**
   - Install on server
   - Users access via network
   - IT manages Python environment

### For VBA version:

- Single `.xlsm` file
- Just click and run
- No installation needed

---

## Pricing Tiers

**Basic (VBA):** $X - Up to 1,000 iterations
**Professional (xlwings):** $Y - Unlimited iterations
**Enterprise (VSTO):** $Z - Multi-user, server deployment

---

## Next Steps

Want me to build:
1. **xlwings Excel interface** (recommended - 1-2 hours)
2. **Pure VBA version** (3-4 hours)
3. **Both**?

The xlwings version will give you the best of both worlds - Excel UX with Python power!
