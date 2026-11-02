import React from 'react';
import { Classroom3D } from './Classroom3D.jsx';
import { FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Floor3D({ floor, buildingWidth, buildingDepth, buildingId }) {
  const { level, name, classrooms = [] } = floor;

  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);

  // Compute exploded vertical translation
  const floorY = (level - 1) * FLOOR_HEIGHT + (level - 1) * explodedHeight * 3.5;

  // In X-Ray mode, if a specific floor is selected, hide floors above it
  const isAboveSelected = selectedBuildingId === buildingId && selectedFloorLevel !== null && level > selectedFloorLevel;
  if (xrayMode && isAboveSelected) {
    return null;
  }

  const isSelectedFloor = selectedBuildingId === buildingId && selectedFloorLevel === level;

  return (
    <group name={`floor-${level}`} position={[0, floorY, 0]}>
      {/* 1. Floor Base Plate Slab */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[buildingWidth - 0.4, 0.2, buildingDepth - 0.4]} />
        <meshStandardMaterial
          color={isSelectedFloor ? '#1c2233' : '#11141d'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Central Corridor Runway Accent */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[buildingWidth * 0.85, 0.02, 3.2]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* 3. Staircase & Lift Core */}
      <mesh position={[-buildingWidth / 2 + 3.5, FLOOR_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, FLOOR_HEIGHT, 5.5]} />
        <meshStandardMaterial
          color="#181d29"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 4. Child Classrooms */}
      {classrooms.map((room) => (
        <Classroom3D
          key={room.id}
          classroom={room}
          buildingId={buildingId}
          floorLevel={level}
        />
      ))}
    </group>
  );
}

