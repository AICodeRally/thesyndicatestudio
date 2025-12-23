"""
Component Library Manager

Handles CRUD operations for the compensation plan component library.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field, asdict
from enum import Enum


class ComponentCategory(Enum):
    """Component categories."""
    OVERVIEW = "Overview"
    ELIGIBILITY = "Eligibility"
    MEASURES = "Measures"
    RATES = "Rates"
    CREDITING = "Crediting"
    PAYMENT_TERMS = "Payment Terms"
    GOVERNANCE = "Governance"
    DEFINITIONS = "Definitions"
    CHANGES = "Employee Changes"
    COMPLIANCE = "Compliance"


class ComponentStatus(Enum):
    """Component lifecycle status."""
    DRAFT = "draft"
    ACTIVE = "active"
    DEPRECATED = "deprecated"
    ARCHIVED = "archived"


@dataclass
class PolicyText:
    """Policy language at different detail levels."""
    short: str
    detailed: str
    legal: Optional[str] = None


@dataclass
class ComponentMetadata:
    """Component metadata for search and filtering."""
    industry: List[str] = field(default_factory=list)
    plan_types: List[str] = field(default_factory=list)
    compliance_flags: List[str] = field(default_factory=list)
    typical_pairings: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)


@dataclass
class ValidationRules:
    """Validation rules for component usage."""
    requires: List[str] = field(default_factory=list)
    conflicts_with: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    recommended_with: List[str] = field(default_factory=list)


@dataclass
class GovernanceImpact:
    """Governance risk scoring factors."""
    financial_risk: int = 0  # 0-10 scale
    complexity: int = 0  # 0-10 scale
    compliance_risk: int = 0  # 0-10 scale
    operational_risk: int = 0  # 0-10 scale


@dataclass
class UsageStats:
    """Component usage statistics."""
    times_used: int = 0
    success_rate: float = 1.0
    avg_admin_rating: float = 0.0
    last_used: Optional[str] = None


@dataclass
class Component:
    """Compensation plan component."""

    # Core identification
    component_id: str
    category: str
    name: str
    version: str

    # Content
    policy_text: PolicyText

    # Metadata
    subcategory: Optional[str] = None
    status: str = ComponentStatus.ACTIVE.value
    created_date: str = field(default_factory=lambda: datetime.now().isoformat())
    last_modified: str = field(default_factory=lambda: datetime.now().isoformat())
    author: str = "system"

    # Classification and rules
    metadata: ComponentMetadata = field(default_factory=ComponentMetadata)
    validation_rules: ValidationRules = field(default_factory=ValidationRules)
    governance_impact: GovernanceImpact = field(default_factory=GovernanceImpact)

    # Analytics
    usage_stats: UsageStats = field(default_factory=UsageStats)

    # Optional fields
    calculations: Optional[Dict[str, Any]] = None
    examples: Optional[List[str]] = None
    notes: Optional[str] = None

    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        data = asdict(self)
        # Convert nested dataclasses
        data['policy_text'] = asdict(self.policy_text)
        data['metadata'] = asdict(self.metadata)
        data['validation_rules'] = asdict(self.validation_rules)
        data['governance_impact'] = asdict(self.governance_impact)
        data['usage_stats'] = asdict(self.usage_stats)
        return data

    @classmethod
    def from_dict(cls, data: Dict) -> 'Component':
        """Create from dictionary."""
        # Convert nested dicts to dataclasses
        if 'policy_text' in data and isinstance(data['policy_text'], dict):
            data['policy_text'] = PolicyText(**data['policy_text'])
        if 'metadata' in data and isinstance(data['metadata'], dict):
            data['metadata'] = ComponentMetadata(**data['metadata'])
        if 'validation_rules' in data and isinstance(data['validation_rules'], dict):
            data['validation_rules'] = ValidationRules(**data['validation_rules'])
        if 'governance_impact' in data and isinstance(data['governance_impact'], dict):
            data['governance_impact'] = GovernanceImpact(**data['governance_impact'])
        if 'usage_stats' in data and isinstance(data['usage_stats'], dict):
            data['usage_stats'] = UsageStats(**data['usage_stats'])

        return cls(**data)


class LibraryManager:
    """Manages the component library."""

    def __init__(self, library_path: Optional[Path] = None):
        """
        Initialize library manager.

        Args:
            library_path: Path to library JSON file. If None, uses default.
        """
        if library_path is None:
            # Default to data/library/components.json
            self.library_path = Path(__file__).parent.parent / 'data' / 'library' / 'components.json'
        else:
            self.library_path = Path(library_path)

        self.library_path.parent.mkdir(parents=True, exist_ok=True)
        self.components: Dict[str, Component] = {}
        self.load()

    def load(self) -> None:
        """Load component library from file."""
        if self.library_path.exists():
            with open(self.library_path, 'r') as f:
                data = json.load(f)
                self.components = {
                    comp_id: Component.from_dict(comp_data)
                    for comp_id, comp_data in data.items()
                }
        else:
            # Initialize empty library
            self.components = {}
            self.save()

    def save(self) -> None:
        """Save component library to file."""
        data = {
            comp_id: comp.to_dict()
            for comp_id, comp in self.components.items()
        }

        with open(self.library_path, 'w') as f:
            json.dump(data, f, indent=2)

    def add_component(self, component: Component) -> None:
        """
        Add component to library.

        Args:
            component: Component to add

        Raises:
            ValueError: If component_id already exists
        """
        if component.component_id in self.components:
            raise ValueError(f"Component {component.component_id} already exists")

        self.components[component.component_id] = component
        self.save()

    def update_component(self, component_id: str, component: Component) -> None:
        """
        Update existing component.

        Args:
            component_id: ID of component to update
            component: Updated component data

        Raises:
            KeyError: If component not found
        """
        if component_id not in self.components:
            raise KeyError(f"Component {component_id} not found")

        component.last_modified = datetime.now().isoformat()
        self.components[component_id] = component
        self.save()

    def delete_component(self, component_id: str) -> None:
        """
        Delete component from library.

        Args:
            component_id: ID of component to delete

        Raises:
            KeyError: If component not found
        """
        if component_id not in self.components:
            raise KeyError(f"Component {component_id} not found")

        del self.components[component_id]
        self.save()

    def get_component(self, component_id: str) -> Component:
        """
        Get component by ID.

        Args:
            component_id: Component ID

        Returns:
            Component object

        Raises:
            KeyError: If component not found
        """
        if component_id not in self.components:
            raise KeyError(f"Component {component_id} not found")

        return self.components[component_id]

    def list_components(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        industry: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> List[Component]:
        """
        List components with optional filtering.

        Args:
            category: Filter by category
            status: Filter by status
            industry: Filter by industry
            tags: Filter by tags (any match)

        Returns:
            List of matching components
        """
        results = list(self.components.values())

        if category:
            results = [c for c in results if c.category == category]

        if status:
            results = [c for c in results if c.status == status]

        if industry:
            results = [c for c in results if industry in c.metadata.industry]

        if tags:
            results = [
                c for c in results
                if any(tag in c.metadata.tags for tag in tags)
            ]

        return results

    def search(self, query: str) -> List[Component]:
        """
        Search components by text query.

        Args:
            query: Search query

        Returns:
            List of matching components
        """
        query_lower = query.lower()
        results = []

        for component in self.components.values():
            # Search in name
            if query_lower in component.name.lower():
                results.append(component)
                continue

            # Search in policy text
            if query_lower in component.policy_text.short.lower():
                results.append(component)
                continue

            if query_lower in component.policy_text.detailed.lower():
                results.append(component)
                continue

            # Search in tags
            if any(query_lower in tag.lower() for tag in component.metadata.tags):
                results.append(component)
                continue

        return results

    def get_by_category(self, category: str) -> List[Component]:
        """Get all components in a category."""
        return self.list_components(category=category)

    def get_active_components(self) -> List[Component]:
        """Get all active components."""
        return self.list_components(status=ComponentStatus.ACTIVE.value)

    def deprecate_component(self, component_id: str) -> None:
        """Mark component as deprecated."""
        component = self.get_component(component_id)
        component.status = ComponentStatus.DEPRECATED.value
        component.last_modified = datetime.now().isoformat()
        self.save()

    def clone_component(self, component_id: str, new_name: str) -> Component:
        """
        Clone an existing component.

        Args:
            component_id: Component to clone
            new_name: Name for new component

        Returns:
            New component
        """
        original = self.get_component(component_id)

        # Create new component with unique ID
        new_id = f"{original.component_id}_CLONE_{uuid.uuid4().hex[:8].upper()}"

        # Deep copy via dict
        new_data = original.to_dict()
        new_data['component_id'] = new_id
        new_data['name'] = new_name
        new_data['version'] = "1.0"
        new_data['created_date'] = datetime.now().isoformat()
        new_data['last_modified'] = datetime.now().isoformat()
        new_data['status'] = ComponentStatus.DRAFT.value

        # Reset usage stats
        new_data['usage_stats'] = asdict(UsageStats())

        new_component = Component.from_dict(new_data)
        self.add_component(new_component)

        return new_component

    def get_stats(self) -> Dict[str, Any]:
        """Get library statistics."""
        total = len(self.components)
        by_category = {}
        by_status = {}

        for component in self.components.values():
            by_category[component.category] = by_category.get(component.category, 0) + 1
            by_status[component.status] = by_status.get(component.status, 0) + 1

        return {
            'total_components': total,
            'by_category': by_category,
            'by_status': by_status,
            'most_used': sorted(
                self.components.values(),
                key=lambda c: c.usage_stats.times_used,
                reverse=True
            )[:10]
        }
