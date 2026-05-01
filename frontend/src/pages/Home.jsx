import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🧬',
    title: 'Genetic Algorithm',
    desc: 'Evolutionary optimization using selection, crossover, mutation, and elitism to find optimal signal timing plans.',
  },
  {
    icon: '🚦',
    title: 'Traffic Simulation',
    desc: 'Discrete-event simulation on an N×N intersection grid with realistic vehicle spawning and movement.',
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    desc: 'Generation-by-generation metrics: fitness, throughput, waiting time, queue length, gridlock penalty.',
  },
  {
    icon: '⚖️',
    title: 'Baseline Comparison',
    desc: 'Compare Fixed Timing, Random Timing, and GA Optimized timing with visual charts and dynamic verdicts.',
  },
  {
    icon: '🗺️',
    title: 'Visual Grid Simulator',
    desc: 'Animated Canvas-based traffic grid showing intersections, signals, vehicles, and congestion in real time.',
  },
  {
    icon: '📝',
    title: 'Research Methodology',
    desc: 'Complete report section covering problem statement, chromosome design, fitness function, and results.',
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="bg-grid-pattern" />
      <div className="bg-radial-glow" />
      <div className="bg-radial-glow-2" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge badge badge-info">Evolutionary Computing Project</div>
            <h1 className="hero-title">
              Evolutionary Optimization of
              <span className="gradient-text"> Urban Traffic Signal Timing</span>
            </h1>
            <p className="hero-subtitle">
              Using Genetic Algorithms to evolve optimal green-light durations for N×N
              intersection grids — reducing waiting time, improving throughput, and eliminating
              gridlock through evolutionary computing.
            </p>
            <div className="hero-actions">
              <Link to="/simulator" className="btn btn-primary">
                🚦 Launch Simulator
              </Link>
              <Link to="/optimizer" className="btn btn-secondary">
                🧬 Run Optimizer
              </Link>
              <Link to="/comparison" className="btn btn-secondary">
                ⚖️ View Comparison
              </Link>
            </div>
          </div>

          <div className="hero-stats animate-slide-up">
            <div className="stat-item">
              <span className="stat-value">N×N</span>
              <span className="stat-label">Grid Size</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">GA</span>
              <span className="stat-label">Optimization</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Strategies</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">Real</span>
              <span className="stat-label">Simulation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="page-header">
            <h2>
              Project <span className="gradient-text">Features</span>
            </h2>
            <p>A complete Evolutionary Computing research simulator, not a basic assignment.</p>
          </div>
          <div className="features-grid grid-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card glass-card animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="page-header">
            <h2>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p>The Genetic Algorithm evolves traffic signal timing through natural selection.</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Initialize Population', desc: 'Generate random chromosomes, each encoding green durations for all intersection phases.' },
              { step: '02', title: 'Evaluate Fitness', desc: 'Run traffic simulation with each timing plan and compute weighted fitness score.' },
              { step: '03', title: 'Selection & Crossover', desc: 'Select fittest parents via tournament selection and combine their genes.' },
              { step: '04', title: 'Mutation & Elitism', desc: 'Apply random mutations for diversity and preserve top individuals across generations.' },
              { step: '05', title: 'Repeat & Evolve', desc: 'Iterate for N generations, evolving progressively better timing plans.' },
              { step: '06', title: 'Compare & Report', desc: 'Compare GA-optimized timing against fixed and random baselines with full metrics.' },
            ].map((s, i) => (
              <div key={i} className="step-card glass-card animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="step-number">{s.step}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card neon-border">
            <h2>Ready to <span className="gradient-text">Optimize</span>?</h2>
            <p>Run the Genetic Algorithm optimizer and see evolution in action.</p>
            <div className="hero-actions">
              <Link to="/optimizer" className="btn btn-primary">🧬 Start GA Optimizer</Link>
              <Link to="/methodology" className="btn btn-secondary">📝 Read Methodology</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
