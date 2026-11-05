/**
 * Zustand Store for AuraSync 3D Digital Twin
 * Manages spatial hierarchy navigation, visual modes (X-ray, exploded view),
 * camera targets, student roster persistence, and architectural interior showcase.
 */

import { create } from 'zustand';
import { PROCESSED_BUILDINGS, findClassroomHierarchy } from '../config/buildings.config.js';
import { getInitialStudents, saveStudentsToStorage, generateSeedStudents } from '../utils/seedStudents.js';

export const useTwin3DStore = create((set, get) => ({
  // Navigation & Spatial Hierarchy
  selectedBuildingId: null,
  selectedFloorLevel: null,
  selectedClassroomId: null,
  selectedStudentId: null,
  hoveredStudentId: null,
  hoveredClassroomId: null,
  cameraMode: 'CAMPUS', // 'CAMPUS' | 'BUILDING' | 'FLOOR' | 'CLASSROOM' | 'STUDENT'

  // Visual Controls
  xrayMode: false,
  explodedHeight: 0, // 0 = closed, up to 6 = fully exploded
  showStudents: true,
  animateStudents: true,
  showHeatmap: false,
  showLabels: true,

  // Student State
  students: getInitialStudents(),

  // Active Modals & Luxury Interior Showcase
  isAddModalOpen: false,
  isImportModalOpen: false,
  isRoomShowcaseOpen: false,
  targetSeatForAdd: null, // { classroomId, benchId, seatIndex, seatId }

  // Action: Setters for Modals & Showcase
  openAddModal: (targetSeat = null) => set({ isAddModalOpen: true, targetSeatForAdd: targetSeat }),
  closeAddModal: () => set({ isAddModalOpen: false, targetSeatForAdd: null }),
  openImportModal: () => set({ isImportModalOpen: true }),
  closeImportModal: () => set({ isImportModalOpen: false }),

  openRoomShowcase: (classroomId) => {
    const hierarchy = findClassroomHierarchy(classroomId);
    set({
      selectedBuildingId: hierarchy ? hierarchy.building.id : get().selectedBuildingId,
      selectedFloorLevel: hierarchy ? hierarchy.floor.level : get().selectedFloorLevel,
      selectedClassroomId: classroomId,
      isRoomShowcaseOpen: true,
      cameraMode: 'CLASSROOM'
    });
  },
  closeRoomShowcase: () => set({ isRoomShowcaseOpen: false, selectedClassroomId: null }),

  // Action: Hover
  setHoveredStudentId: (id) => set({ hoveredStudentId: id }),
  setHoveredClassroomId: (id) => set({ hoveredClassroomId: id }),

  // Action: Visual Modes
  setXrayMode: (enabled) => set((s) => ({ xrayMode: typeof enabled === 'boolean' ? enabled : !s.xrayMode })),
  setExplodedHeight: (val) => set({ explodedHeight: Math.max(0, Math.min(6, val)) }),
  setShowStudents: (val) => set((s) => ({ showStudents: typeof val === 'boolean' ? val : !s.showStudents })),
  setAnimateStudents: (val) => set((s) => ({ animateStudents: typeof val === 'boolean' ? val : !s.animateStudents })),
  setShowHeatmap: (val) => set((s) => ({ showHeatmap: typeof val === 'boolean' ? val : !s.showHeatmap })),
  setShowLabels: (val) => set((s) => ({ showLabels: typeof val === 'boolean' ? val : !s.showLabels })),

  // Action: Navigation Hierarchy
  selectCampus: () => {
    set({
      selectedBuildingId: null,
      selectedFloorLevel: null,
      selectedClassroomId: null,
      selectedStudentId: null,
      isRoomShowcaseOpen: false,
      cameraMode: 'CAMPUS'
    });
  },

  selectBuilding: (buildingId) => {
    set({
      selectedBuildingId: buildingId,
      selectedFloorLevel: null,
      selectedClassroomId: null,
      selectedStudentId: null,
      isRoomShowcaseOpen: false,
      cameraMode: 'BUILDING'
    });
  },

  selectFloor: (buildingId, floorLevel) => {
    set({
      selectedBuildingId: buildingId,
      selectedFloorLevel: floorLevel,
      selectedClassroomId: null,
      selectedStudentId: null,
      isRoomShowcaseOpen: false,
      cameraMode: 'FLOOR'
    });
  },

  selectClassroom: (classroomId) => {
    const hierarchy = findClassroomHierarchy(classroomId);
    if (!hierarchy) return;
    set({
      selectedBuildingId: hierarchy.building.id,
      selectedFloorLevel: hierarchy.floor.level,
      selectedClassroomId: classroomId,
      selectedStudentId: null,
      isRoomShowcaseOpen: true,
      cameraMode: 'CLASSROOM'
    });
  },

  selectStudent: (studentId) => {
    const student = get().students.find((s) => s.id === studentId);
    if (!student) return;
    set({
      selectedBuildingId: student.buildingId,
      selectedFloorLevel: student.floorLevel,
      selectedClassroomId: student.classroomId,
      selectedStudentId: studentId,
      cameraMode: 'STUDENT'
    });
  },

  // Action: Student CRUD
  addStudent: (studentData) => {
    const state = get();
    // Validate seat availability
    const isOccupied = state.students.some((s) => s.seatId === studentData.seatId);
    if (isOccupied) {
      throw new Error(`Seat ${studentData.seatId} is already occupied by another student.`);
    }

    const newStudent = {
      ...studentData,
      id: studentData.id || `stu-${studentData.seatId}-${Date.now().toString(36)}`,
      status: studentData.status || 'PRESENT',
      joinedAt: new Date().toISOString()
    };

    const updated = [...state.students, newStudent];
    saveStudentsToStorage(updated);
    set({ students: updated, isAddModalOpen: false, targetSeatForAdd: null });
    return newStudent;
  },

  updateStudent: (studentId, updates) => {
    const state = get();
    const updated = state.students.map((s) => (s.id === studentId ? { ...s, ...updates } : s));
    saveStudentsToStorage(updated);
    set({ students: updated });
  },

  removeStudent: (studentId) => {
    const state = get();
    const updated = state.students.filter((s) => s.id !== studentId);
    saveStudentsToStorage(updated);
    set({
      students: updated,
      selectedStudentId: state.selectedStudentId === studentId ? null : state.selectedStudentId
    });
  },

  moveStudent: (studentId, targetClassroomId, targetSeatId, targetBenchId, targetSeatIndex) => {
    const state = get();
    const hierarchy = findClassroomHierarchy(targetClassroomId);
    if (!hierarchy) throw new Error(`Target classroom ${targetClassroomId} not found.`);

    // Check if destination seat is occupied
    const occupied = state.students.find((s) => s.seatId === targetSeatId && s.id !== studentId);
    if (occupied) {
      throw new Error(`Target seat ${targetSeatId} is already occupied by ${occupied.name}.`);
    }

    const updated = state.students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          buildingId: hierarchy.building.id,
          floorLevel: hierarchy.floor.level,
          classroomId: targetClassroomId,
          seatId: targetSeatId,
          benchId: targetBenchId,
          seatIndex: targetSeatIndex
        };
      }
      return s;
    });

    saveStudentsToStorage(updated);
    set({ students: updated });
  },

  bulkAddStudents: (newStudentsList) => {
    const state = get();
    const updated = [...state.students, ...newStudentsList];
    saveStudentsToStorage(updated);
    set({ students: updated, isImportModalOpen: false });
  },

  resetToSeedData: () => {
    const seeded = generateSeedStudents();
    saveStudentsToStorage(seeded);
    set({ students: seeded, selectedStudentId: null });
  },

  exportJson: () => {
    const state = get();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      studentCount: state.students.length,
      students: state.students
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurasync_campus_twin_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importJson: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.students)) {
        saveStudentsToStorage(data.students);
        set({ students: data.students });
        return { success: true, count: data.students.length };
      }
      throw new Error('Invalid JSON format: missing students array.');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}));
