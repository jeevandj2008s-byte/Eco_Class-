import React from 'react';
import { Classroom3D } from './Classroom3D.jsx';
import { FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Floor3D({ floor, buildingWidth, buildingDepth, buildingId, courtyard }) {
  const { level, classrooms = [] } = floor;

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
  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  // Outer slab dimensions
  const slabW = buildingWidth - 0.4;
  const slabD = buildingDepth - 0.4;

  // Perimeter wing widths around courtyard
  const sideW = (slabW - cw) / 2;
  const sideD = (slabD - cd) / 2;

  return (
    <group name={`floor-${level}`} position={[0, floorY, 0]}>
      {/* 1. Floor Base Plate Slabs */}
      {hasCourtyard ? (
        // 4 perimeter floor wings surrounding the open central courtyard void
        <group name="courtyard-floor-slabs">
          {/* North Wing */}
          <mesh position={[0, -0.1, -(cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.2, sideD]} />
            <meshStandardMaterial color={isSelectedFloor ? '#1c2233' : '#141724'} roughness={0.7} metalness={0.2} />
          </mesh>

          {/* South Wing */}
          <mesh position={[0, -0.1, (cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.2, sideD]} />
            <meshStandardMaterial color={isSelectedFloor ? '#1c2233' : '#141724'} roughness={0.7} metalness={0.2} />
          </mesh>

          {/* West Wing */}
          <mesh position={[-(cw / 2 + sideW / 2), -0.1, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.2, cd]} />
            <meshStandardMaterial color={isSelectedFloor ? '#1c2233' : '#141724'} roughness={0.7} metalness={0.2} />
          </mesh>

          {/* East Wing */}
          <mesh position={[(cw / 2 + sideW / 2), -0.1, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.2, cd]} />
            <meshStandardMaterial color={isSelectedFloor ? '#1c2233' : '#141724'} roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Inner Courtyard Protective Glass Railing Loop */}
          <group name="courtyard-railings">
            {/* North Railing */}
            <mesh position={[0, 0.5, -cd / 2]}>
              <boxGeometry args={[cw, 1.0, 0.06]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* South Railing */}
            <mesh position={[0, 0.5, cd / 2]}>
              <boxGeometry args={[cw, 1.0, 0.06]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* West Railing */}
            <mesh position={[-cw / 2, 0.5, 0]}>
              <boxGeometry args={[0.06, 1.0, cd]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} roughness={0.1} metalness={0.8} />
            </mesh>
            {/* East Railing */}
            <mesh position={[cw / 2, 0.5, 0]}>
              <boxGeometry args={[0.06, 1.0, cd]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} roughness={0.1} metalness={0.8} />
            </mesh>
          </group>
        </group>
      ) : (
        // Standard solid building floor slab
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[slabW, 0.2, slabD]} />
          <meshStandardMaterial
            color={isSelectedFloor ? '#1c2233' : '#141724'}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* 2. Central Corridor Runway Accent */}
      {!hasCourtyard && (
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[buildingWidth * 0.85, 0.02, 2.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
        </mesh>
      )}

      {/* 3. Open Staircase Core & Elevator Shaft */}
      <group position={[-buildingWidth / 2 + 3.2, FLOOR_HEIGHT / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, FLOOR_HEIGHT, 5.0]} />
          <meshStandardMaterial color="#181d29" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Open Staircase steps inside core */}
        {[0, 1, 2, 3, 4].map((step) => (
          <mesh key={step} position={[-0.8 + step * 0.35, -FLOOR_HEIGHT / 2 + step * 0.65 + 0.3, 0]}>
            <boxGeometry args={[0.4, 0.18, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
        ))}
        {/* Floor level indicator tag on stair core */}
        <mesh position={[2.15, 0.4, 0]}>
          <boxGeometry args={[0.05, 0.8, 1.2]} />
          <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.3} />
        </mesh>
      </group>

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
