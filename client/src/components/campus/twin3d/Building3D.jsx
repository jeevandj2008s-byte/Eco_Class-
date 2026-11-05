import React, { useMemo, useRef, useState } from 'react';
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
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);

  const isSelected = selectedBuildingId === id;
  const isInspectingFloor = isSelected && selectedFloorLevel !== null;
  const isCutaway = xrayMode || isInspectingFloor || (isSelected && selectedClassroomId !== null);

  const activeFloorCount = isInspectingFloor ? Math.min(floorCount, selectedFloorLevel) : floorCount;
  const activeHeight = activeFloorCount * FLOOR_HEIGHT;
  const totalHeight = floorCount * FLOOR_HEIGHT;
  const roofY = totalHeight + (floorCount - 1) * explodedHeight * 3.5;

  const labelConfig = useMemo(() => {
    return BLOCK_LABELS_CONFIG.find((l) => l.id === id) || {
      name,
      shortName: code || name,
      accentColor: color || '#38bdf8',
      entranceLabel: 'Main Entrance'
    };
  }, [id, name, code, color]);

  const buildingTelemetry = useMemo(() => {
    if (!telemetry?.buildings) return { realKw: 42, ghostKw: 31 };
    if (Array.isArray(telemetry.buildings)) {
      return telemetry.buildings.find((b) => b.id === id || b.buildingId === id) || { realKw: 42, ghostKw: 31 };
    }
    return telemetry.buildings[id] || { realKw: 42, ghostKw: 31 };
  }, [telemetry, id]);

  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  // Exterior vertical architectural mullions / glass columns
  const facadeMullions = useMemo(() => {
    const cols = [];
    const spacing = 6.0;
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
      {/* 1. Heavy Architectural Plinth Foundation */}
      <group position={[0, -0.4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[width + 2.0, 0.8, depth + 2.0]} />
          <meshStandardMaterial color="#0b0e17" roughness={0.9} />
        </mesh>
        {/* Accent Plinth Water Table */}
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <boxGeometry args={[width + 0.8, 0.12, depth + 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* 2. Floors & Interior Layout */}
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

      {/* 3. Central Landscaped Quadrangle (Block A) */}
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

          {/* Water Fountain */}
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

          {/* Flag Pole */}
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
        </group>
      )}

      {/* 4. CRYSTAL-CLEAR LUXURY ARCHITECTURAL GLASS CURTAIN FACADE */}
      <group name="luxury-glass-curtain-facade">
        {/* Exterior Mullions / Vertical Aluminum Columns */}
        {facadeMullions.map((c, i) => (
          <mesh key={`mullion-${i}`} position={c} castShadow={!isCutaway}>
            <boxGeometry args={[0.3, activeHeight, 0.3]} />
            <meshStandardMaterial color="#1e2433" roughness={0.3} metalness={0.7} />
          </mesh>
        ))}

        {/* Floor Slab Edge Architectural Bands */}
        {floors.slice(0, activeFloorCount).map((f) => {
          const fY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;
          const isFSelected = isSelected && selectedFloorLevel === f.level;
          const isFHovered = hoveredFloor === f.level;

          return (
            <group key={`facade-band-${f.level}`} position={[0, fY, 0]}>
              {/* Floor Slab Edge Cornice Band */}
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[width + 0.4, 0.28, depth + 0.4]} />
                <meshStandardMaterial
                  color={isFSelected ? '#006bff' : isFHovered ? '#38bdf8' : '#273144'}
                  roughness={0.3}
                  metalness={0.8}
                  emissive={isFSelected ? '#006bff' : isFHovered ? '#38bdf8' : '#000000'}
                  emissiveIntensity={isFSelected ? 0.6 : isFHovered ? 0.3 : 0}
                />
              </mesh>

              {/* Glowing Interactive Floor Highlight Line */}
              <mesh position={[0, 0.1, depth / 2 + 0.22]}>
                <boxGeometry args={[width * 0.95, 0.05, 0.05]} />
                <meshStandardMaterial
                  color="#9ff0ec"
                  emissive="#9ff0ec"
                  emissiveIntensity={isFSelected || isFHovered ? 2.0 : 0.4}
                />
              </mesh>

              {/* INTERACTIVE FLOOR PLUS [+] TAG (as in reference video frame 0 & 1) */}
              {!isInspectingFloor && showLabels && (
                <Html
                  position={[width / 2 + 2.5, 1.4, 0]}
                  center
                  distanceFactor={26}
                  zIndexRange={[90, 0]}
                >
                  <div
                    onMouseEnter={() => setHoveredFloor(f.level)}
                    onMouseLeave={() => setHoveredFloor(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectFloor(id, f.level);
                    }}
                    className={`group cursor-pointer px-3.5 py-1.5 rounded-full border backdrop-blur-xl flex items-center gap-2.5 transition-all select-none shadow-[0_8px_24px_rgba(0,0,0,0.6)] ${
                      isFSelected
                        ? 'bg-[#006bff] border-[#9ff0ec] text-white scale-110 shadow-[0_0_20px_rgba(0,107,255,0.8)]'
                        : isFHovered
                        ? 'bg-[#181d2c]/95 border-[#9ff0ec] text-white scale-105'
                        : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-[#9ff0ec]/80 hover:text-white'
                    }`}
                  >
                    {/* Plus Icon Badge */}
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#9ff0ec]/20 border border-[#9ff0ec]/40 group-hover:bg-[#9ff0ec] group-hover:text-black transition-colors font-bold text-xs text-[#9ff0ec]">
                      +
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[11px] font-bold tracking-tight text-white">
                        Floor {f.level}
                      </span>
                      <span className="text-[9px] font-mono text-[#9ff0ec]">
                        {f.classrooms?.length || 0} Spaces
                      </span>
                    </div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}

        {/* Clear Glass Curtain Facade Panels */}
        {/* North Glass Wall */}
        <mesh position={[0, activeHeight / 2, -depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, activeHeight, 0.08]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* South Glass Wall */}
        <mesh position={[0, activeHeight / 2, depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, activeHeight, 0.08]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* West Glass Wall */}
        <mesh position={[-width / 2, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.08, activeHeight, depth]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* East Glass Wall */}
        <mesh position={[width / 2, activeHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.08, activeHeight, depth]} />
          <meshStandardMaterial
            color="#93c5fd"
            transparent
            opacity={isCutaway ? 0.04 : 0.28}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={1.2}
          />
        </mesh>
      </group>

      {/* 5. Rooftop Infrastructure (hidden during cutaway / floor view) */}
      {!isCutaway && (
        <group position={[0, roofY, 0]} name="rooftop-infrastructure">
          {/* Concrete Roof Slab */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.4, 0.25, depth + 0.4]} />
            <meshStandardMaterial color="#0c0e17" roughness={0.8} />
          </mesh>

          {/* Sleek Parapet Glass Railing */}
          <mesh position={[0, 0.55, -depth / 2]}>
            <boxGeometry args={[width + 0.4, 0.9, 0.08]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.55, depth / 2]}>
            <boxGeometry args={[width + 0.4, 0.9, 0.08]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
          </mesh>
          <mesh position={[-width / 2, 0.55, 0]}>
            <boxGeometry args={[0.08, 0.9, depth]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
          </mesh>
          <mesh position={[width / 2, 0.55, 0]}>
            <boxGeometry args={[0.08, 0.9, depth]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
          </mesh>

          {/* Tilted Solar Panel Arrays */}
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
            </group>
          ))}
        </group>
      )}

      {/* 6. Main Entrance */}
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
        <mesh position={[0, 0.24, 0.6]} receiveShadow>
          <boxGeometry args={[7.5, 0.24, 1.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        <mesh position={[-1.2, 1.5, 0.08]}>
          <boxGeometry args={[2.0, 2.8, 0.08]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[1.2, 1.5, 0.08]}>
          <boxGeometry args={[2.0, 2.8, 0.08]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* 7. Floating Billboard Block Name Label */}
      {!isInspectingFloor && showLabels && (
        <Html
          position={[0, roofY + 3.0, 0]}
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
                <span>{floorCount} Floors</span>
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
