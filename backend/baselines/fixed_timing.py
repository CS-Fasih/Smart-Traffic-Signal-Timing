"""
Fixed timing baseline.

All intersections use the same fixed green duration for both phases.
This represents the simplest traditional traffic control approach.
"""

from typing import Dict, List
from backend.simulation.simulator import TrafficSimulator


def run_fixed_timing(
    grid_size: int = 4,
    green_duration: float = 30.0,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
) -> Dict:
    """
    Run simulation with fixed equal-duration signals at all intersections.
    
    Args:
        grid_size: N for N×N grid
        green_duration: Fixed green duration for both phases (seconds)
        sim_steps: Simulation time steps
        spawn_rate: Vehicle spawn rate
        
    Returns:
        Simulation results dictionary
    """
    # Create timing plan: all intersections get same duration
    timing_plan = []
    for row in range(grid_size):
        for col in range(grid_size):
            timing_plan.append({
                "intersection": (row, col),
                "ns_green": green_duration,
                "ew_green": green_duration,
            })

    simulator = TrafficSimulator(
        grid_size=grid_size,
        timing_plan=timing_plan,
        sim_steps=sim_steps,
        spawn_rate=spawn_rate,
    )
    
    results = simulator.run()
    results["strategy"] = "Fixed Timing"
    results["description"] = f"All intersections use {green_duration}s green for both NS and EW phases"
    results["timing_plan"] = timing_plan
    return results


def run_fixed_timing_with_snapshots(
    grid_size: int = 4,
    green_duration: float = 30.0,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
    snapshot_interval: int = 10,
) -> Dict:
    """Run fixed timing simulation with snapshots for visualization."""
    timing_plan = []
    for row in range(grid_size):
        for col in range(grid_size):
            timing_plan.append({
                "intersection": (row, col),
                "ns_green": green_duration,
                "ew_green": green_duration,
            })

    simulator = TrafficSimulator(
        grid_size=grid_size,
        timing_plan=timing_plan,
        sim_steps=sim_steps,
        spawn_rate=spawn_rate,
    )
    
    results = simulator.run_with_snapshots(snapshot_interval)
    results["strategy"] = "Fixed Timing"
    results["description"] = f"All intersections use {green_duration}s green for both phases"
    results["timing_plan"] = timing_plan
    return results
