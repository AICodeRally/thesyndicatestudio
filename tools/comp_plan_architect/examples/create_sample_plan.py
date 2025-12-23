"""
Example: Create a sample AE compensation plan.

This demonstrates the template assembly engine with dependency resolution,
conflict detection, and gap analysis.
"""

import sys
from pathlib import Path

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core import LibraryManager, TemplateEngine


def main():
    print("=" * 70)
    print("SPM COMP PLAN ARCHITECT - CREATE SAMPLE PLAN")
    print("=" * 70)

    # Initialize
    library = LibraryManager()
    engine = TemplateEngine(library)

    print(f"\nLibrary loaded: {len(library.components)} components available")

    # Create a sample AE plan
    print("\n" + "-" * 70)
    print("Creating FY25 Enterprise AE Plan...")
    print("-" * 70)

    component_ids = [
        "OVERVIEW_STD_001",      # Plan overview
        "ELIG_AE_001",           # AE eligibility (requires quota + territory)
        "QUOTA_ANNUAL_001",      # Annual quota
        "RATE_TIER_001",         # Tiered rates
        "ACCEL_100_001",         # 100% accelerator
        "CREDIT_FULL_001",       # Full credit
        "PAY_MONTHLY_001",       # Monthly payments
        "CLAWBACK_001",          # Clawback terms
        "GOV_DISPUTES_001",      # Dispute resolution
        "GOV_CHANGES_001",       # Plan modification terms
        "DEF_BOOKINGS_001",      # Define bookings
        "DEF_TERRITORY_001",     # Define territory
    ]

    print(f"\nSelected {len(component_ids)} components:")
    for comp_id in component_ids:
        comp = library.get_component(comp_id)
        print(f"  • {comp_id}: {comp.name}")

    # Create plan with auto-dependency resolution
    plan = engine.create_plan(
        name="FY25 Enterprise AE Plan",
        component_ids=component_ids,
        effective_date="2025-01-01",
        end_date="2025-12-31",
        author="todd@bluehorizons.com",
        description="Standard compensation plan for Enterprise Account Executives",
        auto_resolve_dependencies=True
    )

    print(f"\n✅ Plan created: {plan.plan_id}")
    print(f"   Name: {plan.metadata.name}")
    print(f"   Effective: {plan.metadata.effective_date}")
    print(f"   Status: {plan.metadata.status}")
    print(f"   Total components: {len(plan.get_all_component_ids())}")

    # Show sections
    print(f"\n📋 Plan Structure ({len(plan.sections)} sections):")
    for section in plan.sections:
        print(f"\n  {section.section_num}. {section.title}")
        for comp_id in section.component_ids:
            comp = library.get_component(comp_id)
            print(f"     • {comp_id}: {comp.name}")

    # Check for warnings
    warnings = engine.get_warnings(plan)
    if warnings:
        print(f"\n⚠️  Warnings ({len(warnings)}):")
        for warning in warnings:
            print(f"   • {warning}")
    else:
        print(f"\n✅ No warnings")

    # Check for missing categories
    missing = engine.get_missing_categories(plan)
    if missing:
        print(f"\n❌ Missing Required Categories:")
        for cat in missing:
            print(f"   • {cat}")
    else:
        print(f"\n✅ All required categories present")

    # Save plan
    filepath = engine.save_plan(plan)
    print(f"\n💾 Plan saved to: {filepath}")
    print(f"   File size: {filepath.stat().st_size / 1024:.1f} KB")

    # Show plan summary
    print(f"\n" + "=" * 70)
    print("PLAN SUMMARY")
    print("=" * 70)

    total_financial_risk = 0
    total_complexity = 0
    total_compliance_risk = 0

    for comp_id in plan.get_all_component_ids():
        comp = library.get_component(comp_id)
        total_financial_risk += comp.governance_impact.financial_risk
        total_complexity += comp.governance_impact.complexity
        total_compliance_risk += comp.governance_impact.compliance_risk

    # Simple governance score (out of 100)
    # Financial (30%), Complexity (25%), Compliance (25%), Operational (20%)
    financial_score = min(100, (total_financial_risk / len(plan.get_all_component_ids())) * 10 * 0.30)
    complexity_score = min(100, (total_complexity / len(plan.get_all_component_ids())) * 10 * 0.25)
    compliance_score = min(100, (total_compliance_risk / len(plan.get_all_component_ids())) * 10 * 0.25)

    governance_score = int(financial_score + complexity_score + compliance_score)

    print(f"\n📊 Governance Risk Score: {governance_score}/100")
    if governance_score < 40:
        print(f"   Risk Level: ✅ LOW RISK")
    elif governance_score < 70:
        print(f"   Risk Level: ⚠️  MEDIUM RISK")
    else:
        print(f"   Risk Level: 🚨 HIGH RISK")

    print(f"\n   Breakdown:")
    print(f"   - Financial Exposure: {int(financial_score)}/30")
    print(f"   - Complexity: {int(complexity_score)}/25")
    print(f"   - Compliance Risk: {int(compliance_score)}/25")

    print(f"\n✅ Plan creation complete!")

    return plan


if __name__ == '__main__':
    main()
