import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

// Systematically intercept and route fetch requests using environment configuration
const originalFetch = window.fetch;
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api')) {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    input = `${baseUrl}${input}`;
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpeedInsights />
    <Analytics />
    <App />
  </StrictMode>,
);
