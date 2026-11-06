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
  const classroomHierarchy = selectedClassroomId ? findClassroomHierarchy(selectedClassroomId) : null;
  const classroom = classroomHierarchy?.classroom;
  const student = selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null;

  return (
    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#131219]/90 border border-white/[0.14] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs font-medium text-[#b9b8bb] select-none max-w-full overflow-x-auto">
      {/* Root Campus */}
      <button
        onClick={selectCampus}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
          !selectedBuildingId
            ? 'bg-[#006bff]/20 text-[#9ff0ec] font-semibold border border-[#9ff0ec]/30'
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
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedBuildingId && !selectedFloorLevel && !selectedClassroomId
                ? 'bg-[#006bff]/20 text-[#9ff0ec] font-semibold border border-[#9ff0ec]/30'
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
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedFloorLevel && !selectedClassroomId
                ? 'bg-[#006bff]/20 text-[#9ff0ec] font-semibold border border-[#9ff0ec]/30'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor {selectedFloorLevel}</span>
          </button>
        </>
      )}

      {/* Classroom Level */}
      {classroom && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <button
            onClick={() => selectClassroom(classroom.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedClassroomId && !selectedStudentId
                ? 'bg-[#006bff]/20 text-[#9ff0ec] font-semibold border border-[#9ff0ec]/30'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>{classroom.code || classroom.name}</span>
          </button>
        </>
      )}

      {/* Student Level */}
      {student && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#006bff]/30 text-[#9ff0ec] font-semibold border border-[#9ff0ec]/40">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: student.avatarColor || '#38bdf8' }}
            />
            <User className="w-3.5 h-3.5" />
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

