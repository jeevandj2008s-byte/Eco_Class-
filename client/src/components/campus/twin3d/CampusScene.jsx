import React from 'react';
import { CameraRig } from './CameraRig.jsx';
import { Building3D } from './Building3D.jsx';
import { InstancedFurniture } from './InstancedFurniture.jsx';
import { InstancedStudents } from './InstancedStudents.jsx';
import { PROCESSED_BUILDINGS } from '../../../config/buildings.config.js';

export function CampusScene({ telemetry }) {
  return (
    <>
      {/* 1. Atmospheric Cyber Campus Lights */}
      <ambientLight intensity={0.65} />
      <hemisphereLight intensity={0.4} color="#38bdf8" groundColor="#050811" />
      <directionalLight
        position={[45, 80, 50]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={220}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
      />
      {/* Subtle purple-blue backfill rim light */}
      <pointLight position={[-40, 30, -40]} intensity={0.4} color="#a78bfa" distance={150} />

      {/* 2. Campus Ground & Infrastructure Base */}
      <group name="campus-terrain">
        {/* Main Campus Terrain Plate */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[160, 0.4, 160]} />
          <meshStandardMaterial color="#080a11" roughness={0.9} />
        </mesh>

        {/* Outer Perimeter Wall / Campus Border */}
        <mesh position={[0, -0.2, 0]}>
          <ringGeometry args={[78, 80, 64]} />
          <meshBasicMaterial color="#006bff" wireframe opacity={0.15} transparent />
        </mesh>

        {/* Campus Main Road (North Road along K.R. Road) */}
        <mesh position={[0, -0.38, -62]} receiveShadow>
          <boxGeometry args={[155, 0.05, 12]} />
          <meshStandardMaterial color="#111520" roughness={0.7} />
        </mesh>

        {/* Road Divider Strip */}
        <mesh position={[0, -0.35, -62]}>
          <boxGeometry args={[145, 0.02, 0.4]} />
          <meshBasicMaterial color="#fbbf24" opacity={0.7} transparent />
        </mesh>

        {/* Central Quadrangle Green Lawn */}
        <mesh position={[-5, -0.38, 5]} receiveShadow>
          <boxGeometry args={[26, 0.04, 30]} />
          <meshStandardMaterial color="#0a1f18" roughness={0.9} />
        </mesh>

        {/* Pedestrian Pathway Grid */}
        <mesh position={[-5, -0.37, 5]} receiveShadow>
          <boxGeometry args={[30, 0.02, 34]} />
          <meshStandardMaterial color="#121824" roughness={0.8} />
        </mesh>
      </group>

      {/* 3. Buildings Hierarchy */}
      <group name="campus-buildings">
        {PROCESSED_BUILDINGS.map((b) => (
          <Building3D
            key={b.id}
            building={b}
            telemetry={telemetry}
          />
        ))}
      </group>

      {/* 4. GPU-Instanced Classroom Furniture */}
      <InstancedFurniture />

      {/* 5. GPU-Instanced Seated Students */}
      <InstancedStudents />

      {/* 6. Dynamic Camera Flight & Orbit Rig */}
      <CameraRig />
    </>
  );
}

