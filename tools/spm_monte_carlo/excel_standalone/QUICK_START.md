# SPM Monte Carlo Excel Standalone - Quick Start

## 🚀 Build and Deploy in 3 Steps

---

## Step 1: Build the Executable (5 minutes)

### Install Dependencies

```bash
pip install pyinstaller xlwings
```

### Run Builder

```bash
cd excel_standalone
python build_standalone.py
```

**Output:** `dist/SPM_Monte_Carlo/` folder with:
- ✅ `spm_mc.exe` (~150MB)
- ✅ `README.txt` (client instructions)
- ✅ `Excel_Template_Instructions.txt`

---

## Step 2: Create Excel File (15 minutes)

### Quick Method - Copy Template

1. Create new Excel workbook
2. Save as `SPM_Monte_Carlo.xlsm` (macro-enabled)
3. Create these sheets:
   - **Dashboard** - Main interface
   - **Historical_Data** - Input data
   - **Plan_Config** - Compensation plan
   - **Config** - Settings
   - **Results** - Output (empty)

4. Copy VBA code:
   - Press **Alt+F11** (VBA editor)
   - Insert > Module
   - Paste code from `templates/VBA_Code.txt`

5. Add "Run Simulation" button on Dashboard:
   - Developer tab > Insert > Button
   - Draw button
   - Assign macro: `RunSimulation`

6. Add sample data to test

7. Save

### Sheet Templates:

#### Historical_Data Headers:
```
A1: rep_id | B1: period | C1: quota | D1: actual_sales | E1: quota_attainment
```

#### Plan_Config:
```
A2: Plan ID     | B2: MY_PLAN_2024
A3: Plan Name   | B3: 2024 Sales Commission

Row 6: tier_name | quota_min | quota_max | rate
Row 7: Tier 1    | 0.00      | 0.75      | 0.02
Row 8: Tier 2    | 0.75      | 1.00      | 0.03
```

#### Config:
```
A2: Iterations       | B2: 10000
A3: Random Seed      | B3: 42
A4: Sampling Strategy| B4: monte_carlo
```

---

## Step 3: Package and Test (5 minutes)

### 1. Copy Files Together

```
SPM_Monte_Carlo/
├── spm_mc.exe
├── SPM_Monte_Carlo.xlsm
└── README.txt
```

### 2. Test Locally

1. Open `SPM_Monte_Carlo.xlsm`
2. Enable macros
3. Add sample data
4. Click "Run Simulation"
5. Check results appear

### 3. Package for Client

```bash
# On Windows
Compress-Archive -Path "SPM_Monte_Carlo" -DestinationPath "SPM_Monte_Carlo_v1.0.zip"

# On Mac/Linux
zip -r SPM_Monte_Carlo_v1.0.zip SPM_Monte_Carlo/
```

### 4. Send to Client!

Upload to Dropbox/Google Drive and send link.

---

## Client Usage (What They Do)

1. **Download** ZIP file
2. **Unzip** to any folder
3. **Open** `SPM_Monte_Carlo.xlsm`
4. **Enable Macros** if prompted
5. **Add data** to Historical_Data sheet
6. **Click** "Run Simulation" button
7. **View results** in Results sheet

**No Python installation needed!**

---

## Testing Checklist

Before sending to client:

- [ ] Exe builds without errors
- [ ] Excel file has all 5 sheets
- [ ] VBA code runs without errors
- [ ] Sample simulation completes
- [ ] Results display correctly
- [ ] File size < 250MB
- [ ] README is clear

---

## Troubleshooting

### Build fails with "module not found"
```bash
pip install <missing_module>
```

### Exe too large (>300MB)
- Normal for first build
- Contains entire Python + dependencies

### "spm_mc.exe not found" in Excel
- Ensure exe is in SAME folder as Excel file

### Windows Security warning
- Normal for unsigned executables
- Click "More info" > "Run anyway"
- OR: Get code signing certificate

---

## What You Get

### For You (Developer):
- ✅ Reusable build system
- ✅ Professional deliverable
- ✅ Easy to update
- ✅ Can charge premium pricing

### For Client:
- ✅ No installation needed
- ✅ Just unzip and run
- ✅ Familiar Excel interface
- ✅ Fast Python engine

---

## Pricing Guide

**Standalone Package:** $2,500
- Includes exe + Excel template
- No installation required
- Email support for 90 days

**With Code Signing:** +$500
- No security warnings
- Professional trust

**With Training:** +$1,000
- 2-hour training session
- Custom demo with their data

---

## Next Steps

1. ✅ Build exe: `python build_standalone.py`
2. ✅ Create Excel template (use VBA code provided)
3. ✅ Test complete package
4. ✅ ZIP and send to client
5. 💰 Collect payment!

---

## Support

Questions? Check:
- `CLIENT_DEPLOYMENT_GUIDE.md` - Full deployment details
- `templates/VBA_Code.txt` - Complete VBA code
- `dist/SPM_Monte_Carlo/Excel_Template_Instructions.txt` - Excel setup

Ready to build! 🚀
