"""
Example: Export a compensation plan to Excel.

Demonstrates the Excel exporter with professional formatting.
"""

import sys
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core import LibraryManager, TemplateEngine
from exporters import ExcelExporter


def main():
    print("=" * 70)
    print("SPM COMP PLAN ARCHITECT - EXCEL EXPORT DEMO")
    print("=" * 70)

    # Initialize
    library = LibraryManager()
    engine = TemplateEngine(library)
    exporter = ExcelExporter(library)

    # Create a sample plan
    print("\n1. Creating sample FY25 Enterprise AE Plan...")

    component_ids = [
        "OVERVIEW_STD_001",
        "ELIG_AE_001",
        "QUOTA_ANNUAL_001",
        "RATE_TIER_001",
        "ACCEL_100_001",
        "CREDIT_FULL_001",
        "PAY_MONTHLY_001",
        "CLAWBACK_001",
        "GOV_DISPUTES_001",
        "GOV_CHANGES_001",
        "DEF_BOOKINGS_001",
        "DEF_TERRITORY_001",
    ]

    plan = engine.create_plan(
        name="FY25 Enterprise AE Plan",
        component_ids=component_ids,
        effective_date="2025-01-01",
        end_date="2025-12-31",
        author="todd@bluehorizons.com",
        description="Standard compensation plan for Enterprise Account Executives with tiered rates and accelerators.",
        auto_resolve_dependencies=True
    )

    print(f"   ✅ Plan created: {plan.plan_id}")
    print(f"   Components: {len(plan.get_all_component_ids())}")
    print(f"   Sections: {len(plan.sections)}")

    # Export to Excel
    print("\n2. Exporting to Excel...")

    output_dir = Path(__file__).parent.parent / 'output'
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / 'FY25_Enterprise_AE_Plan.xlsx'

    exporter.export(plan, output_file)

    print(f"   ✅ Excel file created: {output_file}")
    print(f"   File size: {output_file.stat().st_size / 1024:.1f} KB")

    # Show what's in the Excel file
    print("\n3. Excel Workbook Structure:")
    print("   📊 Sheet 1: Summary - Plan overview and metadata")
    print("   📄 Sheet 2: Full Policy - Complete policy document")
    print("   📋 Sheet 3: Components - Component details table")
    print("   🎯 Sheet 4: Governance - Risk scorecard")

    print("\n" + "=" * 70)
    print("EXPORT COMPLETE!")
    print("=" * 70)
    print(f"\n✅ Open the file in Excel (Mac or PC) to view:")
    print(f"   {output_file}")

    print("\n💡 The workbook includes:")
    print("   • Professional formatting with Blue Horizons branding")
    print("   • Table of contents with section navigation")
    print("   • Full policy text from all components")
    print("   • Component metadata and dependencies")
    print("   • Governance risk scorecard with visual indicators")
    print("   • Compatible with Excel for Mac and PC!")

    return output_file


if __name__ == '__main__':
    main()
