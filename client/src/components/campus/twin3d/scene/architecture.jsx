import React from 'react';
import { Building3D } from '../Building3D.jsx';
import { PROCESSED_BUILDINGS, CONNECTING_BRIDGES } from '../../../../config/buildings.config.js';

/**
 * Architecture System: Structural Shell — Buildings, Stacked Floors, Solid Walls & Bridges
 */
export function Architecture({ telemetry }) {
  return (
    <group name="campus-architecture">
      {/* 1. Connecting Sky-Bridges between Academic Blocks */}
      <group name="connecting-bridges">
        {CONNECTING_BRIDGES.map((br) => {
          const mx = (br.start[0] + br.end[0]) / 2;
          const my = (br.start[1] + br.end[1]) / 2;
          const mz = (br.start[2] + br.end[2]) / 2;
          const dx = br.end[0] - br.start[0];
          const dz = br.end[2] - br.start[2];
          const len = Math.hypot(dx, dz);
          const rotY = Math.atan2(dx, dz);

          return (
            <group key={br.id} position={[mx, my, mz]} rotation={[0, rotY, 0]}>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[br.width, 0.25, len]} />
                <meshStandardMaterial color="#1e293b" roughness={0.6} />
              </mesh>
              {/* Left Architectural Glass Curtain Wall */}
              <mesh position={[-br.width / 2, br.height / 2, 0]}>
                <boxGeometry args={[0.04, br.height, len]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.32}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              {/* Left Glass Railing Mullion */}
              <mesh position={[-br.width / 2, br.height - 0.05, 0]}>
                <boxGeometry args={[0.08, 0.06, len]} />
                <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
              </mesh>

              {/* Right Architectural Glass Curtain Wall */}
              <mesh position={[br.width / 2, br.height / 2, 0]}>
                <boxGeometry args={[0.04, br.height, len]} />
                <meshStandardMaterial
                  color="#7dd3fc"
                  transparent
                  opacity={0.32}
                  roughness={0.05}
                  metalness={0.9}
                />
              </mesh>
              {/* Right Glass Railing Mullion */}
              <mesh position={[br.width / 2, br.height - 0.05, 0]}>
                <boxGeometry args={[0.08, 0.06, len]} />
                <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[0, br.height, 0]} castShadow>
                <boxGeometry args={[br.width + 0.2, 0.15, len]} />
                <meshStandardMaterial color="#0f172a" roughness={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 2. 8 Volumetric Procedural Solid Campus Buildings */}
      <group name="campus-buildings">
        {PROCESSED_BUILDINGS.map((b) => (
          <Building3D
            key={b.id}
            building={b}
            telemetry={telemetry}
          />
        ))}
      </group>
    </group>
  );
}

export default Architecture;

