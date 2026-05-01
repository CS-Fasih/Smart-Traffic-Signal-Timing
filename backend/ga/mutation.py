"""
Mutation operators for the Genetic Algorithm.

Implements random reset mutation and Gaussian perturbation mutation
to introduce genetic diversity and prevent premature convergence.
"""

import numpy as np
from backend.ga.chromosome import Chromosome, MIN_GREEN, MAX_GREEN


def random_reset_mutation(
    chromosome: Chromosome,
    mutation_rate: float = 0.1,
) -> Chromosome:
    """
    Apply random reset mutation to a chromosome.
    
    Each gene has an independent probability (mutation_rate) of being
    replaced with a new random value within [MIN_GREEN, MAX_GREEN].
    
    Args:
        chromosome: The chromosome to mutate (modified in-place)
        mutation_rate: Probability of each gene being mutated
        
    Returns:
        The mutated chromosome
    """
    mutation_mask = np.random.random(chromosome.gene_length) < mutation_rate
    num_mutations = np.sum(mutation_mask)
    
    if num_mutations > 0:
        chromosome.genes[mutation_mask] = np.random.uniform(
            MIN_GREEN, MAX_GREEN, num_mutations
        )
        chromosome.fitness = None
        chromosome.metrics = {}

    return chromosome


def gaussian_mutation(
    chromosome: Chromosome,
    mutation_rate: float = 0.1,
    sigma: float = 5.0,
) -> Chromosome:
    """
    Apply Gaussian perturbation mutation to a chromosome.
    
    Each gene has an independent probability (mutation_rate) of being
    perturbed by a value drawn from N(0, sigma), then clipped to bounds.
    
    Args:
        chromosome: The chromosome to mutate (modified in-place)
        mutation_rate: Probability of each gene being mutated
        sigma: Standard deviation of the Gaussian noise
        
    Returns:
        The mutated chromosome
    """
    mutation_mask = np.random.random(chromosome.gene_length) < mutation_rate
    num_mutations = np.sum(mutation_mask)
    
    if num_mutations > 0:
        perturbation = np.random.normal(0, sigma, num_mutations)
        chromosome.genes[mutation_mask] += perturbation
        chromosome.genes = np.clip(chromosome.genes, MIN_GREEN, MAX_GREEN)
        chromosome.fitness = None
        chromosome.metrics = {}

    return chromosome
