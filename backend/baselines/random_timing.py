"""
Random timing baseline.

Each intersection gets random green durations within valid bounds.
This represents an unoptimized, chaotic signal control approach.
"""

import random as rnd
from typing import Dict, List
from backend.ga.chromosome import MIN_GREEN, MAX_GREEN
from backend.simulation.simulator import TrafficSimulator


def run_random_timing(
    grid_size: int = 4,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
    seed: int = None,
) -> Dict:
    """
    Run simulation with random signal durations at all intersections.
    
    Args:
        grid_size: N for N×N grid
        sim_steps: Simulation time steps
        spawn_rate: Vehicle spawn rate
        seed: Optional random seed for reproducibility
        
    Returns:
        Simulation results dictionary
    """
    if seed is not None:
        rnd.seed(seed)

    timing_plan = []
    for row in range(grid_size):
        for col in range(grid_size):
            timing_plan.append({
                "intersection": (row, col),
                "ns_green": round(rnd.uniform(MIN_GREEN, MAX_GREEN), 2),
                "ew_green": round(rnd.uniform(MIN_GREEN, MAX_GREEN), 2),
            })

    simulator = TrafficSimulator(
        grid_size=grid_size,
        timing_plan=timing_plan,
        sim_steps=sim_steps,
        spawn_rate=spawn_rate,
    )
    
    results = simulator.run()
    results["strategy"] = "Random Timing"
    results["description"] = f"Each intersection uses random green durations between {MIN_GREEN}s and {MAX_GREEN}s"
    results["timing_plan"] = timing_plan
    return results


def run_random_timing_with_snapshots(
    grid_size: int = 4,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
    snapshot_interval: int = 10,
    seed: int = None,
) -> Dict:
    """Run random timing simulation with snapshots for visualization."""
    if seed is not None:
        rnd.seed(seed)

    timing_plan = []
    for row in range(grid_size):
        for col in range(grid_size):
            timing_plan.append({
                "intersection": (row, col),
                "ns_green": round(rnd.uniform(MIN_GREEN, MAX_GREEN), 2),
                "ew_green": round(rnd.uniform(MIN_GREEN, MAX_GREEN), 2),
            })

    simulator = TrafficSimulator(
        grid_size=grid_size,
        timing_plan=timing_plan,
        sim_steps=sim_steps,
        spawn_rate=spawn_rate,
    )
    
    results = simulator.run_with_snapshots(snapshot_interval)
    results["strategy"] = "Random Timing"
    results["description"] = f"Each intersection uses random green durations between {MIN_GREEN}s and {MAX_GREEN}s"
    results["timing_plan"] = timing_plan
    return results
