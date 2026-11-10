import React from 'react';
import { ChevronRight, Home, Building2, Layers, DoorOpen, User, RotateCcw } from 'lucide-react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import { BUILDINGS_CONFIG, findClassroomHierarchy } from '../../config/buildings.config.js';

export function TwinNavigationBreadcrumb() {
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const students = useTwin3DStore((s) => s.students);

  const selectCampus = useTwin3DStore((s) => s.selectCampus);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);

  const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
  const currentFloor = building?.floors?.find((f) => f.level === selectedFloorLevel);
  const floorClassrooms = currentFloor?.classrooms || [];
  const classroomHierarchy = selectedClassroomId ? findClassroomHierarchy(selectedClassroomId) : null;
  const classroom = classroomHierarchy?.classroom;
  const student = selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e111a]/90 border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md text-xs font-medium text-[#b9b8bb] select-none max-w-full overflow-x-auto">
      {/* Root Campus */}
      <button
        onClick={selectCampus}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer ${
          !selectedBuildingId
            ? 'bg-white/[0.12] text-white font-semibold border border-white/20'
            : 'hover:text-white hover:bg-white/5'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Campus</span>
      </button>

      {/* Building Level */}
      {building && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <button
            onClick={() => selectBuilding(building.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedBuildingId && !selectedFloorLevel && !selectedClassroomId
                ? 'bg-white/[0.12] text-white font-semibold border border-white/20'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{building.name}</span>
          </button>
        </>
      )}

      {/* Floor Level */}
      {building && selectedFloorLevel && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <button
            onClick={() => selectFloor(building.id, selectedFloorLevel)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFloorLevel && !selectedClassroomId
                ? 'bg-white/[0.12] text-white font-semibold border border-white/20'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor {selectedFloorLevel}</span>
          </button>
        </>
      )}

      {/* Quick Class View Pills when on Floor Level (Allows Instant Jump to Class View) */}
      {building && selectedFloorLevel && floorClassrooms.length > 0 && !selectedClassroomId && (
        <div className="flex items-center gap-1 pl-1 ml-1 border-l border-white/20">
          <span className="text-[10px] text-white/50 font-mono">Classes:</span>
          {floorClassrooms.map((cr) => (
            <button
              key={cr.id}
              onClick={() => selectClassroom(cr.id)}
              className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#006bff]/20 text-[10px] font-mono text-[#9ff0ec] border border-white/10 hover:border-[#9ff0ec]/30 transition-colors cursor-pointer shadow-sm"
              title={`Switch to Class View: ${cr.code || cr.name}`}
            >
              {cr.code || cr.name}
            </button>
          ))}
        </div>
      )}

      {/* Classroom Level */}
      {classroom && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.12] text-white font-semibold border border-white/20 shadow-sm">
            <DoorOpen className="w-3.5 h-3.5 text-[#9ff0ec]" />
            <span>Class {classroom.code || classroom.name}</span>
          </div>
          {/* Quick peer classroom switchers */}
          {floorClassrooms
            .filter((c) => c.id !== classroom.id)
            .map((c) => (
              <button
                key={c.id}
                onClick={() => selectClassroom(c.id)}
                className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-[10px] font-mono text-[#b9b8bb] hover:text-white transition-colors cursor-pointer"
                title={`Switch to ${c.code || c.name}`}
              >
                {c.code || c.name}
              </button>
            ))}
        </>
      )}

      {/* Student Level */}
      {student && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.12] text-white font-semibold border border-white/20 shadow-sm">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: student.avatarColor || '#38bdf8' }}
            />
            <User className="w-3.5 h-3.5 text-[#9ff0ec]" />
            <span>{student.name}</span>
          </div>
        </>
      )}

      {/* Reset view shortcut if navigated */}
      {selectedBuildingId && (
        <button
          onClick={selectCampus}
          title="Reset to campus overview"
          className="ml-1 p-1 rounded-lg hover:bg-white/10 text-[#c9c3da] hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default TwinNavigationBreadcrumb;
