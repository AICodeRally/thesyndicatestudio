# SPM Monte Carlo - Client Deployment Guide

## For Consultants/Developers

This guide explains how to build and deploy the standalone Excel version to clients.

---

## Quick Start: Building the Standalone Package

### Prerequisites

1. **Install PyInstaller:**
```bash
pip install pyinstaller xlwings
```

2. **Navigate to excel_standalone folder:**
```bash
cd excel_standalone
```

### Build the Standalone EXE

**Run the builder:**
```bash
python build_standalone.py
```

This will:
- ✅ Create `spm_mc.exe` (standalone executable, ~150MB)
- ✅ Generate `dist/SPM_Monte_Carlo/` folder
- ✅ Create README.txt for clients
- ✅ Create template instructions

**Build time:** 2-5 minutes

---

## Creating the Excel File

### Option 1: Use Provided VBA Code

1. **Create new Excel workbook**
2. **Press Alt+F11** (open VBA editor)
3. **Insert > Module**
4. **Copy code from `templates/VBA_Code.txt`**
5. **Create sheets** as specified below
6. **Add button** on Dashboard linked to `RunSimulation` macro

### Option 2: Download Pre-built Template

*(We can create a master template for you to reuse)*

---

## Excel Workbook Structure

### Required Sheets:

#### 1. **Dashboard** (Main Interface)

```
╔═══════════════════════════════════════════════════════════╗
║    SPM MONTE CARLO SIMULATION TOOL                       ║
║                                                            ║
║    [Run Simulation Button]                               ║
║                                                            ║
║    Status: Ready                                          ║
║                                                            ║
║    Instructions:                                          ║
║    1. Add data to Historical_Data sheet                  ║
║    2. Configure plan in Plan_Config sheet                ║
║    3. Click Run Simulation                               ║
╚═══════════════════════════════════════════════════════════╝
```

**Cell References:**
- B8: Status cell (updated by VBA and Python)

#### 2. **Historical_Data** (Input)

| A: rep_id | B: period | C: quota | D: actual_sales | E: quota_attainment | F: deal_count | G: avg_deal_size |
|-----------|-----------|----------|-----------------|---------------------|---------------|------------------|
| REP001    | 2024-01   | 100000   | 95000          | 0.95               | 12            | 7916.67         |
| REP001    | 2024-02   | 100000   | 108000         | 1.08               | 15            | 7200.00         |

**Data Validation:**
- Headers must match exactly
- At least 2 rows of data
- quota and actual_sales must be positive numbers

#### 3. **Plan_Config** (Input)

**Plan Details (Rows 1-4):**
```
A2: Plan ID          | B2: [Enter Plan ID]
A3: Plan Name        | B3: [Enter Plan Name]
```

**Commission Tiers (Starting Row 6):**

| A: tier_name | B: quota_min | C: quota_max | D: rate |
|--------------|--------------|--------------|---------|
| Tier 1       | 0.00         | 0.75         | 0.02    |
| Tier 2       | 0.75         | 1.00         | 0.03    |
| Tier 3       | 1.00         | 1.25         | 0.045   |
| Tier 4       | 1.25         | 10.00        | 0.06    |

**Bonuses (Optional, Starting ~Row 12):**

| A: bonus_name | B: trigger_metric | C: trigger_condition | D: trigger_value | E: payout | F: frequency |
|---------------|-------------------|----------------------|------------------|-----------|--------------|
| 100% Club     | quota_attainment  | >=                   | 1.0              | 5000      | quarterly    |

#### 4. **Config** (Settings)

| A                    | B            |
|----------------------|--------------|
| Iterations:          | 10000        |
| Random Seed:         | 42           |
| Sampling Strategy:   | monte_carlo  |

**Valid Strategies:**
- `monte_carlo` - Standard random sampling
- `lhs` - Latin Hypercube (more efficient)
- `quasi_random` - Sobol sequences

#### 5. **Results** (Output - Auto-populated)

This sheet is cleared and filled by the simulation.

---

## Complete Deployment Package

### What to Send Client:

```
SPM_Monte_Carlo_v1.0.zip
└── SPM_Monte_Carlo/
    ├── SPM_Monte_Carlo.xlsm    (Excel file with VBA)
    ├── spm_mc.exe               (Python executable)
    └── README.txt               (Client instructions)
```

**Total Size:** ~150-200 MB (zipped)

---

## Building the Package: Step-by-Step

### Step 1: Build Executable

```bash
cd /path/to/excel_standalone
python build_standalone.py
```

**Output:**
```
dist/
└── SPM_Monte_Carlo/
    ├── spm_mc.exe
    ├── README.txt
    └── Excel_Template_Instructions.txt
```

### Step 2: Create Excel File

1. Open Excel, create new workbook
2. Save as `SPM_Monte_Carlo.xlsm` (macro-enabled)
3. Add all required sheets (Dashboard, Historical_Data, Plan_Config, Config, Results)
4. Open VBA Editor (Alt+F11)
5. Copy code from `templates/VBA_Code.txt`
6. Add button on Dashboard:
   - Developer tab > Insert > Button
   - Link to `RunSimulation` macro
7. Format sheets nicely
8. Save

### Step 3: Test Locally

1. Put `spm_mc.exe` and `SPM_Monte_Carlo.xlsm` in same folder
2. Open Excel file
3. Add sample data
4. Click "Run Simulation"
5. Verify results appear

### Step 4: Package for Distribution

1. Create folder: `SPM_Monte_Carlo_v1.0`
2. Copy files:
   - `spm_mc.exe`
   - `SPM_Monte_Carlo.xlsm`
   - `README.txt` (auto-generated)
3. ZIP the folder
4. Upload to Dropbox/Google Drive/etc.

---

## Client Installation (What They Do)

### Simple 3-Step Process:

1. **Download and unzip** the folder
2. **Open** `SPM_Monte_Carlo.xlsm`
3. **Click** "Enable Macros" if prompted

That's it! No Python installation needed.

---

## Testing Checklist

Before sending to client:

- [ ] Executable runs without errors
- [ ] Excel file has all required sheets
- [ ] VBA code is present and macro-enabled
- [ ] Button works and calls simulation
- [ ] Sample data runs successfully
- [ ] Results appear correctly
- [ ] File size is reasonable (~150-200MB)
- [ ] ZIP file extracts properly
- [ ] README is clear and helpful

---

## Troubleshooting Common Issues

### Build Issues

**Problem:** "Module not found" during build
```bash
# Solution: Install missing package
pip install <package_name>
```

**Problem:** Build takes very long (>10 min)
```bash
# Solution: Use --clean flag less often, or skip UPX
# Already set in build script
```

**Problem:** Exe is too large (>300MB)
```bash
# Solution: This is normal for first build
# Consider using UPX compression (but may trigger antivirus)
```

### Runtime Issues

**Problem:** "spm_mc.exe not found"
```
Solution: Ensure exe is in SAME folder as Excel file
```

**Problem:** Windows Security warning
```
Solution: Tell client to click "More info" > "Run anyway"
OR: Get code signing certificate ($100-300/year)
```

**Problem:** Simulation hangs
```
Solution: Check Excel isn't frozen
Check if console window is waiting for input
```

### Excel Issues

**Problem:** Macros disabled
```
Solution: Tell client to enable macros
File > Options > Trust Center > Macro Settings
```

**Problem:** VBA errors
```
Solution: Ensure VBA code is correctly pasted
Check References are not broken (Tools > References)
```

---

## Advanced: Code Signing (Optional but Recommended)

To avoid Windows Security warnings:

### Get Certificate

1. **Purchase code signing certificate**
   - DigiCert, Sectigo, etc. (~$200-400/year)
   - Organization validation required

2. **Sign the executable**
```bash
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com spm_mc.exe
```

3. **Verify signature**
```bash
signtool verify /pa spm_mc.exe
```

**Benefits:**
- ✅ No security warnings
- ✅ Professional appearance
- ✅ Clients trust it more
- ✅ IT departments approve easier

---

## Pricing Strategy

### Suggested Pricing:

**Package Tiers:**

1. **Basic Excel Version** - $1,500
   - Requires Python installation
   - Includes installer script
   - Email support

2. **Standalone Version** - $2,500 ⭐ MOST POPULAR
   - No installation needed
   - Just unzip and run
   - Phone + email support

3. **Enterprise Version** - $5,000+
   - Server deployment
   - Multi-user support
   - Dedicated support
   - Custom branding

**Add-ons:**
- Code signing: +$500 (covers cert cost)
- Custom branding: +$300
- Training session: +$1,000
- Annual updates: +$500/year

---

## Distribution Channels

### Option 1: Direct Download
- Upload to Dropbox/Google Drive
- Send link to client
- Track downloads

### Option 2: Email
- If <25MB, can email directly
- Otherwise, use file transfer service

### Option 3: Physical Media
- USB drive with package
- Professional presentation
- Good for high-value clients

### Option 4: Client Portal
- Create simple website
- Client logs in to download
- Looks more professional

---

## Support Plan

### What to Offer Clients:

**Standard Support (Included):**
- Email support (48-hour response)
- Bug fixes for 90 days
- Basic usage questions

**Premium Support (+$1,000/year):**
- Phone support
- Priority response (4-hour)
- Unlimited questions
- Annual updates

**Enterprise Support (+$3,000/year):**
- Dedicated support line
- Same-day response
- Custom modifications
- On-site training

---

## Updating the Tool

When you improve the Python engine:

1. Rebuild exe: `python build_standalone.py`
2. Test with existing Excel files
3. Update version number
4. Send new exe to clients
5. They replace old exe, keep Excel file

**Versioning:**
```
v1.0 - Initial release
v1.1 - Bug fixes
v2.0 - Major new features
```

---

## Next Steps

1. ✅ Run `python build_standalone.py`
2. ✅ Create Excel template with VBA
3. ✅ Test the complete package
4. ✅ Package as ZIP
5. ✅ Send to first client!

---

## Quick Reference

### Build Command:
```bash
python build_standalone.py
```

### Output Location:
```
excel_standalone/dist/SPM_Monte_Carlo/
```

### Client Receives:
```
SPM_Monte_Carlo_v1.0.zip (150-200 MB)
```

### Client Does:
```
1. Unzip
2. Open Excel file
3. Run simulation
```

**That's it! Simple for everyone.** 🚀
