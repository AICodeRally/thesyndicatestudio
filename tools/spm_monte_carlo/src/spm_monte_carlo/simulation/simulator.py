"""Main Monte Carlo simulator orchestrator."""

import pandas as pd
import numpy as np
from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import logging

from ..data.loader import ExcelDataLoader
from ..data.validator import DataValidator
from ..statistics.distribution_fitter import DistributionFitter
from ..statistics.correlation import CorrelationAnalyzer
from ..compensation.plan import CompensationPlan
from ..compensation.engine import CompensationEngine
from .sampling import get_sampling_strategy, MultivariateSampler
from .results import SimulationResults
from ..exceptions import SimulationError, ConfigurationError

logger = logging.getLogger(__name__)


class MonteCarloSimulator:
    """
    Main Monte Carlo simulation orchestrator.

    Example:
        >>> sim = MonteCarloSimulator(seed=42, parallel=True)
        >>> results = sim.load_data('data.xlsx') \\
        ...              .load_plan('plan.xlsx') \\
        ...              .run(iterations=10000)
        >>> print(results.summary())
    """

    def __init__(
        self,
        seed: Optional[int] = None,
        parallel: bool = True,
        workers: Optional[int] = None,
        sampling_strategy: str = 'monte_carlo'
    ):
        """
        Initialize simulator.

        Args:
            seed: Random seed for reproducibility (default: None)
            parallel: Enable parallel processing (default: True)
            workers: Number of parallel workers (default: CPU count)
            sampling_strategy: 'monte_carlo', 'lhs', or 'quasi_random'
        """
        self.seed = seed
        self.parallel = parallel
        self.workers = workers
        self.sampling_strategy_name = sampling_strategy

        # Data containers
        self._historical_data: Optional[pd.DataFrame] = None
        self._plan: Optional[CompensationPlan] = None
        self._rep_master: Optional[pd.DataFrame] = None
        self._fitted_distributions: Dict[str, Any] = {}
        self._correlation_matrix: Optional[pd.DataFrame] = None

        logger.info(f"Initialized MonteCarloSimulator (seed={seed}, strategy={sampling_strategy})")

    def load_data(
        self,
        file_path: Union[str, Path, pd.DataFrame],
        sheet_name: str = 'Performance',
        validate: bool = True
    ) -> 'MonteCarloSimulator':
        """
        Load historical performance data.

        Args:
            file_path: Path to Excel file or DataFrame
            sheet_name: Sheet name to read (default: 'Performance')
            validate: Run validation checks (default: True)

        Returns:
            Self for method chaining

        Raises:
            ValidationError: If data validation fails
            FileNotFoundError: If file doesn't exist
        """
        logger.info("Loading historical performance data...")

        if isinstance(file_path, pd.DataFrame):
            self._historical_data = file_path
        else:
            self._historical_data = ExcelDataLoader.load_historical_performance(
                file_path, sheet_name
            )

        logger.info(f"Loaded {len(self._historical_data)} performance records")

        # Validate data
        if validate:
            report = DataValidator.validate_dataframe(
                self._historical_data,
                'historical_performance',
                strict=False
            )

            if not report.is_valid:
                logger.error("Data validation failed")
                logger.error(str(report))
                raise ConfigurationError("Historical data validation failed")

            if report.warnings:
                logger.warning(f"Data validation warnings: {len(report.warnings)}")

        return self

    def load_plan(
        self,
        file_path: Union[str, Path, CompensationPlan],
        plan_id: Optional[str] = None
    ) -> 'MonteCarloSimulator':
        """
        Load compensation plan definition.

        Args:
            file_path: Path to Excel file or CompensationPlan instance
            plan_id: Specific plan ID to use (default: first plan in file)

        Returns:
            Self for method chaining
        """
        logger.info("Loading compensation plan...")

        if isinstance(file_path, CompensationPlan):
            self._plan = file_path
        else:
            self._plan = CompensationPlan.from_excel(file_path, plan_id)

        logger.info(f"Loaded plan '{self._plan.plan_id}'")

        return self

    def load_rep_master(
        self,
        file_path: Union[str, Path, pd.DataFrame],
        sheet_name: str = 'Reps'
    ) -> 'MonteCarloSimulator':
        """
        Load rep master data (optional).

        Args:
            file_path: Path to Excel file or DataFrame
            sheet_name: Sheet name to read

        Returns:
            Self for method chaining
        """
        logger.info("Loading rep master data...")

        if isinstance(file_path, pd.DataFrame):
            self._rep_master = file_path
        else:
            self._rep_master = ExcelDataLoader.load_rep_master(file_path, sheet_name)

        logger.info(f"Loaded {len(self._rep_master)} reps")

        return self

    def fit_distributions(
        self,
        auto: bool = True,
        distributions: Optional[Dict[str, str]] = None,
        test_goodness_of_fit: bool = True,
        variables: Optional[List[str]] = None
    ) -> 'MonteCarloSimulator':
        """
        Fit probability distributions to data.

        Args:
            auto: Automatically select best-fit distributions (default: True)
            distributions: Manual distribution specifications
                          {'variable': 'dist_type', ...}
            test_goodness_of_fit: Run statistical tests (default: True)
            variables: Variables to fit (None = quota_attainment)

        Returns:
            Self for method chaining
        """
        if self._historical_data is None:
            raise ConfigurationError("No historical data loaded. Call load_data() first.")

        logger.info("Fitting distributions to data...")

        if variables is None:
            # Default to key variables
            variables = ['quota_attainment']
            if 'deal_count' in self._historical_data.columns:
                variables.append('deal_count')
            if 'avg_deal_size' in self._historical_data.columns:
                variables.append('avg_deal_size')

        fitter = DistributionFitter()

        for var in variables:
            if var not in self._historical_data.columns:
                logger.warning(f"Variable '{var}' not found in data, skipping")
                continue

            # Get manual distribution if specified
            manual_dist = distributions.get(var) if distributions else None

            if manual_dist:
                result = fitter.fit(
                    self._historical_data[var].dropna().values,
                    distribution_type=manual_dist,
                    test_fit=test_goodness_of_fit
                )
            elif auto:
                result = fitter.auto_fit(
                    self._historical_data[var].dropna().values
                )
            else:
                result = fitter.fit(
                    self._historical_data[var].dropna().values,
                    distribution_type='normal'
                )

            self._fitted_distributions[var] = result
            logger.info(
                f"Fitted {var}: {result.distribution_name} "
                f"(p-value: {result.goodness_of_fit.get('p_value', 'N/A')})"
            )

        return self

    def set_correlations(
        self,
        correlation_matrix: Optional[pd.DataFrame] = None,
        auto_detect: bool = True,
        min_correlation: float = 0.0
    ) -> 'MonteCarloSimulator':
        """
        Set or detect correlations between variables.

        Args:
            correlation_matrix: Pre-defined correlation matrix
            auto_detect: Estimate from data if matrix not provided
            min_correlation: Minimum correlation to preserve

        Returns:
            Self for method chaining
        """
        if correlation_matrix is not None:
            self._correlation_matrix = correlation_matrix
            logger.info("Set custom correlation matrix")
        elif auto_detect:
            if self._historical_data is None:
                raise ConfigurationError("No data loaded for correlation detection")

            variables = list(self._fitted_distributions.keys())
            if len(variables) > 1:
                self._correlation_matrix = CorrelationAnalyzer.estimate_correlation_matrix(
                    self._historical_data,
                    variables=variables,
                    min_correlation=min_correlation
                )
                logger.info(f"Detected correlations for {len(variables)} variables")
            else:
                logger.info("Only one variable, skipping correlation")

        return self

    def run(
        self,
        iterations: int = 10000,
        batch_size: Optional[int] = None,
        progress_bar: bool = False
    ) -> SimulationResults:
        """
        Execute Monte Carlo simulation.

        Args:
            iterations: Number of simulation runs (default: 10000)
            batch_size: Batch size for memory management (default: auto)
            progress_bar: Show progress bar (default: False)

        Returns:
            SimulationResults object with analysis

        Raises:
            SimulationError: If simulation fails
            ConfigurationError: If required data not loaded
        """
        # Validate configuration
        if self._historical_data is None:
            raise ConfigurationError("No historical data loaded")
        if self._plan is None:
            raise ConfigurationError("No compensation plan loaded")

        logger.info(f"Starting Monte Carlo simulation ({iterations} iterations)...")

        # Fit distributions if not already done
        if not self._fitted_distributions:
            logger.info("Auto-fitting distributions...")
            self.fit_distributions(auto=True)

        # Set correlations if not already done
        if self._correlation_matrix is None and len(self._fitted_distributions) > 1:
            logger.info("Auto-detecting correlations...")
            self.set_correlations(auto_detect=True)

        # Generate scenarios
        scenarios = self._generate_scenarios(iterations)

        # Calculate compensation for all scenarios
        engine = CompensationEngine(self._plan)
        results = engine.calculate_batch(scenarios, group_by='scenario_id')

        logger.info("Simulation complete!")

        return SimulationResults(results)

    def _generate_scenarios(self, n_scenarios: int) -> pd.DataFrame:
        """
        Generate simulation scenarios.

        Args:
            n_scenarios: Number of scenarios to generate

        Returns:
            DataFrame with scenarios
        """
        logger.info(f"Generating {n_scenarios} scenarios...")

        # Get unique reps
        reps = self._historical_data['rep_id'].unique()
        n_reps = len(reps)

        # Get average quota per rep
        avg_quota = self._historical_data.groupby('rep_id')['quota'].mean()

        # Prepare for sampling
        sampling_strategy = get_sampling_strategy(self.sampling_strategy_name)

        # Generate samples for each variable
        scenarios_list = []

        for scenario_id in range(n_scenarios):
            scenario_data = []

            for rep_id in reps:
                # Get quota for this rep
                quota = avg_quota.get(rep_id, avg_quota.mean())

                # Generate performance metrics
                row = {
                    'scenario_id': scenario_id,
                    'rep_id': rep_id,
                    'quota': quota
                }

                # Sample quota_attainment
                if 'quota_attainment' in self._fitted_distributions:
                    dist = self._fitted_distributions['quota_attainment'].distribution
                    seed = abs(hash((self.seed, scenario_id, rep_id))) % (2**32) if self.seed else None
                    qa = sampling_strategy.sample(dist, 1, seed)[0]
                    row['quota_attainment'] = qa
                    row['actual_sales'] = quota * qa
                else:
                    row['quota_attainment'] = 1.0
                    row['actual_sales'] = quota

                # Sample other metrics if available
                for var in ['deal_count', 'avg_deal_size']:
                    if var in self._fitted_distributions:
                        dist = self._fitted_distributions[var].distribution
                        seed = abs(hash((self.seed, scenario_id, rep_id, var))) % (2**32) if self.seed else None
                        row[var] = sampling_strategy.sample(dist, 1, seed)[0]

                scenario_data.append(row)

            scenarios_list.extend(scenario_data)

        scenarios_df = pd.DataFrame(scenarios_list)

        logger.info(f"Generated {len(scenarios_df)} scenario-rep combinations")

        return scenarios_df

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"MonteCarloSimulator("
            f"data_loaded={self._historical_data is not None}, "
            f"plan_loaded={self._plan is not None}, "
            f"distributions_fit={len(self._fitted_distributions)})"
        )
