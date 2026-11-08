import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedFurniture } from '../InstancedFurniture.jsx';
import { THREE_CONFIG } from '../config/threeConfig.js';
import { ANIMATION_CONFIG } from '../../../../config/buildings.config.js';

/**
 * Furniture System: Chairs, Desks, Props, Benches, Boards & Animated Ceiling Fans
 */
export function FurnitureSystem() {
  return (
    <group name="campus-furniture-system">
      <InstancedFurniture />
    </group>
  );
}

/**
 * Reusable High-Fidelity Animated Ceiling Fan Component
 */
export function CeilingFan({ position = [0, 2.2, 0] }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.ceilingFans) return;
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * (THREE_CONFIG.characters.fanSpeed || 8.5);
    }
  });

  return (
    <group position={position}>
      {/* Ceiling Mounting Canopy */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.06, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* Downrod */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.28, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Motor Housing */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Central Spinner Dome */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.07, 12, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
      </mesh>
      {/* Rotating 3 Aerofoil Blades */}
      <group ref={bladesRef} position={[0, 0.08, 0]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
          <group key={`blade-${idx}`} rotation={[0, angle, 0]}>
            <mesh position={[0.5, 0, 0]} rotation={[0.16, 0, 0]} castShadow>
              <boxGeometry args={[0.82, 0.014, 0.11]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default FurnitureSystem;
