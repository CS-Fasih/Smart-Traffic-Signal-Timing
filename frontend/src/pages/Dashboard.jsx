import { useState } from 'react';
import MetricsCard from '../components/MetricsCard';
import ChartComponent from '../components/ChartComponent';
import { runOptimization } from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runOptimization({
        grid_size: 4,
        population_size: 25,
        generations: 40,
        crossover_rate: 0.8,
        mutation_rate: 0.1,
        elite_count: 2,
        tournament_size: 3,
        sim_steps: 400,
        spawn_rate: 0.25,
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const history = results?.history || [];
  const best = results?.best_chromosome;

  return (
    <div className="dashboard-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>📊 Results <span className="gradient-text">Dashboard</span></h1>
          <p>Comprehensive view of GA optimization results with metrics, charts, and timing plans.</p>
        </div>

        {!results && (
          <div className="dashboard-empty glass-card animate-fade-in">
            <span className="empty-icon">📊</span>
            <h3>No Results Yet</h3>
            <p>Run a quick GA optimization to populate the dashboard with real metrics.</p>
            <button className="btn btn-primary" onClick={handleQuickRun} disabled={loading}>
              {loading ? '⏳ Running...' : '🧬 Quick Optimization (4×4 Grid, 40 Generations)'}
            </button>
            {error && <div className="error-msg">⚠️ {error}</div>}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">Running GA Optimization for Dashboard...</p>
          </div>
        )}

        {best && (
          <>
            {/* Key Metrics */}
            <section className="dash-section animate-fade-in">
              <h2>Key Metrics</h2>
              <div className="grid-4">
                <MetricsCard icon="🏆" label="Best Fitness" value={best.fitness?.toFixed(2)} color="var(--accent-cyan)" />
                <MetricsCard icon="🚗" label="Throughput" value={best.metrics?.throughput} unit="vehicles" color="var(--accent-green)" />
                <MetricsCard icon="⏱️" label="Avg Waiting Time" value={best.metrics?.avg_waiting_time} unit="s" color="var(--accent-yellow)" />
                <MetricsCard icon="📊" label="Avg Queue Length" value={best.metrics?.avg_queue_length} color="var(--accent-blue)" />
                <MetricsCard icon="🚫" label="Gridlock Penalty" value={best.metrics?.gridlock_penalty} color="var(--accent-red)" />
                <MetricsCard icon="🧬" label="Generations" value={results.config?.generations} color="var(--accent-purple)" />
                <MetricsCard icon="👥" label="Population" value={results.config?.population_size} color="var(--accent-orange)" />
                <MetricsCard icon="⏰" label="Total Time" value={results.total_time} unit="s" color="var(--accent-cyan)" />
              </div>
            </section>

            {/* Charts */}
            <section className="dash-section animate-slide-up">
              <h2>Evolution Progress</h2>
              <div className="charts-grid">
                <ChartComponent
                  title="Fitness Over Generations"
                  data={{
                    labels: history.map((h) => h.generation),
                    datasets: [
                      { label: 'Best', data: history.map((h) => h.best_fitness), borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.1)', fill: true, tension: 0.4 },
                      { label: 'Average', data: history.map((h) => h.avg_fitness), borderColor: '#7b2ff7', backgroundColor: 'rgba(123,47,247,0.1)', fill: true, tension: 0.4 },
                    ],
                  }}
                />
                <ChartComponent
                  title="Throughput Over Generations"
                  data={{
                    labels: history.map((h) => h.generation),
                    datasets: [
                      { label: 'Throughput', data: history.map((h) => h.best_metrics?.throughput || 0), borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.1)', fill: true, tension: 0.4 },
                    ],
                  }}
                />
                <ChartComponent
                  title="Waiting Time Over Generations"
                  data={{
                    labels: history.map((h) => h.generation),
                    datasets: [
                      { label: 'Avg Waiting Time', data: history.map((h) => h.best_metrics?.avg_waiting_time || 0), borderColor: '#ffa726', backgroundColor: 'rgba(255,167,38,0.1)', fill: true, tension: 0.4 },
                    ],
                  }}
                />
                <ChartComponent
                  title="Gridlock Penalty Over Generations"
                  data={{
                    labels: history.map((h) => h.generation),
                    datasets: [
                      { label: 'Gridlock Penalty', data: history.map((h) => h.best_metrics?.gridlock_penalty || 0), borderColor: '#ff4757', backgroundColor: 'rgba(255,71,87,0.1)', fill: true, tension: 0.4 },
                    ],
                  }}
                />
              </div>
            </section>

            {/* Best Chromosome */}
            <section className="dash-section animate-fade-in">
              <h2>Best Chromosome — Timing Plan</h2>
              <div className="chromosome-display glass-card">
                <div className="timing-grid">
                  {best.timing_plan?.map((plan, i) => (
                    <div key={i} className="timing-cell">
                      <span className="timing-pos">({plan.intersection[0]},{plan.intersection[1]})</span>
                      <span className="timing-ns">NS: {plan.ns_green}s</span>
                      <span className="timing-ew">EW: {plan.ew_green}s</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
