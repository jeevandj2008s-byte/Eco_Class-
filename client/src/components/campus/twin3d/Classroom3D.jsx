import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { getRoomShowcaseData } from '../../../config/roomShowcase.config.js';

export function Classroom3D({ classroom, buildingId, floorLevel }) {
  const { id, name, code, width, depth, offset, department } = classroom;
  const [hovered, setHovered] = useState(false);

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const openRoomShowcase = useTwin3DStore((s) => s.openRoomShowcase);
  const showLabels = useTwin3DStore((s) => s.showLabels);

  const isSelected = selectedClassroomId === id;
  const isFloorSelected = selectedBuildingId === buildingId && selectedFloorLevel === floorLevel;
  const showcaseData = getRoomShowcaseData(id);

  // Architectural cutaway wall height (clean, non-obtrusive, like in the reference video)
  const wallHeight = 1.4;

  const handleOpenRoom = (e) => {
    e.stopPropagation();
    openRoomShowcase(id);
  };

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
      onClick={handleOpenRoom}
    >
      {/* 1. Polished Architectural Floor Slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.15, 0.1, depth - 0.15]} />
        <meshStandardMaterial
          color={isSelected ? '#1e3a5f' : hovered ? '#1e293b' : '#141a26'}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* 2. Soft Ambient Floor Area Rim */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[width - 0.4, 0.01, depth - 0.4]} />
        <meshBasicMaterial
          color={isSelected ? '#38bdf8' : hovered ? '#9ff0ec' : '#60a5fa'}
          wireframe
          opacity={isSelected ? 0.4 : hovered ? 0.3 : 0.08}
          transparent
        />
      </mesh>

      {/* 3. Clean Interior Architectural Partition Walls (Cutaway Height) */}
      {/* North Wall */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.16]} />
        <meshStandardMaterial color="#262d3d" roughness={0.7} />
      </mesh>
      {/* North Wall Aluminum Cap */}
      <mesh position={[0, wallHeight + 0.02, -depth / 2]}>
        <boxGeometry args={[width + 0.04, 0.04, 0.2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* South Wall (Corridor boundary with door passage cutout) */}
      <group position={[0, 0, depth / 2]}>
        <mesh position={[-width * 0.25, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.45, wallHeight, 0.16]} />
          <meshStandardMaterial color="#222838" roughness={0.7} />
        </mesh>
        <mesh position={[width * 0.25, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.45, wallHeight, 0.16]} />
          <meshStandardMaterial color="#222838" roughness={0.7} />
        </mesh>
        {/* Lintel over doorway */}
        <mesh position={[0, wallHeight - 0.15, 0]}>
          <boxGeometry args={[width * 0.18, 0.3, 0.16]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>
      </group>

      {/* West Dividing Wall */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, wallHeight, depth]} />
        <meshStandardMaterial color="#222838" roughness={0.7} />
      </mesh>

      {/* East Dividing Wall */}
      <mesh position={[width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, wallHeight, depth]} />
        <meshStandardMaterial color="#222838" roughness={0.7} />
      </mesh>

      {/* 4. Glowing Hotspot Concentric Ring on Floor */}
      <group position={[0, 0.12, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.95, 32]} />
          <meshBasicMaterial
            color="#9ff0ec"
            transparent
            opacity={hovered || isSelected ? 0.9 : 0.4}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial
            color="#006bff"
            transparent
            opacity={hovered || isSelected ? 0.35 : 0.12}
          />
        </mesh>
      </group>

      {/* 5. INTERACTIVE ROOM HOTSPOT PIN (Click to View Inside Picture) */}
      {showLabels && isFloorSelected && (
        <Html
          position={[0, 0.9, 0]}
          center
          distanceFactor={22}
          zIndexRange={[95, 0]}
        >
          <div
            onClick={handleOpenRoom}
            className={`cursor-pointer group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border backdrop-blur-xl transition-all duration-200 select-none shadow-[0_12px_32px_rgba(0,0,0,0.8)] ${
              isSelected
                ? 'bg-[#006bff] border-[#9ff0ec] text-white scale-110 shadow-[0_0_30px_rgba(0,107,255,0.9)]'
                : hovered
                ? 'bg-[#151a26]/95 border-[#9ff0ec] text-white scale-105 shadow-[0_0_20px_rgba(159,240,236,0.4)]'
                : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-[#9ff0ec]/80'
            }`}
          >
            {/* Plus / Eye Icon Badge */}
            <div className="flex items-center justify-center w-6 h-6 rounded-xl bg-[#9ff0ec]/20 border border-[#9ff0ec]/50 group-hover:bg-[#9ff0ec] group-hover:text-black transition-colors font-bold text-xs text-[#9ff0ec]">
              +
            </div>

            <div className="flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">
                  {code || name}
                </span>
                <span className="text-[10px] text-[#9ff0ec] font-mono px-1.5 py-0.2 rounded bg-black/40">
                  {showcaseData.areaSqFt}
                </span>
              </div>
              <div className="text-[9px] text-[#c9c3da] font-mono flex items-center gap-1 mt-0.5">
                <span>{showcaseData.category}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{showcaseData.powerDrawKw} kW</span>
              </div>
              <span className="text-[8px] text-[#9ff0ec]/80 font-mono mt-0.5 group-hover:text-white transition-colors">
                Click to explore inside picture →
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
