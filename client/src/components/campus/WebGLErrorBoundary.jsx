import React from 'react';
import { AlertTriangle, RefreshCw, Map } from 'lucide-react';

export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[3D Twin WebGL Error]:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-[#0a0910] p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#131219]/90 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col items-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              3D Accelerated Engine Suspended
            </h3>

            <p className="text-sm text-[#c9c3da] leading-relaxed mb-6">
              Your browser or GPU graphics context is temporarily busy. You can retry initializing the 3D viewport or switch to the high-performance 2D Campus Map.
            </p>

            <div className="w-full p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-rose-400/90 mb-6 truncate">
              {this.state.error?.message || 'WebGL context creation failed'}
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(0,107,255,0.4)] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry 3D Twin</span>
              </button>

              {this.props.onFallbackTo2D && (
                <button
                  onClick={this.props.onFallbackTo2D}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-[#9ff0ec] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Map className="w-4 h-4" />
                  <span>Use 2D Map</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

