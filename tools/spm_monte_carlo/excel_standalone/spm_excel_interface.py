"""
Excel interface for SPM Monte Carlo tool.
This module connects Excel to the Python Monte Carlo engine.
"""

import sys
import pandas as pd
import numpy as np
from pathlib import Path

# Import our Monte Carlo engine
from spm_monte_carlo import MonteCarloSimulator, CompensationPlan


def load_data_from_excel(wb):
    """Load historical data from Excel Historical_Data sheet."""
    try:
        hist_sheet = wb.sheets['Historical_Data']

        # Find data range (assumes headers in row 1)
        data_range = hist_sheet.range('A1').expand()

        # Convert to DataFrame
        data = data_range.options(pd.DataFrame, header=True, index=False).value

        print(f"Loaded {len(data)} rows of historical data")
        return data
    except Exception as e:
        raise Exception(f"Error loading historical data: {str(e)}")


def load_plan_from_excel(wb):
    """Load compensation plan from Excel Plan_Config sheet."""
    try:
        plan_sheet = wb.sheets['Plan_Config']

        # Get plan ID
        plan_id = plan_sheet.range('B2').value or 'DEFAULT_PLAN'
        plan_name = plan_sheet.range('B3').value or 'Commission Plan'

        plan = CompensationPlan(plan_id, plan_name)

        # Load commission tiers
        tier_start_row = 7  # Assuming tiers start at row 7
        tier_range = plan_sheet.range(f'A{tier_start_row}').expand('table')

        if tier_range.rows.count > 1:  # Has data beyond header
            tiers_df = tier_range.options(pd.DataFrame, header=True, index=False).value

            for _, row in tiers_df.iterrows():
                if pd.notna(row.get('quota_min')):  # Skip empty rows
                    plan.add_commission_tier(
                        quota_min=float(row['quota_min']),
                        quota_max=float(row['quota_max']),
                        rate=float(row['rate']),
                        tier_name=str(row.get('tier_name', f"Tier {len(plan.commission_tiers)+1}"))
                    )

        # Load bonuses (if present)
        try:
            bonus_start_row = tier_start_row + tier_range.rows.count + 3
            bonus_range = plan_sheet.range(f'A{bonus_start_row}').expand('table')

            if bonus_range.rows.count > 1:
                bonuses_df = bonus_range.options(pd.DataFrame, header=True, index=False).value

                for _, row in bonuses_df.iterrows():
                    if pd.notna(row.get('bonus_name')):
                        trigger = f"{row['trigger_metric']} {row['trigger_condition']} {row['trigger_value']}"
                        plan.add_bonus(
                            name=str(row['bonus_name']),
                            trigger=trigger,
                            payout=float(row['payout']),
                            frequency=str(row.get('frequency', 'quarterly'))
                        )
        except:
            pass  # No bonuses defined

        print(f"Loaded plan '{plan_id}' with {len(plan.commission_tiers)} tiers and {len(plan.bonuses)} bonuses")
        return plan

    except Exception as e:
        raise Exception(f"Error loading compensation plan: {str(e)}")


def get_config_from_excel(wb):
    """Get simulation configuration from Excel Config sheet."""
    try:
        config_sheet = wb.sheets['Config']

        config = {
            'iterations': int(config_sheet.range('B2').value or 10000),
            'seed': int(config_sheet.range('B3').value or 42),
            'sampling_strategy': str(config_sheet.range('B4').value or 'monte_carlo').lower()
        }

        print(f"Configuration: {config['iterations']} iterations, seed={config['seed']}, strategy={config['sampling_strategy']}")
        return config

    except Exception as e:
        raise Exception(f"Error loading configuration: {str(e)}")


def write_results_to_excel(wb, results):
    """Write simulation results to Excel Results sheet."""
    try:
        results_sheet = wb.sheets['Results']

        # Clear previous results
        results_sheet.clear_contents()

        # Write header
        results_sheet.range('A1').value = "SPM MONTE CARLO SIMULATION RESULTS"
        results_sheet.range('A1').font.size = 14
        results_sheet.range('A1').font.bold = True

        # Summary Statistics
        results_sheet.range('A3').value = "SUMMARY STATISTICS"
        results_sheet.range('A3').font.bold = True

        summary = results.summary()
        results_sheet.range('A4').value = summary

        # Risk Metrics
        risk_start_row = 4 + len(summary) + 3
        results_sheet.range(f'A{risk_start_row}').value = "RISK METRICS"
        results_sheet.range(f'A{risk_start_row}').font.bold = True

        risk_data = [
            ['Metric', 'Value'],
            ['Expected Payout', f"${results.scenarios['total_payout'].mean():,.0f}"],
            ['Median Payout', f"${results.scenarios['total_payout'].median():,.0f}"],
            ['Std Deviation', f"${results.scenarios['total_payout'].std():,.0f}"],
            ['VaR 95%', f"${results.var(0.95):,.0f}"],
            ['VaR 99%', f"${results.var(0.99):,.0f}"],
            ['CVaR 95%', f"${results.cvar(0.95):,.0f}"],
            ['CVaR 99%', f"${results.cvar(0.99):,.0f}"],
            ['Min Payout', f"${results.scenarios['total_payout'].min():,.0f}"],
            ['Max Payout', f"${results.scenarios['total_payout'].max():,.0f}"]
        ]

        results_sheet.range(f'A{risk_start_row + 1}').value = risk_data

        # Sensitivity Analysis
        try:
            sensitivity_start_row = risk_start_row + len(risk_data) + 3
            results_sheet.range(f'A{sensitivity_start_row}').value = "SENSITIVITY ANALYSIS"
            results_sheet.range(f'A{sensitivity_start_row}').font.bold = True

            sensitivity = results.sensitivity_analysis()
            results_sheet.range(f'A{sensitivity_start_row + 1}').value = sensitivity.values

        except Exception as e:
            print(f"Could not generate sensitivity analysis: {e}")

        # Format columns
        results_sheet.autofit()

        print("Results written to Excel successfully")

    except Exception as e:
        raise Exception(f"Error writing results to Excel: {str(e)}")


def run_simulation_from_excel(excel_file_path):
    """
    Main function to run simulation from Excel file.
    This is called by the standalone EXE.
    """
    try:
        import xlwings as xw

        print("=" * 60)
        print("SPM MONTE CARLO SIMULATION")
        print("=" * 60)
        print(f"\nLoading Excel file: {excel_file_path}")

        # Open Excel file
        wb = xw.Book(excel_file_path)

        # Update status in Excel
        status_cell = wb.sheets['Dashboard'].range('B8')
        status_cell.value = "Loading data..."

        # Load data
        print("\n1. Loading historical data...")
        historical_data = load_data_from_excel(wb)

        # Load plan
        print("\n2. Loading compensation plan...")
        status_cell.value = "Loading plan..."
        plan = load_plan_from_excel(wb)

        # Get configuration
        print("\n3. Loading configuration...")
        status_cell.value = "Configuring simulation..."
        config = get_config_from_excel(wb)

        # Run simulation
        print(f"\n4. Running Monte Carlo simulation ({config['iterations']} iterations)...")
        status_cell.value = f"Running {config['iterations']:,} iterations..."

        sim = MonteCarloSimulator(
            seed=config['seed'],
            sampling_strategy=config['sampling_strategy']
        )

        results = sim.load_data(historical_data) \
                     .load_plan(plan) \
                     .fit_distributions(auto=True) \
                     .run(iterations=config['iterations'])

        # Write results
        print("\n5. Writing results to Excel...")
        status_cell.value = "Writing results..."
        write_results_to_excel(wb, results)

        # Update status
        status_cell.value = "Simulation Complete!"
        status_cell.font.color = (0, 128, 0)  # Green

        print("\n" + "=" * 60)
        print("SIMULATION COMPLETE!")
        print("=" * 60)
        print(f"\nResults have been written to the 'Results' sheet.")
        print(f"Expected Payout: ${results.scenarios['total_payout'].mean():,.0f}")
        print(f"VaR 95%: ${results.var(0.95):,.0f}")

        # Save the workbook
        wb.save()

        return True

    except Exception as e:
        print(f"\nERROR: {str(e)}")

        # Try to update Excel with error
        try:
            status_cell.value = f"Error: {str(e)}"
            status_cell.font.color = (255, 0, 0)  # Red
            wb.save()
        except:
            pass

        return False


def main():
    """Entry point for standalone executable."""
    if len(sys.argv) < 2:
        print("Usage: spm_mc.exe <path_to_excel_file>")
        input("\nPress Enter to exit...")
        return False

    excel_file = sys.argv[1]

    if not Path(excel_file).exists():
        print(f"Error: File not found: {excel_file}")
        input("\nPress Enter to exit...")
        return False

    success = run_simulation_from_excel(excel_file)

    if not success:
        input("\nPress Enter to exit...")
    else:
        print("\nYou can now close this window and view results in Excel.")
        input("\nPress Enter to exit...")

    return success


if __name__ == '__main__':
    main()
