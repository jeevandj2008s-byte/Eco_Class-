import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import defaultHotspots from '../../config/bit-hotspots.json';
import { sounds } from '../../lib/utils.js';

// Convert percentage coords to 3D scene units centered at origin
function to3DCoord(pctX, pctY) {
  const x = (pctX - 50) * 1.5;
  const z = (pctY - 50) * 1.5;
  return [x, z];
}

function BuildingMesh({
  building,
  activeOverlay,
  telemetry,
  isSelected,
  onSelect
}) {
  const [hovered, setHovered] = useState(false);

  // Derive building live metrics
  const bData = useMemo(() => {
    let fromTel = null;
    if (telemetry?.buildings) {
      if (Array.isArray(telemetry.buildings)) {
        fromTel = telemetry.buildings.find((b) => b.id === building.id || b.buildingId === building.id);
      } else if (typeof telemetry.buildings === 'object') {
        fromTel = telemetry.buildings[building.id];
      }
    }
    const realKw = fromTel?.realKw || building.baselineKw || 40;
    const ghostKw = fromTel?.ghostKw || (building.baselineKw ? building.baselineKw * 0.75 : 30);
    const occupants = fromTel?.occupants ?? fromTel?.occupancy ?? 120;
    const hasAnomaly = (telemetry?.ghostAnomalies || []).some((a) => a.roomId?.startsWith(building.id) || building.id === 'bit-main');
    return { realKw, ghostKw, occupants, hasAnomaly };
  }, [building, telemetry]);

  // Construct Extrude Geometry with hole cutout for bit-main
  const { geometry, centroid } = useMemo(() => {
    const shape = new THREE.Shape();
    const pts = building.percentagePolygon || [];
    if (pts.length === 0) return { geometry: null, centroid: [0, 0, 0] };

    let sumX = 0;
    let sumZ = 0;

    pts.forEach(([px, py], idx) => {
      const [x, z] = to3DCoord(px, py);
      // In local Shape space: x is x, y is -z so that after -90deg rotation on X, positive y points to negative Z (North)
      const sy = -z;
      if (idx === 0) shape.moveTo(x, sy);
      else shape.lineTo(x, sy);
      sumX += x;
      sumZ += z;
    });
    shape.closePath();

    // Courtyard hole cutout (for bit-main)
    if (building.holes && building.holes.length > 0) {
      building.holes.forEach((holePts) => {
        if (holePts && holePts.length > 0) {
          const holePath = new THREE.Path();
          holePts.forEach(([hx, hy], idx) => {
            const [hx3d, hz3d] = to3DCoord(hx, hy);
            const hsy = -hz3d;
            if (idx === 0) holePath.moveTo(hx3d, hsy);
            else holePath.lineTo(hx3d, hsy);
          });
          holePath.closePath();
          shape.holes.push(holePath);
        }
      });
    }

    const floors = building.floors || 1;
    const height = Math.max(floors * 3.5, 3);

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return {
      geometry: geom,
      centroid: [sumX / pts.length, height, sumZ / pts.length]
    };
  }, [building]);

  // Compute building color depending on overlay mode
  const { color, emissive, emissiveIntensity } = useMemo(() => {
    if (activeOverlay === 'HEATMAP') {
      const baseline = building.baselineKw || 40;
      const ratio = bData.realKw / baseline;
      if (ratio > 1.0) {
        return { color: '#f43f5e', emissive: '#f43f5e', emissiveIntensity: hovered ? 0.8 : 0.45 };
      } else if (ratio > 0.8) {
        return { color: '#f97316', emissive: '#f97316', emissiveIntensity: hovered ? 0.7 : 0.35 };
      } else if (ratio >= 0.5) {
        return { color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: hovered ? 0.6 : 0.25 };
      }
      return { color: '#10b981', emissive: '#10b981', emissiveIntensity: hovered ? 0.6 : 0.2 };
    }

    if (activeOverlay === 'SOLAR') {
      const hasSolar = (building.solarCapacityKw || 0) > 0;
      if (hasSolar) {
        return { color: '#fbbf24', emissive: '#f59e0b', emissiveIntensity: hovered ? 0.9 : 0.5 };
      }
      return { color: '#334155', emissive: '#0f172a', emissiveIntensity: 0.05 };
    }

    if (activeOverlay === 'OCCUPANCY') {
      const occ = bData.occupants;
      const intensity = Math.min(1, Math.max(0.2, occ / 400));
      return { color: '#06b6d4', emissive: '#0284c7', emissiveIntensity: intensity * (hovered ? 0.9 : 0.5) };
    }

    return { color: '#38bdf8', emissive: '#0284c7', emissiveIntensity: hovered ? 0.6 : 0.15 };
  }, [activeOverlay, building, bData, hovered]);

  if (!geometry) return null;

  return (
    <group>
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          sounds.playChime('bubble');
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          sounds.playChime('success');
          if (onSelect) onSelect(building);
        }}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isSelected ? 1.0 : emissiveIntensity}
          roughness={0.25}
          metalness={0.65}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 3D Floating Building Label */}
      <Html position={[centroid[0], centroid[1] + 2.5, centroid[2]]} center distanceFactor={85}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(building);
          }}
          className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-bold border backdrop-blur-md transition-all select-none whitespace-nowrap shadow-xl ${
            isSelected
              ? 'bg-cyan-500 text-black border-cyan-300 ring-4 ring-cyan-500/30 scale-110'
              : hovered
              ? 'bg-slate-900/95 text-white border-cyan-400 scale-105'
              : 'bg-black/80 text-slate-200 border-white/20'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span>{building.shortName || building.name}</span>
            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-white/10 text-cyan-300">
              {building.floors || 1}F
            </span>
          </div>
          {hovered && (
            <div className="text-[10px] font-mono text-emerald-400 pt-0.5">
              {bData.realKw} kW • {bData.occupants} pax
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Campus Ground, Perimeter Roads & Water Channel
function CampusEnvironment() {
  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[160, 150]} />
        <meshStandardMaterial color="#070b14" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Subtle Grid */}
      <gridHelper args={[160, 40, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />

      {/* K.R. Road (West Boundary) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-62, 0.02, 0]} receiveShadow>
        <planeGeometry args={[10, 140]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Water Channel / Storm Drain Line (Blue accent stroke #0284c7) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[28, 0.03, -10]}>
        <planeGeometry args={[4, 110]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.2} />
      </mesh>

      {/* Parking Area Plane with Solar Canopy Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, 0.04, 35]} receiveShadow>
        <planeGeometry args={[20, 45]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Landmark Pins */}
      {/* Kuvempu Kalakshetra (South) */}
      <Html position={[-15, 1, 62]} center distanceFactor={80}>
        <div className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-semibold whitespace-nowrap shadow-lg flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Kuvempu Kalakshetra
        </div>
      </Html>

      {/* Chaitra Kote (North-East) */}
      <Html position={[32, 1, -55]} center distanceFactor={80}>
        <div className="px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[10px] font-semibold whitespace-nowrap shadow-lg flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Chaitra Kote
        </div>
      </Html>

      {/* BIT Pink Tree (Central Lawn) */}
      <Html position={[-8, 1, 5]} center distanceFactor={80}>
        <div className="px-2 py-0.5 rounded-lg bg-pink-950/80 border border-pink-500/50 text-pink-300 text-[10px] font-semibold whitespace-nowrap shadow-lg flex items-center gap-1 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
          BIT Pink Tree
        </div>
      </Html>
    </group>
  );
}

export default function BitCampus3D({
  activeOverlay = 'HEATMAP',
  telemetry,
  onSelectBuilding,
  selectedBuildingId
}) {
  const buildings = defaultHotspots.buildings || [];

  return (
    <div className="relative w-full h-full bg-[#050811] overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 65, 80], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050811']} />
        <fog attach="fog" args={['#050811', 80, 220]} />

        {/* Ambient & Directional Cyber Sunlight */}
        <ambientLight intensity={0.65} />
        <hemisphereLight intensity={0.4} color="#38bdf8" groundColor="#050811" />
        <directionalLight
          position={[50, 90, 40]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={250}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />

        {/* Orbit Controls with Damping and Constrained Tilt */}
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={170}
          target={[0, 5, 0]}
        />

        {/* Campus Environment (Ground, Roads, Waterway, Landmarks) */}
        <CampusEnvironment />

        {/* Procedural Building Meshes Extruded from Footprints */}
        {buildings.map((b) => (
          <BuildingMesh
            key={b.id}
            building={b}
            activeOverlay={activeOverlay}
            telemetry={telemetry}
            isSelected={selectedBuildingId === b.id}
            onSelect={onSelectBuilding}
          />
        ))}
      </Canvas>

      {/* Floating 3D Navigation Watermark & Hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none px-3.5 py-1.5 rounded-xl glass-panel bg-black/70 border border-white/10 text-[10px] text-slate-300 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Left-click + Drag to rotate • Right-click to pan • Scroll to zoom</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none px-3 py-1 rounded-xl glass-panel bg-black/60 border border-white/10 text-[10px] text-slate-400 font-mono">
        Bangalore Institute of Technology 3D Twin
      </div>
    </div>
  );
}

