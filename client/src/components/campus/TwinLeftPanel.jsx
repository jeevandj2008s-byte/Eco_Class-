import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Building2,
  Layers,
  DoorOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Users
} from 'lucide-react';
import { PROCESSED_BUILDINGS } from '../../config/buildings.config.js';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';

export function TwinLeftPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedBuildings, setExpandedBuildings] = useState({ 'bit-main': true, 'bit-block-central': true });
  const [expandedFloors, setExpandedFloors] = useState({ 'bit-main-1': true, 'bit-main-2': true });

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const students = useTwin3DStore((s) => s.students);

  const toggleBuilding = (bId) => {
    setExpandedBuildings((prev) => ({ ...prev, [bId]: !prev[bId] }));
  };

  const toggleFloor = (fKey) => {
    setExpandedFloors((prev) => ({ ...prev, [fKey]: !prev[fKey] }));
  };

  // Filter hierarchy based on search query
  const filteredBuildings = useMemo(() => {
    if (!search.trim()) return PROCESSED_BUILDINGS;
    const q = search.toLowerCase();

    return PROCESSED_BUILDINGS.map((b) => {
      const matchB = b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
      const filteredFloors = b.floors.map((f) => {
        const matchF = f.name.toLowerCase().includes(q);
        const filteredRooms = f.classrooms.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            r.department?.toLowerCase().includes(q)
        );
        if (matchF || filteredRooms.length > 0) {
          return { ...f, classrooms: filteredRooms };
        }
        return null;
      }).filter(Boolean);

      if (matchB || filteredFloors.length > 0) {
        return { ...b, floors: filteredFloors };
      }
      return null;
    }).filter(Boolean);
  }, [search]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-16 left-4 z-20 p-2.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] text-[#9ff0ec] hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all cursor-pointer"
        title="Open Campus Hierarchy Explorer"
      >
        <PanelLeftOpen className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute top-16 left-4 bottom-20 w-72 z-20 flex flex-col rounded-2xl bg-[#131219]/90 border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl select-none animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#9ff0ec]" />
          <span className="text-xs font-bold text-white tracking-tight">Campus Hierarchy</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-[#b9b8bb] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-white/10">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search rooms, departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#9ff0ec]/50"
          />
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredBuildings.map((b) => {
          const isBExpanded = expandedBuildings[b.id] ?? false;
          const isBSelected = selectedBuildingId === b.id && !selectedFloorLevel && !selectedClassroomId;

          return (
            <div key={b.id} className="rounded-xl overflow-hidden">
              {/* Building Row */}
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                  isBSelected
                    ? 'bg-[#006bff]/20 text-[#9ff0ec] border border-[#9ff0ec]/30'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => selectBuilding(b.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBuilding(b.id);
                    }}
                    className="p-0.5 hover:bg-white/10 rounded"
                  >
                    {isBExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                    )}
                  </button>
                  <span className="text-xs font-semibold truncate">{b.name}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#b9b8bb]">
                  {b.code}
                </span>
              </div>

              {/* Floors under building */}
              {isBExpanded && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-white/10 ml-3.5 mt-0.5">
                  {b.floors.map((f) => {
                    const floorKey = `${b.id}-${f.level}`;
                    const isFExpanded = expandedFloors[floorKey] ?? false;
                    const isFSelected =
                      selectedBuildingId === b.id && selectedFloorLevel === f.level && !selectedClassroomId;

                    return (
                      <div key={f.level}>
                        {/* Floor Row */}
                        <div
                          className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                            isFSelected
                              ? 'bg-[#006bff]/20 text-[#9ff0ec] border border-[#9ff0ec]/30 font-semibold'
                              : 'text-[#c9c3da] hover:bg-white/5 hover:text-white'
                          }`}
                          onClick={() => selectFloor(b.id, f.level)}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFloor(floorKey);
                              }}
                              className="p-0.5 hover:bg-white/10 rounded"
                            >
                              {isFExpanded ? (
                                <ChevronDown className="w-3 h-3 text-white/40" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-white/40" />
                              )}
                            </button>
                            <Layers className="w-3 h-3 opacity-60" />
                            <span className="truncate">Floor {f.level}</span>
                          </div>
                          <span className="text-[9px] font-mono text-[#b9b8bb]">
                            {f.classrooms.length} rms
                          </span>
                        </div>

                        {/* Classrooms under floor */}
                        {isFExpanded && (
                          <div className="pl-4 py-0.5 space-y-0.5 border-l border-white/5 ml-3">
                            {f.classrooms.map((room) => {
                              const isRSelected = selectedClassroomId === room.id;
                              const roomStudents = students.filter((s) => s.classroomId === room.id);
                              const totalSeats = room.layout?.seats?.length || 0;

                              return (
                                <div
                                  key={room.id}
                                  onClick={() => selectClassroom(room.id)}
                                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                    isRSelected
                                      ? 'bg-[#006bff] text-white font-bold shadow-[0_0_12px_rgba(0,107,255,0.5)]'
                                      : 'text-[#b9b8bb] hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <DoorOpen className="w-3 h-3 opacity-70" />
                                    <span className="truncate">{room.code || room.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] font-mono">
                                    <Users className="w-2.5 h-2.5 opacity-60" />
                                    <span>{roomStudents.length}/{totalSeats}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

