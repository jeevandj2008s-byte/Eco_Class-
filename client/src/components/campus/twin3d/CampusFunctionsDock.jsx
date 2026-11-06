import React, { useState, useMemo } from 'react';
import {
  Building2,
  Layers,
  Users,
  Eye,
  Sliders,
  Tag,
  Activity,
  UserPlus,
  Upload,
  Download,
  RotateCcw,
  Search,
  ChevronRight,
  ChevronDown,
  DoorOpen,
  Zap,
  BarChart3,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { PROCESSED_BUILDINGS, findClassroomHierarchy } from '../../../config/buildings.config.js';

export function CampusFunctionsDock({ telemetry }) {
  const [activeTab, setActiveTab] = useState('hierarchy'); // 'hierarchy' | 'controls' | 'telemetry' | 'inspector'
  const [search, setSearch] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [expandedBuildings, setExpandedBuildings] = useState({ 'bit-main': true });
  const [expandedFloors, setExpandedFloors] = useState({ 'bit-main-1': true });

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
  const showStudents = useTwin3DStore((s) => s.showStudents);
  const setShowStudents = useTwin3DStore((s) => s.setShowStudents);
  const animateStudents = useTwin3DStore((s) => s.animateStudents);
  const setAnimateStudents = useTwin3DStore((s) => s.setAnimateStudents);

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

  // Selected building and floor
  const selectedBuilding = PROCESSED_BUILDINGS.find((b) => b.id === selectedBuildingId);
  const selectedFloor = selectedBuilding?.floors?.find((f) => f.level === selectedFloorLevel);
  const selectedClassroom = selectedClassroomId ? findClassroomHierarchy(selectedClassroomId)?.classroom : null;
  const selectedStudent = selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null;

  const toggleBuilding = (bId) => {
    setExpandedBuildings((prev) => ({ ...prev, [bId]: !prev[bId] }));
  };

  const toggleFloor = (fKey) => {
    setExpandedFloors((prev) => ({ ...prev, [fKey]: !prev[fKey] }));
  };

  // Filter hierarchy
  const filteredBuildings = useMemo(() => {
    if (!search.trim()) return PROCESSED_BUILDINGS;
    const q = search.toLowerCase();
    return PROCESSED_BUILDINGS.map((b) => {
      const matchB = b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q);
      const filteredFloors = b.floors.map((f) => {
        const matchF = f.name?.toLowerCase().includes(q);
        const filteredRooms = f.classrooms.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            r.department?.toLowerCase().includes(q)
        );
        return { ...f, classrooms: matchB || matchF ? f.classrooms : filteredRooms };
      });
      const hasRooms = filteredFloors.some((f) => f.classrooms.length > 0);
      return matchB || hasRooms ? { ...b, floors: filteredFloors } : null;
    }).filter(Boolean);
  }, [search]);

  // Students in selected classroom or building
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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 select-none animate-fade-in">
      {/* 1. Master Tab Bar Arranged Under 3D Map */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 p-2 rounded-2xl bg-[#131219]/90 border border-white/[0.14] backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hierarchy'
                ? 'bg-[#006bff] text-white shadow-[0_0_16px_rgba(0,107,255,0.5)] font-bold'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'controls'
                ? 'bg-[#006bff] text-white shadow-[0_0_16px_rgba(0,107,255,0.5)] font-bold'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>3D Studio Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#006bff] text-white shadow-[0_0_16px_rgba(0,107,255,0.5)] font-bold'
                : 'text-[#b9b8bb] hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry & Roster</span>
          </button>

          {(selectedFloorLevel !== null || selectedClassroomId !== null) && (
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-amber-500 text-black shadow-[0_0_16px_rgba(245,158,11,0.5)] font-bold'
                  : 'text-amber-400 hover:text-white hover:bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <DoorOpen className="w-4 h-4" />
              <span>
                {selectedClassroom
                  ? `Room: ${selectedClassroom.code || selectedClassroom.name}`
                  : `Floor ${selectedFloorLevel} Cutaway`}
              </span>
            </button>
          )}
        </div>

        {/* Global Quick Action: Reset Campus View */}
        <div className="flex items-center gap-2">
          {selectedBuildingId && (
            <button
              onClick={selectCampus}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[#9ff0ec] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Full Campus</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB CONTENT PANELS */}
      <div className="w-full rounded-3xl bg-[#10131d]/90 border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl min-h-[280px]">
        {/* TAB 1: CAMPUS HIERARCHY */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Campus Architectural Hierarchy
                </h3>
                <p className="text-xs text-[#8e8d92] mt-0.5">
                  Select any building, floor or classroom to smoothly fly the 3D camera into its geometry.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search blocks, rooms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#9ff0ec]"
                />
              </div>
            </div>

            {/* Buildings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredBuildings.map((b) => {
                const isBSelected = selectedBuildingId === b.id;
                const isExpanded = !!expandedBuildings[b.id];
                const bStudents = students.filter((s) => s.buildingId === b.id);

                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl border transition-all p-4 flex flex-col justify-between ${
                      isBSelected
                        ? 'bg-[#006bff]/15 border-[#006bff] shadow-[0_0_24px_rgba(0,107,255,0.3)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                    }`}
                  >
                    <div>
                      {/* Building Header */}
                      <div className="flex items-center justify-between">
                        <div
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-white shadow-sm"
                          style={{ backgroundColor: b.accentColor || '#38bdf8' }}
                        >
                          {b.code || b.shortName}
                        </div>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">
                          {b.baselineKw} kW
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white tracking-tight mt-2 leading-snug">
                        {b.name}
                      </h4>
                      <div className="text-[11px] text-[#8e8d92] font-mono mt-0.5">
                        {b.floorCount} Floors • {bStudents.length} Students
                      </div>
                    </div>

                    {/* Actions & Floor List Toggle */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => selectBuilding(b.id)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <span>Focus Block</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleBuilding(b.id)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        title="Toggle Floor Tree"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expandable Floor & Room List */}
                    {isExpanded && (
                      <div className="mt-3 pt-2 border-t border-white/5 space-y-2">
                        {b.floors.map((fl) => (
                          <div key={fl.level} className="text-xs">
                            <div
                              onClick={() => selectFloor(b.id, fl.level)}
                              className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                                selectedBuildingId === b.id && selectedFloorLevel === fl.level
                                  ? 'bg-[#006bff]/30 text-white font-bold border border-[#006bff]'
                                  : 'hover:bg-white/5 text-[#c9c3da]'
                              }`}
                            >
                              <span className="font-mono text-[11px]">Floor {fl.level} Cutaway</span>
                              <span className="text-[10px] text-[#8e8d92]">
                                {fl.classrooms?.length || 0} Rooms →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 3D STUDIO CONTROLS */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                3D Scene Studio & Visual Controls
              </h3>
              <p className="text-xs text-[#8e8d92] mt-0.5">
                Toggle cutaway visualization modes, floor explosion height, and student dataset actions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. X-Ray Mode Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">X-Ray Cutaway Mode</span>
                    <Eye className="w-4 h-4 text-[#9ff0ec]" />
                  </div>
                  <p className="text-[11px] text-[#8e8d92] mt-1">
                    Opens floor slabs and exterior walls to inspect all classroom layouts simultaneously.
                  </p>
                </div>
                <button
                  onClick={() => setXrayMode()}
                  className={`mt-4 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    xrayMode
                      ? 'bg-[#006bff] text-white shadow-[0_0_16px_rgba(0,107,255,0.6)] font-bold'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{xrayMode ? 'X-Ray Enabled' : 'Enable X-Ray'}</span>
                </button>
              </div>

              {/* 2. Exploded View Slider Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Exploded Floor Slider</span>
                    <span className="text-xs font-mono text-[#9ff0ec] font-bold">
                      {explodedHeight.toFixed(1)}x
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8e8d92] mt-1">
                    Slides floor slabs vertically apart into an architectural exploded axonometric drawing.
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="4.0"
                    step="0.2"
                    value={explodedHeight}
                    onChange={(e) => setExplodedHeight(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#9ff0ec]"
                  />
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => setExplodedHeight(0)}
                      className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                    >
                      Reset (0)
                    </button>
                    <button
                      onClick={() => setExplodedHeight(1.5)}
                      className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                    >
                      Split (1.5x)
                    </button>
                    <button
                      onClick={() => setExplodedHeight(3.0)}
                      className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da]"
                    >
                      Expanded (3x)
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Billboard Labels Toggle */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Billboard Block Labels</span>
                    <Tag className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-[#8e8d92] mt-1">
                    Toggles 3D floating title cards and occupancy badges above campus buildings.
                  </p>
                </div>
                <button
                  onClick={() => setShowLabels()}
                  className={`mt-4 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    showLabels
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{showLabels ? 'Labels Visible' : 'Labels Hidden'}</span>
                </button>
              </div>
            </div>

            {/* Student & Dataset Actions */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 text-[#9ff0ec]">
                Dataset & Student Roster Operations
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => openAddModal()}
                  className="px-4 py-2 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Student to Seat</span>
                </button>

                <button
                  onClick={() => openImportModal()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Bulk CSV Import</span>
                </button>

                <button
                  onClick={exportJson}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={resetToSeedData}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>Reset Seed Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & ROSTER */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Live Telemetry & Student Roster
                </h3>
                <p className="text-xs text-[#8e8d92] mt-0.5">
                  {students.length} total students enrolled across 8 campus blocks.
                </p>
              </div>

              {/* Roster Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Filter by name, USN..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#9ff0ec]"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#8e8d92] font-mono text-[10px]">
                    <th className="pb-2">STUDENT</th>
                    <th className="pb-2">USN</th>
                    <th className="pb-2">DEPARTMENT</th>
                    <th className="pb-2">CLASSROOM</th>
                    <th className="pb-2">ACTION</th>
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
                      <td className="py-2.5 flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-white"
                          style={{ backgroundColor: stu.avatarColor || '#38bdf8' }}
                        >
                          {stu.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{stu.name}</span>
                      </td>
                      <td className="py-2.5 font-mono text-[#9ff0ec]">{stu.usn || stu.rollNo}</td>
                      <td className="py-2.5 text-[#c9c3da]">{stu.department}</td>
                      <td className="py-2.5 font-mono text-white/80">{stu.classroomId}</td>
                      <td className="py-2.5">
                        <button
                          onClick={() => selectStudent(stu.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#006bff]/20 hover:bg-[#006bff] text-[#9ff0ec] hover:text-white border border-[#006bff]/40 text-[10px] font-mono transition-all cursor-pointer"
                        >
                          Zoom in 3D
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVE FLOOR / ROOM INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            {selectedClassroom ? (
              // Classroom Inside Details
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#9ff0ec] uppercase">
                      Classroom Inspection Mode
                    </span>
                    <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                      {selectedClassroom.code || selectedClassroom.name}
                    </h3>
                    <p className="text-xs text-[#8e8d92]">
                      {selectedClassroom.department} • Floor {selectedFloorLevel}
                    </p>
                  </div>

                  <button
                    onClick={() => selectFloor(selectedBuildingId, selectedFloorLevel)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
                  >
                    ← Back to Floor Cutaway
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4 text-center font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#8e8d92] block">Capacity</span>
                    <span className="text-base font-bold text-white">
                      {selectedClassroom.layout?.seats?.length || 24} Seats
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#8e8d92] block">Occupied</span>
                    <span className="text-base font-bold text-emerald-400">
                      {relevantStudents.length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#8e8d92] block">Available</span>
                    <span className="text-base font-bold text-amber-400">
                      {Math.max(0, (selectedClassroom.layout?.seats?.length || 24) - relevantStudents.length)}
                    </span>
                  </div>
                </div>
              </div>
            ) : selectedFloor ? (
              // Floor Cutaway Details
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                      Isometric Floor Cutaway
                    </span>
                    <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                      {selectedBuilding?.name} • Level {selectedFloor.level}
                    </h3>
                    <p className="text-xs text-[#8e8d92]">
                      Upper floors lifted away. Showing open classrooms from above.
                    </p>
                  </div>

                  <button
                    onClick={selectCampus}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
                  >
                    ← Back to Full Campus
                  </button>
                </div>

                {/* Classrooms on this floor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {selectedFloor.classrooms.map((room) => {
                    const rStudents = students.filter((s) => s.classroomId === room.id);
                    const totalSeats = room.layout?.seats?.length || 24;
                    const pct = Math.round((rStudents.length / totalSeats) * 100);

                    return (
                      <div
                        key={room.id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">{room.code || room.name}</h4>
                          <span className="text-[10px] text-[#8e8d92] block">{room.department}</span>
                          <span className="text-[10px] font-mono text-[#9ff0ec]">
                            {rStudents.length} / {totalSeats} seats ({pct}%)
                          </span>
                        </div>

                        <button
                          onClick={() => selectClassroom(room.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
                        >
                          Enter Room
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#8e8d92] text-xs">
                Select any floor on the 3D map or Campus Hierarchy to inspect its interior.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
