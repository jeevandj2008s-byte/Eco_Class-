import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D.jsx';
import { FLOOR_HEIGHT, ANIMATION_CONFIG } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

/**
 * Architectural Theme Colors per Campus Building
 * Believable solid opaque concrete, stone and brick finishes with subtle distinction
 */
const BLOCK_THEMES = {
  'bit-main': {
    wallColor: '#dfdcd5',      // Warm architectural limestone concrete
    trimColor: '#1e2638',      // Deep slate architectural trim
    windowGlass: '#0a101d',    // Dark reflective glass panes
    windowFrame: '#2c3547',
    corniceColor: '#c8c4bc',
    accent: '#38bdf8',
    roofSlab: '#1e2433',
    plinthColor: '#121622'
  },
  'bit-block-central': {
    wallColor: '#d6d3cb',      // Warm buff architectural finish
    trimColor: '#283344',
    windowGlass: '#0b111e',
    windowFrame: '#334055',
    corniceColor: '#c2beb5',
    accent: '#a78bfa',
    roofSlab: '#1c2230',
    plinthColor: '#121622'
  },
  'bit-mechanical': {
    wallColor: '#d2cfc7',      // Engineering sandstone grey
    trimColor: '#242e3f',
    windowGlass: '#090e1a',
    windowFrame: '#374357',
    corniceColor: '#bebab0',
    accent: '#34d399',
    roofSlab: '#1b202c',
    plinthColor: '#121622'
  },
  'bit-block-east': {
    wallColor: '#ddd9d0',      // Academic cream concrete
    trimColor: '#2a3447',
    windowGlass: '#0b111e',
    windowFrame: '#364359',
    corniceColor: '#c6c2b8',
    accent: '#fbbf24',
    roofSlab: '#1e2433',
    plinthColor: '#121622'
  },
  'bit-block-strip': {
    wallColor: '#d9d6ce',      // Platinum concrete
    trimColor: '#202a3a',
    windowGlass: '#0a0f1c',
    windowFrame: '#2d3a4d',
    corniceColor: '#c2beb4',
    accent: '#10b981',
    roofSlab: '#1c2230',
    plinthColor: '#121622'
  },
  'bit-block-southeast': {
    wallColor: '#d4d0c7',      // Neutral warm grey concrete
    trimColor: '#253042',
    windowGlass: '#0b111d',
    windowFrame: '#344155',
    corniceColor: '#bdb8ae',
    accent: '#f97316',
    roofSlab: '#1a1f2b',
    plinthColor: '#121622'
  },
  'bit-guest-house': {
    wallColor: '#e3dfd7',      // Ivory residential plaster & brick
    trimColor: '#2b364a',
    windowGlass: '#0c1220',
    windowFrame: '#3b4960',
    corniceColor: '#cac6bc',
    accent: '#14b8a6',
    roofSlab: '#1d2331',
    plinthColor: '#121622'
  },
  'bit-parking': {
    wallColor: '#1f2637',      // Structural dark steel & concrete facility
    trimColor: '#006bff',
    windowGlass: '#006bff',
    windowFrame: '#1b2232',
    corniceColor: '#161d2b',
    accent: '#006bff',
    roofSlab: '#141a26',
    plinthColor: '#0f131d'
  }
};

export function Building3D({ building, telemetry }) {
  const {
    id,
    name,
    code,
    shortName,
    baselineKw,
    accentColor = '#38bdf8',
    position,
    width,
    depth,
    floorCount,
    floors = [],
    courtyard
  } = building;

  const flagMeshRef = useRef();
  const fountainWaterRef = useRef();
  const roofGroupRef = useRef();
  const buildingGroupRef = useRef();
  const liftAnimRef = useRef(0);

  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [isBuildingHovered, setIsBuildingHovered] = useState(false);

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedBuildingId === id;
  const isInspectingFloor = isSelected && selectedFloorLevel !== null;

  const totalHeight = floorCount * FLOOR_HEIGHT;
  const theme = BLOCK_THEMES[id] || BLOCK_THEMES['bit-main'];

  // Telemetry kW
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

  // Architectural facade window layout calculations
  const facadeWindows = useMemo(() => {
    const windowConfigs = [];
    const windowWidth = 2.4;
    const windowHeight = 1.6;
    const sillHeight = 0.85;
    const spacing = 4.2;

    for (let f = 1; f <= floorCount; f++) {
      const floorBaseY = (f - 1) * FLOOR_HEIGHT;
      const winY = floorBaseY + sillHeight + windowHeight / 2;

      // North & South Facades (along X axis)
      const xCount = Math.max(2, Math.floor((width - 4.0) / spacing));
      const xStart = -((xCount - 1) * spacing) / 2;
      for (let i = 0; i < xCount; i++) {
        const xPos = xStart + i * spacing;
        // North
        windowConfigs.push({
          pos: [xPos, winY, -depth / 2 - 0.02],
          size: [windowWidth, windowHeight, 0.12],
          floor: f,
          side: 'north'
        });
        // South (leave entrance opening on ground floor)
        if (!(f === 1 && Math.abs(xPos) < 5.0)) {
          windowConfigs.push({
            pos: [xPos, winY, depth / 2 + 0.02],
            size: [windowWidth, windowHeight, 0.12],
            floor: f,
            side: 'south'
          });
        }
      }

      // East & West Facades (along Z axis)
      const zCount = Math.max(2, Math.floor((depth - 4.0) / spacing));
      const zStart = -((zCount - 1) * spacing) / 2;
      for (let j = 0; j < zCount; j++) {
        const zPos = zStart + j * spacing;
        // West
        windowConfigs.push({
          pos: [-width / 2 - 0.02, winY, zPos],
          size: [0.12, windowHeight, windowWidth],
          floor: f,
          side: 'west'
        });
        // East
        windowConfigs.push({
          pos: [width / 2 + 0.02, winY, zPos],
          size: [0.12, windowHeight, windowWidth],
          floor: f,
          side: 'east'
        });
      }
    }

    return windowConfigs;
  }, [width, depth, floorCount]);

  // Smooth animation for floor cutaway lift-away
  useFrame((state, delta) => {
    // Courtyard flag wave
    if (ANIMATION_CONFIG.enabled && ANIMATION_CONFIG.flagWave && flagMeshRef.current) {
      flagMeshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 3.0) * 0.15;
    }

    // Courtyard fountain water shimmer
    if (ANIMATION_CONFIG.enabled && ANIMATION_CONFIG.fountainWater && fountainWaterRef.current) {
      fountainWaterRef.current.material.opacity = 0.55 + Math.sin(state.clock.getElapsedTime() * 3.5) * 0.15;
    }

    // Smooth hover micro-elevation
    if (buildingGroupRef.current) {
      const targetHoverY = isBuildingHovered ? 0.35 : 0.0;
      buildingGroupRef.current.position.y = THREE.MathUtils.damp(
        buildingGroupRef.current.position.y,
        targetHoverY,
        7.0,
        delta
      );
    }

    // Smooth lift-away easing for roof
    const targetLift = isInspectingFloor ? 1.0 : 0.0;
    liftAnimRef.current = THREE.MathUtils.damp(liftAnimRef.current, targetLift, 5.0, delta);

    if (roofGroupRef.current) {
      const liftY = liftAnimRef.current * 18.0;
      roofGroupRef.current.position.y = totalHeight + liftY;
      roofGroupRef.current.visible = liftAnimRef.current < 0.95;
    }
  });

  return (
    <group
      ref={buildingGroupRef}
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
      {/* 0. Ambient Ground Contact Drop Shadow */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 3.2, depth + 3.2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* 1. Heavy Solid Foundation Plinth */}
      <group position={[0, -0.4, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[width + 1.8, 0.8, depth + 1.8]} />
          <meshStandardMaterial
            color={theme.plinthColor}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Foundation Plinth Top Slab (Realistic architectural finish, no harsh cyan flood) */}
        <mesh position={[0, 0.42, 0]} receiveShadow>
          <boxGeometry args={[width + 0.6, 0.12, depth + 0.6]} />
          <meshStandardMaterial
            color={isInspectingFloor ? '#151922' : isSelected ? '#1e2538' : isBuildingHovered ? '#252f42' : '#121622'}
            roughness={0.8}
            metalness={0.15}
          />
        </mesh>
        {/* Subtle Outer Perimeter Selection Ring */}
        {isSelected && !isInspectingFloor && (
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[width + 0.64, 0.02, depth + 0.64]} />
            <meshStandardMaterial
              color="#006bff"
              emissive="#006bff"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>

      {/* 2. SOLID OPAQUE EXTERIOR FAÇADE (Rendered when building is closed or at lower floors) */}
      <group name="solid-exterior-facade">
        {floors.map((f) => {
          const isThisFloorCutaway = isInspectingFloor && selectedFloorLevel === f.level;
          const isThisFloorAbove = isInspectingFloor && f.level > selectedFloorLevel;
          // Hide exterior walls on the cutaway floor so classrooms are visible from above
          if (isThisFloorCutaway || isThisFloorAbove) return null;

          const fBaseY = (f.level - 1) * FLOOR_HEIGHT;
          const fMidY = fBaseY + FLOOR_HEIGHT / 2;
          const wallThick = 0.35;

          return (
            <group key={`solid-floor-${f.level}`}>
              {/* North Wall */}
              <mesh position={[0, fMidY, -depth / 2 + wallThick / 2]} castShadow receiveShadow>
                <boxGeometry args={[width, FLOOR_HEIGHT, wallThick]} />
                <meshStandardMaterial
                  color={theme.wallColor}
                  roughness={0.78}
                  metalness={0.08}
                />
              </mesh>

              {/* South Wall */}
              {f.level === 1 ? (
                // Ground floor South wall with entrance cutout
                <group position={[0, fMidY, depth / 2 - wallThick / 2]}>
                  <mesh position={[-(width / 4 + 3.0), 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width / 2 - 6.0, FLOOR_HEIGHT, wallThick]} />
                    <meshStandardMaterial color={theme.wallColor} roughness={0.78} metalness={0.08} />
                  </mesh>
                  <mesh position={[(width / 4 + 3.0), 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width / 2 - 6.0, FLOOR_HEIGHT, wallThick]} />
                    <meshStandardMaterial color={theme.wallColor} roughness={0.78} metalness={0.08} />
                  </mesh>
                  {/* Lintel above main entrance */}
                  <mesh position={[0, FLOOR_HEIGHT / 2 - 0.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[12.0, 1.0, wallThick]} />
                    <meshStandardMaterial color={theme.trimColor} roughness={0.6} metalness={0.2} />
                  </mesh>
                </group>
              ) : (
                <mesh position={[0, fMidY, depth / 2 - wallThick / 2]} castShadow receiveShadow>
                  <boxGeometry args={[width, FLOOR_HEIGHT, wallThick]} />
                  <meshStandardMaterial
                    color={theme.wallColor}
                    roughness={0.78}
                    metalness={0.08}
                  />
                </mesh>
              )}

              {/* West Wall */}
              <mesh position={[-width / 2 + wallThick / 2, fMidY, 0]} castShadow receiveShadow>
                <boxGeometry args={[wallThick, FLOOR_HEIGHT, depth]} />
                <meshStandardMaterial
                  color={theme.wallColor}
                  roughness={0.78}
                  metalness={0.08}
                />
              </mesh>

              {/* East Wall */}
              <mesh position={[width / 2 - wallThick / 2, fMidY, 0]} castShadow receiveShadow>
                <boxGeometry args={[wallThick, FLOOR_HEIGHT, depth]} />
                <meshStandardMaterial
                  color={theme.wallColor}
                  roughness={0.78}
                  metalness={0.08}
                />
              </mesh>

              {/* Floor Slab Edge Cornice Line */}
              <mesh position={[0, fBaseY + 0.1, 0]} receiveShadow>
                <boxGeometry args={[width + 0.35, 0.22, depth + 0.35]} />
                <meshStandardMaterial color={theme.corniceColor} roughness={0.6} metalness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Recessed Dark Reflective Windows (Only shown when floor is not in cutaway) */}
        {facadeWindows.map((win, idx) => {
          const isWinFloorCutaway = isInspectingFloor && selectedFloorLevel === win.floor;
          const isWinFloorAbove = isInspectingFloor && win.floor > selectedFloorLevel;
          if (isWinFloorCutaway || isWinFloorAbove) return null;

          return (
            <group key={`win-${idx}`} position={win.pos}>
              {/* Outer Window Frame */}
              <mesh castShadow>
                <boxGeometry args={win.size} />
                <meshStandardMaterial color={theme.windowFrame} roughness={0.5} metalness={0.5} />
              </mesh>
              {/* Dark Reflective Glass Pane */}
              <mesh position={[0, 0, win.side === 'north' ? 0.02 : win.side === 'south' ? -0.02 : 0]}>
                <boxGeometry
                  args={[
                    win.side === 'east' || win.side === 'west' ? win.size[0] + 0.02 : win.size[0] - 0.2,
                    win.size[1] - 0.2,
                    win.side === 'east' || win.side === 'west' ? win.size[2] - 0.2 : win.size[2] + 0.02
                  ]}
                />
                <meshStandardMaterial
                  color={theme.windowGlass}
                  roughness={0.15}
                  metalness={0.85}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 3. Stacked Volumetric Floors (Interiors are revealed ONLY when this floor is tapped) */}
      {floors.map((floor) => (
        <Floor3D
          key={floor.level}
          floor={floor}
          buildingWidth={width}
          buildingDepth={depth}
          buildingId={id}
          courtyard={courtyard}
          theme={theme}
        />
      ))}

      {/* 4. Central Courtyard Quadrangle (BIT Main Block) */}
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

      {/* 5. INTERACTIVE FLOOR HIGHLIGHT BANDS & HOVER CARDS */}
      {floors.map((f) => {
        const fY = (f.level - 1) * FLOOR_HEIGHT;
        const isFSelected = isSelected && selectedFloorLevel === f.level;
        const isFHovered = hoveredFloor === f.level;

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
            {/* Interactive Amber Glow Hover Band on Facade */}
            <mesh
              position={[0, 0.1, depth / 2 + 0.22]}
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
              <boxGeometry args={[width * 0.96, 0.2, 0.12]} />
              <meshStandardMaterial
                color={isFSelected ? '#006bff' : isFHovered ? '#f59e0b' : theme.accent}
                emissive={isFSelected ? '#006bff' : isFHovered ? '#f59e0b' : theme.accent}
                emissiveIntensity={isFSelected ? 2.0 : isFHovered ? 1.8 : 0.2}
              />
            </mesh>

            {/* Floating Floor Hover Card */}
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
                    <span>Open Floor Cutaway</span>
                    <span>→</span>
                  </button>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* 6. SOLID ROOFTOP INFRASTRUCTURE (Lifts away smoothly during floor cutaway) */}
      <group ref={roofGroupRef} position={[0, totalHeight, 0]} name="rooftop-infrastructure">
        {/* Concrete Roof Slab */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.4, 0.28, depth + 0.4]} />
          <meshStandardMaterial color={theme.roofSlab} roughness={0.85} metalness={0.15} />
        </mesh>

        {/* Solid Parapet Walls */}
        <mesh position={[0, 0.6, -depth / 2]} castShadow>
          <boxGeometry args={[width + 0.4, 0.9, 0.3]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.6, depth / 2]} castShadow>
          <boxGeometry args={[width + 0.4, 0.9, 0.3]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.7} />
        </mesh>
        <mesh position={[-width / 2, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 0.9, depth]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.7} />
        </mesh>
        <mesh position={[width / 2, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 0.9, depth]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.7} />
        </mesh>

        {/* Elevator & Staircase Penthouse Overrun */}
        <mesh position={[-width / 4, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.5, 2.6, 6.0]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.65} metalness={0.2} />
        </mesh>

        {/* HVAC Chillers / Mechanical Units */}
        <group position={[width / 4, 0.9, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, 1.6, 3.2]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        </group>

        {/* Solar Panel Arrays */}
        {[-8, 0, 8].map((zOffset, rIdx) => (
          <group key={`solar-${rIdx}`} position={[0, 0.6, zOffset]} rotation={[-0.26, 0, 0]}>
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

      {/* 7. Solid Grand Main Entrance */}
      <group position={[0, 0, depth / 2]} name="main-entrance">
        {/* Entrance Steps / Plinth */}
        <mesh position={[0, 0.14, 1.6]} receiveShadow>
          <boxGeometry args={[11.0, 0.28, 3.2]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.32, 1.2]} receiveShadow>
          <boxGeometry args={[9.5, 0.28, 2.2]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>

        {/* Supporting Entrance Columns */}
        <mesh position={[-4.5, 1.7, 3.2]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 3.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[4.5, 1.7, 3.2]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 3.0, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Entrance Portico Canopy */}
        <mesh position={[0, 3.2, 2.6]} castShadow>
          <boxGeometry args={[11.5, 0.3, 4.2]} />
          <meshStandardMaterial color={theme.trimColor} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Architectural Glow Strip on Canopy */}
        <mesh position={[0, 3.05, 4.6]}>
          <boxGeometry args={[11.0, 0.06, 0.15]} />
          <meshStandardMaterial color="#9ff0ec" emissive="#9ff0ec" emissiveIntensity={1.5} />
        </mesh>

        {/* Glass Entrance Doors */}
        <mesh position={[0, 1.5, 0.05]} castShadow>
          <boxGeometry args={[5.0, 2.6, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* 8. SLEEK NON-OVERLAPPING 3D BILLBOARD TAG (Expands on Hover/Select) */}
      {showLabels && !isInspectingFloor && (
        <Html
          position={[0, totalHeight + 2.8, 0]}
          center
          distanceFactor={30}
          zIndexRange={[80, 0]}
        >
          {isBuildingHovered || isSelected ? (
            /* Expanded Interactive Card on Hover/Select */
            <div
              onClick={(e) => {
                e.stopPropagation();
                selectBuilding(id);
              }}
              className="cursor-pointer px-3.5 py-2 rounded-2xl bg-[#131219]/95 border border-[#9ff0ec] text-white shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(0,107,255,0.4)] backdrop-blur-xl flex items-center gap-2.5 transition-all select-none scale-105 animate-fade-in"
            >
              <div
                className="flex items-center justify-center w-7 h-7 rounded-xl font-mono font-bold text-xs text-white shadow-md"
                style={{ backgroundColor: accentColor || '#38bdf8' }}
              >
                {code || shortName}
              </div>

              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white tracking-tight">{name}</span>
                <div className="text-[10px] text-[#9ff0ec] font-mono flex items-center gap-1.5 mt-0.5">
                  <span>{floorCount}F</span>
                  <span>•</span>
                  <span>{buildingStudents.length} Students</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{buildingKw} kW</span>
                </div>
              </div>
            </div>
          ) : (
            /* Minimal Non-Overlapping Tag Pill by Default */
            <div
              onClick={(e) => {
                e.stopPropagation();
                selectBuilding(id);
              }}
              className="cursor-pointer px-2.5 py-1 rounded-xl bg-[#10131d]/90 hover:bg-[#181d2c] border border-white/20 hover:border-[#9ff0ec] text-white backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all select-none whitespace-nowrap text-[11px] font-mono"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: accentColor || '#38bdf8' }}
              />
              <span className="font-bold tracking-tight text-white/90">{code || shortName}</span>
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
