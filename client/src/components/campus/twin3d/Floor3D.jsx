import React from 'react';
import { Classroom3D } from './Classroom3D.jsx';
import { FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

export function Floor3D({
  floor,
  buildingWidth,
  buildingDepth,
  buildingId,
  courtyard,
  theme = {
    wallColor: '#dfdcd5',
    trimColor: '#1e2638',
    corniceColor: '#c8c4bc',
    roofSlab: '#1e2433'
  }
}) {
  const { level, classrooms = [] } = floor;

  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);

  // Interior inspection mode
  const isInspectingFloor = selectedBuildingId === buildingId && selectedFloorLevel !== null;
  const isSelectedFloor = isInspectingFloor && selectedFloorLevel === level;
  const isAboveSelected = isInspectingFloor && level > selectedFloorLevel;

  // Upper floors are lifted away and hidden during floor cutaway inspection
  if (isAboveSelected) {
    return null;
  }

  const floorY = (level - 1) * FLOOR_HEIGHT;

  const hasCourtyard = courtyard && courtyard.enabled;
  const cw = hasCourtyard ? courtyard.width : 0;
  const cd = hasCourtyard ? courtyard.depth : 0;

  const slabW = buildingWidth - 0.2;
  const slabD = buildingDepth - 0.2;
  const sideW = (slabW - cw) / 2;
  const sideD = (slabD - cd) / 2;

  return (
    <group name={`floor-${level}`} position={[0, floorY, 0]}>
      {/* 1. Volumetric Floor Base Slab (Solid & Opaque) */}
      {hasCourtyard ? (
        <group name="courtyard-floor-slabs">
          {/* North Wing Corridor Floor */}
          <mesh position={[0, -0.14, -(cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.28, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#222938' : '#141824'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>
          {/* South Wing Corridor Floor */}
          <mesh position={[0, -0.14, (cd / 2 + sideD / 2)]} receiveShadow>
            <boxGeometry args={[slabW, 0.28, sideD]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#222938' : '#141824'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>
          {/* West Wing Corridor Floor */}
          <mesh position={[-(cw / 2 + sideW / 2), -0.14, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.28, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#222938' : '#141824'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>
          {/* East Wing Corridor Floor */}
          <mesh position={[(cw / 2 + sideW / 2), -0.14, 0]} receiveShadow>
            <boxGeometry args={[sideW, 0.28, cd]} />
            <meshStandardMaterial
              color={isSelectedFloor ? '#222938' : '#141824'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>

          {/* Architectural Glass & Steel Balustrades around Courtyard */}
          {isSelectedFloor && (
            <group name="courtyard-railings">
              {/* North Railing */}
              <mesh position={[0, 0.48, -cd / 2]}>
                <boxGeometry args={[cw, 0.9, 0.04]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.35}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[0, 0.95, -cd / 2]}>
                <boxGeometry args={[cw + 0.05, 0.05, 0.06]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* South Railing */}
              <mesh position={[0, 0.48, cd / 2]}>
                <boxGeometry args={[cw, 0.9, 0.04]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.35}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[0, 0.95, cd / 2]}>
                <boxGeometry args={[cw + 0.05, 0.05, 0.06]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* West Railing */}
              <mesh position={[-cw / 2, 0.48, 0]}>
                <boxGeometry args={[0.04, 0.9, cd]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.35}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[-cw / 2, 0.95, 0]}>
                <boxGeometry args={[0.06, 0.05, cd + 0.05]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* East Railing */}
              <mesh position={[cw / 2, 0.48, 0]}>
                <boxGeometry args={[0.04, 0.9, cd]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.35}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[cw / 2, 0.95, 0]}>
                <boxGeometry args={[0.06, 0.05, cd + 0.05]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          )}
        </group>
      ) : (
        <mesh position={[0, -0.14, 0]} receiveShadow>
          <boxGeometry args={[slabW, 0.28, slabD]} />
          <meshStandardMaterial
            color={isSelectedFloor ? '#1e2538' : '#141824'}
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>
      )}

      {/* 2. ISOMETRIC CUTAWAY LOW WALLS (Only rendered on the currently selected floor) */}
      {isSelectedFloor && (
        <group name="floor-cutaway-perimeter-walls">
          {/* North Low Wall */}
          <mesh position={[0, 0.7, -slabD / 2]} castShadow receiveShadow>
            <boxGeometry args={[slabW, 1.4, 0.3]} />
            <meshStandardMaterial color={theme.wallColor} roughness={0.78} />
          </mesh>
          {/* South Low Wall */}
          <mesh position={[0, 0.7, slabD / 2]} castShadow receiveShadow>
            <boxGeometry args={[slabW, 1.4, 0.3]} />
            <meshStandardMaterial color={theme.wallColor} roughness={0.78} />
          </mesh>
          {/* West Low Wall */}
          <mesh position={[-slabW / 2, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 1.4, slabD]} />
            <meshStandardMaterial color={theme.wallColor} roughness={0.78} />
          </mesh>
          {/* East Low Wall */}
          <mesh position={[slabW / 2, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 1.4, slabD]} />
            <meshStandardMaterial color={theme.wallColor} roughness={0.78} />
          </mesh>

          {/* Wall Top Coping Band */}
          <mesh position={[0, 1.42, -slabD / 2]}>
            <boxGeometry args={[slabW + 0.05, 0.06, 0.34]} />
            <meshStandardMaterial color={theme.trimColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.42, slabD / 2]}>
            <boxGeometry args={[slabW + 0.05, 0.06, 0.34]} />
            <meshStandardMaterial color={theme.trimColor} roughness={0.5} />
          </mesh>
          <mesh position={[-slabW / 2, 1.42, 0]}>
            <boxGeometry args={[0.34, 0.06, slabD + 0.05]} />
            <meshStandardMaterial color={theme.trimColor} roughness={0.5} />
          </mesh>
          <mesh position={[slabW / 2, 1.42, 0]}>
            <boxGeometry args={[0.34, 0.06, slabD + 0.05]} />
            <meshStandardMaterial color={theme.trimColor} roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* 3. Open Staircase Core & Elevator Penthouse */}
      {isSelectedFloor && (
        <group position={[-buildingWidth / 2 + 3.4, FLOOR_HEIGHT / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.2, FLOOR_HEIGHT, 5.0]} />
            <meshStandardMaterial color="#1a202c" roughness={0.65} metalness={0.2} />
          </mesh>
          {[0, 1, 2, 3, 4].map((step) => (
            <mesh key={step} position={[-0.8 + step * 0.35, -FLOOR_HEIGHT / 2 + step * 0.65 + 0.3, 0]}>
              <boxGeometry args={[0.4, 0.18, 2.2]} />
              <meshStandardMaterial color="#334155" roughness={0.4} />
            </mesh>
          ))}
          {/* Floor Level Core Plaque */}
          <mesh position={[2.15, 0.4, 0]}>
            <boxGeometry args={[0.05, 0.8, 1.2]} />
            <meshStandardMaterial
              color="#006bff"
              emissive="#006bff"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      )}

      {/* 4. CLASSROOMS & SEATED STUDENTS: Rendered ONLY on the selected cutaway floor */}
      {isSelectedFloor &&
        classrooms.map((room) => (
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
