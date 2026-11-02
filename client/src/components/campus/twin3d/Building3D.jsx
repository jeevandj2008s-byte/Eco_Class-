import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D.jsx';
import { FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Building3D({ building, telemetry }) {
  const { id, name, code, color, position, width, depth, floorCount, floors = [] } = building;

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedBuildingId === id;
  const isInspectingInterior = isSelected && (selectedFloorLevel !== null || selectedClassroomId !== null);

  // Calculate live occupants and telemetry
  const buildingStudents = useMemo(() => {
    return students.filter((s) => s.buildingId === id);
  }, [students, id]);

  const buildingTelemetry = useMemo(() => {
    if (!telemetry?.buildings) return { realKw: 42, ghostKw: 31 };
    if (Array.isArray(telemetry.buildings)) {
      return telemetry.buildings.find((b) => b.id === id || b.buildingId === id) || { realKw: 42, ghostKw: 31 };
    }
    return telemetry.buildings[id] || { realKw: 42, ghostKw: 31 };
  }, [telemetry, id]);

  const totalHeight = floorCount * FLOOR_HEIGHT;
  const roofY = totalHeight + (floorCount - 1) * explodedHeight * 3.5;

  // Outer facade opacity: transparent if xrayMode or inspecting inside
  const isCutaway = xrayMode || isInspectingInterior;

  return (
    <group
      name={`building-${id}`}
      position={[position[0], 0, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        selectBuilding(id);
      }}
    >
      {/* 1. Building Foundation Slab */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[width + 1.2, 0.5, depth + 1.2]} />
        <meshStandardMaterial color="#0c0f17" roughness={0.9} />
      </mesh>

      {/* 2. Floors & Interior Layout */}
      {floors.map((floor) => (
        <Floor3D
          key={floor.level}
          floor={floor}
          buildingWidth={width}
          buildingDepth={depth}
          buildingId={id}
        />
      ))}

      {/* 3. Outer Walls / Architectural Facade */}
      <group name="facade-envelope">
        {/* North Wall */}
        <mesh position={[0, totalHeight / 2, -depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, totalHeight, 0.2]} />
          <meshStandardMaterial
            color="#181e2b"
            transparent={isCutaway}
            opacity={isCutaway ? 0.08 : 0.95}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* South Wall */}
        <mesh position={[0, totalHeight / 2, depth / 2]} castShadow={!isCutaway}>
          <boxGeometry args={[width, totalHeight, 0.2]} />
          <meshStandardMaterial
            color="#181e2b"
            transparent={isCutaway}
            opacity={isCutaway ? 0.08 : 0.95}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* West Wall */}
        <mesh position={[-width / 2, totalHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.2, totalHeight, depth]} />
          <meshStandardMaterial
            color="#151b27"
            transparent={isCutaway}
            opacity={isCutaway ? 0.08 : 0.95}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* East Wall */}
        <mesh position={[width / 2, totalHeight / 2, 0]} castShadow={!isCutaway}>
          <boxGeometry args={[0.2, totalHeight, depth]} />
          <meshStandardMaterial
            color="#151b27"
            transparent={isCutaway}
            opacity={isCutaway ? 0.08 : 0.95}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      </group>

      {/* 4. Architectural Roof with Solar Panels */}
      {!isCutaway && (
        <group position={[0, roofY, 0]}>
          {/* Roof Slab */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.4, 0.3, depth + 0.4]} />
            <meshStandardMaterial color="#0e121a" roughness={0.8} />
          </mesh>

          {/* Rooftop Solar Array Rows */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[width * 0.75, 0.1, depth * 0.65]} />
            <meshStandardMaterial
              color="#1e3a8a"
              emissive="#1d4ed8"
              emissiveIntensity={0.2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* HVAC Chiller Unit */}
          <mesh position={[width * 0.35, 0.5, -depth * 0.3]} castShadow>
            <boxGeometry args={[3.2, 0.8, 2.4]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* 5. Entrance Canopy */}
      <mesh position={[0, 1.8, depth / 2 + 1.2]} castShadow>
        <boxGeometry args={[6.5, 0.2, 2.4]} />
        <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} />
      </mesh>

      {/* 6. Floating 3D Building Badge / Beacon */}
      {showLabels && (
        <Html
          position={[0, roofY + 2.5, 0]}
          center
          distanceFactor={28}
          zIndexRange={[70, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectBuilding(id);
            }}
            className={`cursor-pointer px-3.5 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-3 transition-all select-none ${
              isSelected
                ? 'bg-[#006bff]/90 border-[#9ff0ec] text-white shadow-[0_0_30px_rgba(0,107,255,0.7)] scale-110'
                : 'bg-[#131219]/90 border-white/15 text-[#b9b8bb] hover:border-[#9ff0ec]/50 hover:bg-[#181a26]'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 text-white font-mono font-bold text-xs">
              {code}
            </div>

            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-white tracking-tight">{name}</span>
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

