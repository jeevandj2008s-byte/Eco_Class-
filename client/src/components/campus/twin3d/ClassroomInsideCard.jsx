import React from 'react';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { findClassroomHierarchy } from '../../../config/buildings.config.js';

export function ClassroomInsideCard() {
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);
  const students = useTwin3DStore((s) => s.students);

  if (!selectedClassroomId) return null;

  const hierarchy = findClassroomHierarchy(selectedClassroomId);
  if (!hierarchy) return null;

  const { building, floor, classroom } = hierarchy;
  const roomStudents = students.filter((s) => s.classroomId === selectedClassroomId);
  const totalSeats = classroom.layout?.seats?.length || 24;
  const occupiedSeats = roomStudents.length;
  const freeSeats = Math.max(0, totalSeats - occupiedSeats);

  const selectedStudent = selectedStudentId
    ? students.find((s) => s.id === selectedStudentId)
    : null;

  return (
    <div className="absolute bottom-6 left-6 z-30 max-w-md bg-[#10131d]/95 border border-white/20 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9ff0ec] animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9ff0ec]">
            {building.shortName || building.name} • Level {floor.level}
          </span>
        </div>

        <button
          onClick={() => selectFloor(building.id, floor.level)}
          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#006bff] hover:text-white border border-white/15 text-[11px] font-mono text-[#c9c3da] transition-all flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Floor Cutaway</span>
        </button>
      </div>

      {/* Room Name & Category */}
      <div className="mt-3">
        <h4 className="text-lg font-black text-white tracking-tight leading-snug">
          {classroom.code || classroom.name}
        </h4>
        <div className="text-xs text-[#c9c3da] font-mono mt-0.5">
          {classroom.department || 'Academic Department'}
        </div>
      </div>

      {/* Seating Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center font-mono">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#8e8d92] block">Capacity</span>
          <span className="text-sm font-bold text-white">{totalSeats}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#8e8d92] block">Occupied</span>
          <span className="text-sm font-bold text-emerald-400">{occupiedSeats}</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-[#8e8d92] block">Free Seats</span>
          <span className="text-sm font-bold text-[#9ff0ec]">{freeSeats}</span>
        </div>
      </div>

      {/* Selected Student Details Card (If student is clicked) */}
      {selectedStudent && (
        <div className="mt-3.5 p-3 rounded-2xl bg-[#006bff]/15 border border-[#9ff0ec]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/30"
              style={{ backgroundColor: selectedStudent.avatarColor }}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white">{selectedStudent.name}</span>
              <span className="text-[10px] font-mono text-[#9ff0ec]">
                {selectedStudent.usn || selectedStudent.rollNo} • {selectedStudent.year}
              </span>
            </div>
          </div>

          <button
            onClick={() => selectStudent(null)}
            className="text-[10px] text-white/60 hover:text-white font-mono px-2 py-1 rounded bg-white/10"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
