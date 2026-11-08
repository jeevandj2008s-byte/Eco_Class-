import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { ANIMATION_CONFIG } from '../../../config/buildings.config.js';

export function Classroom3D({ classroom, buildingId, floorLevel }) {
  const { id, name, code, width, depth, offset, layout, department } = classroom;
  const [hovered, setHovered] = useState(false);

  const fanBladesRef = useRef();
  const teacherArmRef = useRef();
  const teacherHeadRef = useRef();
  const pulseLedRef = useRef();

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const hoveredStudentId = useTwin3DStore((s) => s.hoveredStudentId);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);
  const setHoveredStudentId = useTwin3DStore((s) => s.setHoveredStudentId);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const students = useTwin3DStore((s) => s.students);

  const isSelected = selectedClassroomId === id;

  // Filter students allotted to this specific classroom
  const roomStudents = useMemo(() => {
    return students.filter((s) => s.classroomId === id);
  }, [students, id]);

  const totalSeats = layout?.seats?.length || 0;
  const occupiedCount = roomStudents.length;
  const occupancyPct = totalSeats > 0 ? Math.round((occupiedCount / totalSeats) * 100) : 0;

  // Real-time simulated power draw based on occupied students and active equipment
  const activePowerKw = useMemo(() => {
    // 60W per student (laptop/lighting share) + 150W fans + 200W lighting + base
    const watts = 350 + occupiedCount * 55;
    return (watts / 1000).toFixed(2);
  }, [occupiedCount]);

  // Occupancy color indicator
  const occupancyColor =
    occupancyPct >= 90 ? '#ef4444' : occupancyPct >= 70 ? '#f59e0b' : '#10b981';

  // Wall height for isometric cutaway dollhouse view
  const wallHeight = 1.6;

  // Smooth Animations: Fan rotation, Teacher lecturing gesture & Smart Meter pulse
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // 1. Ceiling fan rotation
    if (ANIMATION_CONFIG.enabled && ANIMATION_CONFIG.ceilingFans && fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 8.0;
    }

    // 2. Teacher lecturing micro-motion (teaching gesturing with arm & head swivel)
    if (teacherArmRef.current) {
      teacherArmRef.current.rotation.x = -0.45 + Math.sin(t * 1.8) * 0.28;
      teacherArmRef.current.rotation.z = 0.25 + Math.cos(t * 1.4) * 0.18;
    }
    if (teacherHeadRef.current) {
      teacherHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.25;
    }

    // 3. Smart Meter active power impulse LED blinking
    if (pulseLedRef.current) {
      const isPulse = Math.sin(t * 5.0) > 0.4;
      pulseLedRef.current.opacity = isPulse ? 1.0 : 0.15;
    }
  });

  return (
    <group
      name={`classroom-${id}`}
      position={[offset[0], 0, offset[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectClassroom(id);
      }}
    >
      {/* 1. Volumetric Floor Slab with Acoustic Tile Texture */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.1, depth - 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#1f2e47' : hovered ? '#1e2638' : '#141824'}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      {/* Floor Skirting Border */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[width - 0.08, 0.02, depth - 0.08]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 2. Solid Extruded Perimeter Walls with Cutaways */}
      {/* North Wall (where chalkboard & electrical conduits sit) */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.22]} />
        <meshStandardMaterial color="#222838" roughness={0.7} />
      </mesh>
      {/* North Wall Architectural Lintel Cap */}
      <mesh position={[0, wallHeight + 0.02, -depth / 2]}>
        <boxGeometry args={[width + 0.04, 0.04, 0.26]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>

      {/* South Wall (Corridor boundary with Door opening) */}
      <group position={[0, 0, depth / 2]}>
        <mesh position={[-width * 0.28, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.44, wallHeight, 0.22]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        <mesh position={[width * 0.28, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.44, wallHeight, 0.22]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Door Header Lintel */}
        <mesh position={[0, wallHeight - 0.15, 0]}>
          <boxGeometry args={[width * 0.16, 0.3, 0.22]} />
          <meshStandardMaterial color="#334155" metalness={0.5} />
        </mesh>
        {/* Door Frame Architrave */}
        <mesh position={[-width * 0.08, wallHeight * 0.4, 0]}>
          <boxGeometry args={[0.04, wallHeight * 0.8, 0.24]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} />
        </mesh>
        <mesh position={[width * 0.08, wallHeight * 0.4, 0]}>
          <boxGeometry args={[0.04, wallHeight * 0.8, 0.24]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} />
        </mesh>
      </group>

      {/* West Dividing Wall */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, wallHeight, depth]} />
        <meshStandardMaterial color="#1e2330" roughness={0.7} />
      </mesh>

      {/* East Dividing Wall with Window Cutout & Glass Glazing */}
      <group position={[width / 2, 0, 0]}>
        <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.22, wallHeight, depth]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Architectural Window Frame & Glass */}
        <mesh position={[-0.02, wallHeight * 0.65, 0]}>
          <boxGeometry args={[0.04, 0.7, depth * 0.55]} />
          <meshStandardMaterial
            color="#9ff0ec"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        {/* Window Aluminum Mullions */}
        <mesh position={[-0.03, wallHeight * 0.65, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* 3. Front Wall Green Chalkboard with Scientific/Electrical Formulas */}
      <group position={[0, 1.1, -depth / 2 + 0.14]}>
        {/* Slate Blackboard Body */}
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 1.0, 0.04]} />
          <meshStandardMaterial color="#0f3e26" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Brushed Aluminum Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55) + 0.12, 1.08, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Wooden Chalk & Duster Tray */}
        <mesh position={[0, -0.52, 0.03]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 0.04, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Chalk sticks in tray */}
        <mesh position={[-0.4, -0.5, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, -0.5, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* Chalkboard Scientific & Electrical Diagram Decals */}
        <Html position={[0, 0, 0.025]} transform distanceFactor={14} pointerEvents="none">
          <div className="w-[320px] h-[75px] select-none text-white/80 p-2 flex flex-col justify-between font-mono text-[9px] leading-tight">
            <div className="flex justify-between border-b border-white/20 pb-1 text-[8px] text-[#9ff0ec]">
              <span>EE-302: MICROGRID DYNAMICS</span>
              <span>η = (P_out / P_in) × 100%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-200/90 font-serif">
              <span>P = √3 · V_L · I_L · cos(φ)</span>
              <span className="text-[9px] font-mono text-cyan-300">f = 50.02 Hz</span>
            </div>
            <div className="text-[7.5px] text-white/60 tracking-wider">
              ∮ B · dℓ = μ₀ I_enc  |  CLASSROOM ENERGY AUDIT: ACTIVE
            </div>
          </div>
        </Html>
      </group>

      {/* 4. "THE ELECTRICITY THING": Complete Electrical Infrastructure & Monitoring */}
      {/* A. Sub-Distribution Board (DB / Breaker Box) on West Wall */}
      <group position={[-width / 2 + 0.16, 1.15, -depth / 2 + 1.2]}>
        {/* Metallic DB Cabinet */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.55, 0.42]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* DB Front Door Bezel */}
        <mesh position={[0.042, 0, 0]}>
          <boxGeometry args={[0.01, 0.51, 0.38]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Warning Hazard Badge */}
        <mesh position={[0.048, 0.16, 0]}>
          <boxGeometry args={[0.002, 0.08, 0.1]} />
          <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.3} />
        </mesh>
        {/* 3-Phase Busbar Indicator LEDs (Red, Yellow, Blue) */}
        <mesh position={[0.048, -0.16, -0.1]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.048, -0.16, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.048, -0.16, 0.1]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* B. Smart IoT Energy Sub-Meter next to DB Box */}
      <group position={[-width / 2 + 0.16, 1.15, -depth / 2 + 1.8]}>
        {/* Meter Enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.35, 0.28]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* LCD Glass Screen */}
        <mesh position={[0.038, 0.05, 0]}>
          <boxGeometry args={[0.005, 0.14, 0.22]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        {/* Live Digital Readout on Screen */}
        <Html position={[0.042, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} transform distanceFactor={8} pointerEvents="none">
          <div className="w-[110px] bg-cyan-950/90 text-cyan-300 font-mono text-[8px] p-1 rounded border border-cyan-500/40 select-none text-center">
            <div className="font-bold text-[10px] text-cyan-200">{activePowerKw} kW</div>
            <div className="text-[6.5px] text-cyan-400">230.2V • 50.0Hz</div>
          </div>
        </Html>
        {/* Pulsing Energy Impulse LED (blinks in real-time) */}
        <mesh position={[0.038, -0.08, -0.06]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={1.8}
            transparent
            ref={pulseLedRef}
          />
        </mesh>
        {/* Telemetry LED (Blue) */}
        <mesh position={[0.038, -0.08, 0.06]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* C. Metallic Electrical EMT Conduit Pipe Runs */}
      {/* Vertical riser from DB box up to ceiling header */}
      <mesh position={[-width / 2 + 0.16, (1.15 + wallHeight) / 2, -depth / 2 + 1.2]}>
        <cylinderGeometry args={[0.016, 0.016, wallHeight - 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Vertical riser from Smart Meter up to ceiling header */}
      <mesh position={[-width / 2 + 0.16, (1.15 + wallHeight) / 2, -depth / 2 + 1.8]}>
        <cylinderGeometry args={[0.016, 0.016, wallHeight - 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Horizontal conduit run along North wall header */}
      <mesh position={[0, wallHeight - 0.08, -depth / 2 + 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, width * 0.92, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Ceiling conduit branches feeding Fans and Lighting */}
      <mesh position={[0, wallHeight - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, depth * 0.75, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Conduit Junction Box */}
      <mesh position={[0, wallHeight - 0.08, 0]}>
        <boxGeometry args={[0.09, 0.06, 0.09]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* D. Overhead High-Efficiency LED Troffers (Luminaires) */}
      {[-width * 0.25, width * 0.25].map((lx, lIdx) => (
        <group key={`light-${lIdx}`} position={[lx, wallHeight + 0.08, 0]}>
          {/* Troffer Housing */}
          <mesh>
            <boxGeometry args={[0.45, 0.04, depth * 0.65]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          {/* Diffuser Lens emitting soft natural light */}
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[0.42, 0.01, depth * 0.62]} />
            <meshStandardMaterial
              color="#f8fafc"
              emissive="#f8fafc"
              emissiveIntensity={0.7}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* 5. Teacher Podium Desk & HIGH-ACCURACY TEACHER FIGURE */}
      {layout?.teacherDesk && (
        <group position={[layout.teacherDesk.position[0], 0, layout.teacherDesk.position[2]]}>
          {/* Lectern Desk Top */}
          <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
            <boxGeometry args={[layout.teacherDesk.width, 0.05, layout.teacherDesk.depth]} />
            <meshStandardMaterial color="#3b2d20" roughness={0.4} metalness={0.15} />
          </mesh>
          {/* Wooden Chamfered Base */}
          <mesh position={[0, 0.36, 0]}>
            <boxGeometry args={[layout.teacherDesk.width * 0.88, 0.7, layout.teacherDesk.depth * 0.75]} />
            <meshStandardMaterial color="#2d2218" roughness={0.5} />
          </mesh>
          {/* Teacher Open Laptop */}
          <group position={[0.2, 0.78, 0]}>
            {/* Keyboard base */}
            <mesh>
              <boxGeometry args={[0.28, 0.015, 0.2]} />
              <meshStandardMaterial color="#475569" metalness={0.9} />
            </mesh>
            {/* Angled Laptop Screen */}
            <mesh position={[0, 0.1, -0.1]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.28, 0.18, 0.01]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#38bdf8"
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
          {/* Lecture Notes Folder */}
          <mesh position={[-0.22, 0.77, 0.02]} rotation={[0, 0.15, 0]}>
            <boxGeometry args={[0.24, 0.01, 0.18]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* HIGH-ACCURACY TEACHER HUMAN FIGURE STANDING AT BOARD */}
      <group position={[1.4, 0, -depth / 2 + 1.2]} rotation={[0, Math.PI, 0]}>
        {/* Head with Realistic Hair, Glasses & Animated Swivel */}
        <group ref={teacherHeadRef} position={[0, 1.68, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
          {/* Professional Hair Style */}
          <mesh position={[0, 0.04, -0.02]} castShadow>
            <sphereGeometry args={[0.115, 12, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Glasses Frame */}
          <mesh position={[0, 0.01, 0.1]}>
            <boxGeometry args={[0.14, 0.03, 0.02]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
        </group>

        {/* Torso: Collared Shirt, Dark Tie & Tailored Navy Blazer */}
        <group position={[0, 1.22, 0]}>
          {/* Navy Suit Blazer */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.56, 0.2]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} metalness={0.1} />
          </mesh>
          {/* White Shirt Collar */}
          <mesh position={[0, 0.26, 0.09]}>
            <boxGeometry args={[0.12, 0.06, 0.04]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* Crimson Silk Tie */}
          <mesh position={[0, 0.12, 0.105]}>
            <boxGeometry args={[0.04, 0.25, 0.01]} />
            <meshStandardMaterial color="#991b1b" roughness={0.3} />
          </mesh>
        </group>

        {/* Left Arm Resting Naturally */}
        <mesh position={[0.22, 1.15, 0]} castShadow>
          <boxGeometry args={[0.08, 0.44, 0.08]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0.22, 0.88, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>

        {/* Right Arm: ANIMATED LECTURING GESTURE WITH CHALK */}
        <group ref={teacherArmRef} position={[-0.22, 1.4, 0]}>
          {/* Upper Arm */}
          <mesh position={[0, -0.16, 0]} castShadow>
            <boxGeometry args={[0.08, 0.32, 0.08]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          {/* Forearm pointing towards blackboard */}
          <group position={[0, -0.32, 0]}>
            <mesh position={[0, -0.14, 0.1]} rotation={[0.6, 0, 0]} castShadow>
              <boxGeometry args={[0.07, 0.28, 0.07]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
            </mesh>
            {/* Hand holding chalk stick */}
            <mesh position={[0, -0.28, 0.22]}>
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial color="#fed7aa" />
            </mesh>
            {/* White chalk piece pointing to formula */}
            <mesh position={[0, -0.28, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.06, 6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </group>

        {/* Dress Trousers Legs & Oxford Shoes */}
        <mesh position={[-0.09, 0.48, 0]} castShadow>
          <boxGeometry args={[0.12, 0.92, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 0.48, 0]} castShadow>
          <boxGeometry args={[0.12, 0.92, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Leather Shoes */}
        <mesh position={[-0.09, 0.03, 0.04]}>
          <boxGeometry args={[0.11, 0.06, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.09, 0.03, 0.04]}>
          <boxGeometry args={[0.11, 0.06, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* 6. REALISTIC CLASSROOM BENCHES & SEATED 3D HUMAN STUDENTS */}
      {layout?.benches?.map((bench) => (
        <group key={bench.id} position={bench.position}>
          {/* Bench Solid Teak Tabletop with Beveled Rim */}
          <mesh position={[0, 0.725, 0]} castShadow receiveShadow>
            <boxGeometry args={[bench.width, 0.045, bench.depth]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.08} />
          </mesh>
          {/* Heavy Tubular Steel Legs */}
          <mesh position={[-bench.width * 0.46, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[bench.width * 0.46, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Under-Desk Book Rack */}
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[bench.width * 0.88, 0.02, bench.depth * 0.7]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Chairs & Seated Students for Each Seat Position */}
      {layout?.seats?.map((seat, sIdx) => {
        const student = roomStudents.find((s) => s.seatId === seat.id);
        const isHoveredStu = hoveredStudentId === student?.id;
        const isSelectedStu = selectedStudentId === student?.id;
        const hasLaptop = sIdx % 3 === 0;

        return (
          <group key={seat.id} position={[seat.position[0], 0, seat.position[2]]}>
            {/* Ergonomic Molded Chair */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.04, 0.40]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair Backrest */}
            <mesh position={[0, 0.67, 0.18]} castShadow>
              <boxGeometry args={[0.38, 0.22, 0.03]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair 4 Tubular Steel Legs */}
            <mesh position={[-0.16, 0.225, -0.15]}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.16, 0.225, -0.15]}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.16, 0.225, 0.15]}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.16, 0.225, 0.15]}>
              <boxGeometry args={[0.03, 0.45, 0.03]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>

            {/* HIGH-ACCURACY SEATED 3D HUMAN STUDENT FIGURE */}
            {student && (
              <group
                position={[0, 0.47, 0]}
                rotation={[0, Math.PI, 0]} // Faces forward towards the board
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredStudentId(student.id);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredStudentId(null);
                  document.body.style.cursor = 'auto';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectStudent(student.id);
                }}
              >
                {/* Seated Thighs on Cushion */}
                <mesh position={[0, 0.045, 0.12]} castShadow>
                  <boxGeometry args={[0.26, 0.09, 0.3]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Calves & Shins down to floor */}
                <mesh position={[-0.07, -0.23, 0.24]} castShadow>
                  <boxGeometry args={[0.09, 0.46, 0.09]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0.07, -0.23, 0.24]} castShadow>
                  <boxGeometry args={[0.09, 0.46, 0.09]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Student Shoes */}
                <mesh position={[-0.07, -0.44, 0.28]}>
                  <boxGeometry args={[0.09, 0.05, 0.14]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.4} />
                </mesh>
                <mesh position={[0.07, -0.44, 0.28]}>
                  <boxGeometry args={[0.09, 0.05, 0.14]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.4} />
                </mesh>

                {/* Torso with Student Uniform / Avatar Color */}
                <mesh position={[0, 0.30, 0]} castShadow>
                  <boxGeometry args={[0.30, 0.40, 0.18]} />
                  <meshStandardMaterial
                    color={student.avatarColor || '#38bdf8'}
                    roughness={0.4}
                    metalness={0.15}
                  />
                </mesh>
                {/* Collar Accent */}
                <mesh position={[0, 0.48, 0.06]}>
                  <boxGeometry args={[0.12, 0.04, 0.06]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>

                {/* Head & Hair */}
                <mesh position={[0, 0.65, 0.02]} castShadow>
                  <sphereGeometry args={[0.11, 10, 10]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.70, 0]} castShadow>
                  <sphereGeometry args={[0.115, 10, 8]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>

                {/* Arms Reaching Towards Desk Taking Notes */}
                <mesh position={[-0.18, 0.24, 0.14]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.07, 0.24, 0.08]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>
                <mesh position={[0.18, 0.24, 0.14]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.07, 0.24, 0.08]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>
                {/* Hands on Desk */}
                <mesh position={[-0.18, 0.26, 0.26]}>
                  <sphereGeometry args={[0.035, 8, 8]} />
                  <meshStandardMaterial color="#fed7aa" />
                </mesh>
                <mesh position={[0.18, 0.26, 0.26]}>
                  <sphereGeometry args={[0.035, 8, 8]} />
                  <meshStandardMaterial color="#fed7aa" />
                </mesh>

                {/* Desk Items: Open Notebook or Thin Laptop */}
                {hasLaptop ? (
                  <group position={[0, 0.27, 0.38]}>
                    <mesh>
                      <boxGeometry args={[0.22, 0.01, 0.15]} />
                      <meshStandardMaterial color="#475569" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.08, -0.07]} rotation={[-0.25, 0, 0]}>
                      <boxGeometry args={[0.22, 0.14, 0.008]} />
                      <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.5} />
                    </mesh>
                  </group>
                ) : (
                  <group position={[0, 0.265, 0.35]}>
                    <mesh>
                      <boxGeometry args={[0.18, 0.008, 0.24]} />
                      <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                    </mesh>
                    {/* Blue Ballpoint Pen */}
                    <mesh position={[0.11, 0.008, 0]} rotation={[0, 0.2, 0]}>
                      <cylinderGeometry args={[0.004, 0.004, 0.12, 6]} />
                      <meshStandardMaterial color="#2563eb" />
                    </mesh>
                  </group>
                )}

                {/* Floating Nametag for Hovered/Selected Student */}
                {(isHoveredStu || isSelectedStu) && (
                  <Html position={[0, 0.95, 0]} center distanceFactor={16}>
                    <div className="pointer-events-none px-3 py-1.5 rounded-xl bg-[#131219]/95 border border-[#9ff0ec] text-white shadow-2xl flex items-center gap-2 whitespace-nowrap text-[11px] font-mono">
                      <span
                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
                        style={{ backgroundColor: student.avatarColor }}
                      />
                      <span className="font-bold">{student.name}</span>
                      <span className="text-[#9ff0ec]">• {student.usn || student.rollNo}</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Present
                      </span>
                    </div>
                  </Html>
                )}
              </group>
            )}
          </group>
        );
      })}

      {/* 7. HIGH-FIDELITY AERODYNAMIC ROTATING CEILING FAN */}
      <group position={[0, wallHeight + 0.6, 0]}>
        {/* Ceiling Mount Flange / Canopy */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.13, 0.08, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Downrod */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Motor Housing */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.09, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Central Spinner Dome */}
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.08, 12, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>

        {/* Rotating 3 Aerofoil Blades */}
        <group ref={fanBladesRef} position={[0, -0.32, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, bIdx) => (
            <group key={`b-${bIdx}`} rotation={[0, ang, 0]}>
              <mesh position={[0.55, 0, 0]} rotation={[0.18, 0, 0]} castShadow>
                <boxGeometry args={[0.9, 0.015, 0.12]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
              </mesh>
              {/* Blade Shank Bracket */}
              <mesh position={[0.12, 0, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.04]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 8. FLOATING OCCUPANCY & ENERGY BADGE (Professional & Classic Typography) */}
      {showLabels && (
        <Html
          position={[0, wallHeight + 0.85, 0]}
          center
          distanceFactor={24}
          zIndexRange={[90, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectClassroom(id);
            }}
            className={`cursor-pointer px-4 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-3 transition-all select-none shadow-[0_12px_32px_rgba(0,0,0,0.7)] ${
              isSelected
                ? 'bg-[#006bff] border-[#9ff0ec] text-white scale-110 shadow-[0_0_24px_rgba(0,107,255,0.9)]'
                : hovered
                ? 'bg-[#181d2c]/95 border-[#9ff0ec] text-white scale-105'
                : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-[#9ff0ec]'
            }`}
          >
            {/* Color-coded Occupancy Ring Badge */}
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full border-2 font-mono text-[10px] font-bold text-white shadow-sm"
              style={{
                borderColor: occupancyColor,
                backgroundColor: `${occupancyColor}33`
              }}
            >
              ●
            </div>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white font-classic tracking-tight">
                {code || name}
              </span>
              <span className="text-[9px] font-mono text-[#9ff0ec]">
                {department} • {activePowerKw} kW
              </span>
            </div>

            {/* Occupancy Fraction "32 / 40" */}
            <div className="pl-2 border-l border-white/15 flex flex-col items-end">
              <span
                className="text-xs font-mono font-bold"
                style={{ color: occupancyColor }}
              >
                {occupiedCount} / {totalSeats}
              </span>
              <span className="text-[8px] text-[#b9b8bb] font-mono">
                {occupancyPct}% full
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
