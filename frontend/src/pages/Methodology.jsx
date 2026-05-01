import './Methodology.css';

export default function Methodology() {
  return (
    <div className="methodology-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>📝 Research <span className="gradient-text">Methodology</span></h1>
          <p>Complete documentation of the evolutionary computing approach used in this project.</p>
        </div>

        <div className="report-content animate-fade-in">
          {/* Problem Statement */}
          <section className="report-section glass-card">
            <h2>1. Problem Statement</h2>
            <p>
              Urban traffic congestion is a critical problem in modern cities, leading to increased travel
              time, fuel consumption, air pollution, and economic losses. Traditional traffic signal timing
              systems use fixed-cycle approaches that cannot adapt to varying traffic conditions, resulting
              in suboptimal performance during peak hours and off-peak periods alike.
            </p>
            <p>
              This project addresses the problem of optimizing traffic signal green-light durations across
              an N×N grid of intersections using evolutionary computing techniques. The goal is to find
              signal timing plans that minimize vehicle waiting time, maximize throughput, reduce queue
              lengths, and prevent gridlock conditions.
            </p>
            <div className="highlight-box">
              <strong>Research Question:</strong> Can a Genetic Algorithm evolve traffic signal timing plans
              that significantly outperform traditional fixed-cycle and random timing approaches in terms
              of throughput, waiting time, and congestion management?
            </div>
          </section>

          {/* Proposed Methodology */}
          <section className="report-section glass-card">
            <h2>2. Proposed Methodology</h2>
            <p>
              We employ a Genetic Algorithm (GA) — a metaheuristic optimization technique inspired by
              natural selection — to evolve optimal traffic signal timing plans. The GA operates on a
              population of candidate solutions (chromosomes), iteratively improving them through
              selection, crossover, and mutation operators.
            </p>
            <div className="method-diagram">
              <div className="method-step">
                <span className="step-num">1</span>
                <span className="step-text">Initialize Random Population</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">2</span>
                <span className="step-text">Evaluate Fitness (Simulate)</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">3</span>
                <span className="step-text">Selection</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">4</span>
                <span className="step-text">Crossover</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">5</span>
                <span className="step-text">Mutation</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">6</span>
                <span className="step-text">Elitism + Repeat</span>
              </div>
            </div>
          </section>

          {/* Chromosome Representation */}
          <section className="report-section glass-card">
            <h2>3. Chromosome Representation</h2>
            <p>
              Each chromosome represents a complete traffic signal timing plan for the entire N×N grid.
              For each intersection, there are two signal phases:
            </p>
            <ul>
              <li><strong>NS Phase:</strong> Green duration for North-South traffic flow</li>
              <li><strong>EW Phase:</strong> Green duration for East-West traffic flow</li>
            </ul>
            <p>
              The chromosome is encoded as a real-valued array of length <code>2 × N × N</code>,
              where each gene represents a green-light duration bounded between 10 and 60 seconds.
            </p>
            <div className="code-block">
              <pre>{`# Chromosome structure for a 4×4 grid (32 genes)
chromosome = [
  NS₍₀,₀₎, EW₍₀,₀₎,  # Intersection (0,0)
  NS₍₀,₁₎, EW₍₀,₁₎,  # Intersection (0,1)
  ...
  NS₍₃,₃₎, EW₍₃,₃₎,  # Intersection (3,3)
]

# Gene bounds: 10 ≤ gene_value ≤ 60 (seconds)`}</pre>
            </div>
          </section>

          {/* Fitness Function */}
          <section className="report-section glass-card">
            <h2>4. Fitness Function</h2>
            <p>
              The fitness function evaluates each chromosome by running a discrete-time traffic simulation
              with the corresponding timing plan. The fitness score is computed as:
            </p>
            <div className="formula-box">
              <p className="formula">
                <strong>F</strong> = w₁ × Throughput − w₂ × AvgWaitingTime − w₃ × AvgQueueLength − w₄ × GridlockPenalty
              </p>
            </div>
            <p>Where the default weights are:</p>
            <table className="params-table">
              <thead>
                <tr><th>Weight</th><th>Value</th><th>Objective</th></tr>
              </thead>
              <tbody>
                <tr><td>w₁ (Throughput)</td><td>2.0</td><td>Maximize vehicles completing journey</td></tr>
                <tr><td>w₂ (Waiting Time)</td><td>1.0</td><td>Minimize average time spent waiting</td></tr>
                <tr><td>w₃ (Queue Length)</td><td>0.5</td><td>Minimize average queue buildup</td></tr>
                <tr><td>w₄ (Gridlock)</td><td>3.0</td><td>Heavily penalize gridlock situations</td></tr>
              </tbody>
            </table>
            <p>Higher fitness values indicate better timing plans.</p>
          </section>

          {/* GA Operators */}
          <section className="report-section glass-card">
            <h2>5. GA Operators</h2>
            
            <h3>5.1 Selection — Tournament Selection</h3>
            <p>
              We use tournament selection with tournament size k=3. In each tournament, k individuals
              are randomly sampled from the population, and the fittest individual is selected as a parent.
              This provides good selection pressure while maintaining diversity.
            </p>

            <h3>5.2 Crossover — Single-Point Crossover</h3>
            <p>
              Two parent chromosomes are combined using single-point crossover with a configurable
              crossover rate (default: 0.8). A random crossover point divides each parent's gene array,
              and offspring inherit one segment from each parent.
            </p>

            <h3>5.3 Mutation — Random Reset Mutation</h3>
            <p>
              Each gene has an independent probability (default: 0.1) of being replaced with a new random
              value within the valid range [10, 60]. This operator introduces diversity and prevents
              premature convergence to local optima.
            </p>

            <h3>5.4 Elitism</h3>
            <p>
              The top-K individuals (default: K=2) from each generation are preserved unchanged in the
              next generation. This ensures that the best solutions found so far are never lost.
            </p>
          </section>

          {/* Simulation Setup */}
          <section className="report-section glass-card">
            <h2>6. Simulation Setup</h2>
            <p>
              The traffic simulation models an N×N grid of intersections connected by bidirectional roads.
              Key simulation features include:
            </p>
            <ul>
              <li>Vehicles spawn at grid edges traveling inward (North, South, East, West)</li>
              <li>Each intersection has two-phase signals (NS and EW) cycling based on the timing plan</li>
              <li>Vehicles proceed through green signals and queue at red signals</li>
              <li>Gridlock is detected when queue length exceeds a threshold (15 vehicles)</li>
              <li>The simulation runs for a configurable number of time steps (default: 500)</li>
            </ul>
          </section>

          {/* Parameters */}
          <section className="report-section glass-card">
            <h2>7. Default Parameters</h2>
            <table className="params-table">
              <thead>
                <tr><th>Parameter</th><th>Default Value</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>Grid Size</td><td>4×4</td><td>Number of intersections</td></tr>
                <tr><td>Population Size</td><td>30</td><td>Number of chromosomes per generation</td></tr>
                <tr><td>Generations</td><td>50</td><td>Number of evolutionary iterations</td></tr>
                <tr><td>Crossover Rate</td><td>0.8</td><td>Probability of crossover</td></tr>
                <tr><td>Mutation Rate</td><td>0.1</td><td>Per-gene mutation probability</td></tr>
                <tr><td>Elite Count</td><td>2</td><td>Individuals preserved via elitism</td></tr>
                <tr><td>Tournament Size</td><td>3</td><td>Selection tournament size</td></tr>
                <tr><td>Simulation Steps</td><td>500</td><td>Time steps per simulation run</td></tr>
                <tr><td>Spawn Rate</td><td>0.3</td><td>Vehicle spawn probability per edge per step</td></tr>
                <tr><td>Green Duration Range</td><td>[10, 60]s</td><td>Valid range for green durations</td></tr>
              </tbody>
            </table>
          </section>

          {/* Results Summary */}
          <section className="report-section glass-card">
            <h2>8. Results Summary</h2>
            <p>
              The GA optimizer is compared against two baseline strategies:
            </p>
            <ul>
              <li><strong>Fixed Timing:</strong> All intersections use the same green duration (30s) for both phases</li>
              <li><strong>Random Timing:</strong> Each intersection uses randomly assigned green durations</li>
              <li><strong>GA Optimized:</strong> The best timing plan evolved by the Genetic Algorithm</li>
            </ul>
            <p>
              Results are evaluated across four metrics: throughput, average waiting time, average queue
              length, and gridlock penalty. The comparison page provides a real-time side-by-side evaluation
              with dynamically generated verdicts based on actual simulation results.
            </p>
          </section>

          {/* Conclusion */}
          <section className="report-section glass-card">
            <h2>9. Conclusion</h2>
            <p>
              This project demonstrates the application of Evolutionary Computing — specifically Genetic
              Algorithms — to the real-world problem of urban traffic signal timing optimization. By encoding
              signal timing plans as chromosomes and using traffic simulation as the fitness evaluation,
              the GA can explore a vast search space and converge on solutions that outperform traditional
              approaches.
            </p>
            <p>
              The modular architecture allows experimentation with different grid sizes, GA parameters,
              and traffic conditions. The interactive web interface enables researchers and traffic engineers
              to visualize the optimization process and compare strategies in real time.
            </p>
            <div className="highlight-box">
              <strong>Key Contribution:</strong> A complete, end-to-end evolutionary computing pipeline
              for traffic signal optimization — from chromosome encoding to fitness-driven evolution to
              real-time visualization and baseline comparison.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
