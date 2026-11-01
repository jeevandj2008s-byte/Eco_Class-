import React, { useState, Suspense, lazy } from 'react';
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
import { useCampusStore } from '../store/useCampusStore.js';
import { useSimulationStore } from '../store/useSimulationStore.js';
import { useIslandStore } from '../store/useIslandStore.js';
import { formatINR, formatKw, sounds } from '../lib/utils.js';

// Feature flag for Procedural 3D BIT Model (Phase 5)
const ENABLE_3D_MODEL = true;

// Lazy-load 3D model for fast initial bundle load
const BitCampus3D = lazy(() => import('../components/campus/BitCampus3D.jsx'));

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
    { id: 'HEATMAP', label: 'Live Power Heatmap', color: 'text-rose-600' },
    { id: 'OCCUPANCY', label: 'Occupancy Flow', color: 'text-[#006bff]' },
    { id: 'SOLAR', label: 'Solar Generation', color: 'text-amber-600' }
  ];

  // Optimistic Device Toggle with Rollback & Failure Toast (Fix 3.3)
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
    <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden flex flex-col bg-[#f8f9fb]">
      {/* Top Floating Controls Strip: Active Overlays Selector & 2D/3D Mode Switch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 max-w-full px-2">
        {/* 2D / 3D Model Toggle */}
        {ENABLE_3D_MODEL && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 border border-[#d4e0ed] backdrop-blur-md shadow-cal-card">
            <button
              onClick={() => {
                setViewMode('2D');
                sounds.playChime('bubble');
              }}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === '2D'
                  ? 'bg-[#006bff] text-white shadow-cal-btn font-bold'
                  : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>2D Map</span>
            </button>
            <button
              onClick={() => {
                setViewMode('3D');
                sounds.playChime('chime');
              }}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === '3D'
                  ? 'bg-[#006bff] text-white shadow-cal-btn font-bold'
                  : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D BIT Model</span>
            </button>
          </div>
        )}

        {/* Overlays Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 border border-[#d4e0ed] backdrop-blur-md shadow-cal-card">
          {overlays.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setOverlay(o.id);
                sounds.playChime('bubble');
              }}
              className={`btn-pop px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeOverlay === o.id
                  ? 'bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] font-bold shadow-cal-sm'
                  : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
              }`}
            >
              <span className={o.color}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport: 2D Campus Map or Procedural 3D BIT Model */}
      <div className="flex-1 w-full h-full relative">
        {viewMode === '3D' && ENABLE_3D_MODEL ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8f9fb] space-y-4 select-none">
                <div className="w-12 h-12 border-4 border-[#006bff]/20 border-t-[#006bff] rounded-full animate-spin shadow-cal-sm"></div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-[#006bff] tracking-wider">
                    EXTRUDING BIT CAMPUS 3D TWIN...
                  </p>
                  <p className="text-[10px] text-[#476788] font-mono">
                    Constructing courtyard cutouts & spatial telemetry
                  </p>
                </div>
              </div>
            }
          >
            <BitCampus3D
              activeOverlay={activeOverlay}
              telemetry={telemetry}
              selectedBuildingId={selectedBuilding?.id}
              onSelectBuilding={(b) => setSelectedBuilding(b)}
            />
          </Suspense>
        ) : (
          <CampusMap2D
            activeOverlay={activeOverlay}
            telemetry={telemetry}
            onSelectBuilding={(b) => setSelectedBuilding(b)}
          />
        )}
      </div>

      {/* Building Drill-Down Slide-over / Modal */}
      {selectedBuilding && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white border-l border-[#d4e0ed] shadow-cal-card p-6 flex flex-col overflow-y-auto text-[#0b3558] animate-slideLeft">
          <div className="flex items-center justify-between border-b border-[#d4e0ed] pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#004eba] tracking-wider">
                Building Inspection
              </span>
              <h2 className="text-base font-bold text-[#0b3558] leading-tight">
                {selectedBuilding.label || selectedBuilding.name}
              </h2>
              <p className="text-xs text-[#476788] mt-0.5">
                {selectedBuilding.department} • {selectedBuilding.floors || 1} Floors
              </p>
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="p-2 rounded-lg bg-[#f0f3f8] hover:bg-[#e5ebf3] text-[#476788] hover:text-[#0b3558]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error Alert Banner if Hardware Toggle Fails */}
          {toggleError && (
            <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{toggleError}</span>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="card-lift p-3.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] space-y-1">
              <span className="text-[10px] text-[#476788]">Baseline Load</span>
              <div className="text-base font-bold font-mono text-[#0b3558]">
                {selectedBuilding.baselineKw || 40} kW
              </div>
            </div>

            <div className="card-lift p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="text-[10px] text-amber-700">Rooftop Solar</span>
              <div className="text-base font-bold font-mono text-amber-800">
                {selectedBuilding.solarCapacityKw || 0} kW
              </div>
            </div>
          </div>

          {/* Device & Circuit Control List */}
          <div className="space-y-3 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#476788] flex items-center justify-between">
              <span>Connected Circuits & Sub-Meters</span>
              <span className="text-[10px] font-mono text-[#006bff]">
                {selectedBuilding.devices?.length || 0} Circuits
              </span>
            </h3>

            <div className="space-y-2">
              {(selectedBuilding.devices || []).map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#0b3558] flex items-center gap-1.5">
                      <span>{dev.name}</span>
                      {dev.anomaly && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                          Ghost Waste
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#476788] font-mono">
                      {dev.type} • {dev.kw} kW draw
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeviceToggle(dev.id, dev.state)}
                    className={`btn-pop px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 ${
                      dev.state === 'on'
                        ? 'bg-[#006bff] text-white shadow-cal-btn'
                        : 'bg-white border border-[#d4e0ed] text-[#476788] hover:text-[#0b3558]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{dev.state === 'on' ? 'ACTIVE' : 'OFF'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#d4e0ed] text-center">
            <button
              onClick={() => setSelectedBuilding(null)}
              className="btn-pop w-full py-2.5 rounded-lg bg-[#f0f3f8] hover:bg-[#e5ebf3] text-[#0b3558] font-semibold text-xs"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
