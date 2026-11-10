import React, { useState, useMemo } from 'react';
import {
  Zap,
  MapPin,
  Layers,
  ShieldCheck,
  Building2,
  ArrowRight,
  Search,
  Eye,
  Sliders,
  Tag,
  UserPlus,
  Upload,
  Download,
  RotateCcw,
  DoorOpen,
  BarChart3,
  Compass,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { PROCESSED_BUILDINGS, findClassroomHierarchy } from '../../../config/buildings.config.js';

export function CampusFunctionsDock({ telemetry }) {
  const [activeTab, setActiveTab] = useState('hierarchy'); // 'hierarchy' | 'controls' | 'telemetry' | 'inspector'
  const [search, setSearch] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [expandedBuildings, setExpandedBuildings] = useState({ 'bit-main': true });

  // Store state
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);

  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const setXrayMode = useTwin3DStore((s) => s.setXrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const setExplodedHeight = useTwin3DStore((s) => s.setExplodedHeight);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const setShowLabels = useTwin3DStore((s) => s.setShowLabels);

  const selectCampus = useTwin3DStore((s) => s.selectCampus);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);

  const students = useTwin3DStore((s) => s.students);
  const openAddModal = useTwin3DStore((s) => s.openAddModal);
  const openImportModal = useTwin3DStore((s) => s.openImportModal);
  const exportJson = useTwin3DStore((s) => s.exportJson);
  const resetToSeedData = useTwin3DStore((s) => s.resetToSeedData);

  const selectedBuilding = PROCESSED_BUILDINGS.find((b) => b.id === selectedBuildingId);
  const selectedFloor = selectedBuilding?.floors?.find((f) => f.level === selectedFloorLevel);
  const selectedClassroom = selectedClassroomId ? findClassroomHierarchy(selectedClassroomId)?.classroom : null;

  const toggleBuilding = (bId) => {
    setExpandedBuildings((prev) => ({ ...prev, [bId]: !prev[bId] }));
  };

  // Filter hierarchy
  const filteredBuildings = useMemo(() => {
    if (!search.trim()) return PROCESSED_BUILDINGS;
    const q = search.toLowerCase();
    return PROCESSED_BUILDINGS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.shortName?.toLowerCase().includes(q)
    );
  }, [search]);

  // Students in selected context
  const relevantStudents = useMemo(() => {
    if (selectedClassroomId) {
      return students.filter((s) => s.classroomId === selectedClassroomId);
    }
    if (selectedBuildingId) {
      return students.filter((s) => s.buildingId === selectedBuildingId);
    }
    return students;
  }, [students, selectedClassroomId, selectedBuildingId]);

  const filteredRoster = useMemo(() => {
    if (!rosterSearch.trim()) return relevantStudents.slice(0, 30);
    const q = rosterSearch.toLowerCase();
    return relevantStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.usn?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q)
    );
  }, [relevantStudents, rosterSearch]);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 select-none relative z-10">
      {/* Subtle Hairline divider at top */}
      <div className="w-full h-[1px] bg-white/[0.08]" />

      {/* Section Header: Matching AuraSync Digital Twin Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
        <div>
          <span className="text-xs font-bold text-[#9ff0ec] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#9ff0ec]" />
            <span>Digital Twin Operations</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] mt-2">
            AuraSync Campus<br />
            <span className="text-[#9ff0ec]">
              Digital Twin Architecture
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#b9b8bb] flex items-center gap-1.5 font-normal">
            <span>Verified microgrid telemetry, institutional governance, and Net-Zero 2030 standards.</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9ff0ec]" />
          </p>
        </div>

        {/* Master Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] self-start sm:self-end flex-wrap">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`btn-pop px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hierarchy'
                ? 'bg-white/[0.14] text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#9ff0ec]" />
            <span>Campus Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`btn-pop px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-white/[0.14] text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#6f5adc]" />
            <span>3D Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`btn-pop px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-white/[0.14] text-white font-bold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#bdf7ee]" />
            <span>Telemetry</span>
          </button>

          {(selectedFloorLevel !== null || selectedClassroomId !== null) && (
            <button
              onClick={() => setActiveTab('inspector')}
              className={`btn-pop px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-300 font-bold border border-amber-500/40 shadow-lg'
                  : 'text-amber-400 hover:text-white hover:bg-amber-500/10'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>
                {selectedClassroom
                  ? `Room ${selectedClassroom.code || selectedClassroom.name}`
                  : `Floor ${selectedFloorLevel} Cutaway`}
              </span>
            </button>
          )}

          {selectedBuildingId && (
            <button
              onClick={selectCampus}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#9ff0ec] border border-white/10 transition-colors flex items-center gap-1.5 ml-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 4 ELEVATED DARK GLASS CARDS (MATCHING REFERENCE IMAGE 2) */}
      {/* ============================================================== */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="flex items-center justify-between gap-4 px-1">
            <span className="text-xs text-[#b9b8bb] font-mono">
              Displaying all 8 procedural volumetric building blocks
            </span>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search building name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-[#131219]/80 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#9ff0ec] backdrop-blur-md"
              />
            </div>
          </div>

          {/* Cards Grid: Architectural campus building cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {filteredBuildings.map((b, idx) => {
              const bStudents = students.filter((s) => s.buildingId === b.id);
              const isSelectedB = selectedBuildingId === b.id;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={b.id}
                  className={`w-full min-h-[420px] rounded-2xl bg-[#131219]/90 border ${
                    isSelectedB
                      ? 'border-[#006bff] ring-1 ring-[#006bff]/50'
                      : 'border-white/[0.12] hover:border-white/30'
                  } shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-colors group select-none`}
                >
                  {/* Top: Brand Logo / Module Identifier */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                          <Building2 className={`w-4 h-4 ${isEven ? 'text-[#9ff0ec]' : 'text-[#6f5adc]'}`} />
                        </div>
                        <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                          {b.code || b.shortName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                        {b.baselineKw} kW
                      </span>
                    </div>

                    {/* Middle: Big bold metric number & description */}
                    <div className="mt-7 mb-6">
                      <div
                        className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
                          isEven ? 'text-white' : 'text-[#9ff0ec]'
                        }`}
                      >
                        {b.shortName || b.name}
                      </div>
                      <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed font-normal">
                        {b.name}. {b.floorCount} volumetric stacked floors with active classroom digital twins and telemetry monitoring.
                      </p>

                      {/* Stats Badges */}
                      <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-[#b9b8bb]">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                          {b.floorCount} Floors
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                          {bStudents.length} Students
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floor Cutaway Presets if expanded */}
                  <div className="mb-4 space-y-1 border-t border-white/[0.08] pt-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8e8d92] flex items-center justify-between">
                      <span>Interactive Levels</span>
                      <button
                        onClick={() => toggleBuilding(b.id)}
                        className="hover:text-white"
                      >
                        {expandedBuildings[b.id] ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {expandedBuildings[b.id] &&
                      b.floors.map((fl) => (
                        <div key={fl.level} className="flex flex-col gap-0.5">
                          <button
                            onClick={() => selectFloor(b.id, fl.level)}
                            className="w-full text-left py-1 px-2 rounded-lg hover:bg-white/5 text-[11px] font-mono text-[#c9c3da] hover:text-[#9ff0ec] flex items-center justify-between transition-colors"
                          >
                            <span>Floor {fl.level} Cutaway</span>
                            <span className="text-[10px] text-white/40">
                              {fl.classrooms?.length || 0} Rooms →
                            </span>
                          </button>
                          {/* Quick Class View buttons */}
                          <div className="flex flex-wrap gap-1 pl-3 pb-1">
                            {fl.classrooms?.map((cr) => (
                              <button
                                key={cr.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectClassroom(cr.id);
                                }}
                                className="px-1.5 py-0.5 rounded-md bg-white/[0.04] hover:bg-[#006bff]/30 text-[9.5px] font-mono text-[#9ff0ec] border border-white/10 hover:border-[#9ff0ec]/40 transition-all cursor-pointer"
                                title={`Open Class View: ${cr.code || cr.name}`}
                              >
                                {cr.code || cr.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Bottom: Architectural Action Control */}
                  <button
                    onClick={() => selectBuilding(b.id)}
                    className="inline-flex items-center gap-2 mt-auto self-start px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-[#006bff] text-white text-xs font-semibold border border-white/[0.14] hover:border-transparent transition-colors cursor-pointer"
                  >
                    <span>Focus Block</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: 3D STUDIO CONTROLS (ELEVATED DARK GLASS CARDS)          */}
      {/* ============================================================== */}
      {activeTab === 'controls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* Card 1: X-Ray Cutaway */}
          <div className="rounded-2xl bg-[#131219]/90 border border-white/[0.12] hover:border-white/30 shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#9ff0ec]" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                    Cutaway Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                  {xrayMode ? 'Active' : 'Solid'}
                </span>
              </div>

              <div className="mt-8 mb-6">
                <div className="text-3xl font-bold tracking-tight text-white">
                  X-Ray Vision
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed">
                  Opens building slabs and exterior walls to reveal classroom furniture and seated student occupancy simultaneously.
                </p>
              </div>
            </div>

            <button
              onClick={() => setXrayMode()}
              className="px-4 py-2 rounded-lg bg-[#006bff] hover:bg-[#1a7aff] text-white text-xs font-semibold transition-colors flex items-center gap-2 self-start cursor-pointer shadow-sm"
            >
              <span>{xrayMode ? 'Restore Solid Shell' : 'Enable X-Ray Mode'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Exploded View Slider */}
          <div className="rounded-2xl bg-[#131219]/90 border border-white/[0.12] hover:border-white/30 shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[#9ff0ec]" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                    Floor Exploder
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                  {explodedHeight.toFixed(1)}x Gap
                </span>
              </div>

              <div className="mt-8 mb-4">
                <div className="text-3xl font-bold tracking-tight text-[#9ff0ec]">
                  Axonometric
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed">
                  Slide floor slabs vertically apart into an architectural exploded drawing.
                </p>
              </div>

              {/* Slider */}
              <div className="my-4 space-y-2">
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.2"
                  value={explodedHeight}
                  onChange={(e) => setExplodedHeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#9ff0ec]"
                />
                <div className="flex items-center justify-between gap-1 pt-1">
                  <button
                    onClick={() => setExplodedHeight(0)}
                    className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                  >
                    Reset (0)
                  </button>
                  <button
                    onClick={() => setExplodedHeight(1.5)}
                    className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                  >
                    Split (1.5x)
                  </button>
                  <button
                    onClick={() => setExplodedHeight(3.0)}
                    className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                  >
                    Expand (3x)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLabels()}
              className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.14] transition-colors flex items-center gap-2 self-start cursor-pointer mt-2"
            >
              <span>{showLabels ? 'Hide Labels' : 'Show 3D Labels'}</span>
            </button>
          </div>

          {/* Card 3: Dataset Operations */}
          <div className="rounded-2xl bg-[#131219]/90 border border-white/[0.12] hover:border-white/30 shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#bdf7ee]" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                    Roster Hub
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#bdf7ee] border border-white/[0.12]">
                  {students.length} Enrolled
                </span>
              </div>

              <div className="mt-8 mb-6">
                <div className="text-4xl font-black tracking-tight text-[#bdf7ee]">
                  Operations
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed">
                  Add individual student figures to desks, import CSV rosters, or export microgrid telemetry states.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => openAddModal()}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </button>
                <button
                  onClick={() => openImportModal()}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>CSV Import</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={exportJson}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#c9c3da] text-xs font-mono transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={resetToSeedData}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono transition-colors border border-rose-500/20"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TELEMETRY & STUDENT ROSTER                              */}
      {/* ============================================================== */}
      {activeTab === 'telemetry' && (
        <div className="rounded-2xl bg-[#131219]/90 border border-white/[0.12] shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 backdrop-blur-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-bold text-[#9ff0ec] uppercase tracking-widest">
                Microgrid Data Layer
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight mt-1">
                Student Enrollment & Department Distribution
              </h3>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search students by name or USN..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#9ff0ec]"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#8e8d92] font-mono text-[10px]">
                  <th className="pb-3">STUDENT NAME</th>
                  <th className="pb-3">USN / ROLL NO</th>
                  <th className="pb-3">DEPARTMENT</th>
                  <th className="pb-3">CLASSROOM</th>
                  <th className="pb-3">SEAT ID</th>
                  <th className="pb-3 text-right">3D SPATIAL ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRoster.map((stu) => (
                  <tr
                    key={stu.id}
                    className={`hover:bg-white/[0.04] transition-colors ${
                      selectedStudentId === stu.id ? 'bg-[#006bff]/20' : ''
                    }`}
                  >
                    <td className="py-3 flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: stu.avatarColor || '#38bdf8' }}
                      >
                        {stu.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{stu.name}</span>
                    </td>
                    <td className="py-3 font-mono text-[#9ff0ec]">{stu.usn || stu.rollNo}</td>
                    <td className="py-3 text-[#c9c3da]">{stu.department}</td>
                    <td className="py-3 font-mono text-white/80">{stu.classroomId}</td>
                    <td className="py-3 font-mono text-white/60">{stu.seatId || 'Assigned'}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => selectStudent(stu.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#006bff] text-[#9ff0ec] hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Zoom to Desk →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ACTIVE FLOOR & ROOM CUTAWAY INSPECTOR                   */}
      {/* ============================================================== */}
      {activeTab === 'inspector' && (
        <div className="rounded-2xl bg-[#131219]/90 border border-white/[0.12] shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.06)] p-6 sm:p-7 backdrop-blur-xl">
          {selectedClassroom ? (
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div>
                  <span className="text-xs font-bold text-[#9ff0ec] uppercase tracking-widest">
                    Level 4 Classroom Focus
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight mt-1">
                    {selectedClassroom.code || selectedClassroom.name}
                  </h3>
                  <p className="text-xs text-[#b9b8bb] mt-0.5">
                    {selectedClassroom.department} • Floor Level {selectedFloorLevel}
                  </p>
                </div>

                <button
                  onClick={() => selectFloor(selectedBuildingId, selectedFloorLevel)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  ← Back to Floor Cutaway
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-xs text-[#8e8d92] block font-mono">SEAT CAPACITY</span>
                  <span className="text-3xl font-black text-white mt-1 block">
                    {selectedClassroom.layout?.seats?.length || 24}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-xs text-[#8e8d92] block font-mono">SEATED STUDENTS</span>
                  <span className="text-3xl font-black text-emerald-400 mt-1 block">
                    {relevantStudents.length}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-xs text-[#8e8d92] block font-mono">FREE SEATS</span>
                  <span className="text-3xl font-black text-amber-400 mt-1 block">
                    {Math.max(0, (selectedClassroom.layout?.seats?.length || 24) - relevantStudents.length)}
                  </span>
                </div>
              </div>
            </div>
          ) : selectedFloor ? (
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Level 3 Isometric Floor Cutaway
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight mt-1">
                    {selectedBuilding?.name} • Floor {selectedFloor.level}
                  </h3>
                  <p className="text-xs text-[#b9b8bb] mt-0.5">
                    Showing interior classrooms from above with 3D benches and seated students.
                  </p>
                </div>

                <button
                  onClick={selectCampus}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                >
                  ← Full Campus Overview
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {selectedFloor.classrooms.map((room) => {
                  const rStudents = students.filter((s) => s.classroomId === room.id);
                  const totalSeats = room.layout?.seats?.length || 24;
                  const pct = Math.round((rStudents.length / totalSeats) * 100);

                  return (
                    <div
                      key={room.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 hover:border-[#6f5adc]/50 transition-all"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">{room.code || room.name}</h4>
                        <span className="text-xs text-[#8e8d92] block">{room.department}</span>
                        <span className="text-xs font-mono text-[#9ff0ec] mt-1 block">
                          {rStudents.length} / {totalSeats} seats ({pct}% full)
                        </span>
                      </div>

                      <button
                        onClick={() => selectClassroom(room.id)}
                        className="px-4 py-2 rounded-full bg-[#6f5adc] hover:bg-[#5e48cb] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Enter Room →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#8e8d92] text-xs">
              Tap any floor on the 3D building model above to open its cutaway view.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
