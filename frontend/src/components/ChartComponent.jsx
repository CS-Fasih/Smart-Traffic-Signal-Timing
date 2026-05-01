import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './ChartComponent.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

const defaultDarkOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#9fa8da',
        font: { family: 'Inter', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 20, 45, 0.95)',
      titleColor: '#e8eaf6',
      bodyColor: '#9fa8da',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: '#5c6bc0', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(100, 120, 200, 0.08)' },
      border: { color: 'rgba(100, 120, 200, 0.15)' },
    },
    y: {
      ticks: { color: '#5c6bc0', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(100, 120, 200, 0.08)' },
      border: { color: 'rgba(100, 120, 200, 0.15)' },
    },
  },
};

export default function ChartComponent({ type = 'line', data, options = {}, title }) {
  const mergedOptions = {
    ...defaultDarkOptions,
    ...options,
    plugins: {
      ...defaultDarkOptions.plugins,
      ...(options.plugins || {}),
      title: title
        ? {
            display: true,
            text: title,
            color: '#e8eaf6',
            font: { family: 'Inter', size: 14, weight: 600 },
            padding: { bottom: 16 },
          }
        : undefined,
    },
  };

  const ChartComp = type === 'bar' ? Bar : Line;

  return (
    <div className="chart-wrapper glass-card">
      <div className="chart-inner">
        <ChartComp data={data} options={mergedOptions} />
      </div>
    </div>
  );
}
