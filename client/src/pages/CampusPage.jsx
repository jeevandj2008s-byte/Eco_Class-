import React, { useState } from 'react';
import {
  Layers,
  Map,
  Box,
  Zap,
  Flame,
  Sun,
  Users,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  ChevronRight,
  X,
  Power,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import CampusMap2D from '../components/campus/CampusMap2D.jsx';
import BitCampus3D from '../components/campus/BitCampus3D.jsx';
import { useCampusStore } from '../store/useCampusStore.js';
import { useSimulationStore } from '../store/useSimulationStore.js';
import { useIslandStore } from '../store/useIslandStore.js';
import { formatINR, formatKw, sounds } from '../lib/utils.js';

export default function CampusPage() {
  const {
    activeOverlay,
    setOverlay,
    telemetry
  } = useCampusStore();

  const { pushEvent } = useIslandStore();
  const simulationStore = useSimulationStore();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [viewMode, setViewMode] = useState('2D'); // '2D' | '3D'
  const [toggleError, setToggleError] = useState(null);

  const overlays = [
    {
      id: 'HEATMAP',
      label: 'Live Power Heatmap',
      dotColor: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
      textColor: 'text-rose-300'
    },
    {
      id: 'OCCUPANCY',
      label: 'Occupancy Flow',
      dotColor: 'bg-[#9ff0ec] shadow-[0_0_8px_rgba(159,240,236,0.6)]',
      textColor: 'text-[#9ff0ec]'
    },
    {
      id: 'SOLAR',
      label: 'Solar Generation',
      dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      textColor: 'text-amber-300'
    }
  ];

  // Optimistic Device Toggle with Rollback & Failure Toast
  const handleDeviceToggle = async (deviceId, currentState) => {
    const nextState = currentState === 'on' ? 'off' : 'on';
    sounds.playChime('bubble');
    setToggleError(null);

    // Optimistically update local state immediately
    if (selectedBuilding && selectedBuilding.devices) {
      selectedBuilding.devices.forEach((d) => {
        if (d.id === deviceId) d.state = nextState;
      });
      setSelectedBuilding({ ...selectedBuilding });
    }

    try {
      const res = await fetch('/api/control/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, state: nextState })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      sounds.playChime('success');
    } catch (err) {
      // Rollback optimistic state immediately
      if (selectedBuilding && selectedBuilding.devices) {
        selectedBuilding.devices.forEach((d) => {
          if (d.id === deviceId) d.state = currentState;
        });
        setSelectedBuilding({ ...selectedBuilding });
      }

      sounds.playChime('error');
      const errMsg = `Device toggle failed: ${err.message}. Rolled back to ${currentState.toUpperCase()}.`;
      setToggleError(errMsg);

      pushEvent({
        type: 'ERROR',
        title: 'Hardware Control Error',
        message: errMsg,
        severity: 'critical'
      });

      setTimeout(() => setToggleError(null), 5000);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden flex flex-col bg-transparent">
      {/* Ambient Cosmic Cyber Background matching Campus Control System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="blob-magenta -top-32 -left-20 opacity-35" />
        <div className="blob-cyan -bottom-32 -right-20 opacity-30" />
      </div>
      {/* Top Floating Controls Strip: Mode Switch & Active Overlays in Campus Control Dark Glass */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-2.5 max-w-full px-2">
        {/* 2D / 3D Model Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <button
            onClick={() => {
              setViewMode('2D');
              sounds.playChime('bubble');
            }}
            className={`btn-pop px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === '2D'
                ? 'bg-[#006bff] text-white font-bold shadow-[0_0_20px_rgba(0,107,255,0.45)] border border-white/20'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>2D Map</span>
          </button>
          <button
            onClick={() => {
              setViewMode('3D');
              sounds.playChime('bubble');
            }}
            className={`btn-pop px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              viewMode === '3D'
                ? 'bg-[#006bff] text-white font-bold shadow-[0_0_20px_rgba(0,107,255,0.45)] border border-white/20'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D BIT Model</span>
          </button>
        </div>

        {/* Overlays Selector */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          {overlays.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setOverlay(o.id);
                sounds.playChime('bubble');
              }}
              className={`btn-pop px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeOverlay === o.id
                  ? 'bg-white/[0.12] text-white font-bold border border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${o.dotColor}`} />
              <span className={activeOverlay === o.id ? 'text-white' : o.textColor}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport: 2D Campus Map or Procedural 3D BIT Model */}
      <div className="flex-1 min-h-0 w-full h-full relative">
        {viewMode === '3D' ? (
          <BitCampus3D
            activeOverlay={activeOverlay}
            telemetry={telemetry}
            selectedBuildingId={selectedBuilding?.id}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            onFallbackTo2D={() => setViewMode('2D')}
          />
        ) : (
          <CampusMap2D
            activeOverlay={activeOverlay}
            telemetry={telemetry}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
            onFallbackTo2D={() => setViewMode('2D')}
          />
        )}
      </div>

      {/* Building Drill-Down Slide-over / Modal (Elevated Dark Glass System) */}
      {selectedBuilding && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#131219]/95 border-l border-white/[0.16] shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 flex flex-col overflow-y-auto text-white backdrop-blur-xl animate-slideLeft">
          <div className="flex items-center justify-between border-b border-white/[0.12] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#bdf7ee]">
                Building Inspection
              </span>
              <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight mt-0.5">
                {selectedBuilding.label || selectedBuilding.name}
              </h2>
              <p className="text-xs text-[#b9b8bb] mt-0.5 font-normal">
                {selectedBuilding.department} • {selectedBuilding.floors || 1} Floors
              </p>
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#b9b8bb] hover:text-white border border-white/[0.12] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error Alert Banner if Hardware Toggle Fails */}
          {toggleError && (
            <div className="my-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{toggleError}</span>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] space-y-1">
              <span className="text-[10px] text-[#b9b8bb]">Baseline Load</span>
              <div className="text-base font-bold font-mono text-white">
                {selectedBuilding.baselineKw || 40} kW
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
              <span className="text-[10px] text-amber-300">Rooftop Solar</span>
              <div className="text-base font-bold font-mono text-amber-400">
                {selectedBuilding.solarCapacityKw || 0} kW
              </div>
            </div>
          </div>

          {/* Device & Circuit Control List */}
          <div className="space-y-3 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b9b8bb] flex items-center justify-between">
              <span>Connected Circuits & Sub-Meters</span>
              <span className="text-[10px] font-mono text-[#9ff0ec]">
                {selectedBuilding.devices?.length || 0} Circuits
              </span>
            </h3>

            <div className="space-y-2">
              {(selectedBuilding.devices || []).map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{dev.name}</span>
                      {dev.anomaly && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                          Ghost Waste
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#b9b8bb] font-mono">
                      {dev.type} • {dev.kw} kW draw
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeviceToggle(dev.id, dev.state)}
                    className={`btn-pop px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                      dev.state === 'on'
                        ? 'bg-[#006bff] hover:bg-[#005be0] text-white shadow-[0_0_15px_rgba(0,107,255,0.4)]'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.14] text-[#b9b8bb] hover:text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{dev.state === 'on' ? 'ACTIVE' : 'OFF'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.12] text-center">
            <button
              onClick={() => setSelectedBuilding(null)}
              className="btn-pop w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs border border-white/[0.14] transition"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
