import React, { useState, useEffect, useMemo } from 'react';
import { X, UserPlus, AlertCircle, Check } from 'lucide-react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import { PROCESSED_BUILDINGS, findClassroomHierarchy } from '../../config/buildings.config.js';

const COLOR_OPTIONS = [
  '#38bdf8', // Sky
  '#34d399', // Emerald
  '#f472b6', // Rose
  '#a78bfa', // Lavender
  '#fbbf24', // Amber
  '#fb7185', // Coral
  '#2dd4bf', // Teal
  '#818cf8'  // Indigo
];

export function AddStudentModal() {
  const isAddModalOpen = useTwin3DStore((s) => s.isAddModalOpen);
  const targetSeatForAdd = useTwin3DStore((s) => s.targetSeatForAdd);
  const closeAddModal = useTwin3DStore((s) => s.closeAddModal);
  const addStudent = useTwin3DStore((s) => s.addStudent);
  const students = useTwin3DStore((s) => s.students);

  // Form State
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [section, setSection] = useState('A');
  const [classroomId, setClassroomId] = useState('MB-101');
  const [selectedSeatId, setSelectedSeatId] = useState('');
  const [avatarColor, setAvatarColor] = useState(COLOR_OPTIONS[0]);
  const [error, setError] = useState('');

  // Collect all available classrooms in campus
  const allClassrooms = useMemo(() => {
    const list = [];
    PROCESSED_BUILDINGS.forEach((b) => {
      b.floors.forEach((f) => {
        f.classrooms.forEach((r) => {
          list.push({
            id: r.id,
            name: `${b.code} - ${r.code || r.name} (Fl ${f.level})`,
            buildingId: b.id,
            floorLevel: f.level,
            room: r
          });
        });
      });
    });
    return list;
  }, []);

  // Set default classroom from targetSeatForAdd if present
  useEffect(() => {
    if (targetSeatForAdd?.classroomId) {
      setClassroomId(targetSeatForAdd.classroomId);
    }
  }, [targetSeatForAdd]);

  // Compute available (vacant) seats for the chosen classroom
  const availableSeats = useMemo(() => {
    const hierarchy = findClassroomHierarchy(classroomId);
    if (!hierarchy || !hierarchy.classroom?.layout?.seats) return [];

    const occupiedSeatIds = new Set(students.map((s) => s.seatId));
    return hierarchy.classroom.layout.seats.filter((seat) => !occupiedSeatIds.has(seat.id));
  }, [classroomId, students]);

  // Update selected seat when available seats change
  useEffect(() => {
    if (targetSeatForAdd?.seatId && availableSeats.some((s) => s.id === targetSeatForAdd.seatId)) {
      setSelectedSeatId(targetSeatForAdd.seatId);
    } else if (availableSeats.length > 0) {
      setSelectedSeatId(availableSeats[0].id);
    } else {
      setSelectedSeatId('');
    }
  }, [classroomId, availableSeats, targetSeatForAdd]);

  if (!isAddModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter student name.');
      return;
    }
    if (!usn.trim()) {
      setError('Please enter student USN / Roll number.');
      return;
    }

    // Check duplicate USN
    if (students.some((s) => (s.usn || s.rollNo || '').toUpperCase() === usn.trim().toUpperCase())) {
      setError(`USN "${usn.trim()}" is already registered on campus.`);
      return;
    }

    if (!selectedSeatId) {
      setError(`No vacant seats available in room ${classroomId}. Please choose another room.`);
      return;
    }

    const hierarchy = findClassroomHierarchy(classroomId);
    const chosenSeat = hierarchy.classroom.layout.seats.find((s) => s.id === selectedSeatId);
    if (!chosenSeat) {
      setError('Invalid seat selection.');
      return;
    }

    try {
      addStudent({
        name: name.trim(),
        rollNo: usn.trim(),
        usn: usn.trim(),
        department,
        year,
        section,
        avatarColor,
        buildingId: hierarchy.building.id,
        floorLevel: hierarchy.floor.level,
        classroomId: hierarchy.classroom.id,
        benchId: chosenSeat.benchId,
        seatId: chosenSeat.id,
        seatIndex: chosenSeat.seatIndex,
        row: chosenSeat.row,
        column: chosenSeat.column
      });
      closeAddModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md rounded-2xl bg-[#131219] border border-white/[0.14] shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-5 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006bff]/20 border border-[#006bff]/40 flex items-center justify-center text-[#9ff0ec]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Assign Student to Seat</h3>
              <p className="text-xs text-[#c9c3da]">Add to live 3D campus digital twin roster</p>
            </div>
          </div>
          <button
            onClick={closeAddModal}
            className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#9ff0ec]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">USN / Roll No</label>
              <input
                type="text"
                placeholder="e.g. 1BI22CS088"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#9ff0ec]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#9ff0ec]/50"
              >
                <option value="Computer Science">CSE</option>
                <option value="AI & Machine Learning">AIML</option>
                <option value="Electronics & Comm">ECE</option>
                <option value="Mechanical Engg">MECH</option>
                <option value="Civil Engineering">CIVIL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#9ff0ec]/50"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#9ff0ec]/50"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c9c3da] mb-1.5">Target Classroom</label>
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#9ff0ec]/50"
            >
              {allClassrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#c9c3da]">Seat Assignment</label>
              <span className="text-[11px] font-mono text-[#9ff0ec]">
                {availableSeats.length} vacant seats
              </span>
            </div>
            <select
              value={selectedSeatId}
              onChange={(e) => setSelectedSeatId(e.target.value)}
              disabled={availableSeats.length === 0}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#9ff0ec]/50 disabled:opacity-50"
            >
              {availableSeats.length === 0 ? (
                <option value="">No vacant seats in this classroom</option>
              ) : (
                availableSeats.map((s) => (
                  <option key={s.id} value={s.id}>
                    Row {s.row + 1}, Bench {s.column + 1} • Seat {s.seatIndex + 1}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#c9c3da] mb-2">Avatar Color</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className={`w-7 h-7 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                    avatarColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#131219] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {avatarColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[#c9c3da] text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableSeats.length === 0}
              className="px-5 py-2 rounded-xl bg-[#006bff] hover:bg-[#0058d4] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-[0_4px_16px_rgba(0,107,255,0.4)] cursor-pointer"
            >
              Seat Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

