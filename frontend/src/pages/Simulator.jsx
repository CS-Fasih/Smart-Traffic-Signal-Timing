import { useState, useEffect, useRef } from 'react';
import TrafficGrid from '../components/TrafficGrid';
import MetricsCard from '../components/MetricsCard';
import { runSimulation, runRandomSimulation } from '../api/client';
import './Simulator.css';

export default function Simulator() {
  const [config, setConfig] = useState({
    grid_size: 4,
    sim_steps: 300,
    spawn_rate: 0.25,
    green_duration: 30,
    with_snapshots: true,
    snapshot_interval: 5,
  });
  const [mode, setMode] = useState('fixed');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setCurrentStep(0);
    setIsPlaying(false);
    try {
      const fn = mode === 'random' ? runRandomSimulation : runSimulation;
      const data = await fn(config);
      setResults(data);
      if (data.snapshots?.length > 0) {
        setIsPlaying(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying && results?.snapshots) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= results.snapshots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, results]);

  return (
    <div className="simulator-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>🚦 Traffic <span className="gradient-text">Simulator</span></h1>
          <p>Run real-time traffic simulations with different timing strategies and visualize the results.</p>
        </div>

        <div className="sim-layout">
          {/* Controls Panel */}
          <div className="sim-controls glass-card animate-fade-in">
            <h3>Configuration</h3>

            <div className="mode-toggle">
              <button className={`mode-btn ${mode === 'fixed' ? 'active' : ''}`} onClick={() => setMode('fixed')}>
                Fixed Timing
              </button>
              <button className={`mode-btn ${mode === 'random' ? 'active' : ''}`} onClick={() => setMode('random')}>
                Random Timing
              </button>
            </div>

            <div className="control-fields">
              <div className="input-group">
                <label>Grid Size (N×N)</label>
                <input type="range" min="2" max="6" value={config.grid_size}
                  onChange={(e) => setConfig({ ...config, grid_size: +e.target.value })} />
                <span className="range-value">{config.grid_size}×{config.grid_size}</span>
              </div>

              <div className="input-group">
                <label>Simulation Steps</label>
                <input type="range" min="100" max="1000" step="50" value={config.sim_steps}
                  onChange={(e) => setConfig({ ...config, sim_steps: +e.target.value })} />
                <span className="range-value">{config.sim_steps}</span>
              </div>

              <div className="input-group">
                <label>Spawn Rate</label>
                <input type="range" min="0.05" max="0.5" step="0.05" value={config.spawn_rate}
                  onChange={(e) => setConfig({ ...config, spawn_rate: +e.target.value })} />
                <span className="range-value">{config.spawn_rate}</span>
              </div>

              {mode === 'fixed' && (
                <div className="input-group">
                  <label>Green Duration (seconds)</label>
                  <input type="range" min="10" max="60" value={config.green_duration}
                    onChange={(e) => setConfig({ ...config, green_duration: +e.target.value })} />
                  <span className="range-value">{config.green_duration}s</span>
                </div>
              )}
            </div>

            <button className="btn btn-primary run-btn" onClick={handleRun} disabled={loading}>
              {loading ? '⏳ Simulating...' : '▶ Run Simulation'}
            </button>

            {error && <div className="error-msg">⚠️ {error}</div>}
          </div>

          {/* Visualization */}
          <div className="sim-visual animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TrafficGrid
              gridSize={config.grid_size}
              snapshots={results?.snapshots || []}
              currentStep={currentStep}
              isRunning={isPlaying}
              timingPlan={results?.timing_plan}
              width={560}
              height={560}
            />

            {results?.snapshots && (
              <div className="playback-controls">
                <button className="btn btn-secondary" onClick={() => { setCurrentStep(0); setIsPlaying(true); }}>
                  ⏮ Replay
                </button>
                <button className="btn btn-secondary" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <span className="step-counter">
                  Step {results.snapshots[currentStep]?.step || 0} / {results.snapshots[results.snapshots.length - 1]?.step || 0}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        {results && (
          <div className="sim-metrics animate-slide-up">
            <h3>Simulation Results — <span className="gradient-text">{results.strategy}</span></h3>
            <div className="grid-4">
              <MetricsCard icon="🚗" label="Throughput" value={results.throughput} unit="vehicles" color="var(--accent-green)" />
              <MetricsCard icon="⏱️" label="Avg Waiting Time" value={results.avg_waiting_time} unit="s" color="var(--accent-yellow)" />
              <MetricsCard icon="📊" label="Avg Queue Length" value={results.avg_queue_length} color="var(--accent-cyan)" />
              <MetricsCard icon="🚫" label="Gridlock Penalty" value={results.gridlock_penalty} color="var(--accent-red)" />
              <MetricsCard icon="📦" label="Total Spawned" value={results.total_spawned} color="var(--accent-blue)" />
              <MetricsCard icon="✅" label="Completion Rate" value={results.completion_rate} unit="%" color="var(--accent-green)" />
              <MetricsCard icon="📈" label="Max Queue" value={results.max_queue_length} color="var(--accent-orange)" />
              <MetricsCard icon="🔄" label="Remaining" value={results.vehicles_remaining} color="var(--accent-purple)" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
