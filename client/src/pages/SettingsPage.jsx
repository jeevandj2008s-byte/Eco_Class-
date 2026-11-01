import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  RotateCcw,
  Shield,
  Zap,
  Leaf,
  CheckCircle2,
  Lock,
  Unlock,
  Move
} from 'lucide-react';
import { useIslandStore } from '../store/useIslandStore.js';
import { sounds } from '../lib/utils.js';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const { resetIsland } = useIslandStore();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(json => { if (json.success) setSettings(json.data); })
      .catch(() => {});
  }, []);

  const handleUpdate = async (key, val, scope = 'global') => {
    try {
      const res = await fetch(`/api/settings/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val, scope })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playChime('success');
        setFeedback(`Saved setting ${key} = ${val}`);
        setTimeout(() => setFeedback(null), 3000);
        // Refresh
        setSettings(prev => prev.map(s => s.key === key ? { ...s, effectiveValue: val } : s));
      } else {
        alert(data.error);
      }
    } catch {}
  };

  const handleResetIsland = () => {
    resetIsland();
    sounds.playChime('bubble');
    alert('Dynamic Island position reset to default top-center anchor.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#006bff]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#006bff]">
              System Settings & Inheritance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b3558] mt-1 tracking-tight">
            Global, Department & Personal Scopes
          </h1>
          <p className="text-xs text-[#476788] mt-1">
            Role-bounded settings inheritance (Admin &gt; HOD &gt; Faculty &gt; Student)
          </p>
        </div>

        {/* Theme Studio & Reset Island Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="px-4 py-2.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-cal-btn"
          >
            <Shield className="w-4 h-4" />
            <span>Theme & HOD Console</span>
          </Link>
          <button
            onClick={handleResetIsland}
            className="px-4 py-2.5 rounded-lg bg-[#f0f3f8] hover:bg-[#e6f0ff] border border-[#d4e0ed] text-[#0b3558] font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Move className="w-4 h-4 text-[#006bff]" />
            <span>Reset Island Position</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Settings List */}
      <div className="space-y-4">
        {settings.map((item) => (
          <div
            key={item.key}
            className="p-5 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4e0ed] pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-[#0b3558]">{item.name}</h4>
                <p className="text-[11px] text-[#476788] mt-0.5">{item.description}</p>
              </div>

              {/* Source & Lock Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f0f3f8] border border-[#d4e0ed] text-[#476788]">
                  {item.source}
                </span>
                {item.lockedBy ? (
                  <span className="flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-[#006bff] font-bold bg-[#e6f0ff] px-2 py-0.5 rounded-full border border-[#b8d5ff]">
                    <Unlock className="w-3 h-3" /> Editable
                  </span>
                )}
              </div>
            </div>

            {/* Input & Unit */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="number"
                step="0.05"
                disabled={!item.isEditable}
                value={item.effectiveValue}
                onChange={(e) => handleUpdate(item.key, Number(e.target.value), 'global')}
                className="w-32 px-3 py-1.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] text-xs font-mono font-bold text-[#0b3558] focus:outline-none focus:border-[#006bff] focus:bg-white transition disabled:opacity-40"
              />
              <span className="text-xs font-mono text-[#006bff] font-semibold">{item.unit}</span>
              {item.min !== undefined && (
                <span className="text-[10px] text-[#476788] font-mono">
                  (Bounds: {item.min} to {item.max})
                </span>
              )}
            </div>

            {item.key === 'tariff_per_kwh_inr' && (
              <p className="text-[10px] text-[#476788] italic">
                * Assumed. Edit in Settings with your actual BESCOM bill.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
