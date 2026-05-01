"""
Main Genetic Algorithm optimizer.

Orchestrates the complete evolutionary optimization loop:
1. Initialize random population
2. Evaluate fitness for all individuals
3. Apply elitism (preserve best)
4. Select parents via tournament selection
5. Apply crossover to produce offspring
6. Apply mutation for diversity
7. Merge elites back
8. Repeat for N generations
9. Return generation-by-generation results + best solution
"""

import time
from typing import List, Dict, Callable, Optional

from backend.ga.chromosome import Chromosome, create_random_population
from backend.ga.fitness import evaluate_population
from backend.ga.selection import select_parents
from backend.ga.crossover import single_point_crossover
from backend.ga.mutation import random_reset_mutation
from backend.ga.elitism import apply_elitism, merge_elites


class GAOptimizer:
    """
    Genetic Algorithm optimizer for traffic signal timing.
    
    Attributes:
        grid_size: N for N×N traffic grid
        population_size: Number of individuals per generation
        generations: Number of evolutionary generations
        crossover_rate: Probability of crossover
        mutation_rate: Probability of per-gene mutation
        elite_count: Number of elites to preserve
        tournament_size: Tournament selection size
        sim_steps: Traffic simulation time steps
        spawn_rate: Vehicle spawn rate
    """

    def __init__(
        self,
        grid_size: int = 4,
        population_size: int = 30,
        generations: int = 50,
        crossover_rate: float = 0.8,
        mutation_rate: float = 0.1,
        elite_count: int = 2,
        tournament_size: int = 3,
        sim_steps: int = 500,
        spawn_rate: float = 0.3,
    ):
        self.grid_size = grid_size
        self.population_size = population_size
        self.generations = generations
        self.crossover_rate = crossover_rate
        self.mutation_rate = mutation_rate
        self.elite_count = elite_count
        self.tournament_size = tournament_size
        self.sim_steps = sim_steps
        self.spawn_rate = spawn_rate

        self.population: List[Chromosome] = []
        self.history: List[Dict] = []
        self.best_chromosome: Optional[Chromosome] = None

    def run(self, progress_callback: Optional[Callable] = None) -> Dict:
        """
        Run the full Genetic Algorithm optimization.
        
        Args:
            progress_callback: Optional callback(generation_data) called after each generation
            
        Returns:
            Dictionary containing:
            - best_chromosome: Best timing plan found
            - history: List of generation-by-generation results
            - total_time: Total optimization time
            - config: GA parameters used
        """
        start_time = time.time()
        self.history = []

        # Step 1: Initialize random population
        self.population = create_random_population(self.population_size, self.grid_size)

        for gen in range(self.generations):
            gen_start = time.time()

            # Step 2: Evaluate fitness
            self.population = evaluate_population(
                self.population, self.sim_steps, self.spawn_rate
            )

            # Track best
            current_best = self.population[0]  # Already sorted descending
            if self.best_chromosome is None or current_best.fitness > self.best_chromosome.fitness:
                self.best_chromosome = current_best.copy()

            # Compute population statistics
            fitnesses = [c.fitness for c in self.population]
            avg_fitness = sum(fitnesses) / len(fitnesses)
            min_fitness = min(fitnesses)
            max_fitness = max(fitnesses)

            # Record generation data
            gen_data = {
                "generation": gen + 1,
                "best_fitness": round(current_best.fitness, 2),
                "avg_fitness": round(avg_fitness, 2),
                "min_fitness": round(min_fitness, 2),
                "max_fitness": round(max_fitness, 2),
                "best_metrics": current_best.metrics.copy(),
                "best_chromosome": current_best.genes.tolist(),
                "best_timing_plan": current_best.get_timing_plan(),
                "gen_time": round(time.time() - gen_start, 3),
            }
            self.history.append(gen_data)

            # Progress callback
            if progress_callback:
                progress_callback(gen_data)

            # Step 3: Elitism — preserve best individuals
            elites = apply_elitism(self.population, self.elite_count)

            # Step 4: Create next generation
            new_population = []
            num_offspring_needed = self.population_size - self.elite_count

            while len(new_population) < num_offspring_needed:
                # Select parents
                parents = select_parents(self.population, 2, self.tournament_size)
                parent1, parent2 = parents[0], parents[1]

                # Step 5: Crossover
                child1, child2 = single_point_crossover(
                    parent1, parent2, self.crossover_rate
                )

                # Step 6: Mutation
                child1 = random_reset_mutation(child1, self.mutation_rate)
                child2 = random_reset_mutation(child2, self.mutation_rate)

                new_population.append(child1)
                if len(new_population) < num_offspring_needed:
                    new_population.append(child2)

            # Step 7: Merge elites back
            self.population = merge_elites(new_population, elites)

        # Final evaluation of last generation
        self.population = evaluate_population(
            self.population, self.sim_steps, self.spawn_rate
        )
        if self.population[0].fitness > self.best_chromosome.fitness:
            self.best_chromosome = self.population[0].copy()

        total_time = time.time() - start_time

        return {
            "best_chromosome": self.best_chromosome.to_dict(),
            "history": self.history,
            "total_time": round(total_time, 2),
            "config": {
                "grid_size": self.grid_size,
                "population_size": self.population_size,
                "generations": self.generations,
                "crossover_rate": self.crossover_rate,
                "mutation_rate": self.mutation_rate,
                "elite_count": self.elite_count,
                "tournament_size": self.tournament_size,
                "sim_steps": self.sim_steps,
                "spawn_rate": self.spawn_rate,
            },
        }

    def get_progress(self) -> Dict:
        """Get current optimization progress."""
        return {
            "current_generation": len(self.history),
            "total_generations": self.generations,
            "best_fitness": self.best_chromosome.fitness if self.best_chromosome else None,
            "history": self.history,
        }
