import React, { useState, useMemo } from 'react';
import {
  User,
  MapPin,
  GraduationCap,
  Trash2,
  MoveRight,
  X,
  UserPlus,
  Search,
  Zap,
  DoorOpen,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle2
} from 'lucide-react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import { findClassroomHierarchy, BUILDINGS_CONFIG } from '../../config/buildings.config.js';

export function TwinRightPanel({ telemetry }) {
  const [isOpen, setIsOpen] = useState(true);
  const [rosterSearch, setRosterSearch] = useState('');

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);

  const students = useTwin3DStore((s) => s.students);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);
  const removeStudent = useTwin3DStore((s) => s.removeStudent);
  const openAddModal = useTwin3DStore((s) => s.openAddModal);

  // Selected student
  const student = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  // Selected classroom
  const classroomHierarchy = useMemo(() => {
    return selectedClassroomId ? findClassroomHierarchy(selectedClassroomId) : null;
  }, [selectedClassroomId]);

  // Students in selected classroom
  const roomStudents = useMemo(() => {
    if (!selectedClassroomId) return [];
    return students.filter((s) => s.classroomId === selectedClassroomId);
  }, [students, selectedClassroomId]);

  const filteredRoomStudents = useMemo(() => {
    if (!rosterSearch.trim()) return roomStudents;
    const q = rosterSearch.toLowerCase();
    return roomStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.usn?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q)
    );
  }, [roomStudents, rosterSearch]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-16 right-4 z-20 p-2.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] text-[#9ff0ec] hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all cursor-pointer"
        title="Open Details Inspector"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="absolute top-16 right-4 bottom-20 w-80 z-20 flex flex-col rounded-2xl bg-[#131219]/90 border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl select-none animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-bold text-white tracking-tight">
          {student ? 'Student Profile' : classroomHierarchy ? 'Classroom Roster' : 'Campus Overview'}
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-[#b9b8bb] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <PanelRightClose className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* CASE 1: Student Selected */}
        {student ? (
          <div className="space-y-4">
            {/* Student Header Card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-lg"
                style={{ backgroundColor: student.avatarColor || '#38bdf8' }}
              >
                {student.name.charAt(0)}
              </div>
              <div className="truncate flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight truncate">{student.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-mono text-[#9ff0ec]">{student.usn || student.rollNo}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Present
                  </span>
                </div>
              </div>
            </div>

            {/* Department & Academic Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 text-[#c9c3da]">
                <span>Department</span>
                <span className="font-semibold text-white">{student.department}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 text-[#c9c3da]">
                <span>Academic Year</span>
                <span className="font-semibold text-white">{student.year} (Sec {student.section})</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 text-[#c9c3da]">
                <span>Classroom</span>
                <span className="font-semibold text-[#9ff0ec]">{student.classroomId}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 text-[#c9c3da]">
                <span>Seat Allocation</span>
                <span className="font-mono text-white">
                  Row {(student.row ?? 0) + 1}, Bench #{(student.column ?? 0) + 1} • Seat {(student.seatIndex ?? 0) + 1}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  removeStudent(student.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Unenroll Student</span>
              </button>
            </div>
          </div>
        ) : classroomHierarchy ? (
          /* CASE 2: Classroom Selected */
          <div className="space-y-4">
            {/* Room Info Card */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {classroomHierarchy.classroom.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#006bff]/20 text-[#9ff0ec] border border-[#9ff0ec]/30">
                  {classroomHierarchy.classroom.code}
                </span>
              </div>

              <div className="text-xs text-[#c9c3da]">
                {classroomHierarchy.classroom.department} • Floor {classroomHierarchy.floor.level}
              </div>

              {/* Occupancy Bar */}
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#b9b8bb]">Occupancy</span>
                  <span className="text-[#9ff0ec] font-bold">
                    {roomStudents.length} / {classroomHierarchy.classroom.layout?.seats?.length || 0} seats
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#006bff] to-[#9ff0ec] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (roomStudents.length / (classroomHierarchy.classroom.layout?.seats?.length || 1)) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action: Add Student */}
            <button
              onClick={() => openAddModal({ classroomId: classroomHierarchy.classroom.id })}
              className="w-full py-2 px-3 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_2px_12px_rgba(0,107,255,0.4)] cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Seat Student in {classroomHierarchy.classroom.code}</span>
            </button>

            {/* Students Roster Search */}
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter seated students..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#9ff0ec]/50"
                />
              </div>

              {/* Roster List */}
              <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredRoomStudents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#b9b8bb]">
                    No students currently seated.
                  </div>
                ) : (
                  filteredRoomStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => selectStudent(s.id)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all cursor-pointer border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: s.avatarColor || '#38bdf8' }}
                        />
                        <div className="truncate leading-tight">
                          <div className="text-xs font-semibold text-white truncate">{s.name}</div>
                          <div className="text-[10px] text-[#9ff0ec] font-mono">{s.usn || s.rollNo}</div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-[#c9c3da] flex-shrink-0">
                        R{(s.row ?? 0) + 1}:S{(s.seatIndex ?? 0) + 1}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* CASE 3: Campus Overview */
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Campus Roster Stats</span>
                <span className="text-[10px] font-mono text-[#9ff0ec]">Live Telemetry</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                  <div className="text-lg font-bold text-white font-mono">{students.length}</div>
                  <div className="text-[10px] text-[#c9c3da]">Students Seated</div>
                </div>
                <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                  <div className="text-lg font-bold text-[#9ff0ec] font-mono">
                    {Math.round((students.length / 320) * 100)}%
                  </div>
                  <div className="text-[10px] text-[#c9c3da]">Campus Capacity</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white">Navigation Instructions</span>
              <ul className="text-xs text-[#c9c3da] space-y-1.5 list-disc pl-4">
                <li>Click any building to zoom into its interior.</li>
                <li>Toggle <strong className="text-white">X-Ray</strong> to look through outer walls.</li>
                <li>Use <strong className="text-white">Explode</strong> to slide floors vertically apart.</li>
                <li>Click any classroom to enter and view student benches.</li>
                <li>Click any student to view USN and seat position.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

