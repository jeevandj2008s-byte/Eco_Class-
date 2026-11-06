import React from 'react';
import { Environment } from './scene/environment.jsx';
import { Neighbourhood } from './scene/neighbourhood.jsx';
import { Architecture } from './scene/architecture.jsx';
import { FurnitureSystem } from './scene/furniture.jsx';
import { TrafficSystem } from './systems/traffic.jsx';
import { NPCSystem } from './characters/npc.jsx';
import { CameraSystem } from './systems/camera.jsx';

/**
 * CampusScene — Main Coordinator for the BIT 3D Digital Twin
 *
 * Aligned with the Modular 3D Architecture:
 * ├── scene/
 * │   ├── environment.jsx   ← Sky, lighting (Sun, Hemisphere, Fill), fog
 * │   ├── architecture.jsx  ← Buildings, floors, walls, sky-bridges
 * │   ├── furniture.jsx     ← Chairs, desks, benches, spinning fans
 * │   └── neighbourhood.jsx ← Grounds, roads, perimeter wall, trees, landmarks
 * ├── characters/
 * │   ├── loader.js         ← Procedural humanoid geometries
 * │   ├── controller.js     ← Movement & idle animation loop
 * │   └── npc.jsx           ← Seated student roster & teacher figures
 * └── systems/
 *     ├── camera.jsx        ← Camera controls & animated transitions
 *     ├── routes.js         ← Campus waypoints & driving paths
 *     ├── traffic.jsx       ← Vehicle routing, moving cars & parking
 *     └── performance.js    ← Quality profiles & device detection
 */
export function CampusScene({ telemetry }) {
  return (
    <>
      {/* 1. Environment System: Sky, 3-Point Architectural Lighting & Atmosphere */}
      <Environment />

      {/* 2. Neighbourhood: Grounds, Roads, Boundary Wall, Trees & Landmarks */}
      <Neighbourhood />

      {/* 3. Architecture: 8 Volumetric Procedural Buildings & Connecting Sky-Bridges */}
      <Architecture telemetry={telemetry} />

      {/* 4. Furniture: Student Benches, Chairs, Boards & Animated Ceiling Fans */}
      <FurnitureSystem />

      {/* 5. NPC System: Seated Students with Idle Micro-Motion */}
      <NPCSystem />

      {/* 6. Traffic System: Parking Facility & Moving Road Vehicles */}
      <TrafficSystem />

      {/* 7. Camera System: Smooth Cinematic Rig & View Transitions */}
      <CameraSystem />
    </>
  );
}

export default CampusScene;
