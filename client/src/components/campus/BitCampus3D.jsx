import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary.jsx';
import { CampusScene } from './twin3d/CampusScene.jsx';
import { IsometricCampus3D } from './IsometricCampus3D.jsx';
import { TwinNavigationBreadcrumb } from './TwinNavigationBreadcrumb.jsx';
import { TwinControlsBar } from './TwinControlsBar.jsx';
import { TwinLeftPanel } from './TwinLeftPanel.jsx';
import { TwinRightPanel } from './TwinRightPanel.jsx';
import { AddStudentModal } from './AddStudentModal.jsx';
import { BulkImportModal } from './BulkImportModal.jsx';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';

// Safe WebGL context probe
export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
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

  // Sync external building selection with store if provided
  useEffect(() => {
    if (selectedBuildingId && selectedBuildingId !== storeSelectedBuildingId) {
      selectBuilding(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  return (
    <div className="relative w-full h-full bg-[#07080e] overflow-hidden select-none">
      {hasWebGL ? (
        <WebGLErrorBoundary
          fallback={<IsometricCampus3D telemetry={telemetry} />}
          onError={() => setHasWebGL(false)}
          onFallbackTo2D={onFallbackTo2D}
        >
          <Canvas
            shadows
            camera={{ position: [0, 68, 88], fov: 45 }}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
              stencil: false,
              depth: true
            }}
          >
            <color attach="background" args={['#07080e']} />
            <fog attach="fog" args={['#07080e', 100, 260]} />

            {/* Core Procedural Campus Scene with GPU Instanced Furniture & Students */}
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

      {/* 3. Right Student & Classroom Inspector Panel */}
      <TwinRightPanel telemetry={telemetry} />

      {/* 4. Bottom Controls Bar (X-Ray, Explode Slider, Add, Import) */}
      <TwinControlsBar />

      {/* 5. Modals */}
      <AddStudentModal />
      <BulkImportModal />

      {/* Bottom Navigation Legend & Hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none px-3.5 py-1.5 rounded-xl bg-[#131219]/90 border border-white/[0.14] text-[10px] text-[#b9b8bb] font-mono hidden md:flex items-center gap-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#9ff0ec] animate-ping" />
        <span>Drag: Rotate • Right-click/Shift-drag: Pan • Scroll: Zoom • Click Room/Student to focus</span>
      </div>
    </div>
  );
}
