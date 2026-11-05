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

  const floorY = (level - 1) * FLOOR_HEIGHT + (level - 1) * explodedHeight * 3.5;

  // When a specific floor in this building is selected, hide any floors ABOVE it so the interior is completely open and visible
  const isFloorInspected = selectedBuildingId === buildingId && selectedFloorLevel !== null;
  const isAboveSelected = isFloorInspected && level > selectedFloorLevel;
  if (isAboveSelected || (xrayMode && isAboveSelected)) {
    return null;
  }

  const isSelectedFloor = selectedBuildingId === buildingId && selectedFloorLevel === level;
  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  const slabW = buildingWidth - 0.4;
  const slabD = buildingDepth - 0.4;
  const sideW = (slabW - cw) / 2;
  const sideD = (slabD - cd) / 2;

  return (
    <group name={`floor-${level}`} position={[0, floorY, 0]}>
      {/* 1. Floor Plate Slabs */}
      {hasCourtyard ? (
        <group name="courtyard-floor-slabs">
          {/* North Wing */}
          <mesh position={[0, -0.1, -(cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.2, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1e2638' : '#141724'}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>

          {/* South Wing */}
          <mesh position={[0, -0.1, (cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.2, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1e2638' : '#141724'}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>

          {/* West Wing */}
          <mesh position={[-(cw / 2 + sideW / 2), -0.1, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.2, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1e2638' : '#141724'}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>

          {/* East Wing */}
          <mesh position={[(cw / 2 + sideW / 2), -0.1, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.2, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#1e2638' : '#141724'}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>

          {/* Inner Courtyard Glass Railing Loop */}
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
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[slabW, 0.2, slabD]} />
          <meshStandardMaterial
            color={isSelectedFloor ? '#1e2638' : '#141724'}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      )}

      {/* 2. CRYSTAL-CLEAR LUXURY GLASS CURTAIN PERIMETER WALLS (When Floor is Inspected) */}
      {isSelectedFloor && (
        <group name="floor-plan-glass-perimeter">
          {/* North Exterior Glass Curtain Wall */}
          <mesh position={[0, 1.25, -slabD / 2]}>
            <boxGeometry args={[slabW, 2.5, 0.04]} />
            <meshStandardMaterial
              color="#93c5fd"
              transparent
              opacity={0.32}
              roughness={0.05}
              metalness={0.95}
            />
          </mesh>
          {/* North Glass Aluminum Cap */}
          <mesh position={[0, 2.5, -slabD / 2]}>
            <boxGeometry args={[slabW + 0.1, 0.08, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>

          {/* South Exterior Glass Curtain Wall / Terrace */}
          <mesh position={[0, 1.25, slabD / 2]}>
            <boxGeometry args={[slabW, 2.5, 0.04]} />
            <meshStandardMaterial
              color="#93c5fd"
              transparent
              opacity={0.32}
              roughness={0.05}
              metalness={0.95}
            />
          </mesh>
          {/* South Glass Aluminum Cap */}
          <mesh position={[0, 2.5, slabD / 2]}>
            <boxGeometry args={[slabW + 0.1, 0.08, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>

          {/* West Exterior Glass Curtain Wall */}
          <mesh position={[-slabW / 2, 1.25, 0]}>
            <boxGeometry args={[0.04, 2.5, slabD]} />
            <meshStandardMaterial
              color="#93c5fd"
              transparent
              opacity={0.32}
              roughness={0.05}
              metalness={0.95}
            />
          </mesh>
          {/* West Glass Aluminum Cap */}
          <mesh position={[-slabW / 2, 2.5, 0]}>
            <boxGeometry args={[0.12, 0.08, slabD + 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>

          {/* East Exterior Glass Curtain Wall */}
          <mesh position={[slabW / 2, 1.25, 0]}>
            <boxGeometry args={[0.04, 2.5, slabD]} />
            <meshStandardMaterial
              color="#93c5fd"
              transparent
              opacity={0.32}
              roughness={0.05}
              metalness={0.95}
            />
          </mesh>
          {/* East Glass Aluminum Cap */}
          <mesh position={[slabW / 2, 2.5, 0]}>
            <boxGeometry args={[0.12, 0.08, slabD + 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>

          {/* Corner Chrome Glass Stanchions */}
          {[
            [-slabW / 2, 1.25, -slabD / 2],
            [slabW / 2, 1.25, -slabD / 2],
            [-slabW / 2, 1.25, slabD / 2],
            [slabW / 2, 1.25, slabD / 2]
          ].map((pos, sIdx) => (
            <mesh key={`glass-post-${sIdx}`} position={pos}>
              <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      )}

      {/* 3. Central Corridor Runway Accent */}
      {!hasCourtyard && (
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[buildingWidth * 0.85, 0.02, 2.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
        </mesh>
      )}

      {/* 4. Staircase Core & Elevator Shaft */}
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

      {/* 5. Child Classroom Spaces with Interactive Hotspots */}
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
