#!/usr/bin/env python3
"""
Complete SPM Monte Carlo Package Builder

This script builds the entire client-ready package:
  1. Creates Excel template with all sheets
  2. Copies VBA code and instructions
  3. Creates installers
  4. Packages everything together
  5. Creates ZIP file for distribution

Usage:
    python build_complete_package.py
"""

import shutil
from pathlib import Path
import zipfile
from datetime import datetime


def build_complete_package():
    """Build complete client deployment package."""

    print("=" * 80)
    print("SPM MONTE CARLO - COMPLETE PACKAGE BUILDER")
    print("=" * 80)

    # Setup paths
    base_dir = Path(__file__).parent
    dist_dir = base_dir / 'dist' / 'SPM_Monte_Carlo'
    templates_dir = base_dir / 'templates'

    # Step 1: Create Excel template
    print("\n" + "=" * 80)
    print("STEP 1: Creating Excel Template")
    print("=" * 80)

    from create_excel_template import create_excel_template
    excel_path = create_excel_template()

    print(f"✅ Excel template created: {excel_path}")

    # Step 2: Ensure all documentation is present
    print("\n" + "=" * 80)
    print("STEP 2: Verifying Documentation")
    print("=" * 80)

    doc_files = {
        'README.txt': 'Client readme',
        'install.bat': 'Windows installer',
        'ADD_VBA_INSTRUCTIONS.txt': 'VBA setup guide',
        'QUICK_VBA_STEPS.txt': 'Quick reference',
    }

    missing = []
    for filename, description in doc_files.items():
        file_path = dist_dir / filename
        if file_path.exists():
            print(f"✅ {description}: {filename}")
        else:
            print(f"⚠️  Missing {description}: {filename}")
            missing.append(filename)

    # Step 3: Copy VBA code to dist folder for easy access
    print("\n" + "=" * 80)
    print("STEP 3: Copying VBA Code")
    print("=" * 80)

    vba_source = templates_dir / 'VBA_Code.txt'
    vba_dest = dist_dir / 'VBA_Code.txt'

    if vba_source.exists():
        shutil.copy(vba_source, vba_dest)
        print(f"✅ VBA code copied to: {vba_dest}")
    else:
        print(f"⚠️  VBA source not found: {vba_source}")

    # Step 4: Create Mac installer
    print("\n" + "=" * 80)
    print("STEP 4: Creating Mac Installer")
    print("=" * 80)

    mac_installer = dist_dir / 'install.sh'
    mac_installer_content = """#!/bin/bash
echo "========================================"
echo "SPM MONTE CARLO TOOL - INSTALLATION"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed!"
    echo ""
    echo "Please install Python 3.8 or later from:"
    echo "https://www.python.org/downloads/"
    exit 1
fi

echo "Python found!"
python3 --version
echo ""

echo "Installing required packages..."
echo "This may take 2-3 minutes..."
echo ""

python3 -m pip install --upgrade pip
pip3 install pandas numpy scipy openpyxl xlwings

echo ""
echo "Installing SPM Monte Carlo package..."
pip3 install spm-monte-carlo

echo ""
echo "Installing xlwings Excel add-in..."
xlwings addin install

echo ""
echo "========================================"
echo "INSTALLATION COMPLETE!"
echo "========================================"
echo ""
echo "You can now open SPM_Monte_Carlo.xlsm"
echo "and click 'Run Simulation'"
echo ""
read -p "Press Enter to exit..."
"""

    with open(mac_installer, 'w') as f:
        f.write(mac_installer_content)

    # Make executable
    mac_installer.chmod(0o755)
    print(f"✅ Mac installer created: {mac_installer}")

    # Step 5: Inventory the package
    print("\n" + "=" * 80)
    print("STEP 5: Package Inventory")
    print("=" * 80)

    total_size = 0
    files_list = []

    for item in sorted(dist_dir.iterdir()):
        if item.is_file():
            size = item.stat().st_size
            total_size += size
            size_kb = size / 1024

            files_list.append({
                'name': item.name,
                'size': size,
                'size_kb': size_kb
            })

            print(f"  📄 {item.name:<40} {size_kb:>8.1f} KB")

    print(f"\n  Total size: {total_size / 1024:.1f} KB")

    # Step 6: Create ZIP file
    print("\n" + "=" * 80)
    print("STEP 6: Creating Distribution ZIP")
    print("=" * 80)

    version = "1.0"
    date_str = datetime.now().strftime("%Y%m%d")
    zip_name = f"SPM_Monte_Carlo_v{version}_{date_str}.zip"
    zip_path = base_dir / 'dist' / zip_name

    print(f"\nCreating: {zip_name}...")

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for item in dist_dir.rglob('*'):
            if item.is_file():
                arcname = 'SPM_Monte_Carlo' / item.relative_to(dist_dir)
                zipf.write(item, arcname)
                print(f"  Added: {item.name}")

    zip_size = zip_path.stat().st_size / 1024

    print(f"\n✅ ZIP file created: {zip_path}")
    print(f"   Size: {zip_size:.1f} KB (compressed)")

    # Step 7: Final Summary
    print("\n" + "=" * 80)
    print("BUILD COMPLETE! 🎉")
    print("=" * 80)

    print(f"\n📦 PACKAGE CONTENTS:")
    print(f"   Location: {dist_dir}")
    print(f"   Files: {len(files_list)}")
    print(f"   Total size: {total_size / 1024:.1f} KB")

    print(f"\n📦 DISTRIBUTION FILE:")
    print(f"   {zip_path}")
    print(f"   Size: {zip_size:.1f} KB")

    print(f"\n✅ READY FOR CLIENT DELIVERY:")

    print(f"\n   Package includes:")
    for file_info in files_list:
        print(f"      • {file_info['name']}")

    print(f"\n   What client gets:")
    print(f"      1. Excel template (ready to use)")
    print(f"      2. Python installer (Windows & Mac)")
    print(f"      3. VBA code & instructions")
    print(f"      4. Complete documentation")
    print(f"      5. Quick start guide")

    print(f"\n⏭️  NEXT STEPS:")
    print(f"   1. Test the package:")
    print(f"      • Extract ZIP file")
    print(f"      • Run install.bat (Windows) or install.sh (Mac)")
    print(f"      • Open Excel file")
    print(f"      • Test simulation")
    print(f"")
    print(f"   2. Add VBA to Excel (5 minutes):")
    print(f"      • Follow ADD_VBA_INSTRUCTIONS.txt")
    print(f"      • Or use templates/VBA_Code.txt")
    print(f"")
    print(f"   3. Send to client:")
    print(f"      • Upload {zip_name} to Dropbox/Drive")
    print(f"      • Send download link")
    print(f"      • Include support contact info")
    print(f"")
    print(f"   4. 💰 Collect payment ($2,500)")

    print(f"\n📊 DEPLOYMENT OPTIONS:")
    print(f"   Option 1: Python + Excel (Recommended)")
    print(f"      • Client runs install.bat")
    print(f"      • Opens Excel file")
    print(f"      • No VBA needed with xlwings")
    print(f"      • ✓ Cross-platform")
    print(f"      • ✓ Easy updates")
    print(f"")
    print(f"   Option 2: Standalone .xlsm")
    print(f"      • Add VBA to Excel file")
    print(f"      • Client opens .xlsm")
    print(f"      • Clicks button")
    print(f"      • ✓ No installation")
    print(f"      • ✓ Simpler for client")

    if missing:
        print(f"\n⚠️  MISSING FILES (optional):")
        for filename in missing:
            print(f"      • {filename}")

    print("\n" + "=" * 80)
    print("Ready to deploy! 🚀")
    print("=" * 80)

    return {
        'dist_dir': dist_dir,
        'zip_path': zip_path,
        'total_size': total_size,
        'files': files_list,
        'zip_size': zip_size
    }


if __name__ == '__main__':
    try:
        result = build_complete_package()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
