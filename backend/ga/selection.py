"""
Selection operators for the Genetic Algorithm.

Implements tournament selection where k individuals are randomly chosen
from the population and the fittest among them is selected as a parent.
"""

import random
from typing import List
from backend.ga.chromosome import Chromosome


def tournament_selection(
    population: List[Chromosome],
    tournament_size: int = 3,
) -> Chromosome:
    """
    Select one parent using tournament selection.
    
    Randomly picks `tournament_size` individuals from the population
    and returns the one with the highest fitness.
    
    Args:
        population: List of evaluated chromosomes
        tournament_size: Number of individuals in each tournament
        
    Returns:
        The fittest individual from the tournament
    """
    tournament = random.sample(population, min(tournament_size, len(population)))
    winner = max(tournament, key=lambda c: c.fitness if c.fitness is not None else float('-inf'))
    return winner.copy()


def select_parents(
    population: List[Chromosome],
    num_parents: int,
    tournament_size: int = 3,
) -> List[Chromosome]:
    """
    Select multiple parents from the population using tournament selection.
    
    Args:
        population: List of evaluated chromosomes
        num_parents: Number of parents to select
        tournament_size: Tournament size for each selection
        
    Returns:
        List of selected parent chromosomes (copies)
    """
    parents = []
    for _ in range(num_parents):
        parent = tournament_selection(population, tournament_size)
        parents.append(parent)
    return parents
