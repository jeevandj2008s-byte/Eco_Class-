import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { formatKw, formatINR, formatCo2, sounds } from '../../lib/utils.js';

export default function PasskeyModal({ isOpen, onClose, onAuthorized, title, predictedImpact }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    sounds.playChime('bubble');
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        verify(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    sounds.playChime('bubble');
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verify = (enteredPin) => {
    if (enteredPin === '123456') {
      sounds.playChime('success');
      onAuthorized(enteredPin);
      onClose();
    } else {
      sounds.playChime('error');
      setError('Invalid passkey. Default demo PIN is 123456.');
      setPin('');
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-[#0b3558]/40 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl bg-white border border-[#d4e0ed] p-6 shadow-cal-card relative text-[#0b3558]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#e6f0ff] border border-[#d4e0ed] flex items-center justify-center text-[#006bff]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b3558]">{title || 'Campus Master Switch Authorization'}</h3>
            <p className="text-xs text-[#476788]">Layered Security Check: HOD / Admin Passkey Required</p>
          </div>
        </div>

        {/* Predicted Impact Card */}
        {predictedImpact && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] space-y-2">
            <div className="text-[11px] font-bold text-[#004eba] uppercase tracking-wider">
              Predicted Realtime Impact
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white border border-[#d4e0ed] shadow-cal-sm">
                <div className="text-[10px] text-[#476788]">Demand Drop</div>
                <div className="text-xs font-mono font-bold text-emerald-600 mt-0.5">
                  -{formatKw(predictedImpact.kwDrop || 48)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#d4e0ed] shadow-cal-sm">
                <div className="text-[10px] text-[#476788]">Hourly Savings</div>
                <div className="text-xs font-mono font-bold text-[#006bff] mt-0.5">
                  +{formatINR(predictedImpact.savingsPerHourRs || 396)}/h
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#d4e0ed] shadow-cal-sm">
                <div className="text-[10px] text-[#476788]">CO₂ Avoided</div>
                <div className="text-xs font-mono font-bold text-purple-600 mt-0.5">
                  {formatCo2(predictedImpact.co2AvoidedKg || 34.1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIN Dots Indicator */}
        <div className="flex justify-center items-center gap-3 my-4">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                pin.length > idx
                  ? 'bg-[#006bff] border-[#006bff] shadow-cal-btn scale-110'
                  : 'bg-[#f0f3f8] border-[#d4e0ed]'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-rose-600 mb-3 flex items-center justify-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto my-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="h-12 rounded-xl bg-white hover:bg-[#f0f3f8] active:bg-[#e6f0ff] border border-[#d4e0ed] text-lg font-mono font-semibold text-[#0b3558] transition active:scale-95 shadow-cal-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('123456')}
            className="h-12 rounded-xl bg-[#e6f0ff] hover:bg-[#d4e5ff] text-[#004eba] text-xs font-semibold border border-[#d4e0ed]"
            title="Auto-fill Demo PIN"
          >
            Demo
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-white hover:bg-[#f0f3f8] active:bg-[#e6f0ff] border border-[#d4e0ed] text-lg font-mono font-semibold text-[#0b3558] transition active:scale-95 shadow-cal-sm"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-white hover:bg-[#f0f3f8] text-[#476788] hover:text-[#0b3558] text-xs font-semibold border border-[#d4e0ed] shadow-cal-sm"
          >
            ⌫
          </button>
        </div>

        <p className="text-center text-[11px] text-[#476788] mt-4">
          Demo Passkey PIN: <span className="font-mono text-[#006bff] font-bold">123456</span>
        </p>
      </motion.div>
    </div>
  );
}
