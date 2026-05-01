"""
Fitness function for evaluating traffic signal timing plans.

The fitness function runs a traffic simulation with the chromosome's timing plan
and computes a weighted score based on multiple traffic metrics:
    - Throughput (vehicles completed): MAXIMIZE
    - Average waiting time: MINIMIZE
    - Average queue length: MINIMIZE
    - Gridlock penalty: MINIMIZE

Fitness = (throughput_weight × throughput) 
        - (wait_weight × avg_waiting_time) 
        - (queue_weight × avg_queue_length) 
        - (gridlock_weight × gridlock_penalty)
"""

from backend.ga.chromosome import Chromosome
from backend.simulation.simulator import TrafficSimulator

# Default fitness weights
DEFAULT_WEIGHTS = {
    "throughput": 2.0,
    "waiting_time": 1.0,
    "queue_length": 0.5,
    "gridlock": 3.0,
}


def evaluate_fitness(
    chromosome: Chromosome,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
    weights: dict = None,
) -> float:
    """
    Evaluate the fitness of a chromosome by running traffic simulation.
    
    Args:
        chromosome: The timing plan to evaluate
        sim_steps: Number of simulation time steps
        spawn_rate: Vehicle spawn probability per edge per step
        weights: Dict of fitness component weights
        
    Returns:
        Fitness score (higher is better)
    """
    if weights is None:
        weights = DEFAULT_WEIGHTS

    # Run simulation with this timing plan
    simulator = TrafficSimulator(
        grid_size=chromosome.grid_size,
        timing_plan=chromosome.get_timing_plan(),
        sim_steps=sim_steps,
        spawn_rate=spawn_rate,
    )
    results = simulator.run()

    # Extract metrics
    throughput = results["throughput"]
    avg_waiting = results["avg_waiting_time"]
    avg_queue = results["avg_queue_length"]
    gridlock = results["gridlock_penalty"]

    # Compute fitness
    fitness = (
        weights["throughput"] * throughput
        - weights["waiting_time"] * avg_waiting
        - weights["queue_length"] * avg_queue
        - weights["gridlock"] * gridlock
    )

    # Store metrics on chromosome
    chromosome.fitness = fitness
    chromosome.metrics = {
        "throughput": throughput,
        "avg_waiting_time": round(avg_waiting, 2),
        "avg_queue_length": round(avg_queue, 2),
        "gridlock_penalty": round(gridlock, 2),
        "fitness": round(fitness, 2),
    }

    return fitness


def evaluate_population(
    population: list,
    sim_steps: int = 500,
    spawn_rate: float = 0.3,
    weights: dict = None,
) -> list:
    """
    Evaluate fitness for all chromosomes in the population.
    
    Args:
        population: List of Chromosome objects
        sim_steps: Simulation time steps
        spawn_rate: Vehicle spawn rate
        weights: Fitness weights
        
    Returns:
        Population sorted by fitness (descending)
    """
    for chromosome in population:
        evaluate_fitness(chromosome, sim_steps, spawn_rate, weights)

    # Sort by fitness descending (best first)
    population.sort(key=lambda c: c.fitness, reverse=True)
    return population
