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
 * Reusable Animated Ceiling Fan Component
 */
export function CeilingFan({ position = [0, 2.2, 0] }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.ceilingFans) return;
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * THREE_CONFIG.characters.fanSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Downrod */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* Motor Canopy */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.18, 0.16, 0.12, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      {/* Rotating Blades */}
      <group ref={bladesRef}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
          <mesh
            key={`blade-${idx}`}
            rotation={[0, angle, 0]}
            position={[Math.cos(angle) * 0.45, 0.06, Math.sin(angle) * 0.45]}
          >
            <boxGeometry args={[0.7, 0.01, 0.12]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default FurnitureSystem;
