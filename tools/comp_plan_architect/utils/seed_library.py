"""
Seed the component library with starter components.

This creates a starter set of ~30 common compensation plan components
across all major categories.
"""

from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.library_manager import (
    LibraryManager, Component, PolicyText, ComponentMetadata,
    ValidationRules, GovernanceImpact, ComponentCategory, ComponentStatus
)


def create_starter_library():
    """Create starter component library."""

    components = []

    # ========================================================================
    # OVERVIEW COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="OVERVIEW_STD_001",
        category=ComponentCategory.OVERVIEW.value,
        subcategory="Standard",
        name="Standard Plan Overview",
        version="1.0",
        policy_text=PolicyText(
            short="This document outlines the compensation structure for [ROLE].",
            detailed="""This compensation plan document outlines the structure, eligibility, measures,
and payment terms for [ROLE] positions. This plan is effective [START_DATE] through [END_DATE]
and supersedes all prior compensation arrangements.""",
            legal="This plan may be modified or terminated at any time at the company's sole discretion."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech", "Services"],
            plan_types=["Standard", "Enterprise", "SMB"],
            tags=["overview", "intro", "standard"]
        ),
        governance_impact=GovernanceImpact(financial_risk=0, complexity=1, compliance_risk=0)
    ))

    # ========================================================================
    # ELIGIBILITY COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="ELIG_SDR_001",
        category=ComponentCategory.ELIGIBILITY.value,
        subcategory="Role-Based",
        name="SDR Eligibility - Standard",
        version="2.1",
        policy_text=PolicyText(
            short="Must be in active SDR role for 90+ days",
            detailed="""Employee must hold an active Sales Development Representative (SDR) position
and have completed at least 90 days of employment. Part-time employees and contractors are not eligible.
Employees on performance improvement plans are not eligible for incentive compensation.""",
            legal="Eligibility is contingent upon good standing employment status per company policy."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["New Hire", "Standard"],
            compliance_flags=["FLSA_exempt"],
            typical_pairings=["MEASURE_MEETINGS_001", "MEASURE_OPPS_001"],
            tags=["eligibility", "SDR", "tenure"]
        ),
        validation_rules=ValidationRules(
            requires=["territory_assignment"],
            conflicts_with=["contractor_terms"]
        ),
        governance_impact=GovernanceImpact(financial_risk=1, complexity=2, compliance_risk=2)
    ))

    components.append(Component(
        component_id="ELIG_AE_001",
        category=ComponentCategory.ELIGIBILITY.value,
        subcategory="Role-Based",
        name="Account Executive Eligibility",
        version="2.0",
        policy_text=PolicyText(
            short="Active AE with assigned quota and territory",
            detailed="""Employee must hold an Account Executive position with an assigned annual quota
and defined territory. Must be in good standing with no active performance improvement plans.
Eligibility begins on the first day of the month following assignment of quota.""",
            legal="Plan participation requires signed offer letter or plan acceptance form."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech", "Enterprise"],
            plan_types=["Standard", "Enterprise"],
            compliance_flags=["FLSA_exempt", "SOX_compliant"],
            typical_pairings=["QUOTA_ANNUAL_001", "RATE_TIER_001"],
            tags=["eligibility", "AE", "quota"]
        ),
        validation_rules=ValidationRules(
            requires=["quota_assignment", "territory_assignment"],
            recommended_with=["RAMP_PERIOD_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=2, complexity=3, compliance_risk=2)
    ))

    # ========================================================================
    # MEASURE COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="MEASURE_MEETINGS_001",
        category=ComponentCategory.MEASURES.value,
        subcategory="Activity-Based",
        name="Qualified Meetings Booked",
        version="1.5",
        policy_text=PolicyText(
            short="Credit for qualified meetings booked with target accounts",
            detailed="""Credit is earned for each qualified meeting booked that meets the following criteria:
- Meeting scheduled with decision-maker or influencer
- Prospect meets ICP (Ideal Customer Profile) criteria
- Meeting confirmed by prospect via calendar acceptance
- AE attendance required for credit to be earned""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["SDR", "BDR"],
            tags=["activity", "meetings", "SDR"]
        ),
        validation_rules=ValidationRules(
            requires=["ELIG_SDR_001"],
            recommended_with=["RATE_PER_MEETING_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=3, complexity=4, compliance_risk=1)
    ))

    components.append(Component(
        component_id="MEASURE_OPPS_001",
        category=ComponentCategory.MEASURES.value,
        subcategory="Pipeline",
        name="Qualified Opportunities Created",
        version="1.3",
        policy_text=PolicyText(
            short="Credit for qualified opportunities created in CRM",
            detailed="""Credit is earned when a qualified opportunity is created and progresses to Stage 2
(Qualification) or beyond. Opportunity must meet minimum qualification criteria:
- Budget confirmed ($X+ annual contract value)
- Authority identified
- Need documented
- Timeline within 90 days""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["SDR", "BDR", "AE"],
            tags=["pipeline", "opportunities", "BANT"]
        ),
        validation_rules=ValidationRules(
            requires=["CRM_integration"],
            conflicts_with=["MEASURE_MEETINGS_001"]  # Typically one or the other
        ),
        governance_impact=GovernanceImpact(financial_risk=4, complexity=5, compliance_risk=1)
    ))

    components.append(Component(
        component_id="QUOTA_ANNUAL_001",
        category=ComponentCategory.MEASURES.value,
        subcategory="Quota",
        name="Annual Bookings Quota",
        version="3.0",
        policy_text=PolicyText(
            short="Annual quota measured as new bookings (ACV)",
            detailed="""Quota is set annually and measured as Annual Contract Value (ACV) of new bookings.
Quota is assigned individually based on territory, market segment, and historical performance.
Quota is prorated for partial periods based on hire date or role changes.""",
            legal="Quota may be adjusted at company discretion with 30 days notice."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech", "Enterprise"],
            plan_types=["AE", "Enterprise"],
            compliance_flags=["SOX_compliant"],
            typical_pairings=["ELIG_AE_001", "RATE_TIER_001"],
            tags=["quota", "bookings", "ACV"]
        ),
        validation_rules=ValidationRules(
            requires=["ELIG_AE_001"],
            recommended_with=["ACCEL_100_001", "RAMP_PERIOD_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=8, complexity=6, compliance_risk=3)
    ))

    components.append(Component(
        component_id="QUOTA_RETENTION_001",
        category=ComponentCategory.MEASURES.value,
        subcategory="Quota",
        name="Net Revenue Retention Quota",
        version="2.0",
        policy_text=PolicyText(
            short="Quota measured as Net Revenue Retention (NRR) percentage",
            detailed="""Quota is measured as Net Revenue Retention across assigned book of business.
NRR includes expansion, contraction, and churn. Target NRR is typically 105-115% annually.
Measured on a rolling 12-month basis.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS"],
            plan_types=["CSM", "AM", "Renewal"],
            tags=["retention", "NRR", "renewals"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["QUOTA_ANNUAL_001"],  # Different measure type
            recommended_with=["RATE_THRESHOLD_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=7, complexity=7, compliance_risk=2)
    ))

    # ========================================================================
    # RATE COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="RATE_FLAT_001",
        category=ComponentCategory.RATES.value,
        subcategory="Fixed",
        name="Flat Rate per Unit",
        version="1.0",
        policy_text=PolicyText(
            short="Fixed dollar amount per qualified unit",
            detailed="""Commission is paid as a fixed dollar amount for each qualified unit (meeting, opportunity, etc.).
Rate: $[AMOUNT] per unit. No tiers or accelerators apply.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["SDR", "BDR"],
            tags=["rate", "flat", "fixed", "simple"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["RATE_TIER_001", "RATE_PERCENT_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=2, complexity=1, compliance_risk=1)
    ))

    components.append(Component(
        component_id="RATE_TIER_001",
        category=ComponentCategory.RATES.value,
        subcategory="Tiered",
        name="Tiered Commission Rates",
        version="2.5",
        policy_text=PolicyText(
            short="Commission rate increases with quota attainment tiers",
            detailed="""Commission rate varies based on quota attainment percentage:
- 0-75%: 1.0% of bookings
- 75-100%: 2.0% of bookings
- 100-125%: 3.0% of bookings (accelerator)
- 125%+: 4.0% of bookings (super accelerator)

Tiers are retroactive for the full period.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech", "Enterprise"],
            plan_types=["AE", "Enterprise"],
            typical_pairings=["QUOTA_ANNUAL_001", "ACCEL_100_001"],
            tags=["rate", "tiered", "accelerator"]
        ),
        validation_rules=ValidationRules(
            requires=["QUOTA_ANNUAL_001"],
            conflicts_with=["RATE_FLAT_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=6, complexity=5, compliance_risk=2)
    ))

    components.append(Component(
        component_id="ACCEL_100_001",
        category=ComponentCategory.RATES.value,
        subcategory="Accelerators",
        name="100% Accelerator (1.5x rate)",
        version="1.8",
        policy_text=PolicyText(
            short="Accelerated rate of 1.5x base commission above 100% quota attainment",
            detailed="""For quota attainment above 100%, commission rate accelerates to 1.5x the base rate.
Example: If base rate is 2%, accelerated rate is 3% on all dollars above quota.
Acceleration applies only to incremental attainment, not retroactively.""",
            legal="Accelerator subject to quarterly business review and may be capped."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["AE", "Enterprise"],
            typical_pairings=["QUOTA_ANNUAL_001", "RATE_TIER_001"],
            tags=["accelerator", "multiplier", "quota"]
        ),
        validation_rules=ValidationRules(
            requires=["QUOTA_ANNUAL_001"],
            warnings=["Consider setting cap at 150-200% to control financial exposure"]
        ),
        governance_impact=GovernanceImpact(financial_risk=8, complexity=4, compliance_risk=2)
    ))

    # ========================================================================
    # CREDITING COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="CREDIT_FULL_001",
        category=ComponentCategory.CREDITING.value,
        subcategory="Single",
        name="Full Credit to Primary Rep",
        version="1.0",
        policy_text=PolicyText(
            short="100% credit assigned to primary rep on opportunity",
            detailed="""Full credit (100%) is assigned to the primary sales representative on the opportunity
at time of booking. No split crediting. Primary rep is determined by opportunity owner in CRM.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["Standard", "SMB"],
            tags=["credit", "single", "simple"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["CREDIT_SPLIT_001"],
            recommended_with=["TERRITORY_ASSIGN_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=3, complexity=1, compliance_risk=1)
    ))

    components.append(Component(
        component_id="CREDIT_SPLIT_001",
        category=ComponentCategory.CREDITING.value,
        subcategory="Split",
        name="Split Credit Rules",
        version="2.2",
        policy_text=PolicyText(
            short="Credit split between multiple reps based on defined rules",
            detailed="""Credit may be split between multiple representatives based on the following rules:
- SDR: 10% credit for qualified opportunity creation
- Primary AE: 70% credit for closing
- Overlay/Specialist: 20% credit for technical win
Total must equal 100%. Splits defined at opportunity creation and cannot be changed without manager approval.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech", "Enterprise"],
            plan_types=["Enterprise", "Complex"],
            typical_pairings=["TERRITORY_OVERLAY_001"],
            tags=["credit", "split", "overlay"]
        ),
        validation_rules=ValidationRules(
            requires=["TERRITORY_ASSIGN_001"],
            warnings=["Split crediting increases operational complexity and should be used sparingly"]
        ),
        governance_impact=GovernanceImpact(financial_risk=5, complexity=8, compliance_risk=3)
    ))

    # ========================================================================
    # PAYMENT TERMS COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="PAY_MONTHLY_001",
        category=ComponentCategory.PAYMENT_TERMS.value,
        subcategory="Frequency",
        name="Monthly Payment Schedule",
        version="1.5",
        policy_text=PolicyText(
            short="Commission paid monthly, 45 days after period end",
            detailed="""Commission is calculated and paid monthly. Payment is made approximately 45 days
after the end of each month to allow for deal validation, collections, and payroll processing.
Commissions under $100 may be carried forward to the next payment period.""",
            legal="Payment subject to active employment status at time of payment."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["Standard", "Enterprise"],
            tags=["payment", "monthly", "schedule"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["PAY_QUARTERLY_001"],
            recommended_with=["CLAWBACK_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=2, complexity=2, compliance_risk=2)
    ))

    components.append(Component(
        component_id="PAY_QUARTERLY_001",
        category=ComponentCategory.PAYMENT_TERMS.value,
        subcategory="Frequency",
        name="Quarterly Payment Schedule",
        version="1.3",
        policy_text=PolicyText(
            short="Commission paid quarterly, 60 days after quarter end",
            detailed="""Commission is calculated quarterly and paid approximately 60 days after quarter end.
This allows for full quarter reconciliation, churn analysis, and collections validation.
Quarterly payments may include true-up adjustments from prior periods.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Enterprise"],
            plan_types=["Enterprise", "Executive"],
            tags=["payment", "quarterly", "schedule"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["PAY_MONTHLY_001"]
        ),
        governance_impact=GovernanceImpact(financial_risk=3, complexity=3, compliance_risk=2)
    ))

    components.append(Component(
        component_id="CLAWBACK_001",
        category=ComponentCategory.PAYMENT_TERMS.value,
        subcategory="Clawbacks",
        name="Standard Clawback Terms",
        version="2.0",
        policy_text=PolicyText(
            short="Commission subject to clawback for cancellations within 90 days",
            detailed="""Commission is subject to clawback if the customer:
- Cancels within 90 days of booking
- Fails to make first payment
- Contract is otherwise invalidated

Clawback amount is deducted from future commission payments. If employee terminates before
clawback can be recovered, company may pursue recovery per employment agreement.""",
            legal="Clawback terms are enforceable per state employment law and signed plan agreement."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["Standard", "Enterprise"],
            compliance_flags=["employment_law"],
            tags=["clawback", "cancellation", "recovery"]
        ),
        validation_rules=ValidationRules(
            recommended_with=["PAY_MONTHLY_001"],
            warnings=["Ensure clawback terms comply with state employment laws"]
        ),
        governance_impact=GovernanceImpact(financial_risk=5, complexity=6, compliance_risk=7)
    ))

    # ========================================================================
    # GOVERNANCE COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="GOV_DISPUTES_001",
        category=ComponentCategory.GOVERNANCE.value,
        subcategory="Disputes",
        name="Dispute Resolution Process",
        version="1.0",
        policy_text=PolicyText(
            short="Disputes must be raised within 30 days via formal process",
            detailed="""Any disputes regarding commission calculations must be raised within 30 days of
payment date. Submit disputes via the Compensation Portal with supporting documentation.
Disputes will be reviewed by Compensation team and resolved within 15 business days.
Final determination rests with VP of Sales Operations.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["All"],
            plan_types=["Standard", "Enterprise"],
            tags=["governance", "disputes", "process"]
        ),
        governance_impact=GovernanceImpact(financial_risk=2, complexity=3, compliance_risk=4)
    ))

    components.append(Component(
        component_id="GOV_CHANGES_001",
        category=ComponentCategory.GOVERNANCE.value,
        subcategory="Plan Changes",
        name="Plan Modification Terms",
        version="1.5",
        policy_text=PolicyText(
            short="Plan may be modified with 30 days notice",
            detailed="""Company reserves the right to modify this compensation plan at any time.
Material changes will be communicated with at least 30 days advance notice.
Changes include quota adjustments, rate changes, measure modifications, etc.
Continued employment constitutes acceptance of plan changes.""",
            legal="This plan does not constitute an employment contract and may be modified at company discretion."
        ),
        metadata=ComponentMetadata(
            industry=["All"],
            plan_types=["Standard", "Enterprise"],
            compliance_flags=["employment_law"],
            tags=["governance", "changes", "modifications"]
        ),
        governance_impact=GovernanceImpact(financial_risk=3, complexity=2, compliance_risk=8)
    ))

    # ========================================================================
    # ADDITIONAL IMPORTANT COMPONENTS
    # ========================================================================

    components.append(Component(
        component_id="RAMP_PERIOD_001",
        category=ComponentCategory.GOVERNANCE.value,
        subcategory="Ramps",
        name="New Hire Ramp Period (90 days)",
        version="1.2",
        policy_text=PolicyText(
            short="Reduced quota for first 90 days, full quota thereafter",
            detailed="""New hires receive ramped quota for first 90 days:
- Month 1: 25% of full quota
- Month 2: 50% of full quota
- Month 3: 75% of full quota
- Month 4+: 100% of full quota

Commission rates remain standard throughout ramp. Quota proration does not extend beyond 90 days.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["New Hire", "Standard"],
            typical_pairings=["ELIG_AE_001", "QUOTA_ANNUAL_001"],
            tags=["ramp", "onboarding", "new hire"]
        ),
        governance_impact=GovernanceImpact(financial_risk=4, complexity=4, compliance_risk=1)
    ))

    components.append(Component(
        component_id="CAP_150_001",
        category=ComponentCategory.RATES.value,
        subcategory="Caps",
        name="Commission Cap at 150% Quota",
        version="1.1",
        policy_text=PolicyText(
            short="Maximum commission earned at 150% of quota attainment",
            detailed="""Commission is capped at 150% of quota attainment. No additional commission
is earned beyond this threshold. This cap protects company from windfall deals and ensures
balanced territory management.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["Standard", "Capped"],
            tags=["cap", "ceiling", "maximum"]
        ),
        validation_rules=ValidationRules(
            conflicts_with=["ACCEL_UNCAPPED_001"],
            warnings=["Caps may reduce motivation for top performers"]
        ),
        governance_impact=GovernanceImpact(financial_risk=-5, complexity=3, compliance_risk=1)  # Negative risk = reduces risk
    ))

    components.append(Component(
        component_id="SPIF_Q4_001",
        category=ComponentCategory.RATES.value,
        subcategory="SPIFs",
        name="Q4 Accelerator SPIF",
        version="1.0",
        policy_text=PolicyText(
            short="Additional 0.5% commission on all Q4 bookings",
            detailed="""Special Performance Incentive (SPIF) for Q4: Additional 0.5% commission
on all new bookings closed in Q4 (October 1 - December 31). This SPIF stacks on top of
standard commission rates and accelerators. Paid with January commission payment.""",
            legal="SPIF subject to cancellation at any time."
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["Standard", "Enterprise"],
            tags=["SPIF", "accelerator", "Q4", "temporary"]
        ),
        governance_impact=GovernanceImpact(financial_risk=6, complexity=3, compliance_risk=1)
    ))

    # ========================================================================
    # DEFINITIONS
    # ========================================================================

    components.append(Component(
        component_id="DEF_BOOKINGS_001",
        category=ComponentCategory.DEFINITIONS.value,
        subcategory="Financial",
        name="Definition: Bookings",
        version="1.0",
        policy_text=PolicyText(
            short="Bookings = Annual Contract Value (ACV) of signed deals",
            detailed="""Bookings are defined as the Annual Contract Value (ACV) of new contracts signed
during the measurement period. ACV includes:
- Subscription fees (normalized to 12 months)
- Committed professional services
- EXCLUDES: One-time fees, usage overage, renewals

Bookings are recognized on the contract signature date, not implementation or go-live date.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["SaaS", "Tech"],
            plan_types=["All"],
            tags=["definition", "bookings", "ACV"]
        ),
        governance_impact=GovernanceImpact(financial_risk=0, complexity=2, compliance_risk=1)
    ))

    components.append(Component(
        component_id="DEF_TERRITORY_001",
        category=ComponentCategory.DEFINITIONS.value,
        subcategory="Operational",
        name="Definition: Territory",
        version="1.0",
        policy_text=PolicyText(
            short="Territory = Assigned accounts, geography, or market segment",
            detailed="""Territory is defined as the specific set of accounts, geographic region,
or market segment assigned to a sales representative. Territory assignments are managed
in Salesforce and may include:
- Named accounts (Enterprise)
- Geographic regions (SMB)
- Industry verticals
- Company size segments

Territory changes require VP Sales approval.""",
            legal=None
        ),
        metadata=ComponentMetadata(
            industry=["All"],
            plan_types=["All"],
            tags=["definition", "territory", "assignment"]
        ),
        governance_impact=GovernanceImpact(financial_risk=0, complexity=3, compliance_risk=2)
    ))

    # Create library and add all components
    print("Creating starter component library...")
    print(f"Total components to add: {len(components)}")

    library = LibraryManager()

    added = 0
    for component in components:
        try:
            library.add_component(component)
            added += 1
            print(f"  ✓ Added: {component.component_id} - {component.name}")
        except ValueError as e:
            print(f"  ⚠ Skipped {component.component_id}: {e}")

    print(f"\n✅ Successfully added {added}/{len(components)} components!")

    # Print summary
    stats = library.get_stats()
    print(f"\nLibrary Statistics:")
    print(f"  Total Components: {stats['total_components']}")
    print(f"  By Category:")
    for category, count in sorted(stats['by_category'].items()):
        print(f"    - {category}: {count}")

    return library


if __name__ == '__main__':
    create_starter_library()
