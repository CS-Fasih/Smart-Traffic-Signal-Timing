"""
Chromosome representation for traffic signal timing optimization.

Each chromosome encodes a complete traffic signal timing plan for an N×N grid.
For each intersection, there are 2 phases (North-South and East-West),
so the chromosome length = 2 × N × N.

Gene values represent green-light durations in seconds, bounded by [MIN_GREEN, MAX_GREEN].
"""

import numpy as np
from typing import List, Optional

# Green duration bounds (seconds)
MIN_GREEN = 10
MAX_GREEN = 60


class Chromosome:
    """
    Represents a traffic signal timing plan for an N×N intersection grid.
    
    Attributes:
        grid_size: Size of the traffic grid (N for an N×N grid)
        genes: Array of green durations [NS_phase_0, EW_phase_0, NS_phase_1, EW_phase_1, ...]
        fitness: Evaluated fitness score (None if not yet evaluated)
        metrics: Dictionary of simulation metrics (throughput, waiting time, etc.)
    """

    def __init__(self, grid_size: int, genes: Optional[np.ndarray] = None):
        self.grid_size = grid_size
        self.num_intersections = grid_size * grid_size
        self.gene_length = 2 * self.num_intersections  # 2 phases per intersection

        if genes is not None:
            self.genes = np.clip(genes.astype(float), MIN_GREEN, MAX_GREEN)
        else:
            # Random initialization within bounds
            self.genes = np.random.uniform(MIN_GREEN, MAX_GREEN, self.gene_length)

        self.fitness: Optional[float] = None
        self.metrics: dict = {}

    def get_timing_plan(self) -> List[dict]:
        """
        Convert genes to a structured timing plan.
        
        Returns:
            List of dicts, one per intersection:
            [
                {"intersection": (row, col), "ns_green": float, "ew_green": float},
                ...
            ]
        """
        plan = []
        for i in range(self.num_intersections):
            row = i // self.grid_size
            col = i % self.grid_size
            ns_green = self.genes[2 * i]
            ew_green = self.genes[2 * i + 1]
            plan.append({
                "intersection": (row, col),
                "ns_green": round(float(ns_green), 2),
                "ew_green": round(float(ew_green), 2),
            })
        return plan

    def to_dict(self) -> dict:
        """Serialize chromosome to dictionary."""
        return {
            "grid_size": self.grid_size,
            "genes": self.genes.tolist(),
            "timing_plan": self.get_timing_plan(),
            "fitness": self.fitness,
            "metrics": self.metrics,
        }

    def copy(self) -> "Chromosome":
        """Create a deep copy of this chromosome."""
        new = Chromosome(self.grid_size, self.genes.copy())
        new.fitness = self.fitness
        new.metrics = self.metrics.copy()
        return new

    def __repr__(self):
        return (
            f"Chromosome(grid={self.grid_size}x{self.grid_size}, "
            f"genes_len={self.gene_length}, fitness={self.fitness})"
        )


def create_random_population(pop_size: int, grid_size: int) -> List[Chromosome]:
    """
    Initialize a random population of chromosomes.
    
    Args:
        pop_size: Number of individuals in the population
        grid_size: N for the N×N traffic grid
        
    Returns:
        List of randomly initialized Chromosome objects
    """
    return [Chromosome(grid_size) for _ in range(pop_size)]
