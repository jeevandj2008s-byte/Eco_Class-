import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Zap,
  ShieldCheck,
  RotateCcw,
  Power,
  Lock,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCampusStore } from '../store/useCampusStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatINR, formatKw, sounds } from '../lib/utils.js';

export default function ControlPage({ onOpenMasterSwitch }) {
  const { telemetry } = useCampusStore();
  const { user } = useAuthStore();
  const [optimizerMode, setOptimizerMode] = useState('Balanced');
  const [auditLogs, setAuditLogs] = useState([]);
  const [undoStatus, setUndoStatus] = useState(null);

  useEffect(() => {
    fetch('/api/control/actions')
      .then(res => res.json())
      .then(json => {
        if (json.success) setAuditLogs(json.data);
      })
      .catch(() => {});
  }, []);

  const handleModeChange = (mode) => {
    setOptimizerMode(mode);
    sounds.playChime('bubble');
  };

  const handleUndo = async (actionId) => {
    try {
      const res = await fetch('/api/control/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      const data = await res.json();
      if (data.success) {
        sounds.playChime('success');
        setUndoStatus('Action successfully undone within 60s window.');
        setTimeout(() => setUndoStatus(null), 4000);
      } else {
        alert(data.error);
      }
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-[#0b3558]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#006bff]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#bdf7ee]">
              Campus Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-[1.15] mt-1">
            Autonomous Optimization & Hierarchical Actuation
          </h1>
          <p className="text-xs text-[#b9b8bb] mt-1 font-normal">
            Software digital relays behind DeviceAdapter interface • Passkey PIN enforced
          </p>
        </div>

        {/* Master Campus Eco Switch Trigger */}
        <button
          onClick={onOpenMasterSwitch}
          className="px-5 py-3 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn flex items-center gap-2 transition active:scale-95"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Launch Campus Eco Switch</span>
        </button>
      </div>

      {undoStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{undoStatus}</span>
        </div>
      )}

      {/* Grid: Auto-Optimizer Profile & Master Switches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Auto-Optimizer Tuning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0b3558]">Auto-Optimizer Aggressiveness</h3>
                <p className="text-xs text-[#476788] mt-0.5">Controls thermostat sweet spot and idle thresholds</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#004eba] bg-[#e6f0ff] px-2.5 py-1 rounded-full border border-[#d4e0ed]">
                {optimizerMode} Mode
              </span>
            </div>

            {/* Profile Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Gentle', desc: 'Comfort priority, 20m delay, 24°C' },
                { name: 'Balanced', desc: 'BEE sweet spot, 15m delay, 24-25°C' },
                { name: 'Aggressive', desc: 'Max savings, 8m delay, 26°C peak shed' }
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleModeChange(p.name)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    optimizerMode === p.name
                      ? 'bg-[#e6f0ff] border-[#006bff] text-[#006bff] shadow-cal-sm font-bold'
                      : 'bg-[#f8f9fb] border-[#d4e0ed] text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
                  }`}
                >
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-[#476788] mt-1">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Safety Whitelist */}
            <div className="pt-2 border-t border-[#d4e0ed]">
              <h4 className="text-xs font-bold text-[#476788] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Protected Critical Loads (Immune from Auto-Cut)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#0b3558]">
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Central Server Racks</div>
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Precision CRAC ACs</div>
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Elevator Cabins & Safety</div>
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Fire & Emergency Lights</div>
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Water Supply Booster</div>
                <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm font-medium">Research Lab Refrigeration</div>
              </div>
            </div>
          </div>

          {/* Manual Bulk Profiles */}
          <div className="p-6 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
            <h3 className="text-sm font-bold text-[#0b3558]">Campus-Wide Operational Presets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={onOpenMasterSwitch}
                className="p-3.5 rounded-xl bg-[#f8f9fb] hover:bg-[#e6f0ff] border border-[#d4e0ed] hover:border-[#006bff] text-left transition group shadow-cal-sm"
              >
                <Zap className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-[#0b3558]">Eco Mode</div>
                <div className="text-[10px] text-[#476788] mt-0.5">Shed idle circuits</div>
              </button>

              <button
                onClick={onOpenMasterSwitch}
                className="p-3.5 rounded-xl bg-[#f8f9fb] hover:bg-[#e6f0ff] border border-[#d4e0ed] hover:border-[#006bff] text-left transition group shadow-cal-sm"
              >
                <Clock className="w-5 h-5 text-[#006bff] mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-[#0b3558]">Night Shutdown</div>
                <div className="text-[10px] text-[#476788] mt-0.5">Corridor lighting only</div>
              </button>

              <button
                onClick={onOpenMasterSwitch}
                className="p-3.5 rounded-xl bg-[#f8f9fb] hover:bg-[#e6f0ff] border border-[#d4e0ed] hover:border-[#006bff] text-left transition group shadow-cal-sm"
              >
                <Sparkles className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-[#0b3558]">Event Override</div>
                <div className="text-[10px] text-[#476788] mt-0.5">Auditorium fest power</div>
              </button>

              <button
                onClick={onOpenMasterSwitch}
                className="p-3.5 rounded-xl bg-[#f8f9fb] hover:bg-rose-50 border border-[#d4e0ed] hover:border-rose-300 text-left transition group shadow-cal-sm"
              >
                <AlertTriangle className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition" />
                <div className="text-xs font-bold text-[#0b3558]">Emergency Cut</div>
                <div className="text-[10px] text-[#476788] mt-0.5">Isolate non-critical</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Immutable Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0b3558] uppercase tracking-wider">
                Control Action Audit Trail
              </h3>
              <span className="text-[10px] text-[#476788] font-mono">Immutable Log</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0b3558]">{log.action}</span>
                    <span className="text-[10px] font-mono text-[#004eba] uppercase bg-[#e6f0ff] px-1.5 py-0.2 rounded border border-[#d4e0ed]">{log.userRole}</span>
                  </div>
                  <div className="text-[11px] text-[#476788] flex items-center justify-between">
                    <span>By: {log.userName}</span>
                    <span className="font-mono text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {log.canUndoUntil && !log.undone && (
                    <div className="pt-1.5 flex justify-end">
                      <button
                        onClick={() => handleUndo(log.id)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-amber-300 text-[10px] font-semibold text-amber-800 flex items-center gap-1 shadow-cal-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Undo Action (60s)</span>
                      </button>
                    </div>
                  )}
                  {log.undone && (
                    <div className="text-[10px] text-[#a6bbd1] italic text-right pt-0.5">
                      (Action Undone)
                    </div>
                  )}
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-center py-6 text-xs text-[#476788]">
                  No manual overrides recorded today.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
