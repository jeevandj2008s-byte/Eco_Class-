import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Smartphone,
  KeyRound,
  ArrowRight,
  Zap,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../lib/utils.js';

export default function PairPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResolveCode = async (e) => {
    e?.preventDefault();
    if (code.trim().length !== 6) {
      setError('Please enter a complete 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/camera/resolve-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortCode: code.trim() })
      });

      const data = await res.json();
      if (data.success && data.token) {
        sounds.playChime('success');
        navigate(`/camera/${data.token}`);
      } else {
        setError(data.error || 'Invalid or expired 6-digit pairing code.');
        sounds.playChime('alert');
      }
    } catch (err) {
      setError('Network error contacting twin server.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setError('');
    if (val.length === 6) {
      setTimeout(() => {
        // Auto submit on 6 digits
        fetch('/api/camera/resolve-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shortCode: val })
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.token) {
              sounds.playChime('success');
              navigate(`/camera/${data.token}`);
            } else {
              setError(data.error || 'Invalid or expired 6-digit pairing code.');
            }
          })
          .catch(() => setError('Server unreachable'));
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#0b3558] flex flex-col items-center justify-center p-4 relative">
      <div className="blob-magenta -top-12 -left-12 -z-10" />
      <div className="blob-cyan -bottom-12 -right-12 -z-10" />

      <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-6 text-center">
        {/* Header Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-3xl bg-[#e6f0ff] border border-[#b8d5ff] flex items-center justify-center text-[#006bff]">
            <KeyRound className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-black text-[#0b3558] tracking-tight">Enter 6-Digit Pairing Code</h1>
          <p className="text-xs text-[#476788] mt-1 max-w-xs mx-auto">
            Type the 6-digit code shown on the desktop AuraSync Vision Lab screen to stream camera video.
          </p>
        </div>

        {/* 6-Digit Code Input */}
        <form onSubmit={handleResolveCode} className="space-y-4">
          <div className="flex justify-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={handleInputChange}
              placeholder="••••••"
              autoFocus
              className="w-full max-w-xs tracking-[0.5em] text-center text-3xl font-black font-mono py-3 rounded-2xl bg-[#f8f9fb] border-2 border-[#d4e0ed] focus:border-[#006bff] text-[#0b3558] placeholder:text-[#a6bbd1] focus:outline-hidden transition shadow-sm"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 6 || loading}
            className={`w-full py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-cal-btn transition active:scale-98 ${
              code.length === 6 && !loading
                ? 'bg-[#006bff] hover:bg-[#005be0] text-white'
                : 'bg-[#f0f3f8] text-[#a6bbd1] cursor-not-allowed border border-[#d4e0ed]'
            }`}
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Validating Code...</span>
              </>
            ) : (
              <>
                <span>Connect Camera Stream</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-[#d4e0ed] text-[11px] text-[#476788]">
          Want to scan the QR code instead?{' '}
          <Link to="/vision" className="text-[#006bff] hover:underline font-semibold">
            Open Vision Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
