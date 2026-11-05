import React from 'react';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { PROCESSED_BUILDINGS } from '../../../config/buildings.config.js';

export function FloorInspectorPanel({ telemetry }) {
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectCampus = useTwin3DStore((s) => s.selectCampus);
  const students = useTwin3DStore((s) => s.students);

  // Active building and floor
  const building = PROCESSED_BUILDINGS.find((b) => b.id === selectedBuildingId);
  const floor = building?.floors?.find((f) => f.level === selectedFloorLevel);

  if (!building || !floor || selectedFloorLevel === null) {
    return null;
  }

  // Calculate floor metrics
  const floorStudents = students.filter(
    (s) => s.buildingId === building.id && s.floorLevel === floor.level
  );
  const totalFloorSeats = (floor.classrooms || []).reduce(
    (acc, r) => acc + (r.layout?.seats?.length || 24),
    0
  );
  const occupancyPct = totalFloorSeats > 0 ? Math.round((floorStudents.length / totalFloorSeats) * 100) : 0;

  // Real-time telemetry kW
  let buildingKw = building.baselineKw || 40;
  if (telemetry?.buildings) {
    if (Array.isArray(telemetry.buildings)) {
      const b = telemetry.buildings.find((x) => x.id === building.id);
      if (b?.realKw) buildingKw = b.realKw;
    } else if (telemetry.buildings[building.id]?.realKw) {
      buildingKw = telemetry.buildings[building.id].realKw;
    }
  }

  return (
    <div className="absolute top-20 right-6 z-30 w-80 md:w-96 max-h-[calc(100vh-160px)] flex flex-col bg-[#10131d]/95 border border-white/15 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden animate-slide-in-right select-none">
      {/* 1. Header with Floor Title & Navigation */}
      <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-[#006bff]/20 border border-[#006bff]/40 text-[#9ff0ec] text-[10px] font-mono font-bold">
              {building.shortName || building.name}
            </span>
            <span className="text-[10px] font-mono text-[#c9c3da]">
              Level {floor.level} of {building.floorCount}
            </span>
          </div>

          <button
            onClick={() => selectBuilding(building.id)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors text-xs font-mono"
            title="Back to Building View"
          >
            ✕
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-1.5 leading-snug">
          {floor.name || `Floor ${floor.level}`}
        </h3>

        {/* Floor Level Quick-Switcher Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10 overflow-x-auto">
          <span className="text-[10px] font-mono text-[#8e8d92] mr-1">Floors:</span>
          {building.floors.map((fl) => {
            const isCur = fl.level === selectedFloorLevel;
            return (
              <button
                key={fl.level}
                onClick={() => selectFloor(building.id, fl.level)}
                className={`w-7 h-7 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                  isCur
                    ? 'bg-[#006bff] text-white shadow-[0_0_12px_rgba(0,107,255,0.7)] scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-[#c9c3da]'
                }`}
              >
                {fl.level === 1 ? '1' : fl.level}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Key Stats Grid */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-white/10 bg-black/20 text-center">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] font-mono text-[#8e8d92]">Students</span>
          <span className="text-sm font-black font-mono text-[#9ff0ec]">{floorStudents.length}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] font-mono text-[#8e8d92]">Classes</span>
          <span className="text-sm font-black font-mono text-white">{floor.classrooms?.length || 0}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="block text-[10px] font-mono text-[#8e8d92]">Occupancy</span>
          <span className={`text-sm font-black font-mono ${
            occupancyPct >= 90 ? 'text-rose-400' : occupancyPct >= 70 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {occupancyPct}%
          </span>
        </div>
      </div>

      {/* 3. Classrooms List with Live Occupancy Bars */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar max-h-72">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9ff0ec] flex items-center justify-between">
          <span>Active Classrooms</span>
          <span>{floor.classrooms?.length || 0} Rooms</span>
        </div>

        {floor.classrooms?.map((room) => {
          const roomStus = students.filter((s) => s.classroomId === room.id);
          const cap = room.layout?.seats?.length || 24;
          const pct = Math.round((roomStus.length / cap) * 100);
          const isCurrentRoom = selectedClassroomId === room.id;

          const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';

          return (
            <div
              key={room.id}
              onClick={() => selectClassroom(room.id)}
              className={`group p-3 rounded-2xl border transition-all cursor-pointer ${
                isCurrentRoom
                  ? 'bg-[#006bff]/20 border-[#9ff0ec] shadow-[0_0_20px_rgba(0,107,255,0.4)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between leading-tight">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                  <span className="text-xs font-bold text-white group-hover:text-[#9ff0ec] transition-colors">
                    {room.code || room.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-white">
                  {roomStus.length} <span className="text-[#8e8d92]">/ {cap}</span>
                </span>
              </div>

              <div className="text-[10px] text-[#c9c3da] font-mono mt-1 flex items-center justify-between">
                <span>{room.department}</span>
                <span style={{ color: barColor }}>{pct}% full</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, pct)}%`, backgroundColor: barColor }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 text-[9px] font-mono text-[#9ff0ec]">
                <span>Click to fly inside room</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Actions */}
      <div className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-2">
        <button
          onClick={() => selectBuilding(building.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#c9c3da] hover:text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <span>←</span>
          <span>Building View</span>
        </button>

        <button
          onClick={selectCampus}
          className="flex-1 py-2 px-3 rounded-xl bg-[#006bff] hover:bg-[#0056cc] text-white text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,107,255,0.6)] flex items-center justify-center gap-1.5"
        >
          <span>Campus View</span>
        </button>
      </div>
    </div>
  );
}
