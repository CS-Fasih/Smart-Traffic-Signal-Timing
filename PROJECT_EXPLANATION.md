# Project Explanation: Evolutionary Optimization of Urban Traffic Signal Timing

## Overview

**Project Title:** Evolutionary Optimization of Urban Traffic Signal Timing Using a Genetic Algorithm  
**Course:** Evolutionary Computing  
**Institution:** Dawood University of Engineering & Technology  

This project is a comprehensive full-stack application designed to solve the critical problem of urban traffic congestion by dynamically optimizing traffic signal timing. Traditional signal systems rely on fixed-cycle timings that cannot adapt to fluctuating traffic densities, often leading to gridlocks, excessive wait times, and poor vehicle throughput. 

To overcome these limitations, this project implements a **Genetic Algorithm (GA)** — an Evolutionary Computing technique inspired by natural selection — to discover near-optimal signal timing plans for an $N \times N$ grid of intersections. By simulating traffic flows under various signal configurations and evaluating them based on key performance metrics, the algorithm evolves progressively better timing strategies.

The project features a high-performance **Python/FastAPI backend** that hosts the GA engine and the discrete-event traffic simulator, paired with a modern, interactive **React frontend** that visualizes the traffic grid, tracks the evolutionary optimization process, and provides comparative analytics.

---

## The Problem Statement

In modern cities, intersections are the primary bottlenecks of traffic flow. A poorly timed traffic signal can cause a chain reaction, leading to long queues that spill over into adjacent intersections, creating a complete standstill known as gridlock. 

The goal of this project is to optimize the duration of green lights for both North-South (NS) and East-West (EW) traffic flows at every intersection in an urban grid to achieve the following:
1. **Maximize Vehicle Throughput:** Increase the total number of vehicles that successfully navigate the grid and reach their destinations.
2. **Minimize Average Waiting Time:** Reduce the time vehicles spend idling at red lights.
3. **Minimize Average Queue Length:** Prevent large buildups of vehicles at any single intersection.
4. **Prevent Gridlocks:** Penalize and eliminate configurations that cause traffic flow to stop entirely.

---

## How It Works: The Genetic Algorithm

The core of the system is the Genetic Algorithm (GA), which searches the vast space of possible signal timing plans to find the optimal configuration. The GA workflow mimics biological evolution:

### 1. Chromosome Representation
A **Chromosome** represents a complete timing plan for the entire $N \times N$ grid. It is encoded as a real-valued array of length $2 \times N \times N$.
- Each intersection requires two genes: the green light duration for the North-South (NS) phase and the East-West (EW) phase.
- **Constraints:** Every gene is bounded between a minimum (e.g., 10 seconds) and a maximum (e.g., 60 seconds) duration to ensure realistic traffic cycles.

### 2. Initialization
The process begins by randomly generating an initial population of timing plans (e.g., 30 chromosomes), providing diverse genetic material for the algorithm to explore.

### 3. Evaluation (The Fitness Function)
To determine how "good" a timing plan is, the chromosome is injected into a **discrete-event traffic simulator**. The simulator generates vehicles and models their movement through the grid based on the provided signal timings. After the simulation completes, metrics are extracted, and a weighted **Fitness Score** is calculated:

```text
Fitness = (w₁ × Throughput) − (w₂ × AvgWaitingTime) − (w₃ × AvgQueueLength) − (w₄ × GridlockPenalty)
```
*Higher fitness indicates a better timing plan.* The weights ($w_n$) are configurable to prioritize different goals (e.g., avoiding gridlock is heavily weighted).

### 4. Selection
Parents for the next generation are chosen using **Tournament Selection**. A random subset of chromosomes is selected, and the one with the highest fitness is chosen to reproduce. This ensures that better solutions have a higher probability of passing on their genes while maintaining some genetic diversity.

### 5. Crossover
Pairs of parents exchange genetic material to create offspring. This project uses **Single-Point Crossover** (with a fallback to uniform crossover). A random split point is chosen in the chromosome array; genes before the point come from Parent A, and genes after come from Parent B.

### 6. Mutation
To prevent premature convergence on local optima, **Random Reset Mutation** is applied. With a small probability (mutation rate), a gene is randomly altered to a new value within the valid bounds. This introduces new traits into the population.

### 7. Elitism
The absolute best-performing individuals (e.g., the top 2) are copied directly to the next generation without modification. This guarantees that the algorithm's best solution never degrades over time.

### 8. Evolution
Steps 3-7 are repeated for a specified number of generations. Over time, the population evolves, and the average and maximum fitness scores increase, yielding an optimized traffic signal timing plan.

---

## System Architecture

The project is built using a modern, decoupled client-server architecture.

### Backend (Python + FastAPI)
The backend is responsible for the heavy computational lifting. It is modularly structured:
- **`ga/` module:** Contains the Genetic Algorithm operators (`chromosome.py`, `fitness.py`, `selection.py`, `crossover.py`, `mutation.py`, `elitism.py`, `optimizer.py`).
- **`simulation/` module:** A custom discrete-time traffic engine (`traffic_grid.py`, `vehicle.py`, `simulator.py`). It models grid topology, spawns vehicles, handles vehicle movement and queue logic, and tracks metrics.
- **`baselines/` module:** Provides "Fixed Timing" and "Random Timing" algorithms for comparative benchmarking.
- **`api/` module:** Exposes RESTful endpoints using FastAPI to allow the frontend to trigger simulations, run the optimizer, and fetch comparisons.

### Frontend (React + Vite + Chart.js)
The frontend provides a sleek, interactive user interface built with React. It features a "dark mode glassmorphism" design aesthetic.
- **Simulator View:** An HTML5 Canvas-based visualizer that renders the $N \times N$ grid, animates vehicle movements, and displays real-time signal phases and queue lengths based on simulation snapshots.
- **Optimizer Dashboard:** Allows users to configure GA hyperparameters (population size, mutation rate, generations) and view live charts (via Chart.js) of the fitness progression across generations.
- **Comparison Engine:** Side-by-side performance analysis of Fixed, Random, and GA-Optimized timings, complete with automatically generated natural language verdicts.
- **Methodology & Documentation:** Academic-grade documentation integrated directly into the UI.

---

## Key Features & Accomplishments

- **Realistic Modeling:** The custom traffic simulator accurately models vehicle spawning, directional movement, queueing theory, and intersection signal phasing.
- **Configurable Architecture:** The GA operators (selection, crossover, mutation) and fitness weights are modular and easily interchangeable.
- **Dynamic Visualization:** The React application provides high-quality visualizations of both the evolutionary metrics and the physical traffic flow.
- **Submission-Ready:** The project is fully documented, structured according to software engineering best practices, and includes a comprehensive methodology report suitable for university-level evaluation.

---

## Project Team
- **Muhammad Fasih** (22F-BSCS-19)
- **Syed Masood Hussain** (22F-BSCS-26)
- **Syed Tehmeed Jafar** (22F-BSCS-11)
- **Zohair Raza** (22F-BSCS-29)
- **Nikhil Kumar** (22F-BSCS-31)

This project demonstrates the power of Evolutionary Computing applied to complex, real-world, non-linear optimization problems, proving that intelligent algorithms can significantly outperform static, rule-based systems in urban traffic management.
