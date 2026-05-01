/**
 * API client for the Traffic GA Optimizer backend.
 * Handles all HTTP communication with the FastAPI server.
 */

const API_BASE = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Backend server is not running. Start with: cd backend && python -m backend.main');
    }
    throw error;
  }
}

/** Health check */
export const checkHealth = () => request('/health');

/** Get default config */
export const getConfig = () => request('/config');

/** Run fixed-timing simulation */
export const runSimulation = (config) =>
  request('/simulate', {
    method: 'POST',
    body: JSON.stringify(config),
  });

/** Run random-timing simulation */
export const runRandomSimulation = (config) =>
  request('/simulate/random', {
    method: 'POST',
    body: JSON.stringify(config),
  });

/** Run GA optimization */
export const runOptimization = (config) =>
  request('/optimize', {
    method: 'POST',
    body: JSON.stringify(config),
  });

/** Run full comparison (Fixed vs Random vs GA) */
export const runComparison = (config) =>
  request('/compare', {
    method: 'POST',
    body: JSON.stringify(config),
  });

/** Export results */
export const exportResults = (data, format = 'json') =>
  request('/export', {
    method: 'POST',
    body: JSON.stringify({ data, format }),
  });
