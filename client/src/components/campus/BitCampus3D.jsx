import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary.jsx';
import { CampusScene } from './twin3d/CampusScene.jsx';
import { IsometricCampus3D } from './IsometricCampus3D.jsx';
import { CampusFunctionsDock } from './twin3d/CampusFunctionsDock.jsx';
import { TwinNavigationBreadcrumb } from './TwinNavigationBreadcrumb.jsx';
import { AddStudentModal } from './AddStudentModal.jsx';
import { BulkImportModal } from './BulkImportModal.jsx';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';

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
  const storeSelectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);

  // Sync external building selection with store if provided
  useEffect(() => {
    if (selectedBuildingId && selectedBuildingId !== storeSelectedBuildingId) {
      selectBuilding(selectedBuildingId);
    }
  }, [selectedBuildingId]);

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

        {/* Bottom Navigation Legend & Gesture Hint */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none px-3 py-1 rounded-xl bg-[#131219]/90 border border-white/[0.14] text-[10px] text-[#b9b8bb] font-mono flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#9ff0ec] animate-ping" />
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
