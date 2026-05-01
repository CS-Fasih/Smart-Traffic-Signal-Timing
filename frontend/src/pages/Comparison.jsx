import { useState } from 'react';
import ComparisonTable from '../components/ComparisonTable';
import ChartComponent from '../components/ChartComponent';
import MetricsCard from '../components/MetricsCard';
import { runComparison } from '../api/client';
import './Comparison.css';

export default function Comparison() {
  const [config, setConfig] = useState({
    grid_size: 4,
    sim_steps: 500,
    spawn_rate: 0.3,
    fixed_green_duration: 30,
    ga_population_size: 30,
    ga_generations: 50,
    ga_crossover_rate: 0.8,
    ga_mutation_rate: 0.1,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await runComparison(config);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const barData = results ? {
    labels: ['Throughput', 'Avg Wait Time', 'Avg Queue', 'Gridlock Penalty'],
    datasets: [
      {
        label: 'Fixed Timing',
        data: [
          results.fixed?.throughput || 0,
          results.fixed?.avg_waiting_time || 0,
          results.fixed?.avg_queue_length || 0,
          results.fixed?.gridlock_penalty || 0,
        ],
        backgroundColor: 'rgba(255, 167, 38, 0.7)',
        borderColor: '#ffa726',
        borderWidth: 1,
      },
      {
        label: 'Random Timing',
        data: [
          results.random?.throughput || 0,
          results.random?.avg_waiting_time || 0,
          results.random?.avg_queue_length || 0,
          results.random?.gridlock_penalty || 0,
        ],
        backgroundColor: 'rgba(255, 71, 87, 0.7)',
        borderColor: '#ff4757',
        borderWidth: 1,
      },
      {
        label: 'GA Optimized',
        data: [
          results.ga_optimized?.throughput || 0,
          results.ga_optimized?.avg_waiting_time || 0,
          results.ga_optimized?.avg_queue_length || 0,
          results.ga_optimized?.gridlock_penalty || 0,
        ],
        backgroundColor: 'rgba(0, 255, 136, 0.7)',
        borderColor: '#00ff88',
        borderWidth: 1,
      },
    ],
  } : null;

  const gaHistory = results?.ga_history || [];
  const fitnessEvolution = gaHistory.length > 0 ? {
    labels: gaHistory.map((h) => h.generation),
    datasets: [{
      label: 'GA Best Fitness',
      data: gaHistory.map((h) => h.best_fitness),
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  } : null;

  return (
    <div className="comparison-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>⚖️ Baseline <span className="gradient-text">Comparison</span></h1>
          <p>Compare Fixed Timing, Random Timing, and GA Optimized timing strategies side by side.</p>
        </div>

        {/* Config */}
        <div className="compare-config glass-card animate-fade-in">
          <h3>Comparison Parameters</h3>
          <div className="compare-params">
            <div className="input-group">
              <label>Grid Size</label>
              <input type="number" className="input-field" min="2" max="6" value={config.grid_size}
                onChange={(e) => setConfig({ ...config, grid_size: +e.target.value })} />
            </div>
            <div className="input-group">
              <label>Sim Steps</label>
              <input type="number" className="input-field" min="100" max="1000" step="50" value={config.sim_steps}
                onChange={(e) => setConfig({ ...config, sim_steps: +e.target.value })} />
            </div>
            <div className="input-group">
              <label>Spawn Rate</label>
              <input type="number" className="input-field" min="0.05" max="0.5" step="0.05" value={config.spawn_rate}
                onChange={(e) => setConfig({ ...config, spawn_rate: +e.target.value })} />
            </div>
            <div className="input-group">
              <label>GA Generations</label>
              <input type="number" className="input-field" min="5" max="200" step="5" value={config.ga_generations}
                onChange={(e) => setConfig({ ...config, ga_generations: +e.target.value })} />
            </div>
            <div className="input-group">
              <label>GA Population</label>
              <input type="number" className="input-field" min="10" max="100" step="5" value={config.ga_population_size}
                onChange={(e) => setConfig({ ...config, ga_population_size: +e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleCompare} disabled={loading} style={{ marginTop: 'var(--space-lg)' }}>
            {loading ? '⏳ Running Comparison (Fixed → Random → GA)...' : '⚖️ Run Full Comparison'}
          </button>
          {error && <div className="error-msg">⚠️ {error}</div>}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">Running all three strategies for comparison...</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>This includes a full GA optimization run</p>
          </div>
        )}

        {results && (
          <>
            {/* Strategy Summary */}
            <section className="compare-section animate-fade-in">
              <h2>Strategy Summary</h2>
              <div className="grid-3">
                <div className="strategy-card glass-card">
                  <div className="strategy-header" style={{ borderColor: '#ffa726' }}>
                    <span className="strategy-icon">⏱️</span>
                    <h3>Fixed Timing</h3>
                  </div>
                  <p className="strategy-desc">{results.fixed?.description}</p>
                  <div className="strategy-metrics">
                    <MetricsCard icon="🚗" label="Throughput" value={results.fixed?.throughput} color="#ffa726" />
                    <MetricsCard icon="⏱️" label="Avg Wait" value={results.fixed?.avg_waiting_time} unit="s" color="#ffa726" />
                  </div>
                </div>

                <div className="strategy-card glass-card">
                  <div className="strategy-header" style={{ borderColor: '#ff4757' }}>
                    <span className="strategy-icon">🎲</span>
                    <h3>Random Timing</h3>
                  </div>
                  <p className="strategy-desc">{results.random?.description}</p>
                  <div className="strategy-metrics">
                    <MetricsCard icon="🚗" label="Throughput" value={results.random?.throughput} color="#ff4757" />
                    <MetricsCard icon="⏱️" label="Avg Wait" value={results.random?.avg_waiting_time} unit="s" color="#ff4757" />
                  </div>
                </div>

                <div className="strategy-card glass-card neon-border">
                  <div className="strategy-header" style={{ borderColor: '#00ff88' }}>
                    <span className="strategy-icon">🧬</span>
                    <h3>GA Optimized</h3>
                  </div>
                  <p className="strategy-desc">{results.ga_optimized?.description}</p>
                  <div className="strategy-metrics">
                    <MetricsCard icon="🚗" label="Throughput" value={results.ga_optimized?.throughput} color="#00ff88" />
                    <MetricsCard icon="⏱️" label="Avg Wait" value={results.ga_optimized?.avg_waiting_time} unit="s" color="#00ff88" />
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="compare-section animate-slide-up">
              <h2>Detailed Comparison</h2>
              <ComparisonTable
                fixed={results.fixed}
                random={results.random}
                gaOptimized={results.ga_optimized}
              />
            </section>

            {/* Bar Chart */}
            <section className="compare-section animate-fade-in">
              <h2>Visual Comparison</h2>
              <div className="charts-grid">
                {barData && <ChartComponent type="bar" data={barData} title="Strategy Comparison" />}
                {fitnessEvolution && <ChartComponent data={fitnessEvolution} title="GA Fitness Evolution" />}
              </div>
            </section>

            {/* Verdict */}
            <section className="compare-section animate-slide-up">
              <div className="verdict-card glass-card neon-border">
                <h2>🏆 Final <span className="gradient-text">Verdict</span></h2>
                <p className="verdict-text">{results.verdict}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
