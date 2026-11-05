import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D.jsx';
import { FLOOR_HEIGHT, ANIMATION_CONFIG } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Building3D({ building, telemetry }) {
  const { id, name, code, shortName, baselineKw, accentColor = '#38bdf8', position, width, depth, floorCount, floors = [], courtyard } = building;

  const flagMeshRef = useRef();
  const fountainWaterRef = useRef();
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [isBuildingHovered, setIsBuildingHovered] = useState(false);

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedBuildingId === id;
  const isInspectingFloor = isSelected && selectedFloorLevel !== null;
  const isCutaway = xrayMode || isInspectingFloor || (isSelected && selectedClassroomId !== null);

  const activeFloorCount = isInspectingFloor ? Math.min(floorCount, selectedFloorLevel) : floorCount;
  const activeHeight = activeFloorCount * FLOOR_HEIGHT;
  const totalHeight = floorCount * FLOOR_HEIGHT;
  const roofY = totalHeight + (floorCount - 1) * explodedHeight * 3.5;

  // Real-time telemetry kW
  const buildingKw = useMemo(() => {
    if (!telemetry?.buildings) return baselineKw || 40;
    if (Array.isArray(telemetry.buildings)) {
      const b = telemetry.buildings.find((x) => x.id === id || x.buildingId === id);
      return b?.realKw || baselineKw || 40;
    }
    return telemetry.buildings[id]?.realKw || baselineKw || 40;
  }, [telemetry, id, baselineKw]);

  // Students in this building
  const buildingStudents = useMemo(() => {
    return students.filter((s) => s.buildingId === id);
  }, [students, id]);

  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  // Exterior vertical architectural columns
  const facadePilasters = useMemo(() => {
    const cols = [];
    const spacing = 7.0;
    const halfW = width / 2;
    const halfD = depth / 2;

    cols.push([-halfW, activeHeight / 2, -halfD]);
    cols.push([halfW, activeHeight / 2, -halfD]);
    cols.push([-halfW, activeHeight / 2, halfD]);
    cols.push([halfW, activeHeight / 2, halfD]);

    const xSteps = Math.floor(width / spacing);
    for (let i = 1; i < xSteps; i++) {
      const x = -halfW + i * (width / xSteps);
      cols.push([x, activeHeight / 2, -halfD]);
      cols.push([x, activeHeight / 2, halfD]);
    }

    const zSteps = Math.floor(depth / spacing);
    for (let j = 1; j < zSteps; j++) {
      const z = -halfD + j * (depth / zSteps);
      cols.push([-halfW, activeHeight / 2, z]);
      cols.push([halfW, activeHeight / 2, z]);
    }

    return cols;
  }, [width, depth, activeHeight]);

  useFrame((state) => {
    if (!ANIMATION_CONFIG.enabled) return;
    const t = state.clock.getElapsedTime();

    if (ANIMATION_CONFIG.flagWave && flagMeshRef.current) {
      flagMeshRef.current.rotation.y = Math.sin(t * 3.0) * 0.15;
    }

    if (ANIMATION_CONFIG.fountainWater && fountainWaterRef.current) {
      fountainWaterRef.current.material.opacity = 0.55 + Math.sin(t * 3.5) * 0.15;
    }
  });

  return (
    <group
      name={`building-${id}`}
      position={[position[0], 0, position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsBuildingHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsBuildingHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding(id);
      }}
    >
      {/* 1. Heavy Volumetric Foundation Plinth */}
      <group position={[0, -0.4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[width + 1.8, 0.8, depth + 1.8]} />
          <meshStandardMaterial
            color="#0b0e17"
            roughness={0.9}
          />
        </mesh>
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <boxGeometry args={[width + 0.6, 0.12, depth + 0.6]} />
          <meshStandardMaterial
            color={isSelected ? '#006bff' : isBuildingHovered ? '#38bdf8' : '#1e293b'}
            roughness={0.5}
            metalness={0.4}
            emissive={isSelected ? '#006bff' : isBuildingHovered ? '#38bdf8' : '#000000'}
            emissiveIntensity={isSelected ? 0.6 : isBuildingHovered ? 0.3 : 0}
          />
        </mesh>
      </group>

      {/* 2. Stacked Volumetric Floors (Each with its Classrooms, Real Benches & Seated Students) */}
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

      {/* 3. Central Courtyard Quadrangle (Block A) */}
      {hasCourtyard && (
        <group name="courtyard-quad-garden" position={[0, 0.02, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[cw - 0.4, 0.04, cd - 0.4]} />
            <meshStandardMaterial color="#0f3323" roughness={0.85} />
          </mesh>

          <mesh position={[0, 0.03, 0]} receiveShadow>
            <boxGeometry args={[cw - 0.4, 0.02, 2.2]} />
            <meshStandardMaterial color="#1f293d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.03, 0]} receiveShadow>
            <boxGeometry args={[2.2, 0.02, cd - 0.4]} />
            <meshStandardMaterial color="#1f293d" roughness={0.6} />
          </mesh>

          {/* Central Fountain */}
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
          </group>

          {/* Flag Pole */}
          <group position={[4.5, 0, 4.5]}>
            <mesh position={[0, 4.0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 7.6, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh ref={flagMeshRef} position={[0.75, 7.0, 0]} castShadow>
              <boxGeometry args={[1.5, 0.9, 0.04]} />
              <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* 4. SOLID VOLUMETRIC FACADE, COLUMNS & INTERACTIVE FLOOR BANDS */}
      <group name="volumetric-facade">
        {/* Exterior Columns */}
        {facadePilasters.map((c, i) => (
          <mesh key={`col-${i}`} position={c} castShadow={!isCutaway} receiveShadow>
            <boxGeometry args={[0.5, activeHeight, 0.5]} />
            <meshStandardMaterial color="#1e2433" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}

        {/* Floor Slab Edges & Amber Glow Bands for Each Floor */}
        {floors.slice(0, activeFloorCount).map((f) => {
          const fY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;
          const isFSelected = isSelected && selectedFloorLevel === f.level;
          const isFHovered = hoveredFloor === f.level;

          // Compute floor metrics for card
          const floorStudents = students.filter(
            (s) => s.buildingId === id && s.floorLevel === f.level
          );
          const totalFloorSeats = (f.classrooms || []).reduce(
            (acc, r) => acc + (r.layout?.seats?.length || 24),
            0
          );
          const floorPct = totalFloorSeats > 0 ? Math.round((floorStudents.length / totalFloorSeats) * 100) : 0;

          return (
            <group key={`facade-band-${f.level}`} position={[0, fY, 0]}>
              {/* Floor Slab Edge Cornice */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[width + 0.3, 0.26, depth + 0.3]} />
                <meshStandardMaterial
                  color={isFSelected ? '#006bff' : isFHovered ? '#f59e0b' : '#273144'}
                  roughness={0.4}
                  metalness={0.6}
                />
              </mesh>

              {/* AMBER / CYAN GLOWING HIGHLIGHT BAND (Matching reference video) */}
              <mesh
                position={[0, 0.1, depth / 2 + 0.2]}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredFloor(f.level);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredFloor(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectFloor(id, f.level);
                }}
              >
                <boxGeometry args={[width * 0.98, 0.16, 0.12]} />
                <meshStandardMaterial
                  color={isFSelected ? '#006bff' : isFHovered ? '#f59e0b' : '#38bdf8'}
                  emissive={isFSelected ? '#006bff' : isFHovered ? '#f59e0b' : '#38bdf8'}
                  emissiveIntensity={isFSelected ? 2.0 : isFHovered ? 1.8 : 0.3}
                />
              </mesh>

              {/* FLOATING FLOOR HOVER CARD (Level 2 Block View - matching reference video) */}
              {isFHovered && !isInspectingFloor && (
                <Html
                  position={[0, 1.4, depth / 2 + 1.2]}
                  center
                  distanceFactor={22}
                  zIndexRange={[100, 0]}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      selectFloor(id, f.level);
                    }}
                    className="cursor-pointer p-3.5 rounded-2xl bg-[#10131d]/95 border border-[#f59e0b] shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(245,158,11,0.4)] backdrop-blur-xl flex flex-col gap-2 min-w-[220px] animate-fade-in select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f59e0b]">
                        Floor {f.level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] text-[9px] font-mono font-bold">
                        {floorPct}% Full
                      </span>
                    </div>

                    <div className="text-xs font-extrabold text-white leading-snug">
                      {f.name || `Floor Level ${f.level}`}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-white/10 pt-2 text-[#c9c3da]">
                      <div>
                        <span className="block text-[#8e8d92]">Classes</span>
                        <span className="font-bold text-white">{f.classrooms?.length || 0} Rooms</span>
                      </div>
                      <div>
                        <span className="block text-[#8e8d92]">Students</span>
                        <span className="font-bold text-[#9ff0ec]">{floorStudents.length} / {totalFloorSeats}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectFloor(id, f.level);
                      }}
                      className="w-full py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[11px] font-mono tracking-tight transition-all shadow-md flex items-center justify-center gap-1.5 mt-1"
                    >
                      <span>Explore Floor Cutaway</span>
                      <span>→</span>
                    </button>
                  </div>
                </Html>
              )}
            </group>
          );
        })}

        {/* Glazed Architectural Windows */}
        <mesh position={[0, activeHeight / 2, -depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, activeHeight, 0.08]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, activeHeight / 2, depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, activeHeight, 0.08]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[-width / 2, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.08, activeHeight, depth]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[width / 2, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.08, activeHeight, depth]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* 5. Volumetric Solid Rooftop with Parapet Walls, Solar Arrays & Chiller Units */}
      {!isCutaway && (
        <group position={[0, roofY, 0]} name="rooftop-infrastructure">
          {/* Concrete Roof Slab */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.4, 0.25, depth + 0.4]} />
            <meshStandardMaterial color="#0c0e17" roughness={0.8} />
          </mesh>

          {/* Parapet Walls */}
          <mesh position={[0, 0.5, -depth / 2]} castShadow>
            <boxGeometry args={[width + 0.4, 0.8, 0.25]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.5, depth / 2]} castShadow>
            <boxGeometry args={[width + 0.4, 0.8, 0.25]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[-width / 2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, depth]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[width / 2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, depth]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>

          {/* Solar Panel Arrays */}
          {[-8, 0, 8].map((zOffset, rIdx) => (
            <group key={`solar-${rIdx}`} position={[0, 0.5, zOffset]} rotation={[-0.26, 0, 0]}>
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
            </group>
          ))}
        </group>
      )}

      {/* 6. Grand Main Entrance */}
      <group position={[0, 0, depth / 2]} name="main-entrance">
        <mesh position={[0, 3.0, 2.6]} castShadow>
          <boxGeometry args={[10.5, 0.25, 4.2]} />
          <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0, 2.85, 4.4]}>
          <boxGeometry args={[10.0, 0.05, 0.15]} />
          <meshStandardMaterial color="#9ff0ec" emissive="#9ff0ec" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.12, 1.2]} receiveShadow>
          <boxGeometry args={[8.5, 0.24, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>

      {/* 7. FLOATING BILLBOARD BLOCK NAME LABEL & CAMPUS HOVER CARD */}
      {showLabels && !isInspectingFloor && (
        <Html
          position={[0, roofY + 3.0, 0]}
          center
          distanceFactor={28}
          zIndexRange={[80, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectBuilding(id);
            }}
            className={`cursor-pointer px-4 py-2.5 rounded-2xl border backdrop-blur-xl flex items-center gap-3 transition-all select-none shadow-[0_16px_40px_rgba(0,0,0,0.8)] ${
              isSelected
                ? 'bg-[#006bff]/95 border-[#9ff0ec] text-white shadow-[0_0_30px_rgba(0,107,255,0.7)] scale-110'
                : isBuildingHovered
                ? 'bg-[#181d2c]/95 border-[#9ff0ec] text-white scale-105'
                : 'bg-[#131219]/90 border-white/15 text-[#b9b8bb] hover:border-[#9ff0ec]/50'
            }`}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl font-mono font-bold text-xs text-white shadow-md"
              style={{ backgroundColor: accentColor || '#38bdf8' }}
            >
              {code || shortName}
            </div>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white tracking-tight">{name}</span>
              <div className="text-[10px] text-[#9ff0ec] font-mono flex items-center gap-1.5 mt-0.5">
                <span>{floorCount} Floors</span>
                <span>•</span>
                <span>{buildingStudents.length} Students</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{buildingKw} kW</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
