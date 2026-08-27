import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
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

/** Mount Vercel instrumentation after first paint so it cannot contend with FCP/LCP. */
function DeferredVercelInsights() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(enable, 1);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;
  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DeferredVercelInsights />
    <App />
  </StrictMode>,
);
