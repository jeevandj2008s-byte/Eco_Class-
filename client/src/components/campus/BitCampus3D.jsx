import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Wind } from 'lucide-react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary.jsx';
import { CampusScene } from './twin3d/CampusScene.jsx';
import { IsometricCampus3D } from './IsometricCampus3D.jsx';
import { CampusFunctionsDock } from './twin3d/CampusFunctionsDock.jsx';
import { TwinNavigationBreadcrumb } from './TwinNavigationBreadcrumb.jsx';
import { AddStudentModal } from './AddStudentModal.jsx';
import { BulkImportModal } from './BulkImportModal.jsx';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import { findClassroomHierarchy } from '../../config/buildings.config.js';

// Safe WebGL context probe that immediately disposes its context to prevent leaking GPU context slots
let _cachedWebGL = null;
export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  if (_cachedWebGL !== null) return _cachedWebGL;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
    if (!gl) {
      _cachedWebGL = false;
      return false;
    }
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    _cachedWebGL = true;
    return true;
  } catch (e) {
    _cachedWebGL = false;
    return false;
  }
}

export default function BitCampus3D({
  activeOverlay = 'HEATMAP',
  telemetry,
  onSelectBuilding,
  selectedBuildingId,
  onFallbackTo2D
}) {
  const [hasWebGL, setHasWebGL] = useState(() => isWebGLAvailable());
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectCampus = useTwin3DStore((s) => s.selectCampus);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const storeSelectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const students = useTwin3DStore((s) => s.students);

  // Sync external building selection with store if provided
  useEffect(() => {
    if (selectedBuildingId && selectedBuildingId !== storeSelectedBuildingId) {
      selectBuilding(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  // Selected Classroom Telemetry for Corner HUD
  const classroomHierarchy = useMemo(
    () => (selectedClassroomId ? findClassroomHierarchy(selectedClassroomId) : null),
    [selectedClassroomId]
  );
  const selectedClassroom = classroomHierarchy?.classroom;

  const roomStudents = useMemo(() => {
    if (!selectedClassroomId) return [];
    return students.filter((s) => s.classroomId === selectedClassroomId);
  }, [students, selectedClassroomId]);

  const totalSeats = selectedClassroom?.layout?.seats?.length || 24;
  const occupiedCount = roomStudents.length;
  const occupancyPct = totalSeats > 0 ? Math.round((occupiedCount / totalSeats) * 100) : 0;
  const activePowerKw = useMemo(() => {
    const watts = 350 + occupiedCount * 55;
    return (watts / 1000).toFixed(2);
  }, [occupiedCount]);

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar px-3 md:px-6 pt-16 md:pt-20 pb-16 select-none bg-transparent">
      {/* ============================================================== */}
      {/* 1. TOP HERO SECTION: THE 3D CAMPUS MAP VIEWPORT               */}
      {/* ============================================================== */}
      <div className="relative w-full h-[52vh] sm:h-[58vh] md:h-[64vh] min-h-[380px] shrink-0 rounded-2xl md:rounded-3xl overflow-hidden border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#07080e]">
        {hasWebGL ? (
          <WebGLErrorBoundary
            fallback={<IsometricCampus3D telemetry={telemetry} />}
            onError={() => setHasWebGL(false)}
            onFallbackTo2D={onFallbackTo2D}
          >
            <Canvas
              camera={{ position: [0, 68, 88], fov: 45 }}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
                stencil: false,
                depth: true
              }}
              onCreated={({ gl }) => {
                gl.setClearColor(new THREE.Color('#0e1322'), 1);
              }}
            >
              <color attach="background" args={['#0e1322']} />
              <fog attach="fog" args={['#0e1322', 140, 360]} />

              {/* Core Architectural Campus 3D Scene */}
              <CampusScene telemetry={telemetry} />
            </Canvas>
          </WebGLErrorBoundary>
        ) : (
          /* High-Performance Universal 3D Campus Digital Twin Fallback */
          <IsometricCampus3D telemetry={telemetry} />
        )}

        {/* Top-Left Sleek Breadcrumb Pill (Inside 3D Viewport) */}
        <div className="absolute top-3 left-3 z-20 max-w-[calc(100%-110px)]">
          <TwinNavigationBreadcrumb />
        </div>

        {/* Top-Right Quick Reset Camera View Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={selectCampus}
            className="px-2.5 py-1.5 rounded-xl bg-[#131219]/90 hover:bg-[#1f2638] border border-white/15 text-[11px] font-mono font-semibold text-[#9ff0ec] shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset Camera View to Campus Overview"
          >
            <span>Reset View</span>
          </button>
        </div>

        {/* Top-Right CORNER CLASSROOM HUD PANEL */}
        {/* Docked neatly in the corner so it NEVER covers the classroom, glass windows, or fans! */}
        {selectedClassroom && (
          <div className="absolute top-12 right-3 z-20 w-[210px] p-2.5 rounded-xl bg-[#0e111a]/95 border border-white/15 backdrop-blur-md shadow-[0_12px_28px_rgba(0,0,0,0.7)] flex flex-col gap-1.5 animate-fade-in text-white select-none">
            {/* Header: Class Code & Power */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold font-classic text-xs text-white tracking-tight">
                  {selectedClassroom.code || selectedClassroom.name}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 font-mono text-[9px] font-bold text-amber-300">
                {activePowerKw} kW
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
              <div className="p-1 rounded-md bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[#b9b8bb] text-[8px]">Dept</span>
                <span className="text-white font-semibold truncate">{selectedClassroom.department || 'CSE'}</span>
              </div>
              <div className="p-1 rounded-md bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[#b9b8bb] text-[8px]">Fan</span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <Wind className="w-2.5 h-2.5 text-cyan-300" /> Active
                </span>
              </div>
              <div className="p-1 rounded-md bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[#b9b8bb] text-[8px]">Attendance</span>
                <span className="text-emerald-300 font-bold">{occupancyPct}%</span>
              </div>
              <div className="p-1 rounded-md bg-white/5 border border-white/5 flex flex-col">
                <span className="text-[#b9b8bb] text-[8px]">Present</span>
                <span className="text-white font-bold">{occupiedCount}/{totalSeats}</span>
              </div>
            </div>

            {/* Exit Class View Button */}
            <button
              onClick={() => selectFloor(storeSelectedBuildingId, selectedFloorLevel)}
              className="w-full mt-1 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[10px] font-mono text-white/80 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Exit Class View back to Floor View"
            >
              <span>← Back to Floor View</span>
            </button>
          </div>
        )}

        {/* Bottom Navigation Legend & Gesture Hint */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none px-3 py-1 rounded-xl bg-[#131219]/90 border border-white/[0.14] text-[10px] text-[#b9b8bb] font-mono flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#9ff0ec]" />
          <span className="hidden sm:inline">Orbit: Drag • Zoom: Scroll • Tap Building to focus</span>
          <span className="sm:hidden">Touch: Drag to Orbit & Pinch to Zoom</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BOTTOM SECTION: ALL FUNCTIONS ARRANGED CLEANLY UNDER 3D MAP */}
      {/* ============================================================== */}
      <div className="w-full mt-4">
        <CampusFunctionsDock telemetry={telemetry} />
      </div>

      {/* 3. Modals */}
      <AddStudentModal />
      <BulkImportModal />
    </div>
  );
}
