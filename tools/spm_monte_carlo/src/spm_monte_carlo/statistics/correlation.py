"""Correlation analysis utilities."""

import numpy as np
import pandas as pd
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)


class CorrelationAnalyzer:
    """Analyze and handle correlations between variables."""

    @staticmethod
    def estimate_correlation_matrix(
        df: pd.DataFrame,
        variables: Optional[List[str]] = None,
        method: str = 'pearson',
        min_correlation: float = 0.0
    ) -> pd.DataFrame:
        """
        Estimate correlation matrix from data.

        Args:
            df: DataFrame with variables
            variables: List of variables to include (None = all numeric)
            method: Correlation method ('pearson', 'spearman', 'kendall')
            min_correlation: Minimum absolute correlation to keep

        Returns:
            Correlation matrix DataFrame
        """
        if variables is None:
            # Use all numeric columns
            variables = df.select_dtypes(include=[np.number]).columns.tolist()

        logger.info(f"Estimating correlation matrix for {len(variables)} variables")

        # Calculate correlations
        corr_matrix = df[variables].corr(method=method)

        # Filter by minimum correlation
        if min_correlation > 0:
            mask = np.abs(corr_matrix) >= min_correlation
            np.fill_diagonal(mask.values, True)  # Keep diagonal
            corr_matrix = corr_matrix.where(mask, 0)

        logger.info(f"Correlation matrix shape: {corr_matrix.shape}")

        return corr_matrix

    @staticmethod
    def validate_correlation_matrix(corr_matrix: pd.DataFrame) -> bool:
        """
        Validate correlation matrix properties.

        Args:
            corr_matrix: Correlation matrix

        Returns:
            True if valid

        Raises:
            ValueError: If matrix is invalid
        """
        # Check symmetry
        if not np.allclose(corr_matrix.values, corr_matrix.values.T):
            raise ValueError("Correlation matrix must be symmetric")

        # Check diagonal is 1.0
        if not np.allclose(np.diag(corr_matrix.values), 1.0):
            raise ValueError("Correlation matrix diagonal must be 1.0")

        # Check values in [-1, 1]
        if not np.all((corr_matrix.values >= -1) & (corr_matrix.values <= 1)):
            raise ValueError("Correlation values must be in [-1, 1]")

        # Check positive semi-definite (eigenvalues >= 0)
        eigenvalues = np.linalg.eigvals(corr_matrix.values)
        if not np.all(eigenvalues >= -1e-10):  # Allow small numerical errors
            logger.warning(
                f"Correlation matrix is not positive semi-definite. "
                f"Min eigenvalue: {eigenvalues.min()}"
            )
            return False

        logger.info("Correlation matrix is valid")
        return True

    @staticmethod
    def cholesky_decomposition(corr_matrix: pd.DataFrame) -> np.ndarray:
        """
        Compute Cholesky decomposition for correlated sampling.

        Args:
            corr_matrix: Correlation matrix

        Returns:
            Lower triangular Cholesky factor

        Raises:
            ValueError: If matrix is not positive definite
        """
        try:
            L = np.linalg.cholesky(corr_matrix.values)
            logger.info("Cholesky decomposition successful")
            return L
        except np.linalg.LinAlgError as e:
            raise ValueError(
                "Correlation matrix is not positive definite. "
                "Cannot compute Cholesky decomposition."
            ) from e

    @staticmethod
    def nearest_positive_definite(matrix: np.ndarray) -> np.ndarray:
        """
        Find the nearest positive definite matrix.

        Uses eigenvalue adjustment to make matrix positive definite.

        Args:
            matrix: Input matrix

        Returns:
            Nearest positive definite matrix
        """
        # Ensure symmetry
        B = (matrix + matrix.T) / 2

        # Eigenvalue decomposition
        eigenvalues, eigenvectors = np.linalg.eigh(B)

        # Adjust negative eigenvalues
        eigenvalues[eigenvalues < 0] = 1e-10

        # Reconstruct matrix
        result = eigenvectors @ np.diag(eigenvalues) @ eigenvectors.T

        # Ensure diagonal is 1.0 (for correlation matrix)
        D_inv_sqrt = np.diag(1.0 / np.sqrt(np.diag(result)))
        result = D_inv_sqrt @ result @ D_inv_sqrt

        logger.info("Adjusted to nearest positive definite matrix")

        return result

    @staticmethod
    def apply_correlation(
        samples: np.ndarray,
        corr_matrix: pd.DataFrame
    ) -> np.ndarray:
        """
        Apply correlation structure to independent samples.

        Uses Cholesky decomposition to induce correlation.

        Args:
            samples: Independent samples (n_samples x n_variables)
            corr_matrix: Desired correlation matrix

        Returns:
            Correlated samples
        """
        n_samples, n_vars = samples.shape

        if n_vars != len(corr_matrix):
            raise ValueError(
                f"Number of variables in samples ({n_vars}) "
                f"doesn't match correlation matrix size ({len(corr_matrix)})"
            )

        # Get Cholesky factor
        try:
            L = CorrelationAnalyzer.cholesky_decomposition(corr_matrix)
        except ValueError:
            # Try to fix matrix
            logger.warning("Correlation matrix not positive definite, adjusting...")
            fixed_corr = CorrelationAnalyzer.nearest_positive_definite(
                corr_matrix.values
            )
            L = np.linalg.cholesky(fixed_corr)

        # Apply correlation: X_corr = X_indep @ L^T
        correlated = samples @ L.T

        logger.info(f"Applied correlation to {n_samples} samples")

        return correlated
