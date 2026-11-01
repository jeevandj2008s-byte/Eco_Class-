import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('⚠️ AuraSync caught a runtime error in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-3xl bg-white border border-[#d4e0ed] text-[#0b3558] space-y-4 shadow-cal-card">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#0b3558]">Module Display Recovery</h2>
              <p className="text-xs text-[#476788] mt-1 leading-relaxed">
                A component error occurred while rendering this module. Your session and telemetry are safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] text-left font-mono text-[10px] text-rose-700 overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Module</span>
              </button>

              <Link
                to="/"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-[#f0f3f8] hover:bg-[#e6f0ff] text-[#0b3558] font-semibold text-xs flex items-center gap-1.5 transition border border-[#d4e0ed]"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
