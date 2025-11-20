"""
Add VBA code to the Excel template to make it macro-enabled.
Uses xlwings to add VBA macros programmatically.
"""

import xlwings as xw
from pathlib import Path


def add_vba_macros():
    """Add VBA macros to Excel template."""

    print("=" * 70)
    print("ADDING VBA MACROS TO EXCEL TEMPLATE")
    print("=" * 70)

    # Paths
    template_dir = Path(__file__).parent / 'dist' / 'SPM_Monte_Carlo'
    xlsx_path = template_dir / 'SPM_Monte_Carlo.xlsx'
    xlsm_path = template_dir / 'SPM_Monte_Carlo.xlsm'
    vba_code_path = Path(__file__).parent / 'templates' / 'VBA_Code.txt'

    # Read VBA code
    print(f"\n1. Reading VBA code from {vba_code_path}...")
    with open(vba_code_path, 'r') as f:
        vba_code = f.read()

    print(f"   VBA code size: {len(vba_code)} characters")

    # Open Excel file
    print(f"\n2. Opening Excel file: {xlsx_path}...")
    app = xw.App(visible=False)

    try:
        wb = app.books.open(str(xlsx_path))

        # Add VBA module
        print("\n3. Adding VBA module...")

        # Access VBA project
        vba_project = wb.api.VBProject

        # Add standard module
        vba_module = vba_project.VBComponents.Add(1)  # 1 = vbext_ct_StdModule
        vba_module.Name = "SPM_MonteCarlo"

        # Add VBA code
        vba_module.CodeModule.AddFromString(vba_code)

        print("   ✓ VBA module 'SPM_MonteCarlo' added successfully")

        # Save as macro-enabled workbook
        print(f"\n4. Saving as macro-enabled workbook: {xlsm_path}...")
        wb.api.SaveAs(str(xlsm_path), FileFormat=52)  # 52 = xlOpenXMLWorkbookMacroEnabled

        print("   ✓ Saved as .xlsm")

        # Close workbook
        wb.close()

        # Delete original .xlsx file
        print(f"\n5. Removing original .xlsx file...")
        xlsx_path.unlink()
        print("   ✓ Removed")

    finally:
        # Quit Excel
        app.quit()

    print("\n" + "=" * 70)
    print("✅ EXCEL FILE WITH VBA MACROS CREATED SUCCESSFULLY!")
    print("=" * 70)
    print(f"\nFile location: {xlsm_path}")
    print(f"File size: {xlsm_path.stat().st_size / 1024:.1f} KB")

    print("\n📝 FINAL STEPS:")
    print("1. Open SPM_Monte_Carlo.xlsm")
    print("2. Enable macros when prompted")
    print("3. Add sample data to Historical_Data sheet")
    print("4. Click 'Run Simulation' button on Dashboard")
    print("5. View results in Results sheet!")

    print("\n📦 READY FOR CLIENT DELIVERY:")
    print(f"   Package folder: {template_dir}")
    print("   Contents:")
    print("   - SPM_Monte_Carlo.xlsm (Excel file with VBA)")
    print("   - install.bat (Python installer)")

    return xlsm_path


if __name__ == '__main__':
    try:
        add_vba_macros()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

        print("\n⚠️  FALLBACK: Manual VBA Addition Required")
        print("\nIf VBA automation failed, you can add VBA manually:")
        print("1. Open SPM_Monte_Carlo.xlsx")
        print("2. Save As → Excel Macro-Enabled Workbook (.xlsm)")
        print("3. Press Alt+F11 (VBA editor)")
        print("4. Insert > Module")
        print("5. Copy code from templates/VBA_Code.txt")
        print("6. Save and close")
