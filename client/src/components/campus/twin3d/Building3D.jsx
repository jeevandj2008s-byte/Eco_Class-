import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D.jsx';
import { FLOOR_HEIGHT, BLOCK_LABELS_CONFIG, ANIMATION_CONFIG } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Building3D({ building, telemetry }) {
  const { id, name, code, color, position, width, depth, floorCount, floors = [], courtyard } = building;

  const flagMeshRef = useRef();
  const fountainWaterRef = useRef();

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedBuildingId === id;
  const isInspectingFloor = isSelected && selectedFloorLevel !== null;
  const isCutaway = xrayMode || isInspectingFloor || (isSelected && selectedClassroomId !== null);

  // Determine active render height: when inspecting a floor, cutoff facade at the selected floor
  const activeFloorCount = isInspectingFloor ? Math.min(floorCount, selectedFloorLevel) : floorCount;
  const activeHeight = activeFloorCount * FLOOR_HEIGHT;
  const totalHeight = floorCount * FLOOR_HEIGHT;
  const roofY = totalHeight + (floorCount - 1) * explodedHeight * 3.5;

  // Label and style from single central config
  const labelConfig = useMemo(() => {
    return BLOCK_LABELS_CONFIG.find((l) => l.id === id) || {
      name,
      shortName: code || name,
      accentColor: color || '#38bdf8',
      entranceLabel: 'Main Entrance'
    };
  }, [id, name, code, color]);

  // Telemetry metrics
  const buildingTelemetry = useMemo(() => {
    if (!telemetry?.buildings) return { realKw: 42, ghostKw: 31 };
    if (Array.isArray(telemetry.buildings)) {
      return telemetry.buildings.find((b) => b.id === id || b.buildingId === id) || { realKw: 42, ghostKw: 31 };
    }
    return telemetry.buildings[id] || { realKw: 42, ghostKw: 31 };
  }, [telemetry, id]);

  const buildingStudents = useMemo(() => {
    return students.filter((s) => s.buildingId === id);
  }, [students, id]);

  // Courtyard geometry
  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  // Exterior pilaster / brick column positions along North, South, West, East facades
  const brickColumns = useMemo(() => {
    const cols = [];
    const spacing = 7.0; // distance between columns
    const halfW = width / 2;
    const halfD = depth / 2;

    // Corner columns
    cols.push([-halfW, activeHeight / 2, -halfD]);
    cols.push([halfW, activeHeight / 2, -halfD]);
    cols.push([-halfW, activeHeight / 2, halfD]);
    cols.push([halfW, activeHeight / 2, halfD]);

    // North & South intermediate columns
    const xSteps = Math.floor(width / spacing);
    for (let i = 1; i < xSteps; i++) {
      const x = -halfW + i * (width / xSteps);
      cols.push([x, activeHeight / 2, -halfD]);
      cols.push([x, activeHeight / 2, halfD]);
    }

    // West & East intermediate columns
    const zSteps = Math.floor(depth / spacing);
    for (let j = 1; j < zSteps; j++) {
      const z = -halfD + j * (depth / zSteps);
      cols.push([-halfW, activeHeight / 2, z]);
      cols.push([halfW, activeHeight / 2, z]);
    }

    return cols;
  }, [width, depth, activeHeight]);

  // Animation frame loop for courtyard flag waving and fountain ripple
  useFrame((state) => {
    if (!ANIMATION_CONFIG.enabled) return;
    const t = state.clock.getElapsedTime();

    if (ANIMATION_CONFIG.flagWave && flagMeshRef.current) {
      flagMeshRef.current.rotation.y = Math.sin(t * 3.0) * 0.15;
      flagMeshRef.current.scale.x = 1.0 + Math.sin(t * 4.0) * 0.05;
    }

    if (ANIMATION_CONFIG.fountainWater && fountainWaterRef.current) {
      fountainWaterRef.current.material.opacity = 0.55 + Math.sin(t * 3.5) * 0.15;
    }
  });

  return (
    <group
      name={`building-${id}`}
      position={[position[0], 0, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding(id);
      }}
    >
      {/* 1. Heavy Rusticated Brick Plinth Foundation */}
      <group position={[0, -0.4, 0]}>
        {/* Foundation Base Concrete */}
        <mesh receiveShadow>
          <boxGeometry args={[width + 2.0, 0.8, depth + 2.0]} />
          <meshStandardMaterial color="#0b0e17" roughness={0.9} />
        </mesh>
        {/* Red Brick Water Table / Plinth Trim */}
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <boxGeometry args={[width + 0.8, 0.12, depth + 0.8]} />
          <meshStandardMaterial color="#8b2f15" roughness={0.7} />
        </mesh>
      </group>

      {/* 2. Floors & Interior Classroom Layout */}
      {floors.map((floor) => (
        <Floor3D
          key={floor.level}
          floor={floor}
          buildingWidth={width}
          buildingDepth={depth}
          buildingId={id}
          courtyard={courtyard}
        />
      ))}

      {/* 3. Landscaped Central Courtyard Quad Garden (Block A) */}
      {hasCourtyard && (
        <group name="courtyard-quad-garden" position={[0, 0.02, 0]}>
          {/* Green Lawn */}
          <mesh receiveShadow>
            <boxGeometry args={[cw - 0.4, 0.04, cd - 0.4]} />
            <meshStandardMaterial color="#0f3323" roughness={0.85} />
          </mesh>

          {/* Cross Stone Pathways */}
          <mesh position={[0, 0.03, 0]} receiveShadow>
            <boxGeometry args={[cw - 0.4, 0.02, 2.2]} />
            <meshStandardMaterial color="#1f293d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.03, 0]} receiveShadow>
            <boxGeometry args={[2.2, 0.02, cd - 0.4]} />
            <meshStandardMaterial color="#1f293d" roughness={0.6} />
          </mesh>

          {/* Central Water Fountain */}
          <group position={[0, 0.2, 0]}>
            <mesh receiveShadow castShadow>
              <cylinderGeometry args={[2.4, 2.6, 0.4, 24]} />
              <meshStandardMaterial color="#2d3748" roughness={0.5} />
            </mesh>
            <mesh ref={fountainWaterRef} position={[0, 0.21, 0]}>
              <cylinderGeometry args={[2.1, 2.1, 0.05, 24]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.3}
                transparent
                opacity={0.65}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.4, 0.6, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>

          {/* Institution Flag Pole */}
          <group position={[4.5, 0, 4.5]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[1.0, 0.4, 1.0]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 4.0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 7.6, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 7.85, 0]}>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh ref={flagMeshRef} position={[0.75, 7.0, 0]} castShadow>
              <boxGeometry args={[1.5, 0.9, 0.04]} />
              <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} />
            </mesh>
          </group>

          {/* Courtyard Garden Benches */}
          {[
            { pos: [-4.5, 0.2, -2.5], rot: Math.PI / 2 },
            { pos: [-4.5, 0.2, 2.5], rot: Math.PI / 2 },
            { pos: [4.5, 0.2, -2.5], rot: -Math.PI / 2 },
            { pos: [0, 0.2, -4.5], rot: 0 }
          ].map((b, i) => (
            <group key={`bench-${i}`} position={b.pos} rotation={[0, b.rot, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.1, 0.45]} />
                <meshStandardMaterial color="#78350f" roughness={0.6} />
              </mesh>
              <mesh position={[-0.6, -0.15, 0]}>
                <boxGeometry args={[0.1, 0.3, 0.4]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
              <mesh position={[0.6, -0.15, 0]}>
                <boxGeometry args={[0.1, 0.3, 0.4]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            </group>
          ))}

          {/* Courtyard Trees */}
          {[
            [-5.5, 0, -5.5],
            [5.5, 0, -5.5],
            [-5.5, 0, 5.5]
          ].map((p, i) => (
            <group key={`tree-${i}`} position={p}>
              <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.24, 2.4, 8]} />
                <meshStandardMaterial color="#451a03" roughness={0.9} />
              </mesh>
              <mesh position={[0, 2.8, 0]} castShadow>
                <dodecahedronGeometry args={[1.4, 1]} />
                <meshStandardMaterial color="#15803d" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 4. REALISTIC ARCHITECTURAL BRICK FACADE & STRUCTURAL COLUMNS */}
      <group name="brick-architectural-facade">
        {/* Exterior Brick Pilasters / Structural Columns */}
        {brickColumns.map((c, i) => (
          <mesh key={`brick-col-${i}`} position={c} castShadow receiveShadow>
            <boxGeometry args={[0.75, activeHeight, 0.75]} />
            <meshStandardMaterial
              color="#9a3412" // Rich Terracotta Engineering Brick Tone
              roughness={0.75}
              metalness={0.1}
            />
          </mesh>
        ))}

        {/* Horizontal Concrete Floor Slabs & Brick Spandrel Panels */}
        {floors.slice(0, activeFloorCount).map((f) => {
          const fY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;
          return (
            <group key={`facade-level-${f.level}`} position={[0, fY, 0]}>
              {/* Floor Slab Edge Cornice Band (Precast Stone) */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[width + 0.35, 0.26, depth + 0.35]} />
                <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
              </mesh>

              {/* Terracotta Brick Spandrel Wall Course (below windows on this floor) */}
              {/* North Brick Spandrel */}
              <mesh position={[0, 0.55, -depth / 2]} castShadow>
                <boxGeometry args={[width, 0.8, 0.25]} />
                <meshStandardMaterial color="#943212" roughness={0.78} />
              </mesh>
              {/* South Brick Spandrel */}
              <mesh position={[0, 0.55, depth / 2]} castShadow>
                <boxGeometry args={[width, 0.8, 0.25]} />
                <meshStandardMaterial color="#943212" roughness={0.78} />
              </mesh>
              {/* West Brick Spandrel */}
              <mesh position={[-width / 2, 0.55, 0]} castShadow>
                <boxGeometry args={[0.25, 0.8, depth]} />
                <meshStandardMaterial color="#943212" roughness={0.78} />
              </mesh>
              {/* East Brick Spandrel */}
              <mesh position={[width / 2, 0.55, 0]} castShadow>
                <boxGeometry args={[0.25, 0.8, depth]} />
                <meshStandardMaterial color="#943212" roughness={0.78} />
              </mesh>

              {/* Concrete Window Sill Lintel */}
              <mesh position={[0, 0.98, -depth / 2]}>
                <boxGeometry args={[width + 0.1, 0.1, 0.3]} />
                <meshStandardMaterial color="#64748b" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.98, depth / 2]}>
                <boxGeometry args={[width + 0.1, 0.1, 0.3]} />
                <meshStandardMaterial color="#64748b" roughness={0.4} />
              </mesh>
            </group>
          );
        })}

        {/* Glazed Architectural Ribbon Window Panels */}
        {/* North Facade Windows */}
        <mesh position={[0, activeHeight / 2, -depth / 2 + 0.05]} castShadow={!isCutaway}>
          <boxGeometry args={[width - 0.5, activeHeight * 0.72, 0.06]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.06 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* South Facade Windows */}
        <mesh position={[0, activeHeight / 2, depth / 2 - 0.05]} castShadow={!isCutaway}>
          <boxGeometry args={[width - 0.5, activeHeight * 0.72, 0.06]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.06 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* West Facade Windows */}
        <mesh position={[-width / 2 + 0.05, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.06, activeHeight * 0.72, depth - 0.5]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.06 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* East Facade Windows */}
        <mesh position={[width / 2 - 0.05, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.06, activeHeight * 0.72, depth - 0.5]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.06 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* 5. Exterior Straight Architectural Staircase */}
      <group position={[width / 2 + 1.2, 0, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => (
          <mesh
            key={`ext-stair-${step}`}
            position={[0, step * 0.42 + 0.2, -6 + step * 0.9]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1.8, 0.2, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}
        {/* Exterior Staircase Glass Handrail */}
        <mesh position={[0.9, 2.2, -2.8]} rotation={[-0.42, 0, 0]}>
          <boxGeometry args={[0.06, 0.9, 7.8]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
        </mesh>
      </group>

      {/* 6. Rooftop Infrastructure (Solar Panels, Tanks & Parapet - hidden during cutaway / floor view) */}
      {!isCutaway && (
        <group position={[0, roofY, 0]} name="rooftop-infrastructure">
          {/* Concrete Roof Slab */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.4, 0.25, depth + 0.4]} />
            <meshStandardMaterial color="#0c0e17" roughness={0.8} />
          </mesh>

          {/* Brick Parapet Wall with Concrete Coping */}
          <mesh position={[0, 0.45, -depth / 2]} castShadow>
            <boxGeometry args={[width + 0.4, 0.6, 0.28]} />
            <meshStandardMaterial color="#8b2f15" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.45, depth / 2]} castShadow>
            <boxGeometry args={[width + 0.4, 0.6, 0.28]} />
            <meshStandardMaterial color="#8b2f15" roughness={0.75} />
          </mesh>
          <mesh position={[-width / 2, 0.45, 0]} castShadow>
            <boxGeometry args={[0.28, 0.6, depth]} />
            <meshStandardMaterial color="#8b2f15" roughness={0.75} />
          </mesh>
          <mesh position={[width / 2, 0.45, 0]} castShadow>
            <boxGeometry args={[0.28, 0.6, depth]} />
            <meshStandardMaterial color="#8b2f15" roughness={0.75} />
          </mesh>

          {/* Tilted Rooftop Solar Panel Arrays */}
          {[-8, 0, 8].map((zOffset, rIdx) => (
            <group key={`solar-row-${rIdx}`} position={[0, 0.5, zOffset]} rotation={[-0.26, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[width * 0.75, 0.08, 3.2]} />
                <meshStandardMaterial
                  color="#1e3a8a"
                  emissive="#1d4ed8"
                  emissiveIntensity={0.25}
                  roughness={0.15}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[width * 0.74, 0.02, 3.1]} />
                <meshBasicMaterial color="#38bdf8" wireframe opacity={0.3} transparent />
              </mesh>
            </group>
          ))}

          {/* Water Tanks */}
          <group position={[width * 0.32, 0.9, -depth * 0.32]}>
            <mesh position={[-1.2, 0, 0]} castShadow>
              <cylinderGeometry args={[1.1, 1.1, 1.6, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[1.2, 0, 0]} castShadow>
              <cylinderGeometry args={[1.1, 1.1, 1.6, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.6, 0]}>
              <boxGeometry args={[4.2, 0.3, 2.6]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>

          {/* HVAC Chiller Unit */}
          <mesh position={[-width * 0.32, 0.6, -depth * 0.3]} castShadow>
            <boxGeometry args={[3.8, 1.0, 2.6]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* 7. Grand Main Entrance (Brick Portico Pillars, Steps, Canopy) */}
      <group position={[0, 0, depth / 2]} name="main-entrance">
        {/* Cantilever Entrance Canopy */}
        <mesh position={[0, 3.0, 2.6]} castShadow>
          <boxGeometry args={[10.5, 0.25, 4.2]} />
          <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} metalness={0.6} />
        </mesh>
        {/* Canopy Accent LED Strip */}
        <mesh position={[0, 2.85, 4.4]}>
          <boxGeometry args={[10.0, 0.05, 0.15]} />
          <meshStandardMaterial color="#9ff0ec" emissive="#9ff0ec" emissiveIntensity={1.5} />
        </mesh>
        {/* Brick Portico Support Columns */}
        <mesh position={[-4.8, 1.4, 4.4]} castShadow>
          <boxGeometry args={[0.6, 2.8, 0.6]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} />
        </mesh>
        <mesh position={[4.8, 1.4, 4.4]} castShadow>
          <boxGeometry args={[0.6, 2.8, 0.6]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} />
        </mesh>

        {/* Concrete Steps (3 Tiers) */}
        <mesh position={[0, 0.12, 1.2]} receiveShadow>
          <boxGeometry args={[8.5, 0.24, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.24, 0.6]} receiveShadow>
          <boxGeometry args={[7.5, 0.24, 1.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Accessible Wheelchair Ramp */}
        <group position={[-5.8, 0, 1.2]}>
          <mesh position={[0, 0.12, 0]} rotation={[0.08, 0, 0]} receiveShadow>
            <boxGeometry args={[1.6, 0.2, 3.2]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          <mesh position={[-0.8, 0.6, 0]}>
            <boxGeometry args={[0.05, 0.8, 3.0]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>

        {/* Double Entrance Glass Doors */}
        <mesh position={[-1.2, 1.5, 0.08]}>
          <boxGeometry args={[2.0, 2.8, 0.08]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[1.2, 1.5, 0.08]}>
          <boxGeometry args={[2.0, 2.8, 0.08]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Door Entrance Label */}
        {showLabels && (
          <Html position={[0, 3.6, 2.6]} center distanceFactor={22}>
            <div className="pointer-events-none px-2.5 py-1 rounded-lg bg-[#131219]/90 border border-[#9ff0ec]/30 text-[10px] font-mono text-[#9ff0ec] whitespace-nowrap shadow-lg">
              {labelConfig.entranceLabel}
            </div>
          </Html>
        )}
      </group>

      {/* 8. Floating Billboard Block Name Label */}
      {showLabels && (
        <Html
          position={[0, (isCutaway ? activeHeight : roofY) + 3.0, 0]}
          center
          distanceFactor={28}
          zIndexRange={[70, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectBuilding(id);
            }}
            className={`cursor-pointer px-4 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-3 transition-all select-none ${
              isSelected
                ? 'bg-[#006bff]/90 border-[#9ff0ec] text-white shadow-[0_0_30px_rgba(0,107,255,0.7)] scale-110'
                : 'bg-[#131219]/90 border-white/15 text-[#b9b8bb] hover:border-[#9ff0ec]/50 hover:bg-[#181a26]'
            }`}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl font-mono font-bold text-xs text-white shadow-md"
              style={{ backgroundColor: labelConfig.accentColor || '#38bdf8' }}
            >
              {code || labelConfig.shortName}
            </div>

            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-white tracking-tight">{labelConfig.name}</span>
              <div className="text-[10px] text-[#9ff0ec] font-mono flex items-center gap-1.5 mt-0.5">
                <span>{buildingStudents.length} Students</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{buildingTelemetry.realKw} kW</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
