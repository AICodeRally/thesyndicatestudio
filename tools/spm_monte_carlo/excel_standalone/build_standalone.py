"""
Build standalone executable for SPM Monte Carlo Excel integration.

This script creates a standalone .exe that bundles Python and all dependencies.
"""

import PyInstaller.__main__
import os
import shutil
from pathlib import Path

def build_standalone():
    """Build standalone executable using PyInstaller."""

    print("=" * 70)
    print("BUILDING SPM MONTE CARLO STANDALONE EXECUTABLE")
    print("=" * 70)

    # Get paths
    current_dir = Path(__file__).parent
    src_dir = current_dir.parent / 'src'
    interface_script = current_dir / 'spm_excel_interface.py'
    dist_dir = current_dir / 'dist'
    build_dir = current_dir / 'build'

    # Clean previous builds
    if dist_dir.exists():
        print("\nCleaning previous build...")
        shutil.rmtree(dist_dir)
    if build_dir.exists():
        shutil.rmtree(build_dir)

    print(f"\nBuilding from: {interface_script}")
    print(f"Source directory: {src_dir}")

    # PyInstaller arguments
    args = [
        str(interface_script),                  # Script to bundle
        '--onefile',                            # Single executable
        '--name=spm_mc',                        # Output name
        '--console',                            # Show console window for progress
        '--clean',                              # Clean cache
        f'--distpath={dist_dir}',              # Output directory
        f'--workpath={build_dir}',             # Build directory

        # Hidden imports (packages not auto-detected)
        '--hidden-import=spm_monte_carlo',
        '--hidden-import=spm_monte_carlo.data',
        '--hidden-import=spm_monte_carlo.statistics',
        '--hidden-import=spm_monte_carlo.simulation',
        '--hidden-import=spm_monte_carlo.compensation',
        '--hidden-import=spm_monte_carlo.exceptions',
        '--hidden-import=pandas',
        '--hidden-import=numpy',
        '--hidden-import=scipy',
        '--hidden-import=scipy.stats',
        '--hidden-import=scipy.optimize',
        '--hidden-import=matplotlib',
        '--hidden-import=openpyxl',
        '--hidden-import=xlsxwriter',
        '--hidden-import=xlwings',
        '--hidden-import=seaborn',

        # Add data files
        f'--add-data={src_dir / "spm_monte_carlo"}{os.pathsep}spm_monte_carlo',

        # Windows specific
        '--noupx',                              # Don't use UPX compression (can trigger antivirus)
    ]

    print("\nRunning PyInstaller...")
    print("This may take 2-5 minutes...\n")

    # Run PyInstaller
    PyInstaller.__main__.run(args)

    # Check if build succeeded
    exe_path = dist_dir / 'spm_mc.exe'
    if exe_path.exists():
        exe_size_mb = exe_path.stat().st_size / (1024 * 1024)
        print("\n" + "=" * 70)
        print("BUILD SUCCESSFUL!")
        print("=" * 70)
        print(f"\nExecutable created: {exe_path}")
        print(f"File size: {exe_size_mb:.1f} MB")
        print("\nNext steps:")
        print("1. Test the executable")
        print("2. Copy to distribution folder with Excel file")
        print("3. Package as ZIP for client delivery")
    else:
        print("\n" + "=" * 70)
        print("BUILD FAILED!")
        print("=" * 70)
        print("\nExecutable not found. Check error messages above.")

    return exe_path.exists()


def create_distribution_package():
    """Create complete distribution package."""

    print("\n" + "=" * 70)
    print("CREATING DISTRIBUTION PACKAGE")
    print("=" * 70)

    current_dir = Path(__file__).parent
    dist_dir = current_dir / 'dist'
    package_dir = dist_dir / 'SPM_Monte_Carlo'

    # Create package directory
    package_dir.mkdir(parents=True, exist_ok=True)

    # Copy executable
    exe_source = dist_dir / 'spm_mc.exe'
    if exe_source.exists():
        shutil.copy(exe_source, package_dir / 'spm_mc.exe')
        print(f"\n✓ Copied spm_mc.exe")
    else:
        print("\n✗ spm_mc.exe not found! Build it first.")
        return False

    # Create README
    readme_path = package_dir / 'README.txt'
    with open(readme_path, 'w') as f:
        f.write("""SPM MONTE CARLO SIMULATION TOOL
================================

INSTALLATION
------------
1. Extract this entire folder to any location on your computer
2. Keep all files together in the same folder
3. Do not move or rename files

USAGE
-----
1. Open SPM_Monte_Carlo.xlsm (Excel file)
2. Click "Enable Macros" if prompted
3. Add your historical data to the "Historical_Data" sheet
4. Configure your compensation plan in the "Plan_Config" sheet
5. Adjust simulation settings in the "Config" sheet (optional)
6. Click the "Run Simulation" button on the Dashboard
7. A command window will open showing progress
8. When complete, results will appear in the "Results" sheet

REQUIREMENTS
------------
- Windows 7 or later
- Microsoft Excel 2013 or later (2016+ recommended)
- Approximately 200 MB of disk space

TROUBLESHOOTING
---------------

Problem: "spm_mc.exe not found" error
Solution: Make sure spm_mc.exe is in the SAME folder as the Excel file

Problem: Windows Security warning
Solution: Click "More info" then "Run anyway" - the file is safe

Problem: Antivirus blocks the exe
Solution: Add an exception for spm_mc.exe in your antivirus software

Problem: Simulation runs very slowly
Solution: Reduce the number of iterations in the Config sheet

SUPPORT
-------
Email: support@yourcompany.com
Documentation: See Excel file for detailed instructions

VERSION
-------
Version 1.0
Built: 2024
""")
    print(f"✓ Created README.txt")

    # Create Excel template instructions
    excel_instructions = package_dir / 'Excel_Template_Instructions.txt'
    with open(excel_instructions, 'w') as f:
        f.write("""EXCEL TEMPLATE SETUP INSTRUCTIONS
==================================

You need to create the Excel file manually. Here's what to include:

REQUIRED SHEETS:
1. Dashboard - Main interface with Run button
2. Historical_Data - Input data
3. Plan_Config - Compensation plan setup
4. Config - Simulation settings
5. Results - Output from simulation

DASHBOARD SHEET:
- Title: "SPM Monte Carlo Simulation Tool"
- Button: "Run Simulation" (linked to VBA macro)
- Status cell: B8 (shows simulation progress)
- Instructions panel

HISTORICAL_DATA SHEET:
Columns (starting at A1):
- A: rep_id
- B: period
- C: quota
- D: actual_sales
- E: quota_attainment (optional)
- F: deal_count (optional)
- G: avg_deal_size (optional)

PLAN_CONFIG SHEET:
Plan Info (rows 1-4):
- A2: "Plan ID:" | B2: (enter plan ID)
- A3: "Plan Name:" | B3: (enter plan name)

Commission Tiers (starting row 6):
Headers: tier_name | quota_min | quota_max | rate
Data rows with tier definitions

Bonuses (optional, starting ~row 12):
Headers: bonus_name | trigger_metric | trigger_condition | trigger_value | payout | frequency

CONFIG SHEET:
- A2: "Iterations:" | B2: 10000
- A3: "Random Seed:" | B3: 42
- A4: "Sampling Strategy:" | B4: monte_carlo

RESULTS SHEET:
(Populated automatically by simulation)

VBA CODE:
Copy the code from VBA_Code.txt into your Excel VBA editor (Alt+F11)

For a complete template, contact support.
""")
    print(f"✓ Created Excel template instructions")

    print(f"\n" + "=" * 70)
    print("DISTRIBUTION PACKAGE READY!")
    print("=" * 70)
    print(f"\nPackage location: {package_dir}")
    print("\nPackage contents:")
    print("  - spm_mc.exe")
    print("  - README.txt")
    print("  - Excel_Template_Instructions.txt")
    print("\nTo complete:")
    print("  1. Create Excel file following instructions")
    print("  2. Add Excel file to this folder")
    print("  3. ZIP the entire folder")
    print("  4. Send to client!")

    return True


if __name__ == '__main__':
    print("\nSPM MONTE CARLO - STANDALONE BUILDER")
    print("=" * 70)

    # Step 1: Build executable
    print("\nSTEP 1: Building standalone executable...")
    if build_standalone():
        # Step 2: Create distribution package
        print("\nSTEP 2: Creating distribution package...")
        create_distribution_package()

        print("\n" + "=" * 70)
        print("ALL DONE!")
        print("=" * 70)
    else:
        print("\nBuild failed. Fix errors and try again.")
