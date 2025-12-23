"""Data loading utilities."""

import pandas as pd
from pathlib import Path
from typing import Union, Optional
import logging

logger = logging.getLogger(__name__)


class ExcelDataLoader:
    """Load and parse Excel data files."""

    @staticmethod
    def load_historical_performance(
        file_path: Union[str, Path],
        sheet_name: str = 'Performance'
    ) -> pd.DataFrame:
        """
        Load historical performance data from Excel.

        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name to read

        Returns:
            DataFrame with historical performance data

        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If sheet doesn't exist
        """
        file_path = Path(file_path)

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        logger.info(f"Loading historical performance data from {file_path}")

        try:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            logger.info(f"Loaded {len(df)} rows from {sheet_name}")
            return df
        except ValueError as e:
            raise ValueError(f"Sheet '{sheet_name}' not found in {file_path}") from e

    @staticmethod
    def load_compensation_plan(
        file_path: Union[str, Path],
        plan_id: Optional[str] = None
    ) -> dict:
        """
        Load compensation plan from Excel.

        Args:
            file_path: Path to Excel file
            plan_id: Specific plan ID to filter (optional)

        Returns:
            Dictionary with plan components:
                - 'overview': Plan overview DataFrame
                - 'commission_tiers': Commission tiers DataFrame
                - 'bonuses': Bonuses DataFrame (if exists)
                - 'spifs': SPIFs DataFrame (if exists)

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = Path(file_path)

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        logger.info(f"Loading compensation plan from {file_path}")

        # Read all sheets
        excel_file = pd.ExcelFile(file_path)
        plan_data = {}

        # Load Plan Overview
        if 'Plan_Overview' in excel_file.sheet_names:
            plan_data['overview'] = pd.read_excel(file_path, sheet_name='Plan_Overview')
            logger.info(f"Loaded {len(plan_data['overview'])} plan(s) from Plan_Overview")
        else:
            raise ValueError("Plan_Overview sheet is required")

        # Filter by plan_id if specified
        if plan_id:
            plan_data['overview'] = plan_data['overview'][
                plan_data['overview']['plan_id'] == plan_id
            ]
            if len(plan_data['overview']) == 0:
                raise ValueError(f"Plan ID '{plan_id}' not found")

        # Load Commission Tiers
        if 'Commission_Tiers' in excel_file.sheet_names:
            plan_data['commission_tiers'] = pd.read_excel(
                file_path, sheet_name='Commission_Tiers'
            )
            if plan_id:
                plan_data['commission_tiers'] = plan_data['commission_tiers'][
                    plan_data['commission_tiers']['plan_id'] == plan_id
                ]
            logger.info(f"Loaded {len(plan_data['commission_tiers'])} commission tiers")

        # Load Bonuses (optional)
        if 'Bonuses' in excel_file.sheet_names:
            plan_data['bonuses'] = pd.read_excel(file_path, sheet_name='Bonuses')
            if plan_id:
                plan_data['bonuses'] = plan_data['bonuses'][
                    plan_data['bonuses']['plan_id'] == plan_id
                ]
            logger.info(f"Loaded {len(plan_data['bonuses'])} bonuses")

        # Load SPIFs (optional)
        if 'SPIFs' in excel_file.sheet_names:
            plan_data['spifs'] = pd.read_excel(file_path, sheet_name='SPIFs')
            logger.info(f"Loaded {len(plan_data['spifs'])} SPIFs")

        return plan_data

    @staticmethod
    def load_rep_master(
        file_path: Union[str, Path],
        sheet_name: str = 'Reps'
    ) -> pd.DataFrame:
        """
        Load rep master data from Excel.

        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name to read

        Returns:
            DataFrame with rep master data

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = Path(file_path)

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        logger.info(f"Loading rep master data from {file_path}")

        try:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            logger.info(f"Loaded {len(df)} reps from {sheet_name}")
            return df
        except ValueError as e:
            raise ValueError(f"Sheet '{sheet_name}' not found in {file_path}") from e

    @staticmethod
    def load_dataframe(
        file_path: Union[str, Path],
        sheet_name: str = 0
    ) -> pd.DataFrame:
        """
        Generic DataFrame loader.

        Args:
            file_path: Path to Excel file
            sheet_name: Sheet name or index

        Returns:
            DataFrame

        Raises:
            FileNotFoundError: If file doesn't exist
        """
        file_path = Path(file_path)

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        return pd.read_excel(file_path, sheet_name=sheet_name)
