import './ComparisonTable.css';

export default function ComparisonTable({ fixed, random, gaOptimized }) {
  if (!fixed || !random || !gaOptimized) return null;

  const metrics = [
    { key: 'throughput', label: 'Throughput (vehicles)', icon: '🚗', better: 'higher' },
    { key: 'avg_waiting_time', label: 'Avg Waiting Time (s)', icon: '⏱️', better: 'lower' },
    { key: 'avg_queue_length', label: 'Avg Queue Length', icon: '📊', better: 'lower' },
    { key: 'gridlock_penalty', label: 'Gridlock Penalty', icon: '🚫', better: 'lower' },
    { key: 'completion_rate', label: 'Completion Rate (%)', icon: '✅', better: 'higher' },
  ];

  const getBestClass = (metric, values) => {
    const isHigherBetter = metric.better === 'higher';
    const best = isHigherBetter ? Math.max(...values) : Math.min(...values);
    return values.map((v) => v === best ? 'best-value' : '');
  };

  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th className="metric-col">Metric</th>
            <th className="strategy-col fixed-col">
              <span className="strategy-dot" style={{ background: '#ffa726' }} />
              Fixed Timing
            </th>
            <th className="strategy-col random-col">
              <span className="strategy-dot" style={{ background: '#ff4757' }} />
              Random Timing
            </th>
            <th className="strategy-col ga-col">
              <span className="strategy-dot" style={{ background: '#00ff88' }} />
              GA Optimized
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const vals = [
              fixed[metric.key] ?? 0,
              random[metric.key] ?? 0,
              gaOptimized[metric.key] ?? 0,
            ];
            const classes = getBestClass(metric, vals);

            return (
              <tr key={metric.key}>
                <td className="metric-name">
                  <span className="metric-icon">{metric.icon}</span>
                  {metric.label}
                </td>
                <td className={classes[0]}>
                  {typeof vals[0] === 'number' ? vals[0].toLocaleString(undefined, { maximumFractionDigits: 2 }) : vals[0]}
                </td>
                <td className={classes[1]}>
                  {typeof vals[1] === 'number' ? vals[1].toLocaleString(undefined, { maximumFractionDigits: 2 }) : vals[1]}
                </td>
                <td className={classes[2]}>
                  {typeof vals[2] === 'number' ? vals[2].toLocaleString(undefined, { maximumFractionDigits: 2 }) : vals[2]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
