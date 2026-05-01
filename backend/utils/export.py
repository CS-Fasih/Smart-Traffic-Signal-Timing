"""
Export utilities for saving simulation and optimization results.
"""

import json
import csv
import io
from typing import Dict, Any


def export_to_json(data: Dict[str, Any]) -> str:
    """Export data as formatted JSON string."""
    return json.dumps(data, indent=2, default=str)


def export_to_csv(data: Dict[str, Any]) -> str:
    """
    Export comparison data as CSV string.
    Handles flat metric dictionaries.
    """
    output = io.StringIO()
    
    # If data has strategy results
    strategies = []
    for key in ["fixed", "random", "ga_optimized"]:
        if key in data:
            strategy_data = data[key]
            strategies.append(strategy_data)

    if strategies:
        # Get all metric keys
        metric_keys = set()
        for s in strategies:
            metric_keys.update(s.keys())
        
        # Remove non-metric keys
        skip_keys = {"timing_plan", "snapshots", "description"}
        metric_keys = sorted(metric_keys - skip_keys)

        writer = csv.writer(output)
        writer.writerow(["Metric"] + [s.get("strategy", "Unknown") for s in strategies])
        
        for key in metric_keys:
            row = [key] + [str(s.get(key, "N/A")) for s in strategies]
            writer.writerow(row)
    else:
        # Generic dict export
        writer = csv.writer(output)
        for key, value in data.items():
            if not isinstance(value, (dict, list)):
                writer.writerow([key, value])

    return output.getvalue()


def generate_verdict(fixed: Dict, random: Dict, ga: Dict) -> str:
    """
    Generate a dynamic verdict comparing the three timing strategies.
    
    Analyzes throughput, waiting time, and gridlock metrics to produce
    a natural language summary of which approach performed best.
    """
    verdicts = []
    
    # Compare throughput
    throughputs = {
        "Fixed Timing": fixed.get("throughput", 0),
        "Random Timing": random.get("throughput", 0),
        "GA Optimized": ga.get("throughput", 0),
    }
    best_throughput = max(throughputs, key=throughputs.get)
    
    # Compare waiting time
    wait_times = {
        "Fixed Timing": fixed.get("avg_waiting_time", 999),
        "Random Timing": random.get("avg_waiting_time", 999),
        "GA Optimized": ga.get("avg_waiting_time", 999),
    }
    best_wait = min(wait_times, key=wait_times.get)
    
    # Compare gridlock
    gridlocks = {
        "Fixed Timing": fixed.get("gridlock_penalty", 999),
        "Random Timing": random.get("gridlock_penalty", 999),
        "GA Optimized": ga.get("gridlock_penalty", 999),
    }
    best_gridlock = min(gridlocks, key=gridlocks.get)

    # Build verdict
    ga_throughput = throughputs["GA Optimized"]
    fixed_throughput = throughputs["Fixed Timing"]
    random_throughput = throughputs["Random Timing"]
    
    ga_wait = wait_times["GA Optimized"]
    fixed_wait = wait_times["Fixed Timing"]
    random_wait = wait_times["Random Timing"]

    if best_throughput == "GA Optimized":
        improvement_fixed = ((ga_throughput - fixed_throughput) / max(fixed_throughput, 1)) * 100
        improvement_random = ((ga_throughput - random_throughput) / max(random_throughput, 1)) * 100
        verdicts.append(
            f"GA Optimized timing achieved the highest throughput ({ga_throughput} vehicles), "
            f"improving over Fixed Timing by {improvement_fixed:.1f}% and Random Timing by {improvement_random:.1f}%."
        )
    else:
        verdicts.append(
            f"{best_throughput} achieved the highest throughput ({throughputs[best_throughput]} vehicles). "
            f"GA Optimized achieved {ga_throughput} vehicles."
        )

    if best_wait == "GA Optimized":
        reduction_fixed = ((fixed_wait - ga_wait) / max(fixed_wait, 0.01)) * 100
        verdicts.append(
            f"GA Optimized reduced average waiting time to {ga_wait:.1f}s, "
            f"a {reduction_fixed:.1f}% reduction compared to Fixed Timing ({fixed_wait:.1f}s)."
        )
    else:
        verdicts.append(
            f"{best_wait} had the lowest average waiting time ({wait_times[best_wait]:.1f}s). "
            f"GA Optimized achieved {ga_wait:.1f}s."
        )

    if best_gridlock == "GA Optimized":
        verdicts.append(
            f"GA Optimized achieved the lowest gridlock penalty ({gridlocks['GA Optimized']:.2f}), "
            f"demonstrating superior congestion management."
        )

    # Overall conclusion
    wins = sum([
        best_throughput == "GA Optimized",
        best_wait == "GA Optimized",
        best_gridlock == "GA Optimized",
    ])
    
    if wins >= 2:
        verdicts.append(
            "CONCLUSION: The Genetic Algorithm optimization successfully evolved superior "
            "traffic signal timing plans, outperforming both Fixed and Random baselines "
            "across multiple metrics. This demonstrates the effectiveness of evolutionary "
            "computing in solving the traffic signal timing optimization problem."
        )
    elif wins == 1:
        verdicts.append(
            "CONCLUSION: The Genetic Algorithm showed improvement in some metrics. "
            "With additional generations or parameter tuning, further improvements are expected."
        )
    else:
        verdicts.append(
            "CONCLUSION: The Genetic Algorithm results were comparable to baselines in this run. "
            "Increasing population size, generations, or adjusting mutation/crossover rates "
            "may yield better optimization results."
        )

    return " ".join(verdicts)
