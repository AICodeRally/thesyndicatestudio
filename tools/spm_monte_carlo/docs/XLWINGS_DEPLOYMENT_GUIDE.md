# xlwings Deployment Guide - Client Distribution Options

## Overview

xlwings allows you to call Python from Excel. Here are all deployment options, from simplest to most robust.

---

## Deployment Options Comparison

| Option | Setup Complexity | Client Experience | Maintenance | Best For |
|--------|------------------|-------------------|-------------|----------|
| **1. Python + Excel** | Medium | Medium | Easy | Tech-savvy clients |
| **2. Standalone EXE** | Low | Easy | Medium | Non-technical clients |
| **3. Anaconda Distribution** | Medium | Easy | Easy | Enterprise clients |
| **4. Server-Based** | High | Very Easy | Easy | Large organizations |
| **5. Pure Embedded** | Low | Very Easy | Hard | Simple deployments |

---

## Option 1: Python Installation + Excel File (Simplest for Development)

### What Client Gets:
1. **One Excel file:** `SPM_Monte_Carlo.xlsm`
2. **One installer script:** `install.bat`

### How It Works:

**Step 1: You create installer script**

```batch
@echo off
echo ========================================
echo SPM Monte Carlo Tool - Installation
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found. Installing Python...
    echo Please download Python from https://python.org
    pause
    exit /b 1
)

echo Installing dependencies...
python -m pip install --upgrade pip
pip install xlwings pandas numpy scipy matplotlib openpyxl xlsxwriter seaborn

echo.
echo Installing SPM Monte Carlo package...
pip install spm-monte-carlo

echo.
echo Configuring xlwings...
xlwings addin install

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo You can now open SPM_Monte_Carlo.xlsm
pause
```

**Step 2: Client runs installer (ONE TIME)**
- Double-click `install.bat`
- Takes 2-3 minutes
- Installs everything needed

**Step 3: Client uses Excel file**
- Opens `SPM_Monte_Carlo.xlsm`
- Clicks "Run Simulation" button
- Excel calls Python in background
- Results appear in Excel

### Pros:
- ✅ Easy to update (just send new .xlsm file)
- ✅ Full Python power
- ✅ Easy for you to maintain

### Cons:
- ❌ Requires Python installation
- ❌ One-time setup needed
- ❌ IT might block Python installation

---

## Option 2: Standalone EXE (RECOMMENDED for Non-Technical Clients)

### What Client Gets:
**ONE FOLDER** containing:
```
SPM_Monte_Carlo_v1.0/
├── SPM_Monte_Carlo.xlsm          (Excel file)
├── spm_mc.exe                     (Python frozen as EXE)
└── README.txt                     (simple instructions)
```

### How It Works:

**Step 1: You create standalone package**

```bash
# Install xlwings PRO (one-time, $300/year license)
pip install xlwings-pro

# Create standalone executable
xlwings standalone build --freeze

# This creates:
# - Frozen Python as .exe
# - Excel file configured to call the exe
# - All dependencies bundled
```

**Alternative using PyInstaller (FREE):**

```python
# standalone_builder.py
import PyInstaller.__main__
import sys

PyInstaller.__main__.run([
    'spm_excel_interface.py',
    '--onefile',
    '--name=spm_mc',
    '--hidden-import=spm_monte_carlo',
    '--hidden-import=pandas',
    '--hidden-import=numpy',
    '--hidden-import=scipy',
    '--add-data=src/spm_monte_carlo:spm_monte_carlo',
])
```

**Step 2: Configure Excel to call EXE**

```vba
' In Excel VBA module
Sub RunSimulation()
    Dim exePath As String
    Dim excelPath As String

    ' Get path where Excel file is located
    excelPath = ThisWorkbook.Path

    ' Path to standalone exe (in same folder)
    exePath = excelPath & "\spm_mc.exe"

    ' Check if exe exists
    If Dir(exePath) = "" Then
        MsgBox "Error: spm_mc.exe not found!" & vbCrLf & _
               "Please ensure it's in the same folder as this Excel file.", _
               vbCritical, "Missing File"
        Exit Sub
    End If

    ' Run the exe and pass Excel file path
    Dim cmd As String
    cmd = """" & exePath & """ """ & ThisWorkbook.FullName & """"

    Shell cmd, vbNormalFocus

    MsgBox "Simulation running... results will appear when complete.", vbInformation
End Sub
```

**Step 3: Client usage**
1. Unzip folder anywhere
2. Open Excel file
3. Click "Run Simulation" button
4. That's it!

### Pros:
- ✅ **No Python installation needed**
- ✅ **No IT approval needed**
- ✅ Works on any Windows PC
- ✅ Just unzip and run

### Cons:
- ❌ Larger file size (~100-200 MB)
- ❌ Slower startup (exe unpacking)
- ❌ Might trigger antivirus warnings

### How to Distribute:
```
1. Zip the folder: SPM_Monte_Carlo_v1.0.zip
2. Upload to Dropbox/Google Drive
3. Client downloads and unzips
4. Run Excel file
```

---

## Option 3: Anaconda/Miniconda Distribution (Best for Enterprise)

### What Client Gets:
1. **Anaconda installer** (or Miniconda)
2. **Environment file:** `spm_environment.yml`
3. **Excel file:** `SPM_Monte_Carlo.xlsm`
4. **Quick start script:** `setup.bat`

### How It Works:

**Step 1: You create environment file**

```yaml
# spm_environment.yml
name: spm_monte_carlo
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.11
  - pandas
  - numpy
  - scipy
  - matplotlib
  - openpyxl
  - xlsxwriter
  - seaborn
  - pip
  - pip:
    - xlwings
    - spm-monte-carlo
```

**Step 2: You create setup script**

```batch
@echo off
echo Creating SPM Monte Carlo environment...

REM Create conda environment
conda env create -f spm_environment.yml

REM Activate environment
call conda activate spm_monte_carlo

REM Install xlwings add-in
xlwings addin install

echo.
echo Setup complete! You can now use SPM_Monte_Carlo.xlsm
pause
```

**Step 3: Client runs setup (ONE TIME)**
```
1. Install Anaconda (IT usually allows this)
2. Run setup.bat
3. Done!
```

**Step 4: Excel configuration**

Excel automatically uses the conda environment when installed via `xlwings addin install`.

### Pros:
- ✅ Clean environment management
- ✅ IT departments prefer Anaconda
- ✅ Easy to specify exact versions
- ✅ No dependency conflicts

### Cons:
- ❌ Requires Anaconda installation (~500 MB)
- ❌ More complex initial setup

---

## Option 4: Server-Based Deployment (Enterprise Scale)

### Architecture:

```
Client PC                          Company Server
┌─────────────┐                   ┌──────────────────┐
│   Excel     │ ──HTTP/REST──▶    │   Flask/FastAPI  │
│   File      │ ◀─── JSON ────    │   Python Server  │
└─────────────┘                   │                  │
                                  │  SPM Monte Carlo │
                                  │      Engine      │
                                  └──────────────────┘
```

### How It Works:

**Step 1: You deploy Python server**

```python
# server.py
from flask import Flask, request, jsonify
import pandas as pd
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan

app = Flask(__name__)

@app.route('/run_simulation', methods=['POST'])
def run_simulation():
    data = request.json

    # Parse data
    hist_data = pd.DataFrame(data['historical_data'])
    plan_config = data['plan_config']
    iterations = data.get('iterations', 10000)

    # Build plan
    plan = CompensationPlan(plan_config['plan_id'])
    for tier in plan_config['tiers']:
        plan.add_commission_tier(**tier)

    # Run simulation
    sim = MonteCarloSimulator(seed=42)
    results = sim.load_data(hist_data).load_plan(plan).run(iterations)

    # Return results
    return jsonify({
        'summary': results.summary().to_dict(),
        'var_95': float(results.var(0.95)),
        'var_99': float(results.var(0.99)),
        'cvar_95': float(results.cvar(0.95))
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Step 2: Excel calls server via VBA**

```vba
Sub RunSimulation()
    Dim http As Object
    Dim url As String
    Dim jsonData As String
    Dim response As String

    ' Create HTTP object
    Set http = CreateObject("MSXML2.XMLHTTP")

    ' Server URL
    url = "http://your-server.company.com:5000/run_simulation"

    ' Prepare JSON data
    jsonData = BuildJSONFromExcel()

    ' Send request
    http.Open "POST", url, False
    http.setRequestHeader "Content-Type", "application/json"
    http.send jsonData

    ' Get response
    response = http.responseText

    ' Parse and display results
    DisplayResults response
End Sub
```

**Step 3: Client usage**
1. Open Excel file
2. Click "Run Simulation"
3. Excel sends data to server
4. Server runs Python simulation
5. Results return to Excel

### Pros:
- ✅ **Zero client installation**
- ✅ Centralized updates
- ✅ Can handle heavy computations
- ✅ Multi-user support
- ✅ Audit logging

### Cons:
- ❌ Requires server infrastructure
- ❌ Network dependency
- ❌ More complex deployment

---

## Option 5: Fully Embedded Python (Advanced)

### Using embedPy or similar

Bundle Python directly into Excel file using COM.

**Very Complex** - not recommended for most cases.

---

## Recommended Deployment Strategy by Client Type

### Small Business / Individual Consultant
**Option 1: Python + Excel**
- Simple installer script
- Quick to set up
- Easy to support

### Mid-Size Company (10-100 users)
**Option 2: Standalone EXE**
- No Python installation
- Distribute via shared drive
- Minimal IT involvement

### Large Enterprise (100+ users)
**Option 3: Anaconda** or **Option 4: Server**
- Anaconda for desktop users
- Server for centralized control

---

## Step-by-Step: Building Standalone EXE (Most Popular)

### 1. Install PyInstaller

```bash
pip install pyinstaller
```

### 2. Create entry point script

```python
# spm_excel_runner.py
import sys
import xlwings as xw
from spm_excel_interface import main

if __name__ == '__main__':
    # Get Excel file path from command line
    if len(sys.argv) > 1:
        excel_file = sys.argv[1]
        wb = xw.Book(excel_file)
        wb.set_mock_caller()

    # Run simulation
    result = main()
    print(result)
```

### 3. Build executable

```bash
pyinstaller --onefile \
            --name spm_mc \
            --hidden-import spm_monte_carlo \
            --hidden-import pandas \
            --hidden-import numpy \
            --hidden-import scipy \
            --hidden-import openpyxl \
            spm_excel_runner.py
```

### 4. Package for distribution

```
SPM_Monte_Carlo/
├── SPM_Monte_Carlo.xlsm
├── spm_mc.exe
└── README.txt
```

### 5. Create README.txt

```
SPM Monte Carlo Tool
====================

Installation:
1. Unzip this folder anywhere on your computer
2. Keep all files together in the same folder

Usage:
1. Open SPM_Monte_Carlo.xlsm
2. Add your data to the "Historical_Data" sheet
3. Configure your plan in "Plan_Config" sheet
4. Click "Run Simulation" button
5. View results in "Results" sheet

Requirements:
- Windows 7 or later
- Microsoft Excel 2013 or later

Support:
- Email: support@yourcompany.com
```

---

## Security Considerations

### Antivirus Issues
Standalone EXEs might trigger warnings:

**Solutions:**
1. **Code signing certificate** ($100-300/year)
   - Digitally sign your .exe
   - Windows recognizes it as safe

2. **Whitelist instructions**
   - Provide IT with hash
   - Instructions for adding exception

3. **Use Anaconda instead**
   - Trusted by enterprises
   - No exe warnings

---

## Licensing Considerations

### xlwings Licenses

**xlwings (Free/Open Source):**
- ✅ Can use for free
- ✅ Unlimited use
- ❌ No standalone freeze support

**xlwings PRO ($300/year per developer):**
- ✅ Standalone freeze built-in
- ✅ Better performance
- ✅ Priority support
- ✅ Commercial use allowed

### Alternative (PyInstaller - FREE)
- Build standalone without xlwings PRO
- Need manual configuration
- Works great once set up

---

## My Recommendation for Your Use Case

### For Client Distribution:

**Start with Standalone EXE (Option 2):**

1. **Build once using PyInstaller** (free)
2. **Distribute folder** (zip file)
3. **Client unzips and runs** (no installation)
4. **Charge more** for "no installation needed" version

### Pricing Model:

- **Basic (Excel + Python):** $X - requires Python
- **Pro (Standalone EXE):** $X + $500 - no installation
- **Enterprise (Server):** Custom pricing

---

## Quick Start: Build Your First Standalone

Want me to create:
1. ✅ Build script for standalone EXE
2. ✅ Excel template configured
3. ✅ Distribution package ready to zip

Should take about 1 hour to set up the first time, then you can build new versions in minutes!

Ready to build the standalone version?
