import { useState } from 'react';
import MetricsCard from '../components/MetricsCard';
import ChartComponent from '../components/ChartComponent';
import TrafficGrid from '../components/TrafficGrid';
import { runOptimization } from '../api/client';
import './Optimizer.css';

export default function Optimizer() {
  const [config, setConfig] = useState({
    grid_size: 4,
    population_size: 30,
    generations: 50,
    crossover_rate: 0.8,
    mutation_rate: 0.1,
    elite_count: 2,
    tournament_size: 3,
    sim_steps: 500,
    spawn_rate: 0.3,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await runOptimization(config);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const history = results?.history || [];
  const best = results?.best_chromosome;

  const fitnessData = {
    labels: history.map((h) => `Gen ${h.generation}`),
    datasets: [
      {
        label: 'Best Fitness',
        data: history.map((h) => h.best_fitness),
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Avg Fitness',
        data: history.map((h) => h.avg_fitness),
        borderColor: '#7b2ff7',
        backgroundColor: 'rgba(123, 47, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const metricsData = {
    labels: history.map((h) => `Gen ${h.generation}`),
    datasets: [
      {
        label: 'Throughput',
        data: history.map((h) => h.best_metrics?.throughput || 0),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const waitingData = {
    labels: history.map((h) => `Gen ${h.generation}`),
    datasets: [
      {
        label: 'Avg Waiting Time',
        data: history.map((h) => h.best_metrics?.avg_waiting_time || 0),
        borderColor: '#ffa726',
        backgroundColor: 'rgba(255, 167, 38, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const gridlockData = {
    labels: history.map((h) => `Gen ${h.generation}`),
    datasets: [
      {
        label: 'Gridlock Penalty',
        data: history.map((h) => h.best_metrics?.gridlock_penalty || 0),
        borderColor: '#ff4757',
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="optimizer-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>🧬 GA <span className="gradient-text">Optimizer</span></h1>
          <p>Configure and run the Genetic Algorithm to evolve optimal traffic signal timing plans.</p>
        </div>

        <div className="opt-layout">
          {/* Config Panel */}
          <div className="opt-config glass-card animate-fade-in">
            <h3>GA Parameters</h3>
            <div className="config-grid">
              {[
                { key: 'grid_size', label: 'Grid Size (N×N)', min: 2, max: 6, step: 1 },
                { key: 'population_size', label: 'Population Size', min: 10, max: 100, step: 5 },
                { key: 'generations', label: 'Generations', min: 5, max: 200, step: 5 },
                { key: 'crossover_rate', label: 'Crossover Rate', min: 0.1, max: 1.0, step: 0.05 },
                { key: 'mutation_rate', label: 'Mutation Rate', min: 0.01, max: 0.5, step: 0.01 },
                { key: 'elite_count', label: 'Elite Count', min: 1, max: 10, step: 1 },
                { key: 'tournament_size', label: 'Tournament Size', min: 2, max: 10, step: 1 },
                { key: 'sim_steps', label: 'Sim Steps', min: 100, max: 1000, step: 50 },
                { key: 'spawn_rate', label: 'Spawn Rate', min: 0.05, max: 0.5, step: 0.05 },
              ].map((param) => (
                <div key={param.key} className="input-group">
                  <label>{param.label}</label>
                  <div className="range-row">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={config[param.key]}
                      onChange={(e) => setConfig({ ...config, [param.key]: +e.target.value })}
                    />
                    <span className="range-value">{config[param.key]}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary run-btn" onClick={handleOptimize} disabled={loading}>
              {loading ? '⏳ Evolving... (this may take a moment)' : '🧬 Run Optimization'}
            </button>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {results && (
              <div className="opt-summary">
                <p className="summary-time">✅ Completed in <strong>{results.total_time}s</strong></p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="opt-results">
            {loading && (
              <div className="opt-loading glass-card">
                <div className="spinner" />
                <p className="loading-text">Running Genetic Algorithm Optimization...</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Population: {config.population_size} × Generations: {config.generations}
                </p>
              </div>
            )}

            {best && (
              <>
                <div className="grid-4 animate-fade-in">
                  <MetricsCard icon="🏆" label="Best Fitness" value={best.fitness?.toFixed(2)} color="var(--accent-cyan)" />
                  <MetricsCard icon="🚗" label="Throughput" value={best.metrics?.throughput} color="var(--accent-green)" />
                  <MetricsCard icon="⏱️" label="Avg Wait" value={best.metrics?.avg_waiting_time} unit="s" color="var(--accent-yellow)" />
                  <MetricsCard icon="🚫" label="Gridlock" value={best.metrics?.gridlock_penalty} color="var(--accent-red)" />
                </div>

                <div className="charts-grid animate-slide-up">
                  <ChartComponent data={fitnessData} title="Fitness Over Generations" />
                  <ChartComponent data={metricsData} title="Throughput Over Generations" />
                  <ChartComponent data={waitingData} title="Waiting Time Over Generations" />
                  <ChartComponent data={gridlockData} title="Gridlock Penalty Over Generations" />
                </div>

                <div className="best-plan glass-card animate-fade-in">
                  <h3>Best Timing Plan</h3>
                  <p>The optimal green-light durations (NS/EW seconds) for each intersection:</p>
                  <TrafficGrid
                    gridSize={config.grid_size}
                    timingPlan={best.timing_plan}
                    width={480}
                    height={480}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
