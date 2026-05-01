import './MetricsCard.css';

export default function MetricsCard({ icon, label, value, unit, trend, color }) {
  const trendColor = trend === 'up' ? 'var(--accent-green)' : trend === 'down' ? 'var(--accent-red)' : 'var(--text-muted)';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';

  return (
    <div className="metrics-card glass-card" style={{ '--card-accent': color || 'var(--accent-cyan)' }}>
      <div className="metrics-icon">{icon}</div>
      <div className="metrics-info">
        <span className="metrics-label">{label}</span>
        <span className="metrics-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="metrics-unit">{unit}</span>}
        </span>
      </div>
      {trend && (
        <span className="metrics-trend" style={{ color: trendColor }}>
          {trendIcon}
        </span>
      )}
    </div>
  );
}
