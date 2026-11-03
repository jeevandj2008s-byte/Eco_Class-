import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRig } from './CameraRig.jsx';
import { Building3D } from './Building3D.jsx';
import { ParkingLot } from './ParkingLot.jsx';
import { InstancedFurniture } from './InstancedFurniture.jsx';
import { InstancedStudents } from './InstancedStudents.jsx';
import { PROCESSED_BUILDINGS, CONNECTING_BRIDGES, ANIMATION_CONFIG } from '../../../config/buildings.config.js';

export function CampusScene({ telemetry }) {
  const treesGroupRef = useRef();

  // Subtle wind sway animation for perimeter campus trees
  useFrame((state) => {
    if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.treesSway) return;
    const t = state.clock.getElapsedTime();
    if (treesGroupRef.current) {
      treesGroupRef.current.children.forEach((child, idx) => {
        child.rotation.z = Math.sin(t * 1.5 + idx * 0.8) * 0.03;
        child.rotation.x = Math.cos(t * 1.2 + idx * 0.6) * 0.02;
      });
    }
  });

  return (
    <>
      {/* 1. Atmospheric Soft Architectural Sunlight & Cyber Ambient Fill */}
      <ambientLight intensity={0.65} color="#b4c6e7" />
      <hemisphereLight intensity={0.45} color="#38bdf8" groundColor="#060814" />
      <directionalLight
        position={[55, 85, 45]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={240}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
      />
      {/* Warm Interior Classroom Light bounce */}
      <pointLight position={[-15, 20, 10]} intensity={0.4} color="#fef3c7" distance={120} />
      {/* Cool Specular Violet Backfill Rim Light */}
      <pointLight position={[-50, 40, -50]} intensity={0.4} color="#a78bfa" distance={160} />

      {/* 2. Campus Grounds, Roads, Perimeter Wall & Main Gate */}
      <group name="campus-terrain">
        {/* Main Terrain Base Plate */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[180, 0.4, 180]} />
          <meshStandardMaterial color="#080a11" roughness={0.9} />
        </mesh>

        {/* Outer Perimeter Boundary Ring with Neon Blueprint Trace */}
        <mesh position={[0, -0.2, 0]}>
          <ringGeometry args={[84, 86, 64]} />
          <meshBasicMaterial color="#006bff" wireframe opacity={0.18} transparent />
        </mesh>

        {/* Boundary Concrete Wall */}
        <group name="boundary-wall">
          {/* North Wall */}
          <mesh position={[0, 0.6, -75]} castShadow>
            <boxGeometry args={[150, 1.6, 0.4]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* South Wall with Main Campus Gate Opening */}
          <mesh position={[-45, 0.6, 75]} castShadow>
            <boxGeometry args={[60, 1.6, 0.4]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[45, 0.6, 75]} castShadow>
            <boxGeometry args={[60, 1.6, 0.4]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          {/* Main Campus Entrance Gate Security Pillars */}
          <mesh position={[-14, 1.8, 75]} castShadow>
            <boxGeometry args={[1.6, 3.6, 1.6]} />
            <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[14, 1.8, 75]} castShadow>
            <boxGeometry args={[1.6, 3.6, 1.6]} />
            <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.2} />
          </mesh>
        </group>

        {/* North Campus Highway / K.R. Road */}
        <mesh position={[0, -0.38, -62]} receiveShadow>
          <boxGeometry args={[170, 0.05, 14]} />
          <meshStandardMaterial color="#0f1422" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.35, -62]}>
          <boxGeometry args={[160, 0.02, 0.4]} />
          <meshBasicMaterial color="#fbbf24" opacity={0.8} transparent />
        </mesh>

        {/* Main Access Road leading from Gate to Parking & Building Entrance */}
        <mesh position={[0, -0.38, 50]} receiveShadow>
          <boxGeometry args={[12, 0.05, 52]} />
          <meshStandardMaterial color="#101524" roughness={0.7} />
        </mesh>

        {/* Road linking Main Access to Block A & Parking */}
        <mesh position={[0, -0.38, 24]} receiveShadow>
          <boxGeometry args={[65, 0.05, 10]} />
          <meshStandardMaterial color="#101524" roughness={0.7} />
        </mesh>

        {/* Campus Central Quadrangle Lawn */}
        <mesh position={[-5, -0.38, 2]} receiveShadow>
          <boxGeometry args={[28, 0.04, 32]} />
          <meshStandardMaterial color="#0a261c" roughness={0.85} />
        </mesh>

        {/* Perimeter Campus Trees */}
        <group ref={treesGroupRef} name="campus-trees">
          {[
            [-58, 0, -45],
            [-58, 0, -15],
            [-58, 0, 15],
            [-58, 0, 45],
            [58, 0, -45],
            [58, 0, -15],
            [58, 0, 15],
            [58, 0, 45],
            [-30, 0, -52],
            [30, 0, -52],
            [-35, 0, 68],
            [35, 0, 68]
          ].map((pos, idx) => (
            <group key={`tree-${idx}`} position={pos}>
              {/* Trunk */}
              <mesh position={[0, 1.8, 0]} castShadow>
                <cylinderGeometry args={[0.28, 0.42, 3.6, 8]} />
                <meshStandardMaterial color="#3b1d11" roughness={0.9} />
              </mesh>
              {/* Low-poly Canopy */}
              <mesh position={[0, 4.4, 0]} castShadow>
                <icosahedronGeometry args={[2.4, 1]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#15803d' : '#166534'} roughness={0.75} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 3. Connecting Elevated Sky-Bridges between Blocks */}
      <group name="connecting-bridges">
        {CONNECTING_BRIDGES.map((br) => {
          // Compute midpoint and direction vector
          const mx = (br.start[0] + br.end[0]) / 2;
          const my = (br.start[1] + br.end[1]) / 2;
          const mz = (br.start[2] + br.end[2]) / 2;
          const dx = br.end[0] - br.start[0];
          const dz = br.end[2] - br.start[2];
          const len = Math.hypot(dx, dz);
          const rotY = Math.atan2(dx, dz);

          return (
            <group key={br.id} position={[mx, my, mz]} rotation={[0, rotY, 0]}>
              {/* Bridge Floor Concrete Slab */}
              <mesh receiveShadow castShadow>
                <boxGeometry args={[br.width, 0.25, len]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
              {/* Bridge Glass Enclosure Walls */}
              <mesh position={[-br.width / 2, br.height / 2, 0]}>
                <boxGeometry args={[0.06, br.height, len]} />
                <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
              </mesh>
              <mesh position={[br.width / 2, br.height / 2, 0]}>
                <boxGeometry args={[0.06, br.height, len]} />
                <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} roughness={0.1} />
              </mesh>
              {/* Bridge Roof */}
              <mesh position={[0, br.height, 0]} castShadow>
                <boxGeometry args={[br.width + 0.2, 0.15, len]} />
                <meshStandardMaterial color="#0f172a" roughness={0.7} />
              </mesh>
              {/* Structural Ground Columns */}
              <mesh position={[0, -my / 2, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.35, my, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 4. Building Blocks Hierarchy (Block A, B, C, D) */}
      <group name="campus-buildings">
        {PROCESSED_BUILDINGS.map((b) => (
          <Building3D
            key={b.id}
            building={b}
            telemetry={telemetry}
          />
        ))}
      </group>

      {/* 5. Complete Parking Facility with Cars, Bikes, Barrier Arm & Booth */}
      <ParkingLot />

      {/* 6. GPU-Instanced Classroom Benches & Desks */}
      <InstancedFurniture />

      {/* 7. GPU-Instanced Seated Students with Avatar Colors */}
      <InstancedStudents />

      {/* 8. Dynamic Camera Flight & Orbit Rig */}
      <CameraRig />
    </>
  );
}
