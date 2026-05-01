"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


class SimulationConfig(BaseModel):
    """Configuration for running a traffic simulation."""
    grid_size: int = Field(default=4, ge=2, le=8, description="Grid size N for N×N grid")
    sim_steps: int = Field(default=500, ge=100, le=2000, description="Simulation time steps")
    spawn_rate: float = Field(default=0.3, ge=0.05, le=0.8, description="Vehicle spawn rate")
    green_duration: float = Field(default=30.0, ge=10, le=60, description="Fixed green duration")
    with_snapshots: bool = Field(default=False, description="Include state snapshots")
    snapshot_interval: int = Field(default=10, ge=1, le=50, description="Snapshot interval")


class GAConfig(BaseModel):
    """Configuration for the Genetic Algorithm optimizer."""
    grid_size: int = Field(default=4, ge=2, le=8, description="Grid size N for N×N grid")
    population_size: int = Field(default=30, ge=10, le=100, description="Population size")
    generations: int = Field(default=50, ge=5, le=200, description="Number of generations")
    crossover_rate: float = Field(default=0.8, ge=0.1, le=1.0, description="Crossover rate")
    mutation_rate: float = Field(default=0.1, ge=0.01, le=0.5, description="Mutation rate")
    elite_count: int = Field(default=2, ge=1, le=10, description="Number of elites")
    tournament_size: int = Field(default=3, ge=2, le=10, description="Tournament size")
    sim_steps: int = Field(default=500, ge=100, le=2000, description="Simulation steps")
    spawn_rate: float = Field(default=0.3, ge=0.05, le=0.8, description="Vehicle spawn rate")


class ComparisonConfig(BaseModel):
    """Configuration for baseline comparison."""
    grid_size: int = Field(default=4, ge=2, le=8, description="Grid size")
    sim_steps: int = Field(default=500, ge=100, le=2000, description="Simulation steps")
    spawn_rate: float = Field(default=0.3, ge=0.05, le=0.8, description="Spawn rate")
    fixed_green_duration: float = Field(default=30.0, ge=10, le=60, description="Fixed green duration")
    ga_population_size: int = Field(default=30, ge=10, le=100, description="GA population size")
    ga_generations: int = Field(default=50, ge=5, le=200, description="GA generations")
    ga_crossover_rate: float = Field(default=0.8, ge=0.1, le=1.0)
    ga_mutation_rate: float = Field(default=0.1, ge=0.01, le=0.5)


class SimulationResult(BaseModel):
    """Result from a traffic simulation."""
    strategy: str
    description: str
    throughput: int
    total_spawned: int
    avg_waiting_time: float
    avg_queue_length: float
    max_queue_length: int
    gridlock_penalty: float
    total_gridlock_events: int
    completion_rate: float
    vehicles_remaining: int
    timing_plan: Optional[List[Dict]] = None
    snapshots: Optional[List[Dict]] = None


class GenerationResult(BaseModel):
    """Result from one GA generation."""
    generation: int
    best_fitness: float
    avg_fitness: float
    min_fitness: float
    max_fitness: float
    best_metrics: Dict[str, Any]
    best_timing_plan: List[Dict]
    gen_time: float


class GAResult(BaseModel):
    """Complete GA optimization result."""
    best_chromosome: Dict[str, Any]
    history: List[Dict[str, Any]]
    total_time: float
    config: Dict[str, Any]


class ComparisonResult(BaseModel):
    """Result from baseline comparison."""
    fixed: Dict[str, Any]
    random: Dict[str, Any]
    ga_optimized: Dict[str, Any]
    verdict: str
    ga_history: List[Dict[str, Any]]


class ExportRequest(BaseModel):
    """Request to export results."""
    data: Dict[str, Any]
    format: str = Field(default="json", description="Export format: json or csv")
