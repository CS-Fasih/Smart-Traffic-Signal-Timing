"""
Traffic grid model for the N×N intersection network.

Each intersection has two traffic signal phases:
    - NS (North-South): Green for vehicles traveling N↔S
    - EW (East-West): Green for vehicles traveling E↔W

The grid has roads connecting adjacent intersections.
Vehicles enter from grid edges and traverse the network.
"""

from typing import List, Tuple, Dict
from enum import Enum


class SignalPhase(Enum):
    """Traffic signal phase states."""
    NS_GREEN = "NS_GREEN"  # North-South has green
    EW_GREEN = "EW_GREEN"  # East-West has green


class Intersection:
    """
    Represents a single intersection in the traffic grid.
    
    Attributes:
        row, col: Grid position
        ns_green_duration: Green duration for NS phase (seconds)
        ew_green_duration: Green duration for EW phase (seconds)
        current_phase: Current signal phase
        phase_timer: Time remaining in current phase
        ns_queue: Vehicles queued in NS direction
        ew_queue: Vehicles queued in EW direction
    """

    def __init__(self, row: int, col: int, ns_green: float = 30, ew_green: float = 30):
        self.row = row
        self.col = col
        self.ns_green_duration = ns_green
        self.ew_green_duration = ew_green
        self.current_phase = SignalPhase.NS_GREEN
        self.phase_timer = ns_green
        self.ns_queue: List = []
        self.ew_queue: List = []
        self.total_ns_wait = 0.0
        self.total_ew_wait = 0.0
        self.vehicles_passed = 0
        self.gridlock_events = 0

    def update(self, dt: float = 1.0) -> None:
        """Advance the signal timer by dt seconds."""
        self.phase_timer -= dt
        if self.phase_timer <= 0:
            self._switch_phase()

    def _switch_phase(self) -> None:
        """Toggle between NS and EW green phases."""
        if self.current_phase == SignalPhase.NS_GREEN:
            self.current_phase = SignalPhase.EW_GREEN
            self.phase_timer = self.ew_green_duration
        else:
            self.current_phase = SignalPhase.NS_GREEN
            self.phase_timer = self.ns_green_duration

    def is_ns_green(self) -> bool:
        return self.current_phase == SignalPhase.NS_GREEN

    def is_ew_green(self) -> bool:
        return self.current_phase == SignalPhase.EW_GREEN

    def get_queue_length(self) -> int:
        return len(self.ns_queue) + len(self.ew_queue)

    def to_dict(self) -> dict:
        return {
            "position": [self.row, self.col],
            "ns_green_duration": self.ns_green_duration,
            "ew_green_duration": self.ew_green_duration,
            "current_phase": self.current_phase.value,
            "phase_timer": round(self.phase_timer, 1),
            "ns_queue_length": len(self.ns_queue),
            "ew_queue_length": len(self.ew_queue),
            "vehicles_passed": self.vehicles_passed,
        }


class TrafficGrid:
    """
    N×N grid of intersections connected by roads.
    
    The grid layout:
    - Rows represent North-South roads
    - Columns represent East-West roads
    - Intersections are at every (row, col) position
    """

    def __init__(self, grid_size: int, timing_plan: List[dict] = None):
        self.grid_size = grid_size
        self.intersections: Dict[Tuple[int, int], Intersection] = {}

        # Create intersections
        for row in range(grid_size):
            for col in range(grid_size):
                ns_green = 30.0
                ew_green = 30.0

                if timing_plan:
                    for plan in timing_plan:
                        pos = plan["intersection"]
                        if pos[0] == row and pos[1] == col:
                            ns_green = plan["ns_green"]
                            ew_green = plan["ew_green"]
                            break

                self.intersections[(row, col)] = Intersection(row, col, ns_green, ew_green)

    def get_intersection(self, row: int, col: int) -> Intersection:
        return self.intersections.get((row, col))

    def update_all(self, dt: float = 1.0) -> None:
        """Update all intersection signals."""
        for intersection in self.intersections.values():
            intersection.update(dt)

    def get_total_queue_length(self) -> int:
        return sum(i.get_queue_length() for i in self.intersections.values())

    def get_all_states(self) -> List[dict]:
        return [i.to_dict() for i in self.intersections.values()]

    def check_gridlock(self, max_queue: int = 15) -> int:
        """Count intersections experiencing gridlock (queue > threshold)."""
        gridlocked = 0
        for intersection in self.intersections.values():
            if intersection.get_queue_length() > max_queue:
                gridlocked += 1
                intersection.gridlock_events += 1
        return gridlocked
