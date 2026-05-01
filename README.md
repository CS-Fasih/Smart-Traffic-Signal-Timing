# 🧬 Evolutionary Optimization of Urban Traffic Signal Timing

## Using a Genetic Algorithm

> **Course:** Evolutionary Computing  
> **University:** Dawood University of Engineering & Technology  
> **Semester:** Fall 2022

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Methodology](#-methodology)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)
- [Genetic Algorithm](#-genetic-algorithm)
- [Fitness Function](#-fitness-function)
- [Comparison](#-comparison)
- [Team Members](#-team-members)

---

## 🎯 Problem Statement

Urban traffic congestion is a critical problem in modern cities. Traditional traffic signal timing systems use fixed-cycle approaches that cannot adapt to varying traffic conditions. This project addresses the problem of optimizing traffic signal green-light durations across an N×N grid of intersections using **Evolutionary Computing** techniques.

**Objective:** Find signal timing plans that:
- ✅ Maximize vehicle throughput
- ✅ Minimize average waiting time
- ✅ Reduce queue lengths
- ✅ Prevent gridlock conditions

---

## 🧬 Methodology

We employ a **Genetic Algorithm (GA)** to evolve optimal traffic signal timing plans:

1. **Initialize** a random population of timing plans (chromosomes)
2. **Evaluate** each plan using a discrete-event traffic simulation
3. **Select** parents via tournament selection
4. **Crossover** parents using single-point crossover
5. **Mutate** offspring genes for diversity
6. **Preserve** the best individuals through elitism
7. **Repeat** for N generations

The GA is compared against two baselines:
- **Fixed Timing:** All signals use equal green durations
- **Random Timing:** Each signal uses random green durations
- **GA Optimized:** The best plan evolved by the Genetic Algorithm

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Algorithm | Python (NumPy) |
| Backend API | FastAPI + Uvicorn |
| Frontend | React 18 + Vite |
| Charts | Chart.js + react-chartjs-2 |
| Styling | Vanilla CSS (Glassmorphism + Dark Theme) |
| Visualization | HTML5 Canvas |
| Routing | React Router v6 |

---

## 📁 Project Structure

```
Smart-Traffic-Signal-Timing/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── requirements.txt           # Python dependencies
│   ├── __init__.py
│   ├── ga/                        # Genetic Algorithm
│   │   ├── chromosome.py          # Chromosome representation
│   │   ├── fitness.py             # Fitness function
│   │   ├── selection.py           # Tournament selection
│   │   ├── crossover.py           # Crossover operators
│   │   ├── mutation.py            # Mutation operators
│   │   ├── elitism.py             # Elitism preservation
│   │   └── optimizer.py           # Main GA loop
│   ├── simulation/                # Traffic simulation
│   │   ├── traffic_grid.py        # N×N intersection grid
│   │   ├── vehicle.py             # Vehicle agent
│   │   └── simulator.py           # Simulation engine
│   ├── baselines/                 # Baseline strategies
│   │   ├── fixed_timing.py        # Fixed equal-duration
│   │   └── random_timing.py       # Random-duration
│   ├── api/                       # REST API
│   │   ├── routes.py              # API endpoints
│   │   └── schemas.py             # Pydantic models
│   └── utils/
│       └── export.py              # Export & verdict generation
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx               # React entry
│       ├── App.jsx                # Router + layout
│       ├── index.css              # Design system
│       ├── api/
│       │   └── client.js          # API client
│       ├── components/            # Reusable components
│       │   ├── Navbar.jsx         # Navigation bar
│       │   ├── Footer.jsx         # Footer
│       │   ├── TrafficGrid.jsx    # Canvas traffic grid
│       │   ├── MetricsCard.jsx    # Metric display card
│       │   ├── ChartComponent.jsx # Chart wrapper
│       │   ├── ComparisonTable.jsx# Comparison table
│       │   └── TeamCard.jsx       # Team member card
│       └── pages/                 # Application pages
│           ├── Home.jsx           # Landing page
│           ├── Simulator.jsx      # Traffic simulator
│           ├── Optimizer.jsx      # GA optimizer
│           ├── Dashboard.jsx      # Results dashboard
│           ├── Comparison.jsx     # Baseline comparison
│           ├── Methodology.jsx    # Research report
│           └── Team.jsx           # Team members
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### Backend

```bash
cd backend
pip install -r requirements.txt
cd ..
python -m backend.main
```

The API will start at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will start at `http://localhost:5173`

### Both Together

Open two terminals:
```bash
# Terminal 1 — Backend
python -m backend.main

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## 🧬 Genetic Algorithm

### Chromosome Representation
Each chromosome is a real-valued array of length `2 × N × N`, encoding green durations for both phases (NS and EW) at every intersection.

```
Gene structure: [NS₍₀,₀₎, EW₍₀,₀₎, NS₍₀,₁₎, EW₍₀,₁₎, ..., NS₍ₙ,ₙ₎, EW₍ₙ,ₙ₎]
Gene bounds: 10 ≤ value ≤ 60 seconds
```

### GA Operators

| Operator | Implementation |
|----------|---------------|
| Selection | Tournament selection (k=3) |
| Crossover | Single-point crossover (rate=0.8) |
| Mutation | Random reset mutation (rate=0.1) |
| Elitism | Top-2 preservation |
| Population | 30 individuals |
| Generations | 50 |

---

## 📐 Fitness Function

```
Fitness = w₁ × Throughput − w₂ × AvgWaitingTime − w₃ × AvgQueueLength − w₄ × GridlockPenalty
```

| Weight | Value | Objective |
|--------|-------|-----------|
| w₁ (Throughput) | 2.0 | Maximize |
| w₂ (Waiting Time) | 1.0 | Minimize |
| w₃ (Queue Length) | 0.5 | Minimize |
| w₄ (Gridlock) | 3.0 | Minimize |

Higher fitness = Better timing plan

---

## ⚖️ Comparison

The project compares three strategies under identical simulation conditions:

1. **Fixed Timing** — All signals use 30s green per phase
2. **Random Timing** — Random durations ∈ [10, 60]s
3. **GA Optimized** — Best evolved timing plan

Metrics compared:
- Throughput (vehicles completed)
- Average waiting time
- Average queue length
- Gridlock penalty
- Completion rate

A dynamic verdict is generated based on actual results.

---

## 👥 Team Members

| Name | Roll Number |
|------|-------------|
| Muhammad Fasih | 22F-BSCS-19 |
| Syed Masood Hussain | 22F-BSCS-26 |
| Syed Tehmeed Jafar | 22F-BSCS-11 |
| Zohair Raza | 22F-BSCS-29 |
| Nikhil Kumar | 22F-BSCS-31 |

---

## 📄 License

This project is developed for academic purposes as part of the Evolutionary Computing course at Dawood University of Engineering & Technology.

---

<p align="center">
  Built with 🧬 Python + React + Genetic Algorithms
</p>
