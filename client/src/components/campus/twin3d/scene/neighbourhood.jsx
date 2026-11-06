import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CAMPUS_LANDMARKS, ANIMATION_CONFIG } from '../../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../../store/useTwin3DStore.js';

/**
 * Neighbourhood: Outdoor World — Roads, Ground, Perimeter Wall, Nature & Landmarks
 */
export function Neighbourhood() {
  const treesGroupRef = useRef();
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);

  // Subtle wind sway animation for perimeter trees in loop
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
    <group name="campus-neighbourhood">
      {/* 1. Main Campus Terrain Base Plate */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[190, 0.4, 190]} />
        <meshStandardMaterial color="#080a11" roughness={0.9} />
      </mesh>

      {/* 2. Outer Perimeter Boundary Ring with Subtle Blueprint Trace */}
      <mesh position={[0, -0.2, 0]}>
        <ringGeometry args={[88, 90, 64]} />
        <meshBasicMaterial color="#006bff" wireframe opacity={0.15} transparent />
      </mesh>

      {/* 3. Perimeter Boundary Wall & Main Entrance Gate */}
      <group name="boundary-wall">
        {/* Rear Wall */}
        <mesh position={[0, 0.6, -75]} castShadow receiveShadow>
          <boxGeometry args={[160, 1.6, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Front Left Wall */}
        <mesh position={[-45, 0.6, 75]} castShadow receiveShadow>
          <boxGeometry args={[65, 1.6, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Front Right Wall */}
        <mesh position={[45, 0.6, 75]} castShadow receiveShadow>
          <boxGeometry args={[65, 1.6, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Main Campus Gate Pillars */}
        <mesh position={[-14, 1.8, 75]} castShadow>
          <boxGeometry args={[1.6, 3.6, 1.6]} />
          <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[14, 1.8, 75]} castShadow>
          <boxGeometry args={[1.6, 3.6, 1.6]} />
          <meshStandardMaterial color="#006bff" emissive="#006bff" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* 4. Campus Roads & Pedestrian Driveways */}
      {/* Top Campus Perimeter Road (Matching 2D Map Road) */}
      <mesh position={[0, -0.38, -58]} receiveShadow>
        <boxGeometry args={[180, 0.05, 12]} />
        <meshStandardMaterial color="#0f1422" roughness={0.7} />
      </mesh>
      {/* Road Center Line Marking */}
      <mesh position={[0, -0.35, -58]}>
        <boxGeometry args={[170, 0.02, 0.4]} />
        <meshBasicMaterial color="#fbbf24" opacity={0.8} transparent />
      </mesh>

      {/* Main Access Road leading from Gate toward Quad & Parking */}
      <mesh position={[0, -0.38, 50]} receiveShadow>
        <boxGeometry args={[12, 0.05, 52]} />
        <meshStandardMaterial color="#101524" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.38, 24]} receiveShadow>
        <boxGeometry args={[65, 0.05, 10]} />
        <meshStandardMaterial color="#101524" roughness={0.7} />
      </mesh>

      {/* 5. Campus Trees (Wind Swaying Nature) */}
      <group ref={treesGroupRef} name="campus-trees">
        {[
          [-65, 0, -45],
          [-65, 0, -15],
          [-65, 0, 15],
          [-65, 0, 45],
          [68, 0, -45],
          [68, 0, -15],
          [68, 0, 15],
          [68, 0, 45],
          [-30, 0, -50],
          [20, 0, -50],
          [-35, 0, 68],
          [35, 0, 68]
        ].map((pos, idx) => (
          <group key={`tree-${idx}`} position={pos}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.42, 3.6, 8]} />
              <meshStandardMaterial color="#3b1d11" roughness={0.9} />
            </mesh>
            <mesh position={[0, 4.4, 0]} castShadow>
              <icosahedronGeometry args={[2.4, 1]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#15803d' : '#166534'} roughness={0.75} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Iconic Landmarks: Kuvempu Kalakshetra, Chaitra Kota, Pink Tree */}
      <group name="campus-landmarks">
        {CAMPUS_LANDMARKS.map((lm) => (
          <group key={lm.id} position={lm.position}>
            {lm.id === 'lm-pink-tree' ? (
              <group>
                <mesh position={[0, 1.6, 0]} castShadow>
                  <cylinderGeometry args={[0.25, 0.4, 3.2, 8]} />
                  <meshStandardMaterial color="#422006" roughness={0.9} />
                </mesh>
                <mesh position={[0, 4.2, 0]} castShadow>
                  <dodecahedronGeometry args={[2.6, 1]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.7} />
                </mesh>
              </group>
            ) : lm.id === 'lm-kuvempu' ? (
              <group>
                <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[4.2, 4.8, 1.6, 24]} />
                  <meshStandardMaterial color="#78350f" roughness={0.6} />
                </mesh>
                <mesh position={[0, 1.7, 0]} castShadow>
                  <coneGeometry args={[4.5, 1.2, 24]} />
                  <meshStandardMaterial color="#b45309" roughness={0.5} />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh position={[0, 1.2, 0]} castShadow>
                  <boxGeometry args={[3.6, 2.4, 3.6]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0, 2.5, 0]} castShadow>
                  <coneGeometry args={[2.8, 1.2, 4]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.7} />
                </mesh>
              </group>
            )}

            {/* Landmark Billboard Tag */}
            {showLabels && !selectedBuildingId && (
              <Html position={[0, 5.2, 0]} center distanceFactor={26}>
                <div className="pointer-events-none px-2.5 py-1 rounded-xl bg-[#131219]/90 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap shadow-xl flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lm.color }} />
                  <span className="font-bold">{lm.name}</span>
                </div>
              </Html>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

export default Neighbourhood;

