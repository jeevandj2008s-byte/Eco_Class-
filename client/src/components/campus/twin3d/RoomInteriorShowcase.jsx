import React, { useEffect, useState, useMemo } from 'react';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { getRoomShowcaseData } from '../../../config/roomShowcase.config.js';
import { PROCESSED_BUILDINGS, findClassroomHierarchy } from '../../../config/buildings.config.js';

export function RoomInteriorShowcase({ telemetry }) {
  const isRoomShowcaseOpen = useTwin3DStore((s) => s.isRoomShowcaseOpen);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const closeRoomShowcase = useTwin3DStore((s) => s.closeRoomShowcase);
  const openRoomShowcase = useTwin3DStore((s) => s.openRoomShowcase);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [ecoModeActive, setEcoModeActive] = useState(false);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeRoomShowcase();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeRoomShowcase]);

  // Current room data
  const roomData = useMemo(() => {
    if (!selectedClassroomId) return null;
    return getRoomShowcaseData(selectedClassroomId);
  }, [selectedClassroomId]);

  // Reset image loaded state on room switch
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedClassroomId]);

  // Sibling rooms on this same floor for the switcher tabs
  const siblingRooms = useMemo(() => {
    if (!selectedClassroomId) return [];
    const hierarchy = findClassroomHierarchy(selectedClassroomId);
    if (!hierarchy || !hierarchy.floor) return [];
    return hierarchy.floor.classrooms || [];
  }, [selectedClassroomId]);

  if (!isRoomShowcaseOpen || !roomData) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between bg-black/90 backdrop-blur-md overflow-hidden animate-fade-in select-none">
      {/* 1. Full-Bleed Photorealistic Interior Showcase Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={roomData.imageUrl}
          alt={roomData.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'scale-100 opacity-90 blur-0' : 'scale-105 opacity-0 blur-md'
          }`}
        />
        {/* Cinematic Vignette & Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* 2. Top Header Navigation Bar */}
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={closeRoomShowcase}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#006bff] hover:text-white border border-white/20 transition-all text-xs font-semibold text-[#c9c3da] shadow-lg"
          >
            <span>←</span>
            <span>Back to 3D Floor Plan</span>
          </button>

          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#9ff0ec] font-mono font-bold">
              {roomData.buildingName} • {roomData.floorName}
            </span>
            <span className="text-xs font-bold text-white tracking-tight">
              {roomData.name}
            </span>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Digital Twin Online</span>
          </div>

          <button
            onClick={closeRoomShowcase}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors text-sm font-mono border border-white/15"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 3. Center Room Feature Highlights Overlay (Subtle Badges) */}
      <div className="relative z-10 px-8 py-4 pointer-events-none hidden lg:flex flex-wrap gap-2 max-w-xl">
        {roomData.features?.map((f, i) => (
          <div
            key={i}
            className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-[10px] font-mono text-[#c9c3da] backdrop-blur-md"
          >
            ✓ {f}
          </div>
        ))}
      </div>

      {/* 4. Bottom Interactive Bar (Matching frame 3, 4, 7 from reference video) */}
      <div className="relative z-10 w-full px-6 py-5 flex flex-col md:flex-row items-end md:items-center justify-between gap-4 border-t border-white/10 bg-black/60 backdrop-blur-2xl">
        {/* Left: Space Title, Description & Metadata */}
        <div className="flex flex-col text-left max-w-xl">
          <div className="text-[11px] uppercase tracking-widest text-[#9ff0ec] font-mono font-bold flex items-center gap-2">
            <span>{roomData.category}</span>
            <span>•</span>
            <span className="text-white/70">{roomData.areaSqFt}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            {roomData.name}
          </h2>
          <p className="text-xs text-[#c9c3da] mt-1 line-clamp-2 leading-relaxed">
            {roomData.description}
          </p>

          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-white/90">
            <span className="px-2 py-0.5 rounded bg-white/10">Cap: {roomData.capacity}</span>
            <span className="px-2 py-0.5 rounded bg-white/10">Temp: {roomData.temperature}</span>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              ⚡ {roomData.powerDrawKw} kW Draw
            </span>
          </div>
        </div>

        {/* Center: Room Switcher Tabs (Matching Reference Video) */}
        {siblingRooms.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-xl overflow-x-auto max-w-md">
            {siblingRooms.map((r) => {
              const isCurrent = r.id === selectedClassroomId;
              return (
                <button
                  key={r.id}
                  onClick={() => openRoomShowcase(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-[#006bff] text-white shadow-[0_0_15px_rgba(0,107,255,0.7)]'
                      : 'text-[#c9c3da] hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r.code || r.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Eco-Switch & Back Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEcoModeActive(!ecoModeActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg ${
              ecoModeActive
                ? 'bg-emerald-500 text-black shadow-emerald-500/50'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            <span>⚡</span>
            <span>{ecoModeActive ? 'Eco-Mode Active (-22%)' : 'Engage Eco-Cut'}</span>
          </button>

          <button
            onClick={closeRoomShowcase}
            className="px-4 py-2 rounded-xl bg-[#006bff] hover:bg-[#0056cc] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,107,255,0.6)]"
          >
            ← Return to Floor
          </button>
        </div>
      </div>
    </div>
  );
}

