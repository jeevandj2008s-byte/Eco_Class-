import React, { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Classroom3D({ classroom, buildingId, floorLevel }) {
  const { id, name, code, width, depth, offset, layout, department } = classroom;
  const [hovered, setHovered] = useState(false);

  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedClassroomId === id;

  // Calculate live occupancy for this room
  const roomStudents = useMemo(() => {
    return students.filter((s) => s.classroomId === id);
  }, [students, id]);

  const totalSeats = layout?.seats?.length || 0;
  const occupancyPct = totalSeats > 0 ? Math.round((roomStudents.length / totalSeats) * 100) : 0;

  // Base wall height
  const wallHeight = 3.2;

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
      {/* 1. Floor Slab (Warm institutional wood/sand finish contrasting with cool glass) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.1, depth - 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#25324d' : '#1c2230'}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Perimeter Walls (Warm Sand / Beige tone on inside) */}
      {/* Back Wall */}
      <mesh position={[0, wallHeight / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.15]} />
        <meshStandardMaterial color="#2d3342" roughness={0.75} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, wallHeight, depth]} />
        <meshStandardMaterial color="#262b38" roughness={0.75} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, wallHeight, depth]} />
        <meshStandardMaterial color="#262b38" roughness={0.75} />
      </mesh>

      {/* Front Wall (where teaching board sits) */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.15]} />
        <meshStandardMaterial color="#2d3342" roughness={0.75} />
      </mesh>

      {/* 3. Teaching Board (Green Chalkboard / Whiteboard Hybrid) */}
      <mesh position={[0, 1.8, -depth / 2 + 0.1]} receiveShadow>
        <boxGeometry args={[Math.min(4.2, width * 0.5), 1.35, 0.04]} />
        <meshStandardMaterial
          color="#164e3f"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Metallic Board Frame Border */}
      <mesh position={[0, 1.8, -depth / 2 + 0.08]}>
        <boxGeometry args={[Math.min(4.2, width * 0.5) + 0.12, 1.45, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 4. Standing Teacher Figure at Front */}
      <group position={[0.8, 0, -depth / 2 + 1.4]} rotation={[0, Math.PI, 0]}>
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

      {/* 5. Corridor Glass Partition with Door Cutout */}
      <group position={[0, wallHeight / 2, depth / 2 - 0.1]}>
        {/* Glass Wall Section */}
        <mesh position={[-width * 0.15, 0, 0]}>
          <boxGeometry args={[width * 0.65, wallHeight, 0.05]} />
          <meshStandardMaterial
            color="#60a5fa"
            transparent
            opacity={0.18}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Door Frame & Header */}
        <mesh position={[width * 0.35, wallHeight / 2 - 0.3, 0]}>
          <boxGeometry args={[1.4, 0.6, 0.08]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* 6. Warm Ceiling Lighting Strip */}
      <mesh position={[0, wallHeight - 0.1, 0]}>
        <boxGeometry args={[width * 0.65, 0.04, 0.2]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fde68a"
          emissiveIntensity={1.3}
        />
      </mesh>

      {/* 7. Floating 3D Room Label */}
      {showLabels && (
        <Html
          position={[0, wallHeight + 0.6, 0]}
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
                ? 'bg-[#006bff]/90 border-[#9ff0ec] text-white shadow-[0_0_20px_rgba(0,107,255,0.6)] scale-105'
                : hovered
                ? 'bg-[#181a26]/95 border-[#9ff0ec]/50 text-white shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
                : 'bg-[#131219]/90 border-white/10 text-[#b9b8bb] hover:border-white/30'
            }`}
          >
            <div className="flex flex-col items-start leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9ff0ec]" />
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
