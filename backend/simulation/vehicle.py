"""
Vehicle agent for the traffic simulation.

Vehicles spawn at grid edges, travel through the network following
a path of intersections, and exit when they reach their destination edge.
"""

import random
from typing import Tuple, List
from enum import Enum


class Direction(Enum):
    """Vehicle travel direction."""
    NORTH = "NORTH"
    SOUTH = "SOUTH"
    EAST = "EAST"
    WEST = "WEST"


# Map directions to (row_delta, col_delta)
DIRECTION_DELTA = {
    Direction.NORTH: (-1, 0),
    Direction.SOUTH: (1, 0),
    Direction.EAST: (0, 1),
    Direction.WEST: (0, -1),
}

# NS directions and EW directions
NS_DIRECTIONS = {Direction.NORTH, Direction.SOUTH}
EW_DIRECTIONS = {Direction.EAST, Direction.WEST}


class Vehicle:
    """
    Represents a vehicle in the traffic simulation.
    
    Attributes:
        id: Unique vehicle identifier
        row, col: Current position (intersection)
        direction: Travel direction
        waiting_time: Total time spent waiting at red signals
        is_queued: Whether currently stopped at a red light
        completed: Whether vehicle has exited the grid
    """

    _next_id = 0

    def __init__(self, row: int, col: int, direction: Direction):
        Vehicle._next_id += 1
        self.id = Vehicle._next_id
        self.row = row
        self.col = col
        self.direction = direction
        self.waiting_time = 0.0
        self.is_queued = False
        self.completed = False
        self.steps_in_system = 0

    def needs_ns_green(self) -> bool:
        """Check if this vehicle needs NS green to proceed."""
        return self.direction in NS_DIRECTIONS

    def needs_ew_green(self) -> bool:
        """Check if this vehicle needs EW green to proceed."""
        return self.direction in EW_DIRECTIONS

    def get_next_position(self) -> Tuple[int, int]:
        """Calculate next position based on direction."""
        dr, dc = DIRECTION_DELTA[self.direction]
        return self.row + dr, self.col + dc

    def advance(self) -> None:
        """Move vehicle to next intersection."""
        dr, dc = DIRECTION_DELTA[self.direction]
        self.row += dr
        self.col += dc
        self.is_queued = False

    def __repr__(self):
        return f"Vehicle(id={self.id}, pos=({self.row},{self.col}), dir={self.direction.value})"


def spawn_vehicles(grid_size: int, spawn_rate: float) -> List[Vehicle]:
    """
    Spawn new vehicles at grid edges.
    
    Vehicles enter from all four edges traveling inward:
    - North edge (row=0): travel SOUTH
    - South edge (row=N-1): travel NORTH  
    - West edge (col=0): travel EAST
    - East edge (col=N-1): travel WEST
    
    Args:
        grid_size: Size of the traffic grid
        spawn_rate: Probability of spawning at each edge position
        
    Returns:
        List of newly spawned vehicles
    """
    new_vehicles = []

    # North edge → traveling South
    for col in range(grid_size):
        if random.random() < spawn_rate:
            new_vehicles.append(Vehicle(0, col, Direction.SOUTH))

    # South edge → traveling North
    for col in range(grid_size):
        if random.random() < spawn_rate:
            new_vehicles.append(Vehicle(grid_size - 1, col, Direction.NORTH))

    # West edge → traveling East
    for row in range(grid_size):
        if random.random() < spawn_rate:
            new_vehicles.append(Vehicle(row, 0, Direction.EAST))

    # East edge → traveling West
    for row in range(grid_size):
        if random.random() < spawn_rate:
            new_vehicles.append(Vehicle(row, grid_size - 1, Direction.WEST))

    return new_vehicles
