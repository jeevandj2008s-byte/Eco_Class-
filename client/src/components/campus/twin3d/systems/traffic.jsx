import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ParkingLot } from '../ParkingLot.jsx';
import { ANIMATION_CONFIG } from '../../../../config/buildings.config.js';

/**
 * Traffic System: Vehicle Routing, Moving Cars, Junction Logic & Parking Facility
 * Executes inside the animation loop:
 *   updateVehicles(delta)
 */
export function TrafficSystem() {
  const roadCarRef = useRef();
  const roadCar2Ref = useRef();

  // Animation loop updating campus traffic
  useFrame((_, delta) => {
    if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.movingCars) return;

    // Moving Car 1: Cruising along top Perimeter Road (-85 to +85 on X)
    if (roadCarRef.current) {
      roadCarRef.current.position.x += delta * 14.0;
      if (roadCarRef.current.position.x > 85) {
        roadCarRef.current.position.x = -85;
      }
    }

    // Moving Car 2: Cruising along Main Entrance Driveway (Z from 75 to 24 on Z)
    if (roadCar2Ref.current) {
      roadCar2Ref.current.position.z -= delta * 8.0;
      if (roadCar2Ref.current.position.z < 24) {
        roadCar2Ref.current.position.z = 75;
      }
    }
  });

  return (
    <group name="campus-traffic-system">
      {/* 1. Complete Parking Facility */}
      <ParkingLot />

      {/* 2. Moving Vehicle 1 on Perimeter Road (Blue Electric Sedan) */}
      <group ref={roadCarRef} position={[-85, -0.15, -55]}>
        {/* Car Chassis */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[4.2, 0.75, 1.9]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Cabin Roof & Windshield */}
        <mesh position={[-0.2, 0.85, 0]} castShadow>
          <boxGeometry args={[2.3, 0.60, 1.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Headlights (Warm White Glow) */}
        <mesh position={[2.12, 0.35, 0.6]}>
          <boxGeometry args={[0.05, 0.15, 0.35]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[2.12, 0.35, -0.6]}>
          <boxGeometry args={[0.05, 0.15, 0.35]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Tail Lights (Red LED) */}
        <mesh position={[-2.12, 0.35, 0.6]}>
          <boxGeometry args={[0.05, 0.15, 0.35]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-2.12, 0.35, -0.6]}>
          <boxGeometry args={[0.05, 0.15, 0.35]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* 4 Rubber Tires */}
        {[-1.2, 1.2].map((x) =>
          [-0.95, 0.95].map((z) => (
            <mesh key={`wheel-${x}-${z}`} position={[x, 0.22, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.2, 12]} />
              <meshStandardMaterial color="#111827" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* 3. Moving Vehicle 2 on Main Entrance Avenue (White EV Shuttle) */}
      <group ref={roadCar2Ref} position={[-2.5, -0.15, 75]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[4.6, 0.9, 2.0]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[3.2, 0.65, 1.85]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.5} roughness={0.1} />
        </mesh>
        {/* Front Headlights */}
        <mesh position={[2.32, 0.45, 0.65]}>
          <boxGeometry args={[0.05, 0.18, 0.3]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[2.32, 0.45, -0.65]}>
          <boxGeometry args={[0.05, 0.18, 0.3]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>
    </group>
  );
}

export default TrafficSystem;
