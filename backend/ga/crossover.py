"""
Crossover operators for the Genetic Algorithm.

Implements single-point crossover and uniform crossover to combine
genetic material from two parent chromosomes to produce offspring.
"""

import numpy as np
import random
from backend.ga.chromosome import Chromosome, MIN_GREEN, MAX_GREEN


def single_point_crossover(
    parent1: Chromosome,
    parent2: Chromosome,
    crossover_rate: float = 0.8,
) -> tuple:
    """
    Perform single-point crossover between two parents.
    
    A random crossover point is chosen. Child1 gets parent1's genes before the point
    and parent2's genes after. Child2 gets the reverse.
    
    Args:
        parent1: First parent chromosome
        parent2: Second parent chromosome
        crossover_rate: Probability of crossover occurring
        
    Returns:
        Tuple of two offspring chromosomes
    """
    child1 = parent1.copy()
    child2 = parent2.copy()

    if random.random() < crossover_rate:
        point = random.randint(1, len(parent1.genes) - 1)
        child1.genes = np.concatenate([parent1.genes[:point], parent2.genes[point:]])
        child2.genes = np.concatenate([parent2.genes[:point], parent1.genes[point:]])
        
        # Ensure bounds
        child1.genes = np.clip(child1.genes, MIN_GREEN, MAX_GREEN)
        child2.genes = np.clip(child2.genes, MIN_GREEN, MAX_GREEN)

    # Reset fitness since genes changed
    child1.fitness = None
    child1.metrics = {}
    child2.fitness = None
    child2.metrics = {}

    return child1, child2


def uniform_crossover(
    parent1: Chromosome,
    parent2: Chromosome,
    crossover_rate: float = 0.8,
    swap_prob: float = 0.5,
) -> tuple:
    """
    Perform uniform crossover between two parents.
    
    Each gene is independently swapped between parents with probability swap_prob.
    
    Args:
        parent1: First parent chromosome
        parent2: Second parent chromosome
        crossover_rate: Probability of crossover occurring
        swap_prob: Probability of swapping each gene
        
    Returns:
        Tuple of two offspring chromosomes
    """
    child1 = parent1.copy()
    child2 = parent2.copy()

    if random.random() < crossover_rate:
        mask = np.random.random(len(parent1.genes)) < swap_prob
        child1.genes[mask] = parent2.genes[mask]
        child2.genes[mask] = parent1.genes[mask]

        child1.genes = np.clip(child1.genes, MIN_GREEN, MAX_GREEN)
        child2.genes = np.clip(child2.genes, MIN_GREEN, MAX_GREEN)

    child1.fitness = None
    child1.metrics = {}
    child2.fitness = None
    child2.metrics = {}

    return child1, child2
