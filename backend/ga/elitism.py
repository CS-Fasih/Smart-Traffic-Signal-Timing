"""
Elitism operator for the Genetic Algorithm.

Preserves the top-K fittest individuals from the current generation
and carries them forward unchanged to the next generation.
This prevents the loss of the best solutions found so far.
"""

from typing import List
from backend.ga.chromosome import Chromosome


def apply_elitism(
    population: List[Chromosome],
    elite_count: int = 2,
) -> List[Chromosome]:
    """
    Extract the top elite_count individuals from the population.
    
    The population must already be sorted by fitness (descending).
    Returns deep copies of the elite individuals to preserve them.
    
    Args:
        population: Fitness-sorted population (best first)
        elite_count: Number of elite individuals to preserve
        
    Returns:
        List of elite chromosome copies
    """
    # Ensure we don't try to take more elites than population
    elite_count = min(elite_count, len(population))
    
    # Sort by fitness descending if not already
    sorted_pop = sorted(
        population,
        key=lambda c: c.fitness if c.fitness is not None else float('-inf'),
        reverse=True,
    )
    
    # Return copies of top individuals
    elites = [sorted_pop[i].copy() for i in range(elite_count)]
    return elites


def merge_elites(
    new_population: List[Chromosome],
    elites: List[Chromosome],
) -> List[Chromosome]:
    """
    Merge elites back into the new population.
    
    Replaces the worst individuals in the new population with elites
    to maintain population size.
    
    Args:
        new_population: The newly created population (after crossover/mutation)
        elites: Elite individuals from the previous generation
        
    Returns:
        Population with elites inserted
    """
    # Sort new population by fitness (those without fitness go last)
    new_population.sort(
        key=lambda c: c.fitness if c.fitness is not None else float('-inf'),
        reverse=True,
    )
    
    # Replace worst individuals with elites
    for i, elite in enumerate(elites):
        if i < len(new_population):
            new_population[-(i + 1)] = elite
        else:
            new_population.append(elite)
    
    return new_population
