import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary.jsx';
import { CampusScene } from './twin3d/CampusScene.jsx';
import { IsometricCampus3D } from './IsometricCampus3D.jsx';
import { FloorInspectorPanel } from './twin3d/FloorInspectorPanel.jsx';
import { ClassroomInsideCard } from './twin3d/ClassroomInsideCard.jsx';
import { TwinNavigationBreadcrumb } from './TwinNavigationBreadcrumb.jsx';
import { TwinControlsBar } from './TwinControlsBar.jsx';
import { TwinLeftPanel } from './TwinLeftPanel.jsx';
import { TwinRightPanel } from './TwinRightPanel.jsx';
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
  const storeSelectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);

  // Sync external building selection with store if provided
  useEffect(() => {
    if (selectedBuildingId && selectedBuildingId !== storeSelectedBuildingId) {
      selectBuilding(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden select-none">
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
              gl.setClearColor(new THREE.Color('#07080e'), 1);
            }}
          >
            <color attach="background" args={['#07080e']} />
            <fog attach="fog" args={['#07080e', 100, 260]} />

            {/* Core Architectural Campus 3D Scene */}
            <CampusScene telemetry={telemetry} />
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        /* High-Performance Universal 3D Campus Digital Twin Fallback */
        <IsometricCampus3D telemetry={telemetry} />
      )}

      {/* 1. Spatial Breadcrumb Navigation Bar */}
      <TwinNavigationBreadcrumb />

      {/* 2. Left Architectural Hierarchy Explorer */}
      <TwinLeftPanel />

      {/* 3. Right Campus / Student Inspector Panel (Shown at Campus & Room levels) */}
      {selectedFloorLevel === null && <TwinRightPanel telemetry={telemetry} />}

      {/* 4. Luxury Floor Inspector Slide-in Panel (Level 3 Isometric Cutaway Mode) */}
      <FloorInspectorPanel telemetry={telemetry} />

      {/* 5. Classroom Inside HUD Card (Level 4 Room Mode) */}
      <ClassroomInsideCard />

      {/* 6. Bottom Controls Bar */}
      <TwinControlsBar />

      {/* 7. Modals */}
      <AddStudentModal />
      <BulkImportModal />

      {/* Bottom Navigation Legend & Hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none px-3.5 py-1.5 rounded-xl bg-[#131219]/90 border border-white/[0.14] text-[10px] text-[#b9b8bb] font-mono hidden md:flex items-center gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#9ff0ec] animate-ping" />
        <span>Click any Building to inspect • Click Floor Level to cut away • Click Room to visit students</span>
      </div>
    </div>
  );
}
