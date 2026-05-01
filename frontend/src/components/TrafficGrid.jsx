import { useRef, useEffect, useCallback } from 'react';
import './TrafficGrid.css';

/**
 * Canvas-based animated traffic grid visualization.
 * Renders intersections, roads, traffic signals, moving vehicles, and queues.
 */
export default function TrafficGrid({
  gridSize = 4,
  snapshots = [],
  currentStep = 0,
  isRunning = false,
  timingPlan = null,
  width = 600,
  height = 600,
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stepRef = useRef(currentStep);

  stepRef.current = currentStep;

  const draw = useCallback((ctx) => {
    const W = width;
    const H = height;
    const padding = 60;
    const gridW = W - padding * 2;
    const gridH = H - padding * 2;
    const cellW = gridW / gridSize;
    const cellH = gridH / gridSize;

    // Clear
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);

    // Draw roads (gray strips)
    ctx.strokeStyle = 'rgba(100, 120, 200, 0.15)';
    ctx.lineWidth = cellW * 0.5;
    for (let i = 0; i < gridSize; i++) {
      const x = padding + i * cellW + cellW / 2;
      ctx.beginPath();
      ctx.moveTo(x, padding * 0.5);
      ctx.lineTo(x, H - padding * 0.5);
      ctx.stroke();
    }
    for (let i = 0; i < gridSize; i++) {
      const y = padding + i * cellH + cellH / 2;
      ctx.beginPath();
      ctx.moveTo(padding * 0.5, y);
      ctx.lineTo(W - padding * 0.5, y);
      ctx.stroke();
    }

    // Draw road markings (dashed center lines)
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < gridSize; i++) {
      const x = padding + i * cellW + cellW / 2;
      ctx.beginPath();
      ctx.moveTo(x, padding * 0.5);
      ctx.lineTo(x, H - padding * 0.5);
      ctx.stroke();
    }
    for (let i = 0; i < gridSize; i++) {
      const y = padding + i * cellH + cellH / 2;
      ctx.beginPath();
      ctx.moveTo(padding * 0.5, y);
      ctx.lineTo(W - padding * 0.5, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Get current snapshot
    const snap = snapshots[Math.min(stepRef.current, snapshots.length - 1)];
    const intersections = snap?.intersections || [];

    // Draw intersections
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cx = padding + col * cellW + cellW / 2;
        const cy = padding + row * cellH + cellH / 2;
        const size = Math.min(cellW, cellH) * 0.35;

        // Find intersection data
        const iData = intersections.find(
          (i) => i.position[0] === row && i.position[1] === col
        );

        // Intersection box
        ctx.fillStyle = 'rgba(20, 26, 51, 0.9)';
        ctx.strokeStyle = 'rgba(100, 120, 200, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx - size, cy - size, size * 2, size * 2, 4);
        ctx.fill();
        ctx.stroke();

        // Traffic signals
        const isNSGreen = iData?.current_phase === 'NS_GREEN';
        const signalSize = size * 0.25;

        // NS signal (top/bottom)
        ctx.fillStyle = isNSGreen ? '#00ff88' : '#ff4757';
        ctx.shadowColor = isNSGreen ? '#00ff88' : '#ff4757';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx, cy - size * 0.5, signalSize, 0, Math.PI * 2);
        ctx.fill();

        // EW signal (left/right)
        ctx.fillStyle = !isNSGreen ? '#00ff88' : '#ff4757';
        ctx.shadowColor = !isNSGreen ? '#00ff88' : '#ff4757';
        ctx.beginPath();
        ctx.arc(cx + size * 0.5, cy, signalSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Queue indicators
        if (iData) {
          const nsQ = iData.ns_queue_length || 0;
          const ewQ = iData.ew_queue_length || 0;

          if (nsQ > 0) {
            ctx.fillStyle = nsQ > 8 ? '#ff4757' : '#ffa726';
            ctx.font = `bold ${Math.max(10, size * 0.3)}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(nsQ, cx, cy - size - 8);
          }
          if (ewQ > 0) {
            ctx.fillStyle = ewQ > 8 ? '#ff4757' : '#ffa726';
            ctx.font = `bold ${Math.max(10, size * 0.3)}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(ewQ, cx + size + 14, cy + 4);
          }
        }

        // Timing labels from plan
        if (timingPlan) {
          const plan = timingPlan.find(
            (p) => p.intersection[0] === row && p.intersection[1] === col
          );
          if (plan) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = `${Math.max(8, size * 0.22)}px JetBrains Mono`;
            ctx.textAlign = 'center';
            ctx.fillText(
              `${Math.round(plan.ns_green)}/${Math.round(plan.ew_green)}`,
              cx,
              cy + 4
            );
          }
        }

        // Intersection label
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = `${Math.max(8, size * 0.2)}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(`(${row},${col})`, cx, cy + size + 14);
      }
    }

    // Draw vehicles from snapshot
    if (snap?.vehicles) {
      snap.vehicles.forEach((v) => {
        const vx = padding + v.col * cellW + cellW / 2;
        const vy = padding + v.row * cellH + cellH / 2;
        const vSize = Math.min(cellW, cellH) * 0.08;

        // Offset based on direction so they don't overlap
        let ox = 0, oy = 0;
        if (v.direction === 'NORTH') oy = -cellH * 0.2;
        if (v.direction === 'SOUTH') oy = cellH * 0.2;
        if (v.direction === 'EAST') ox = cellW * 0.2;
        if (v.direction === 'WEST') ox = -cellW * 0.2;

        ctx.fillStyle = v.queued ? '#ff4757' : '#00d4ff';
        ctx.shadowColor = v.queued ? '#ff4757' : '#00d4ff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.roundRect(vx + ox - vSize, vy + oy - vSize * 0.6, vSize * 2, vSize * 1.2, 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // Grid label
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`${gridSize}×${gridSize} Traffic Grid`, 10, 18);

    if (snap) {
      ctx.textAlign = 'right';
      ctx.fillText(
        `Step: ${snap.step} | Vehicles: ${snap.vehicle_count} | Completed: ${snap.completed_count}`,
        W - 10,
        18
      );
    }
  }, [gridSize, snapshots, timingPlan, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    draw(ctx);
  }, [draw, width, height, currentStep, snapshots]);

  return (
    <div className="traffic-grid-wrapper">
      <canvas
        ref={canvasRef}
        className="traffic-grid-canvas"
        width={width}
        height={height}
      />
      <div className="grid-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#00ff88' }} /> Green
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#ff4757' }} /> Red
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#00d4ff' }} /> Vehicle
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#ffa726' }} /> Queue
        </span>
      </div>
    </div>
  );
}
