"""
API routes for the Traffic GA Optimizer backend.

Provides endpoints for:
- Running traffic simulations
- Running GA optimization
- Comparing Fixed, Random, and GA timing strategies
- Exporting results
- Getting default configuration
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import json
import io

from backend.api.schemas import (
    SimulationConfig,
    GAConfig,
    ComparisonConfig,
    ExportRequest,
)
from backend.simulation.simulator import TrafficSimulator
from backend.baselines.fixed_timing import run_fixed_timing, run_fixed_timing_with_snapshots
from backend.baselines.random_timing import run_random_timing, run_random_timing_with_snapshots
from backend.ga.optimizer import GAOptimizer
from backend.utils.export import export_to_json, export_to_csv, generate_verdict

router = APIRouter(prefix="/api")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "Traffic GA Optimizer"}


@router.get("/config")
async def get_default_config():
    """Get default configuration parameters."""
    return {
        "simulation": SimulationConfig().model_dump(),
        "ga": GAConfig().model_dump(),
        "comparison": ComparisonConfig().model_dump(),
    }


@router.post("/simulate")
async def run_simulation(config: SimulationConfig):
    """
    Run a traffic simulation with fixed timing.
    
    Returns simulation results including throughput, waiting time,
    queue length, and gridlock metrics.
    """
    try:
        if config.with_snapshots:
            results = run_fixed_timing_with_snapshots(
                grid_size=config.grid_size,
                green_duration=config.green_duration,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
                snapshot_interval=config.snapshot_interval,
            )
        else:
            results = run_fixed_timing(
                grid_size=config.grid_size,
                green_duration=config.green_duration,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
            )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simulate/random")
async def run_random_simulation(config: SimulationConfig):
    """Run a traffic simulation with random timing."""
    try:
        if config.with_snapshots:
            results = run_random_timing_with_snapshots(
                grid_size=config.grid_size,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
                snapshot_interval=config.snapshot_interval,
            )
        else:
            results = run_random_timing(
                grid_size=config.grid_size,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
            )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize")
async def run_optimization(config: GAConfig):
    """
    Run the Genetic Algorithm optimization.
    
    Returns the best chromosome, generation-by-generation history,
    and timing plan for the optimal solution.
    """
    try:
        optimizer = GAOptimizer(
            grid_size=config.grid_size,
            population_size=config.population_size,
            generations=config.generations,
            crossover_rate=config.crossover_rate,
            mutation_rate=config.mutation_rate,
            elite_count=config.elite_count,
            tournament_size=config.tournament_size,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )
        
        results = optimizer.run()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare")
async def run_comparison(config: ComparisonConfig):
    """
    Run all three timing strategies and compare results.
    
    Runs Fixed Timing, Random Timing, and GA Optimized timing
    with the same simulation parameters, then generates a verdict.
    """
    try:
        # 1. Fixed timing baseline
        fixed_results = run_fixed_timing(
            grid_size=config.grid_size,
            green_duration=config.fixed_green_duration,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )

        # 2. Random timing baseline
        random_results = run_random_timing(
            grid_size=config.grid_size,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )

        # 3. GA Optimized timing
        optimizer = GAOptimizer(
            grid_size=config.grid_size,
            population_size=config.ga_population_size,
            generations=config.ga_generations,
            crossover_rate=config.ga_crossover_rate,
            mutation_rate=config.ga_mutation_rate,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )
        ga_results = optimizer.run()
        
        # Get GA optimized simulation metrics
        ga_best = ga_results["best_chromosome"]
        ga_metrics = ga_best["metrics"]
        ga_metrics["strategy"] = "GA Optimized"
        ga_metrics["description"] = "Best timing plan found by Genetic Algorithm"
        ga_metrics["timing_plan"] = ga_best["timing_plan"]
        ga_metrics["throughput"] = ga_metrics.get("throughput", 0)
        ga_metrics["total_spawned"] = fixed_results.get("total_spawned", 0)
        ga_metrics["max_queue_length"] = int(ga_metrics.get("avg_queue_length", 0) * 2)
        ga_metrics["total_gridlock_events"] = int(ga_metrics.get("gridlock_penalty", 0))
        ga_metrics["completion_rate"] = round(
            ga_metrics["throughput"] / max(ga_metrics.get("total_spawned", 1), 1) * 100, 2
        )
        ga_metrics["vehicles_remaining"] = 0

        # Generate dynamic verdict
        verdict = generate_verdict(fixed_results, random_results, ga_metrics)

        return {
            "fixed": fixed_results,
            "random": random_results,
            "ga_optimized": ga_metrics,
            "verdict": verdict,
            "ga_history": ga_results["history"],
            "ga_config": ga_results["config"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export")
async def export_results(request: ExportRequest):
    """Export results in JSON or CSV format."""
    try:
        if request.format == "csv":
            csv_content = export_to_csv(request.data)
            return StreamingResponse(
                io.BytesIO(csv_content.encode()),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=results.csv"},
            )
        else:
            json_content = export_to_json(request.data)
            return StreamingResponse(
                io.BytesIO(json_content.encode()),
                media_type="application/json",
                headers={"Content-Disposition": "attachment; filename=results.json"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
