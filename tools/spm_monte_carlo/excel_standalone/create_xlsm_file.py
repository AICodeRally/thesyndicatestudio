"""
Create complete Excel Macro-Enabled Workbook (.xlsm) with VBA code.

Since xlwings VBA manipulation requires Excel to be open, we'll use
the xlsxwriter approach or provide clear manual instructions.
"""

import shutil
from pathlib import Path
import zipfile
import os


def create_manual_instructions():
    """Create clear instructions for manual VBA addition."""

    print("=" * 70)
    print("EXCEL TEMPLATE READY - MANUAL VBA ADDITION REQUIRED")
    print("=" * 70)

    template_dir = Path(__file__).parent / 'dist' / 'SPM_Monte_Carlo'
    xlsx_path = template_dir / 'SPM_Monte_Carlo.xlsx'
    vba_code_path = Path(__file__).parent / 'templates' / 'VBA_Code.txt'

    print(f"\n✅ Excel template created: {xlsx_path}")
    print(f"✅ VBA code available: {vba_code_path}")

    # Create step-by-step instruction file
    instructions = """
================================================================================
SPM MONTE CARLO - ADD VBA MACROS (5 MINUTES)
================================================================================

QUICK STEPS TO ENABLE MACROS:
------------------------------

1. OPEN EXCEL FILE
   • Double-click: SPM_Monte_Carlo.xlsx
   • Excel will open

2. SAVE AS MACRO-ENABLED WORKBOOK
   • File → Save As
   • Choose location (or keep same folder)
   • File Format: "Excel Macro-Enabled Workbook (*.xlsm)"
   • Click Save
   • ✓ You now have SPM_Monte_Carlo.xlsm

3. OPEN VBA EDITOR
   • Press: Alt + F11 (Windows) or Fn + Option + F11 (Mac)
   • VBA Editor window opens

4. INSERT NEW MODULE
   • In VBA Editor: Insert → Module
   • A new blank module appears (Module1)

5. COPY VBA CODE
   • Open file: templates/VBA_Code.txt
   • Select all (Ctrl+A / Cmd+A)
   • Copy (Ctrl+C / Cmd+C)

6. PASTE INTO MODULE
   • Click in Module1 code window
   • Paste (Ctrl+V / Cmd+V)
   • Code appears in the module

7. RENAME MODULE (Optional)
   • In Properties window (bottom left)
   • Change (Name) from "Module1" to "SPM_MonteCarlo"

8. SAVE AND CLOSE
   • File → Save (or Ctrl+S / Cmd+S)
   • Close VBA Editor
   • Close Excel

9. TEST THE MACRO
   • Open SPM_Monte_Carlo.xlsm
   • Click "Enable Macros" if prompted
   • Go to Dashboard sheet
   • Add sample data to Historical_Data sheet (already has examples)
   • Click "RUN SIMULATION" button
   • ✓ Results appear in Results sheet!

================================================================================
TROUBLESHOOTING:
================================================================================

ISSUE: "Enable Macros" doesn't appear
   → Excel may already trust the file location
   → File → Options → Trust Center → Trust Center Settings
   → Macro Settings → Enable all macros (or trust location)

ISSUE: Button doesn't work
   → Developer tab → Insert → Button (Form Control)
   → Draw button over "▶ RUN SIMULATION" text
   → Assign macro: RunSimulation
   → Click OK

ISSUE: "spm_mc.exe not found"
   → Make sure you run install.bat first
   → OR: Put spm_mc.exe in same folder as Excel file

ISSUE: No Developer tab in Excel
   → File → Options → Customize Ribbon
   → Check "Developer" in right column
   → Click OK

================================================================================
CLIENT DEPLOYMENT PACKAGE:
================================================================================

Once you've added VBA and tested, ZIP these files:

SPM_Monte_Carlo/
├── SPM_Monte_Carlo.xlsm    ← Excel file with VBA
├── install.bat              ← Python installer (Windows)
└── README.txt               ← Client instructions

For Mac clients:
   Create install.sh instead of .bat

================================================================================
NEXT STEPS:
================================================================================

1. ✅ Follow steps 1-9 above (takes 5 minutes)
2. ✅ Test the simulation works
3. ✅ ZIP the package
4. ✅ Send to client
5. 💰 Collect $2,500!

================================================================================
ALTERNATIVE: PYTHON INSTALLER APPROACH (NO VBA NEEDED)
================================================================================

If VBA is problematic, you can use xlwings UDF approach:

1. Client runs: install.bat
2. Opens Excel file
3. xlwings handles everything automatically
4. No VBA macros needed!

This is actually EASIER and more reliable for cross-platform deployment.

See: CLIENT_DEPLOYMENT_GUIDE.md for full details

================================================================================
"""

    # Save instructions
    instructions_path = template_dir / 'ADD_VBA_INSTRUCTIONS.txt'
    with open(instructions_path, 'w') as f:
        f.write(instructions)

    print(f"\n📝 Detailed instructions saved: {instructions_path}")

    # Also create a quick reference card
    quick_ref = """
QUICK REFERENCE: Add VBA to Excel
==================================

1. Open SPM_Monte_Carlo.xlsx
2. Save As → .xlsm (Macro-Enabled)
3. Alt+F11 (VBA Editor)
4. Insert → Module
5. Copy templates/VBA_Code.txt
6. Paste into module
7. Save & Close
8. Test button on Dashboard sheet

Done! ✅
"""

    quick_ref_path = template_dir / 'QUICK_VBA_STEPS.txt'
    with open(quick_ref_path, 'w') as f:
        f.write(quick_ref)

    print(f"📝 Quick reference saved: {quick_ref_path}")

    print("\n" + "=" * 70)
    print("📦 DEPLOYMENT PACKAGE READY!")
    print("=" * 70)

    print(f"\n📂 Location: {template_dir}")
    print("\n📁 Contents:")
    for item in sorted(template_dir.iterdir()):
        size = item.stat().st_size
        if size > 1024:
            size_str = f"{size / 1024:.1f} KB"
        else:
            size_str = f"{size} bytes"
        print(f"   • {item.name} ({size_str})")

    print("\n✅ WHAT YOU HAVE NOW:")
    print("   • Excel template with all sheets and formatting")
    print("   • VBA code ready to copy")
    print("   • Python installer (install.bat)")
    print("   • Complete instructions for adding VBA")

    print("\n⏭️  NEXT STEPS:")
    print("   1. Follow ADD_VBA_INSTRUCTIONS.txt (5 minutes)")
    print("   2. Test the simulation")
    print("   3. ZIP the folder")
    print("   4. Send to client!")

    print("\n💡 TIP: For faster deployment, consider the Python installer")
    print("   approach (no VBA needed) - see CLIENT_DEPLOYMENT_GUIDE.md")

    return template_dir


if __name__ == '__main__':
    try:
        create_manual_instructions()
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
