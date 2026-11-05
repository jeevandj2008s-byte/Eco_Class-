import React from 'react';
import { Classroom3D } from './Classroom3D.jsx';
import { FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Floor3D({ floor, buildingWidth, buildingDepth, buildingId, courtyard }) {
  const { level, classrooms = [] } = floor;

  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);

  // If a specific floor is selected, hide floors above it so the chosen floor is an isometric cutaway dollhouse
  const isInspectingFloor = selectedBuildingId === buildingId && selectedFloorLevel !== null;
  const isAboveSelected = isInspectingFloor && level > selectedFloorLevel;
  if (isAboveSelected) {
    return null;
  }

  const isSelectedFloor = isInspectingFloor && selectedFloorLevel === level;
  const floorY = (level - 1) * FLOOR_HEIGHT + (level - 1) * explodedHeight * 3.5;

  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  const slabW = buildingWidth - 0.3;
  const slabD = buildingDepth - 0.3;
  const sideW = (slabW - cw) / 2;
  const sideD = (slabD - cd) / 2;

  return (
    <group name={`floor-${level}`} position={[0, floorY, 0]}>
      {/* 1. Volumetric Floor Base Plate Slab */}
      {hasCourtyard ? (
        <group name="courtyard-floor-slabs">
          {/* North Wing */}
          <mesh position={[0, -0.12, -(cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.24, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1c2436' : '#121622'}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          {/* South Wing */}
          <mesh position={[0, -0.12, (cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.24, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1c2436' : '#121622'}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          {/* West Wing */}
          <mesh position={[-(cw / 2 + sideW / 2), -0.12, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.24, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1c2436' : '#121622'}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          {/* East Wing */}
          <mesh position={[(cw / 2 + sideW / 2), -0.12, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.24, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1c2436' : '#121622'}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>

          {/* Courtyard Glass Railing Loop */}
          <group name="courtyard-railings">
            <mesh position={[0, 0.5, -cd / 2]}>
              <boxGeometry args={[cw, 1.0, 0.05]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.5, cd / 2]}>
              <boxGeometry args={[cw, 1.0, 0.05]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
            </mesh>
            <mesh position={[-cw / 2, 0.5, 0]}>
              <boxGeometry args={[0.05, 1.0, cd]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
            </mesh>
            <mesh position={[cw / 2, 0.5, 0]}>
              <boxGeometry args={[0.05, 1.0, cd]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
            </mesh>
          </group>
        </group>
      ) : (
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <boxGeometry args={[slabW, 0.24, slabD]} />
          <meshStandardMaterial
            color={isSelectedFloor ? '#1c2436' : '#121622'}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* 2. Glass Curtain Perimeter Walls when in Dollhouse Cutaway */}
      {isSelectedFloor && (
        <group name="floor-cutaway-glass-walls">
          {/* North Glass Wall */}
          <mesh position={[0, 1.2, -slabD / 2]}>
            <boxGeometry args={[slabW, 2.4, 0.04]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.3} roughness={0.05} metalness={0.95} />
          </mesh>
          {/* South Glass Wall */}
          <mesh position={[0, 1.2, slabD / 2]}>
            <boxGeometry args={[slabW, 2.4, 0.04]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.3} roughness={0.05} metalness={0.95} />
          </mesh>
          {/* West Glass Wall */}
          <mesh position={[-slabW / 2, 1.2, 0]}>
            <boxGeometry args={[0.04, 2.4, slabD]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.3} roughness={0.05} metalness={0.95} />
          </mesh>
          {/* East Glass Wall */}
          <mesh position={[slabW / 2, 1.2, 0]}>
            <boxGeometry args={[0.04, 2.4, slabD]} />
            <meshStandardMaterial color="#93c5fd" transparent opacity={0.3} roughness={0.05} metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* 3. Open Staircase Core & Elevator Shaft */}
      <group position={[-buildingWidth / 2 + 3.2, FLOOR_HEIGHT / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, FLOOR_HEIGHT, 5.0]} />
          <meshStandardMaterial color="#181d29" roughness={0.6} metalness={0.2} />
        </mesh>
        {[0, 1, 2, 3, 4].map((step) => (
          <mesh key={step} position={[-0.8 + step * 0.35, -FLOOR_HEIGHT / 2 + step * 0.65 + 0.3, 0]}>
            <boxGeometry args={[0.4, 0.18, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
        ))}
        {/* Floor Level Badge */}
        <mesh position={[2.15, 0.4, 0]}>
          <boxGeometry args={[0.05, 0.8, 1.2]} />
          <meshStandardMaterial
            color={isSelectedFloor ? '#9ff0ec' : '#006bff'}
            emissive={isSelectedFloor ? '#9ff0ec' : '#006bff'}
            emissiveIntensity={isSelectedFloor ? 0.9 : 0.3}
          />
        </mesh>
      </group>

      {/* 4. Child Classrooms with Real 3D Benches, Students and Boards */}
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
