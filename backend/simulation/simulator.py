"""
Traffic simulator engine.

Runs a discrete-time-step simulation of traffic flow through an N×N
intersection grid. Vehicles spawn at edges, travel through intersections,
wait at red signals, and exit the grid.

Collects metrics: throughput, average waiting time, queue lengths, gridlock events.
"""

import random
from typing import List, Dict
from backend.simulation.traffic_grid import TrafficGrid
from backend.simulation.vehicle import Vehicle, spawn_vehicles


class TrafficSimulator:
    """
    Discrete-time traffic simulation on an N×N grid.
    
    Args:
        grid_size: N for the N×N intersection grid
        timing_plan: List of timing dicts from chromosome
        sim_steps: Number of simulation time steps
        spawn_rate: Vehicle spawn probability per edge position per step
    """

    def __init__(
        self,
        grid_size: int = 4,
        timing_plan: List[dict] = None,
        sim_steps: int = 500,
        spawn_rate: float = 0.3,
    ):
        self.grid_size = grid_size
        self.sim_steps = sim_steps
        self.spawn_rate = spawn_rate
        self.grid = TrafficGrid(grid_size, timing_plan)
        self.vehicles: List[Vehicle] = []
        self.completed_vehicles: List[Vehicle] = []

        # Metrics tracking
        self.total_spawned = 0
        self.total_completed = 0
        self.total_waiting_time = 0.0
        self.queue_length_history: List[int] = []
        self.gridlock_history: List[int] = []
        self.throughput_history: List[int] = []

    def run(self) -> Dict:
        """
        Run the full traffic simulation.
        
        Returns:
            Dictionary of simulation results/metrics
        """
        # Reset vehicle ID counter for consistency
        Vehicle._next_id = 0

        for step in range(self.sim_steps):
            self._step(step)

        return self._compute_results()

    def run_with_snapshots(self, snapshot_interval: int = 10) -> Dict:
        """
        Run simulation and capture periodic state snapshots for visualization.
        
        Args:
            snapshot_interval: Capture state every N steps
            
        Returns:
            Results dict with additional 'snapshots' key
        """
        Vehicle._next_id = 0
        snapshots = []

        for step in range(self.sim_steps):
            self._step(step)

            if step % snapshot_interval == 0:
                snapshots.append(self._capture_snapshot(step))

        results = self._compute_results()
        results["snapshots"] = snapshots
        return results

    def _step(self, step: int) -> None:
        """Execute one simulation time step."""
        # 1. Update traffic signals
        self.grid.update_all()

        # 2. Spawn new vehicles at edges
        new_vehicles = spawn_vehicles(self.grid_size, self.spawn_rate)
        self.vehicles.extend(new_vehicles)
        self.total_spawned += len(new_vehicles)

        # 3. Process each vehicle
        vehicles_to_remove = []
        step_completed = 0

        for vehicle in self.vehicles:
            vehicle.steps_in_system += 1
            intersection = self.grid.get_intersection(vehicle.row, vehicle.col)

            if intersection is None:
                # Vehicle has exited the grid
                vehicle.completed = True
                vehicles_to_remove.append(vehicle)
                step_completed += 1
                continue

            # Check if vehicle can proceed
            can_proceed = False
            if vehicle.needs_ns_green() and intersection.is_ns_green():
                can_proceed = True
            elif vehicle.needs_ew_green() and intersection.is_ew_green():
                can_proceed = True

            if can_proceed:
                # Remove from queue if queued
                if vehicle in intersection.ns_queue:
                    intersection.ns_queue.remove(vehicle)
                elif vehicle in intersection.ew_queue:
                    intersection.ew_queue.remove(vehicle)

                vehicle.is_queued = False
                intersection.vehicles_passed += 1

                # Move to next intersection
                vehicle.advance()

                # Check if exited grid
                if (vehicle.row < 0 or vehicle.row >= self.grid_size or
                        vehicle.col < 0 or vehicle.col >= self.grid_size):
                    vehicle.completed = True
                    vehicles_to_remove.append(vehicle)
                    step_completed += 1
            else:
                # Vehicle must wait
                vehicle.waiting_time += 1.0
                vehicle.is_queued = True
                self.total_waiting_time += 1.0

                # Add to appropriate queue
                if vehicle.needs_ns_green():
                    if vehicle not in intersection.ns_queue:
                        intersection.ns_queue.append(vehicle)
                else:
                    if vehicle not in intersection.ew_queue:
                        intersection.ew_queue.append(vehicle)

        # Remove completed vehicles
        for v in vehicles_to_remove:
            self.completed_vehicles.append(v)
            if v in self.vehicles:
                self.vehicles.remove(v)
        
        self.total_completed += step_completed

        # 4. Track metrics
        total_queue = self.grid.get_total_queue_length()
        self.queue_length_history.append(total_queue)
        self.throughput_history.append(step_completed)
        
        gridlocked = self.grid.check_gridlock(max_queue=15)
        self.gridlock_history.append(gridlocked)

    def _compute_results(self) -> Dict:
        """Compute final simulation metrics."""
        throughput = self.total_completed

        # Average waiting time per completed vehicle
        if self.completed_vehicles:
            avg_waiting = sum(v.waiting_time for v in self.completed_vehicles) / len(self.completed_vehicles)
        else:
            avg_waiting = sum(v.waiting_time for v in self.vehicles) / max(len(self.vehicles), 1) if self.vehicles else 0

        avg_queue = sum(self.queue_length_history) / max(len(self.queue_length_history), 1)
        total_gridlock = sum(self.gridlock_history)

        # Gridlock penalty: normalized by grid size and sim steps
        gridlock_penalty = total_gridlock / max(self.sim_steps * self.grid_size * self.grid_size, 1) * 100

        return {
            "throughput": throughput,
            "total_spawned": self.total_spawned,
            "avg_waiting_time": round(avg_waiting, 2),
            "avg_queue_length": round(avg_queue, 2),
            "max_queue_length": max(self.queue_length_history) if self.queue_length_history else 0,
            "gridlock_penalty": round(gridlock_penalty, 2),
            "total_gridlock_events": total_gridlock,
            "completion_rate": round(throughput / max(self.total_spawned, 1) * 100, 2),
            "vehicles_remaining": len(self.vehicles),
        }

    def _capture_snapshot(self, step: int) -> Dict:
        """Capture current simulation state for visualization."""
        return {
            "step": step,
            "intersections": self.grid.get_all_states(),
            "vehicle_count": len(self.vehicles),
            "completed_count": self.total_completed,
            "queue_length": self.grid.get_total_queue_length(),
            "vehicles": [
                {
                    "id": v.id,
                    "row": v.row,
                    "col": v.col,
                    "direction": v.direction.value,
                    "waiting": v.waiting_time,
                    "queued": v.is_queued,
                }
                for v in self.vehicles[:100]  # Limit for performance
            ],
        }
