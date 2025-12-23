# Building the Standalone Executable - Quick Fix

## Issue with Current Build

The full build includes matplotlib which has PIL dependencies causing issues. For the Excel standalone version, we don't actually need visualization libraries since results go directly to Excel.

## Two Options:

### Option 1: Quick Build (Recommended for Excel)

**Create a minimal version without visualization:**

```bash
# Install only what's needed for Excel interface
pip install pyinstaller xlwings pandas numpy scipy openpyxl

# Build with minimal dependencies
pyinstaller --onefile \
    --name spm_mc \
    --console \
    --hidden-import pandas \
    --hidden-import numpy \
    --hidden-import scipy \
    --hidden-import scipy.stats \
    --hidden-import openpyxl \
    --hidden-import xlwings \
    spm_excel_interface.py
```

**Result:** Smaller exe (~80MB) without visualization dependencies

### Option 2: Full Build (Includes All Features)

**Fix the PIL issue first:**

```bash
# Install Pillow
pip install Pillow

# Then run the builder
python build_standalone.py
```

---

## Recommended Approach for Client Delivery

For Excel-only clients, **Option 1 is better** because:
- ✅ Smaller file size (~80MB vs ~150MB)
- ✅ Faster to build
- ✅ No visualization dependencies needed
- ✅ Excel handles all charting

Clients can create charts directly in Excel from the Results data.

---

## Manual Build Steps (If automated builder fails)

### 1. Simple PyInstaller Command

```bash
pyinstaller --onefile \
    --name spm_mc \
    --console \
    --clean \
    --hidden-import spm_monte_carlo \
    --hidden-import spm_monte_carlo.data \
    --hidden-import spm_monte_carlo.statistics \
    --hidden-import spm_monte_carlo.simulation \
    --hidden-import spm_monte_carlo.compensation \
    spm_excel_interface.py
```

### 2. Test the Executable

```bash
cd dist
./spm_mc ../path/to/excel_file.xlsm
```

### 3. Package for Distribution

```
SPM_Monte_Carlo/
├── spm_mc.exe (or spm_mc on Mac)
├── SPM_Monte_Carlo.xlsm
└── README.txt
```

---

## Alternative: Skip Standalone Build

**If PyInstaller is problematic**, use **Option 1 from deployment guide**:

### Python + Excel with Simple Installer

**What client gets:**
- Excel file
- `install.bat` that runs:
  ```batch
  pip install spm-monte-carlo xlwings
  xlwings addin install
  ```

**This works great and is actually easier to maintain!**

Benefits:
- ✅ No PyInstaller complexity
- ✅ Easy to update (just pip install --upgrade)
- ✅ Smaller download
- ✅ Client gets exact Python version you tested

Many enterprise clients prefer this because:
- IT can vet the exact Python packages
- Updates are simple
- More transparent what's installed

---

## For Mac Users (like you)

PyInstaller on Mac creates Mac executables (.app or Unix binary), **not Windows .exe files**.

To create Windows .exe for clients:

**Option A:** Build on Windows machine/VM
**Option B:** Use Windows in cloud (AWS/Azure)
**Option C:** Use wine/cross-compilation (complex)
**Option D:** Just use Python installer approach (easier!)

---

## My Recommendation

Since you're on Mac and most SPM clients are on Windows:

**Go with Python + Installer approach:**

1. Package your tool: `pip install -e .`
2. Upload to PyPI or private repo
3. Give clients simple installer:
   ```batch
   pip install spm-monte-carlo
   pip install xlwings
   xlwings addin install
   ```
4. Send them Excel file
5. Done!

**Charge the same $2,500** - clients don't care about the technical approach, they care that it's easy to use.

---

## Quick Test (Python Approach)

Want me to create the Python installer package instead? Takes 5 minutes and works cross-platform!

