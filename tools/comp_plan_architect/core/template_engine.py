"""
Template Assembly Engine

Assembles compensation plans from reusable components with dependency resolution,
conflict detection, and gap analysis.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Any, Set
from dataclasses import dataclass, field, asdict
from enum import Enum

from .library_manager import LibraryManager, Component, ComponentCategory


class PlanStatus(Enum):
    """Plan lifecycle status."""
    DRAFT = "draft"
    REVIEW = "review"
    APPROVED = "approved"
    ACTIVE = "active"
    ARCHIVED = "archived"


@dataclass
class PlanMetadata:
    """Plan metadata."""
    name: str
    effective_date: str
    end_date: Optional[str] = None
    status: str = PlanStatus.DRAFT.value
    version: str = "1.0"
    author: str = "system"
    reviewers: List[str] = field(default_factory=list)
    approval_date: Optional[str] = None
    created_date: str = field(default_factory=lambda: datetime.now().isoformat())
    last_modified: str = field(default_factory=lambda: datetime.now().isoformat())
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)


@dataclass
class PlanSection:
    """A section in the compensation plan."""
    section_num: str
    title: str
    component_ids: List[str]
    custom_text: Optional[str] = None
    subsections: List['PlanSection'] = field(default_factory=list)

    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        data = asdict(self)
        data['subsections'] = [sub.to_dict() for sub in self.subsections]
        return data

    @classmethod
    def from_dict(cls, data: Dict) -> 'PlanSection':
        """Create from dictionary."""
        subsections = []
        if 'subsections' in data:
            subsections = [cls.from_dict(sub) for sub in data['subsections']]
        data['subsections'] = subsections
        return cls(**data)


@dataclass
class Plan:
    """Compensation plan document."""
    plan_id: str
    metadata: PlanMetadata
    sections: List[PlanSection] = field(default_factory=list)

    # Computed fields (not serialized)
    _all_component_ids: Optional[Set[str]] = field(default=None, init=False, repr=False)

    def get_all_component_ids(self) -> Set[str]:
        """Get all component IDs used in this plan."""
        if self._all_component_ids is None:
            self._all_component_ids = set()
            for section in self.sections:
                self._all_component_ids.update(section.component_ids)
                for subsection in section.subsections:
                    self._all_component_ids.update(subsection.component_ids)
        return self._all_component_ids

    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            'plan_id': self.plan_id,
            'metadata': asdict(self.metadata),
            'sections': [section.to_dict() for section in self.sections]
        }

    @classmethod
    def from_dict(cls, data: Dict) -> 'Plan':
        """Create from dictionary."""
        metadata = PlanMetadata(**data['metadata'])
        sections = [PlanSection.from_dict(s) for s in data['sections']]
        return cls(
            plan_id=data['plan_id'],
            metadata=metadata,
            sections=sections
        )


class TemplateEngine:
    """
    Template assembly engine for building compensation plans.
    """

    def __init__(self, library: Optional[LibraryManager] = None):
        """
        Initialize template engine.

        Args:
            library: LibraryManager instance. If None, creates new one.
        """
        self.library = library or LibraryManager()

    def create_plan(
        self,
        name: str,
        component_ids: List[str],
        effective_date: str,
        end_date: Optional[str] = None,
        author: str = "system",
        description: Optional[str] = None,
        auto_resolve_dependencies: bool = True
    ) -> Plan:
        """
        Create a new compensation plan from components.

        Args:
            name: Plan name
            component_ids: List of component IDs to include
            effective_date: Plan effective date (ISO format)
            end_date: Plan end date (ISO format)
            author: Plan author
            description: Plan description
            auto_resolve_dependencies: Auto-add required components

        Returns:
            Plan object

        Raises:
            ValueError: If components not found or conflicts detected
        """
        # Validate all components exist
        for comp_id in component_ids:
            try:
                self.library.get_component(comp_id)
            except KeyError:
                raise ValueError(f"Component not found: {comp_id}")

        # Resolve dependencies if requested
        if auto_resolve_dependencies:
            component_ids = self._resolve_dependencies(component_ids)

        # Check for conflicts
        conflicts = self._check_conflicts(component_ids)
        if conflicts:
            conflict_msgs = [f"{c1} conflicts with {c2}" for c1, c2 in conflicts]
            raise ValueError(f"Component conflicts detected: {', '.join(conflict_msgs)}")

        # Generate plan ID
        plan_id = f"PLAN_{name.upper().replace(' ', '_')}_{uuid.uuid4().hex[:8].upper()}"

        # Create metadata
        metadata = PlanMetadata(
            name=name,
            effective_date=effective_date,
            end_date=end_date,
            author=author,
            description=description
        )

        # Auto-organize components into sections by category
        sections = self._organize_into_sections(component_ids)

        # Create plan
        plan = Plan(
            plan_id=plan_id,
            metadata=metadata,
            sections=sections
        )

        return plan

    def _resolve_dependencies(self, component_ids: List[str]) -> List[str]:
        """
        Resolve component dependencies and add required components.

        Args:
            component_ids: Initial list of component IDs

        Returns:
            Expanded list with dependencies
        """
        resolved = set(component_ids)
        to_check = list(component_ids)

        while to_check:
            comp_id = to_check.pop(0)
            component = self.library.get_component(comp_id)

            for required_id in component.validation_rules.requires:
                # Check if any component matches the required pattern
                matched = False
                for existing_id in resolved:
                    if self._matches_pattern(existing_id, required_id):
                        matched = True
                        break

                if not matched:
                    # Try to find a matching component in library
                    candidates = self._find_matching_components(required_id)
                    if candidates:
                        # Add first match
                        resolved.add(candidates[0])
                        to_check.append(candidates[0])

        return list(resolved)

    def _matches_pattern(self, comp_id: str, pattern: str) -> bool:
        """Check if component ID matches a pattern (supports wildcards)."""
        if '*' in pattern:
            prefix = pattern.split('*')[0]
            return comp_id.startswith(prefix)
        return comp_id == pattern

    def _find_matching_components(self, pattern: str) -> List[str]:
        """Find components matching a pattern."""
        results = []
        for comp_id in self.library.components.keys():
            if self._matches_pattern(comp_id, pattern):
                results.append(comp_id)
        return results

    def _check_conflicts(self, component_ids: List[str]) -> List[tuple]:
        """
        Check for conflicts between components.

        Args:
            component_ids: List of component IDs

        Returns:
            List of (component_id_1, component_id_2) tuples that conflict
        """
        conflicts = []

        for comp_id in component_ids:
            component = self.library.get_component(comp_id)

            for conflict_pattern in component.validation_rules.conflicts_with:
                for other_id in component_ids:
                    if other_id != comp_id and self._matches_pattern(other_id, conflict_pattern):
                        conflicts.append((comp_id, other_id))

        return conflicts

    def _organize_into_sections(self, component_ids: List[str]) -> List[PlanSection]:
        """
        Organize components into logical sections by category.

        Args:
            component_ids: List of component IDs

        Returns:
            List of PlanSection objects
        """
        # Group components by category
        by_category = {}
        for comp_id in component_ids:
            component = self.library.get_component(comp_id)
            category = component.category
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(comp_id)

        # Define standard section order
        standard_order = [
            ComponentCategory.OVERVIEW.value,
            ComponentCategory.ELIGIBILITY.value,
            ComponentCategory.MEASURES.value,
            ComponentCategory.RATES.value,
            ComponentCategory.CREDITING.value,
            ComponentCategory.PAYMENT_TERMS.value,
            ComponentCategory.GOVERNANCE.value,
            ComponentCategory.DEFINITIONS.value,
            ComponentCategory.CHANGES.value,
            ComponentCategory.COMPLIANCE.value,
        ]

        sections = []
        section_num = 1

        for category in standard_order:
            if category in by_category:
                section = PlanSection(
                    section_num=str(section_num),
                    title=category,
                    component_ids=by_category[category]
                )
                sections.append(section)
                section_num += 1

        # Add any remaining categories not in standard order
        for category, comp_ids in by_category.items():
            if category not in standard_order:
                section = PlanSection(
                    section_num=str(section_num),
                    title=category,
                    component_ids=comp_ids
                )
                sections.append(section)
                section_num += 1

        return sections

    def add_components(self, plan: Plan, component_ids: List[str]) -> Plan:
        """
        Add components to an existing plan.

        Args:
            plan: Existing plan
            component_ids: Component IDs to add

        Returns:
            Updated plan
        """
        # Get current component IDs
        current_ids = plan.get_all_component_ids()

        # Add new components
        all_ids = list(current_ids) + [c for c in component_ids if c not in current_ids]

        # Resolve dependencies if needed
        all_ids = self._resolve_dependencies(all_ids)

        # Check conflicts
        conflicts = self._check_conflicts(all_ids)
        if conflicts:
            conflict_msgs = [f"{c1} conflicts with {c2}" for c1, c2 in conflicts]
            raise ValueError(f"Component conflicts detected: {', '.join(conflict_msgs)}")

        # Re-organize sections
        plan.sections = self._organize_into_sections(all_ids)
        plan.metadata.last_modified = datetime.now().isoformat()
        plan._all_component_ids = None  # Reset cache

        return plan

    def remove_components(self, plan: Plan, component_ids: List[str]) -> Plan:
        """
        Remove components from a plan.

        Args:
            plan: Existing plan
            component_ids: Component IDs to remove

        Returns:
            Updated plan
        """
        to_remove = set(component_ids)

        # Remove from all sections
        for section in plan.sections:
            section.component_ids = [c for c in section.component_ids if c not in to_remove]

        # Remove empty sections
        plan.sections = [s for s in plan.sections if s.component_ids]

        plan.metadata.last_modified = datetime.now().isoformat()
        plan._all_component_ids = None  # Reset cache

        return plan

    def get_warnings(self, plan: Plan) -> List[str]:
        """
        Get validation warnings for a plan.

        Args:
            plan: Plan to check

        Returns:
            List of warning messages
        """
        warnings = []
        component_ids = plan.get_all_component_ids()

        for comp_id in component_ids:
            component = self.library.get_component(comp_id)

            # Check for warnings from component
            warnings.extend(component.validation_rules.warnings)

            # Check for recommended components
            for rec_id in component.validation_rules.recommended_with:
                if not any(self._matches_pattern(cid, rec_id) for cid in component_ids):
                    warnings.append(
                        f"Component {comp_id} recommends including {rec_id}"
                    )

        return warnings

    def get_missing_categories(self, plan: Plan) -> List[str]:
        """
        Identify missing standard categories (gap analysis).

        Args:
            plan: Plan to check

        Returns:
            List of missing category names
        """
        component_ids = plan.get_all_component_ids()
        present_categories = set()

        for comp_id in component_ids:
            component = self.library.get_component(comp_id)
            present_categories.add(component.category)

        # Required categories
        required = [
            ComponentCategory.OVERVIEW.value,
            ComponentCategory.ELIGIBILITY.value,
            ComponentCategory.MEASURES.value,
            ComponentCategory.PAYMENT_TERMS.value,
        ]

        missing = [cat for cat in required if cat not in present_categories]
        return missing

    def save_plan(self, plan: Plan, directory: Optional[Path] = None) -> Path:
        """
        Save plan to JSON file.

        Args:
            plan: Plan to save
            directory: Directory to save to (default: data/plans/drafts)

        Returns:
            Path to saved file
        """
        if directory is None:
            directory = Path(__file__).parent.parent / 'data' / 'plans' / 'drafts'

        directory.mkdir(parents=True, exist_ok=True)

        filename = f"{plan.plan_id}.json"
        filepath = directory / filename

        with open(filepath, 'w') as f:
            json.dump(plan.to_dict(), f, indent=2)

        return filepath

    def load_plan(self, filepath: Path) -> Plan:
        """
        Load plan from JSON file.

        Args:
            filepath: Path to plan file

        Returns:
            Plan object
        """
        with open(filepath, 'r') as f:
            data = json.load(f)

        return Plan.from_dict(data)

    def clone_plan(self, plan: Plan, new_name: str) -> Plan:
        """
        Clone an existing plan.

        Args:
            plan: Plan to clone
            new_name: Name for new plan

        Returns:
            New plan
        """
        # Deep copy via dict
        data = plan.to_dict()

        # Update metadata
        new_id = f"PLAN_{new_name.upper().replace(' ', '_')}_{uuid.uuid4().hex[:8].upper()}"
        data['plan_id'] = new_id
        data['metadata']['name'] = new_name
        data['metadata']['version'] = "1.0"
        data['metadata']['status'] = PlanStatus.DRAFT.value
        data['metadata']['created_date'] = datetime.now().isoformat()
        data['metadata']['last_modified'] = datetime.now().isoformat()
        data['metadata']['approval_date'] = None

        return Plan.from_dict(data)
