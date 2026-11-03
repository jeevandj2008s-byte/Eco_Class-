import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PARKING_CONFIG, BLOCK_LABELS_CONFIG, ANIMATION_CONFIG } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

const CAR_COLORS = [
  '#0284c7', // Sky Blue
  '#dc2626', // Crimson Red
  '#f59e0b', // Amber Orange
  '#10b981', // Emerald Green
  '#475569', // Slate Grey
  '#ffffff', // Pure White
  '#1e1b4b', // Deep Indigo
  '#7c3aed'  // Purple
];

export function ParkingLot() {
  const barrierArmRef = useRef();
  const movingCarRef = useRef();

  const showLabels = useTwin3DStore((s) => s.showLabels);

  const {
    position,
    width,
    depth,
    rows,
    baysPerRow,
    bayWidth,
    bayDepth,
    bikeSlots,
    accessibleBays,
    carFillRatio
  } = PARKING_CONFIG;

  // Label configuration
  const labelConfig = useMemo(() => {
    return BLOCK_LABELS_CONFIG.find((l) => l.id === 'campus-parking') || {
      name: 'Parking Facility',
      shortName: 'Parking',
      code: 'P',
      accentColor: '#006bff'
    };
  }, []);

  // Compute deterministic parked cars layout
  const parkedCars = useMemo(() => {
    const cars = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const startX = -((baysPerRow * bayWidth) / 2) + bayWidth / 2;

    for (let r = 0; r < rows; r++) {
      // Row 0 faces South, Row 1 faces North
      const zPos = r === 0 ? -depth / 4 : depth / 4;
      const rotY = r === 0 ? 0 : Math.PI;

      for (let c = 0; c < baysPerRow; c++) {
        const xPos = startX + c * bayWidth;
        const isOccupied = rnd() < carFillRatio;
        const isAccessible = r === 0 && c < accessibleBays;

        if (isOccupied) {
          const color = CAR_COLORS[Math.floor(rnd() * CAR_COLORS.length)];
          cars.push({
            id: `car-${r}-${c}`,
            x: xPos,
            y: 0.38,
            z: zPos,
            rotY,
            color,
            isAccessible
          });
        }
      }
    }
    return cars;
  }, [rows, baysPerRow, bayWidth, depth, carFillRatio, accessibleBays]);

  // Compute parked two-wheelers / bikes
  const parkedBikes = useMemo(() => {
    const bikes = [];
    const bikeStartX = -width / 2 + 3.0;
    const bikeZ = -depth / 2 + 2.5;

    for (let i = 0; i < bikeSlots; i++) {
      if (i % 3 === 0) continue; // Some empty slots
      bikes.push({
        id: `bike-${i}`,
        x: bikeStartX + (i * 0.9),
        y: 0.25,
        z: bikeZ,
        color: i % 2 === 0 ? '#ef4444' : '#0ea5e9'
      });
    }
    return bikes;
  }, [bikeSlots, width, depth]);

  // Animation Loop for Barrier Arm and Moving Vehicle
  useFrame((state) => {
    if (!ANIMATION_CONFIG.enabled) return;
    const t = state.clock.getElapsedTime();

    // 1. Barrier arm opening and closing cyclically every 6 seconds
    if (ANIMATION_CONFIG.barrierArm && barrierArmRef.current) {
      const cycle = (Math.sin(t * 1.2) + 1) / 2; // 0 to 1
      // Rotate upwards from 0 to 75 degrees (Math.PI / 2.4)
      barrierArmRef.current.rotation.z = (cycle > 0.6 ? 0.6 : cycle) * (Math.PI / 2.2);
    }

    // 2. Autonomous Car Driving into the parking aisle
    if (ANIMATION_CONFIG.carsMoving && movingCarRef.current) {
      // Loop a car driving forward along aisle Z axis
      const speed = 4.5;
      const loopLength = 26;
      const offset = (t * speed) % loopLength;
      movingCarRef.current.position.z = depth / 2 - offset;
      movingCarRef.current.position.x = 0;
    }
  });

  return (
    <group name="parking-facility" position={position}>
      {/* 1. Asphalt Ground Surface */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[width, 0.08, depth]} />
        <meshStandardMaterial color="#0e131f" roughness={0.85} />
      </mesh>

      {/* Perimeter Curb Border */}
      <mesh position={[0, 0.05, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.4, 0.15, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.4, 0.15, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[-width / 2, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, depth]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[width / 2, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, depth]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* 2. Painted Parking Bays (White Thermoplastic Striping) */}
      {Array.from({ length: baysPerRow + 1 }).map((_, i) => {
        const startX = -((baysPerRow * bayWidth) / 2);
        const x = startX + i * bayWidth;
        return (
          <group key={`bay-lines-${i}`}>
            {/* Row 0 Line */}
            <mesh position={[x, 0.01, -depth / 4]}>
              <boxGeometry args={[0.1, 0.01, bayDepth]} />
              <meshBasicMaterial color="#ffffff" opacity={0.75} transparent />
            </mesh>
            {/* Row 1 Line */}
            <mesh position={[x, 0.01, depth / 4]}>
              <boxGeometry args={[0.1, 0.01, bayDepth]} />
              <meshBasicMaterial color="#ffffff" opacity={0.75} transparent />
            </mesh>
          </group>
        );
      })}

      {/* Accessible PRM Bay Blue Ground Markings */}
      {Array.from({ length: accessibleBays }).map((_, i) => {
        const startX = -((baysPerRow * bayWidth) / 2) + bayWidth / 2;
        return (
          <mesh key={`acc-${i}`} position={[startX + i * bayWidth, 0.012, -depth / 4]}>
            <boxGeometry args={[1.6, 0.01, 1.6]} />
            <meshBasicMaterial color="#0284c7" opacity={0.8} transparent />
          </mesh>
        );
      })}

      {/* Central Driveway Directional Arrows */}
      {[-6, 6].map((xOffset, i) => (
        <group key={`arrow-${i}`} position={[xOffset, 0.015, 0]}>
          <mesh>
            <boxGeometry args={[0.2, 0.01, 1.6]} />
            <meshBasicMaterial color="#ffffff" opacity={0.7} transparent />
          </mesh>
          <mesh position={[0, 0, 0.9]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.5, 0.01, 0.15]} />
            <meshBasicMaterial color="#ffffff" opacity={0.7} transparent />
          </mesh>
        </group>
      ))}

      {/* Speed Bumps on Entrance/Exit */}
      <mesh position={[0, 0.04, depth / 2 - 2.5]}>
        <boxGeometry args={[7.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} />
      </mesh>

      {/* 3. Dedicated Two-Wheeler / Bike Zone */}
      <group position={[-width / 2 + 8, 0, -depth / 2 + 2.5]}>
        {/* Yellow Zone Border */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[bikeSlots * 0.95, 0.01, 2.2]} />
          <meshBasicMaterial color="#eab308" opacity={0.25} transparent />
        </mesh>
        {/* Metal Bike Racks */}
        {Array.from({ length: Math.floor(bikeSlots / 2) }).map((_, i) => (
          <mesh key={`rack-${i}`} position={[-((bikeSlots * 0.9) / 2) + i * 1.8 + 0.8, 0.35, 0]} castShadow>
            <boxGeometry args={[0.06, 0.7, 1.8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Parked Bikes */}
        {parkedBikes.map((b) => (
          <group key={b.id} position={[b.x - (-width / 2 + 8), b.y, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.55, 1.4]} />
              <meshStandardMaterial color={b.color} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.15, -0.6]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.15, 0.6]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Parked Cars (Low-poly Stylized Vehicle Meshes) */}
      {parkedCars.map((car) => (
        <group key={car.id} position={[car.x, car.y, car.z]} rotation={[0, car.rotY, 0]}>
          {/* Main Car Body Chassis */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.5, 4.2]} />
            <meshStandardMaterial color={car.color} metalness={0.8} roughness={0.2} envMapIntensity={0.8} />
          </mesh>
          {/* Cabin & Windshield */}
          <mesh position={[0, 0.6, -0.2]} castShadow>
            <boxGeometry args={[1.7, 0.45, 2.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Headlights */}
          <mesh position={[-0.65, 0.22, 2.11]}>
            <boxGeometry args={[0.35, 0.15, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0.65, 0.22, 2.11]}>
            <boxGeometry args={[0.35, 0.15, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
          {/* Taillights */}
          <mesh position={[-0.65, 0.22, -2.11]}>
            <boxGeometry args={[0.35, 0.15, 0.05]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.65, 0.22, -2.11]}>
            <boxGeometry args={[0.35, 0.15, 0.05]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
          </mesh>
          {/* Wheels */}
          {[-0.95, 0.95].map((wx, wi) => (
            <React.Fragment key={`wheels-${wi}`}>
              <mesh position={[wx, 0.02, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.22, 12]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
              </mesh>
              <mesh position={[wx, 0.02, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.22, 12]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      ))}

      {/* 5. Animated Moving Car Driving in Aisle */}
      {ANIMATION_CONFIG.carsMoving && (
        <group ref={movingCarRef} position={[0, 0.38, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[1.9, 0.5, 4.2]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.6, -0.2]} castShadow>
            <boxGeometry args={[1.7, 0.45, 2.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 6. Security Guard Booth & Automated Barrier Arm Gate */}
      <group position={[width / 2 - 3.5, 0, depth / 2 + 1.5]}>
        {/* Guard Booth Structure */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 3.0, 2.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Guard Booth Glass Windows */}
        <mesh position={[0, 1.7, 1.42]}>
          <boxGeometry args={[2.2, 1.2, 0.05]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
        {/* Security Officer inside */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.5, 0.9, 0.4]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>

        {/* Barrier Gate Housing Pedestal */}
        <mesh position={[-3.2, 0.6, 0]} castShadow>
          <boxGeometry args={[0.45, 1.2, 0.45]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} />
        </mesh>

        {/* Animated Barrier Arm */}
        <group ref={barrierArmRef} position={[-3.2, 1.1, 0]}>
          <mesh position={[-2.4, 0, 0]}>
            <boxGeometry args={[4.8, 0.12, 0.08]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.3} />
          </mesh>
          {/* Reflective White Stripes on Arm */}
          {[-1, -2, -3, -4].map((sx, si) => (
            <mesh key={`stripe-${si}`} position={[sx, 0, 0]}>
              <boxGeometry args={[0.3, 0.14, 0.09]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>

      {/* 7. Modern LED Lamp Posts along perimeter */}
      {[
        [-width / 2 + 1, -depth / 2 + 1],
        [width / 2 - 1, -depth / 2 + 1],
        [-width / 2 + 1, depth / 2 - 1],
        [width / 2 - 1, depth / 2 - 1]
      ].map((lp, i) => (
        <group key={`lamp-${i}`} position={[lp[0], 0, lp[1]]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 5.0, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 5.0, 0.4]}>
            <boxGeometry args={[0.4, 0.12, 0.9]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Glowing LED Head */}
          <mesh position={[0, 4.9, 0.5]}>
            <boxGeometry args={[0.3, 0.04, 0.7]} />
            <meshStandardMaterial color="#ffffff" emissive="#9ff0ec" emissiveIntensity={2.0} />
          </mesh>
        </group>
      ))}

      {/* 8. Pedestrian Path & Zebra Crossing to Building */}
      <group position={[-width / 2 - 4.0, 0, 0]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[3.5, 0.02, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Zebra Crossing White Stripes */}
        {[-4, -2, 0, 2, 4].map((zy, zi) => (
          <mesh key={`zebra-${zi}`} position={[0, 0.02, zy]}>
            <boxGeometry args={[3.2, 0.01, 0.8]} />
            <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
          </mesh>
        ))}
      </group>

      {/* 9. Floating 3D Parking Facility Badge & Sign */}
      {showLabels && (
        <Html position={[0, 5.5, 0]} center distanceFactor={28}>
          <div className="pointer-events-none px-3.5 py-1.5 rounded-2xl bg-[#131219]/90 border border-white/15 text-white backdrop-blur-xl flex items-center gap-2.5 shadow-xl select-none">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white"
              style={{ backgroundColor: labelConfig.accentColor || '#006bff' }}
            >
              {labelConfig.code || 'P'}
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-white tracking-tight">{labelConfig.name}</span>
              <span className="text-[10px] text-[#9ff0ec] font-mono">
                {parkedCars.length}/{rows * baysPerRow} Cars • {parkedBikes.length} Bikes
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
