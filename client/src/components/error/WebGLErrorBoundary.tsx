import React, { Component, ReactNode } from 'react';

let webglAvailableCache: boolean | null = null;

// WebGL Feature Detection with cached result to avoid creating canvases on every render pass
export function isWebGLAvailable(): boolean {
  if (webglAvailableCache !== null) {
    return webglAvailableCache;
  }
  try {
    const canvas = document.createElement('canvas');
    webglAvailableCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    webglAvailableCache = false;
  }
  return webglAvailableCache;
}

// React Error Boundary for WebGL initialization errors
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo?: string;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorInfo: error?.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGL context failed to initialize or encountered a runtime error. Rendering CSS fallback:", error, errorInfo);
  }

  render() {
    if (this.state.hasError || !isWebGLAvailable()) {
      return this.props.fallback || (
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/20 via-black to-black pointer-events-none" />
      );
    }
    return this.props.children;
  }
}
