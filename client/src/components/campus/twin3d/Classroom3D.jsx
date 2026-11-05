import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { ANIMATION_CONFIG } from '../../../config/buildings.config.js';

export function Classroom3D({ classroom, buildingId, floorLevel }) {
  const { id, name, code, width, depth, offset, layout, department } = classroom;
  const [hovered, setHovered] = useState(false);

  const fanBladesRef1 = useRef();
  const fanBladesRef2 = useRef();

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const students = useTwin3DStore((s) => s.students);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);

  const isSelected = selectedClassroomId === id;
  const isFloorSelected = selectedBuildingId === buildingId && selectedFloorLevel === floorLevel;
  const isCutaway = xrayMode || isFloorSelected || isSelected;

  // Calculate live occupancy for this room
  const roomStudents = useMemo(() => {
    return students.filter((s) => s.classroomId === id);
  }, [students, id]);

  const totalSeats = layout?.seats?.length || 0;
  const occupancyPct = totalSeats > 0 ? Math.round((roomStudents.length / totalSeats) * 100) : 0;

  // Base wall height and cutaway viewing height
  const fullWallHeight = 3.2;
  // In cutaway / floor-inspection mode, lower front walls to 0.85m so classrooms, benches, and students are clearly visible
  const viewingWallHeight = isCutaway ? 0.85 : 3.2;

  // Animate ceiling fan blades smoothly
  useFrame((_, delta) => {
    if (!ANIMATION_CONFIG.enabled) return;
    const spinSpeed = delta * 8.0;
    if (fanBladesRef1.current) fanBladesRef1.current.rotation.y += spinSpeed;
    if (fanBladesRef2.current) fanBladesRef2.current.rotation.y += spinSpeed;
  });

  return (
    <group
      name={`classroom-${id}`}
      position={[offset[0], 0, offset[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectClassroom(id);
      }}
    >
      {/* 1. Classroom Flooring (Warm institutional timber/terrazzo finish) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.1, depth - 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#20293d' : '#181e2b'}
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Perimeter Walls with Architectural Cutaway for Clear Visibility */}
      {/* Front Wall (where teaching chalkboard sits - always full height to mount board & clock) */}
      <mesh position={[0, fullWallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, fullWallHeight, 0.18]} />
        <meshStandardMaterial color="#2d3342" roughness={0.7} />
      </mesh>

      {/* Back / Corridor Wall (Waist-height cutaway so students and benches are visible) */}
      <mesh position={[0, viewingWallHeight / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, viewingWallHeight, 0.18]} />
        <meshStandardMaterial color="#282e3d" roughness={0.7} />
      </mesh>
      {/* Glass upper partition on corridor wall when not cutaway */}
      {!isCutaway && (
        <mesh position={[0, (fullWallHeight + viewingWallHeight) / 2, depth / 2]}>
          <boxGeometry args={[width * 0.75, fullWallHeight - viewingWallHeight, 0.04]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.2} roughness={0.1} />
        </mesh>
      )}

      {/* Left Dividing Wall (Lowered near front in cutaway mode) */}
      <mesh
        position={[-width / 2, (isCutaway ? 1.6 : fullWallHeight) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.18, isCutaway ? 1.6 : fullWallHeight, depth]} />
        <meshStandardMaterial color="#242936" roughness={0.7} />
      </mesh>

      {/* Right Dividing Wall */}
      <mesh
        position={[width / 2, (isCutaway ? 1.6 : fullWallHeight) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.18, isCutaway ? 1.6 : fullWallHeight, depth]} />
        <meshStandardMaterial color="#242936" roughness={0.7} />
      </mesh>

      {/* 3. Teaching Green Chalkboard with Metal Trim & Chalk Tray */}
      <group position={[0, 1.85, -depth / 2 + 0.12]}>
        {/* Board Surface */}
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 1.45, 0.04]} />
          <meshStandardMaterial color="#14532d" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* Metal Outer Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55) + 0.14, 1.55, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Chalk Tray */}
        <mesh position={[0, -0.74, 0.04]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 0.04, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      </group>

      {/* Wall Clock above board */}
      <group position={[0, fullWallHeight - 0.45, -depth / 2 + 0.11]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.02, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
      </group>

      {/* 4. Standing Teacher Figure at Front */}
      <group position={[1.0, 0, -depth / 2 + 1.4]} rotation={[0, Math.PI, 0]}>
        {/* Head */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Torso (Formal Teacher Blazer) */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.38, 0.58, 0.22]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        {/* Standing Legs */}
        <mesh position={[-0.1, 0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.95, 0.16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.95, 0.16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>
      </group>

      {/* 5. PROCEDURAL CEILING FANS (2 Rotating Fans per Classroom) */}
      {/* Ceiling Fan 1 (Front Area) */}
      <group position={[0, fullWallHeight - 0.1, -depth * 0.2]}>
        {/* Ceiling Mount Bracket */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Downrod */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Motor Housing */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.10, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Rotating 3 Aerofoil Blades */}
        <group ref={fanBladesRef1} position={[0, -0.44, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, bIdx) => (
            <group key={`fan1-b-${bIdx}`} rotation={[0, angle, 0]}>
              <mesh position={[0.62, 0, 0]} rotation={[0.15, 0, 0]} castShadow>
                <boxGeometry args={[1.05, 0.015, 0.14]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Ceiling Fan 2 (Rear Area) */}
      <group position={[0, fullWallHeight - 0.1, depth * 0.22]}>
        {/* Ceiling Mount Bracket */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Downrod */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Motor Housing */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.10, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Rotating 3 Aerofoil Blades */}
        <group ref={fanBladesRef2} position={[0, -0.44, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, bIdx) => (
            <group key={`fan2-b-${bIdx}`} rotation={[0, angle, 0]}>
              <mesh position={[0.62, 0, 0]} rotation={[0.15, 0, 0]} castShadow>
                <boxGeometry args={[1.05, 0.015, 0.14]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 6. Warm LED Ceiling Lighting Strips */}
      <mesh position={[-width * 0.25, fullWallHeight - 0.05, 0]}>
        <boxGeometry args={[0.2, 0.03, depth * 0.7]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[width * 0.25, fullWallHeight - 0.05, 0]}>
        <boxGeometry args={[0.2, 0.03, depth * 0.7]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.4} />
      </mesh>

      {/* 7. Floating 3D Room Label */}
      {showLabels && (
        <Html
          position={[0, viewingWallHeight + 0.6, 0]}
          center
          distanceFactor={22}
          zIndexRange={[80, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectClassroom(id);
            }}
            className={`cursor-pointer px-3 py-1.5 rounded-xl border backdrop-blur-md flex items-center gap-2 transition-all select-none ${
              isSelected
                ? 'bg-[#006bff]/95 border-[#9ff0ec] text-white shadow-[0_0_20px_rgba(0,107,255,0.7)] scale-105'
                : hovered
                ? 'bg-[#181a26]/95 border-[#9ff0ec]/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
                : 'bg-[#131219]/90 border-white/10 text-[#b9b8bb] hover:border-white/30'
            }`}
          >
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9ff0ec]" />
                <span className="text-xs font-bold text-white tracking-tight">{code || name}</span>
              </div>
              <span className="text-[9px] text-[#c9c3da] font-mono">{department || 'Academic'}</span>
            </div>

            <div className="pl-1.5 border-l border-white/10 flex flex-col items-end">
              <span className="text-[11px] font-mono font-bold text-[#9ff0ec]">
                {roomStudents.length}/{totalSeats}
              </span>
              <span className="text-[8px] text-[#b9b8bb] font-mono">{occupancyPct}% full</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
