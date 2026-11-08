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

  const totalSeats = layout?.seats?.length || 24;
  const occupiedCount = roomStudents.length;
  const occupancyPct = totalSeats > 0 ? Math.round((occupiedCount / totalSeats) * 100) : 0;

  // Real-time simulated power draw based on occupied students and active equipment
  const activePowerKw = useMemo(() => {
    const watts = 350 + occupiedCount * 55;
    return (watts / 1000).toFixed(2);
  }, [occupiedCount]);

  // Occupancy color indicator
  const occupancyColor =
    occupancyPct >= 90 ? '#ef4444' : occupancyPct >= 70 ? '#f59e0b' : '#10b981';

  // Architectural Dollhouse Low-Wall Heights for Unobstructed Interior Visibility
  const backWallHeight = 1.25;
  const sideWallHeight = 0.85;
  const frontCutawayHeight = 0.32; // Lowered so camera has 100% clear sightline inside!

  // Smooth Animations: Fan rotation, Teacher lecturing gesture & Smart Meter pulse
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // 1. Moving ceiling fan rotation
    if (ANIMATION_CONFIG.enabled && ANIMATION_CONFIG.ceilingFans && fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 8.5;
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
      {/* 0. Warm Interior Ambient Point Light (Illuminates Room Interior) */}
      <pointLight
        position={[0, 1.4, 0]}
        intensity={isSelected ? 0.85 : 0.45}
        color="#fff4e0"
        distance={9}
        decay={2}
      />

      {/* 1. DISTINCT MODULAR SQUARE BLOCK FLOOR SLAB */}
      {/* Base Room Floor Slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.06, 0.1, depth - 0.06]} />
        <meshStandardMaterial
          color={isSelected ? '#20293d' : hovered ? '#1e2638' : '#171c28'}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Architectural Skirting & Perimeter Room Boundary (Clear Square Block Definition) */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[width - 0.04, 0.015, depth - 0.04]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : hovered ? '#9ff0ec' : '#334155'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* 2. ARCHITECTURAL DOLLHOUSE CUTAWAY WALLS (Square Room Partitioning) */}
      {/* North (Back) Wall: Holds Chalkboard, Conduits, DB Box & Smart Meter */}
      <mesh position={[0, backWallHeight / 2, -depth / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[width, backWallHeight, 0.2]} />
        <meshStandardMaterial color="#222838" roughness={0.7} />
      </mesh>
      {/* North Wall Top Architectural Lintel Cap */}
      <mesh position={[0, backWallHeight + 0.02, -depth / 2 + 0.1]}>
        <boxGeometry args={[width + 0.02, 0.04, 0.24]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>

      {/* West Dividing Wall (Low cutaway for square block definition) */}
      <mesh position={[-width / 2 + 0.1, sideWallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, sideWallHeight, depth]} />
        <meshStandardMaterial color="#1e2330" roughness={0.7} />
      </mesh>

      {/* East Dividing Wall with Window Glass Accent */}
      <group position={[width / 2 - 0.1, 0, 0]}>
        <mesh position={[0, sideWallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, sideWallHeight, depth]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Semi-translucent architectural glass window panel */}
        <mesh position={[0, sideWallHeight * 0.65, 0]}>
          <boxGeometry args={[0.04, 0.35, depth * 0.55]} />
          <meshStandardMaterial
            color="#9ff0ec"
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* South (Front) Corridor Wall: CUT DOWN LOW (0.32m) so Classroom Interior is 100% Visible! */}
      <group position={[0, 0, depth / 2 - 0.1]}>
        {/* Left low wall stub */}
        <mesh position={[-width * 0.28, frontCutawayHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.44, frontCutawayHeight, 0.2]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Right low wall stub */}
        <mesh position={[width * 0.28, frontCutawayHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.44, frontCutawayHeight, 0.2]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Open Doorway Passage Threshold */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[width * 0.16, 0.02, 0.2]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} />
        </mesh>
      </group>

      {/* 3. FRONT WALL GREEN CHALKBOARD */}
      <group position={[0, 0.85, -depth / 2 + 0.22]}>
        {/* Slate Blackboard Body */}
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(4.4, width * 0.58), 0.72, 0.03]} />
          <meshStandardMaterial color="#0f3e26" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* Brushed Aluminum Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[Math.min(4.4, width * 0.58) + 0.08, 0.78, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Wooden Chalk & Duster Tray */}
        <mesh position={[0, -0.38, 0.03]}>
          <boxGeometry args={[Math.min(4.4, width * 0.58), 0.03, 0.06]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        {/* Chalk sticks in tray */}
        <mesh position={[-0.3, -0.36, 0.03]}>
          <cylinderGeometry args={[0.007, 0.007, 0.04, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, -0.36, 0.03]}>
          <cylinderGeometry args={[0.007, 0.007, 0.04, 6]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* 3D Chalk diagram lines (rendered directly on mesh, no HTML bleed) */}
        <mesh position={[0, 0.05, 0.018]}>
          <planeGeometry args={[Math.min(3.8, width * 0.5), 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* 4. "THE ELECTRICITY THING": Full Electrical Infrastructure & Metering */}
      {/* A. Sub-Distribution Board (DB / Breaker Box) on West Side */}
      <group position={[-width / 2 + 0.22, 0.85, -depth / 2 + 0.9]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.42, 0.34]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* DB Front Door Bezel */}
        <mesh position={[0.038, 0, 0]}>
          <boxGeometry args={[0.008, 0.38, 0.3]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        {/* Hazard Badge */}
        <mesh position={[0.043, 0.12, 0]}>
          <boxGeometry args={[0.002, 0.06, 0.08]} />
          <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.5} />
        </mesh>
        {/* 3-Phase Indicator LEDs (R-Y-B) */}
        <mesh position={[0.043, -0.12, -0.07]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.043, -0.12, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.043, -0.12, 0.07]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* B. Smart IoT Energy Sub-Meter next to DB Box */}
      <group position={[-width / 2 + 0.22, 0.85, -depth / 2 + 1.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.3, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Digital LCD screen */}
        <mesh position={[0.032, 0.04, 0]}>
          <boxGeometry args={[0.004, 0.11, 0.18]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Pulsing Energy Impulse LED (blinks in real-time) */}
        <mesh position={[0.032, -0.07, -0.05]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={2.0}
            transparent
            ref={pulseLedRef}
          />
        </mesh>
        {/* Telemetry LED (Blue) */}
        <mesh position={[0.032, -0.07, 0.05]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* C. Metallic Electrical EMT Conduit Pipe Runs */}
      {/* Vertical riser from DB box up to wall header */}
      <mesh position={[-width / 2 + 0.22, (0.85 + backWallHeight) / 2, -depth / 2 + 0.9]}>
        <cylinderGeometry args={[0.014, 0.014, backWallHeight - 0.55, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Horizontal conduit run along North wall header */}
      <mesh position={[0, backWallHeight - 0.06, -depth / 2 + 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, width * 0.88, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Ceiling conduit branches feeding Fans and Lighting */}
      <mesh position={[0, backWallHeight - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, depth * 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* D. Overhead High-Efficiency LED Troffer Luminaires */}
      {[-width * 0.22, width * 0.22].map((lx, lIdx) => (
        <group key={`light-${lIdx}`} position={[lx, backWallHeight + 0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.38, 0.03, depth * 0.6]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.015, 0]}>
            <boxGeometry args={[0.35, 0.01, depth * 0.56]} />
            <meshStandardMaterial
              color="#f8fafc"
              emissive="#f8fafc"
              emissiveIntensity={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* 5. TEACHER PODIUM DESK & ACCURATE TEACHER FIGURE */}
      {layout?.teacherDesk && (
        <group position={[layout.teacherDesk.position[0], 0, layout.teacherDesk.position[2]]}>
          {/* Lectern Desk Top */}
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[layout.teacherDesk.width, 0.04, layout.teacherDesk.depth]} />
            <meshStandardMaterial color="#3b2d20" roughness={0.4} metalness={0.15} />
          </mesh>
          {/* Wooden Chamfered Base */}
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[layout.teacherDesk.width * 0.88, 0.68, layout.teacherDesk.depth * 0.75]} />
            <meshStandardMaterial color="#2d2218" roughness={0.5} />
          </mesh>
          {/* Teacher Open Slim Laptop */}
          <group position={[0.18, 0.75, 0]}>
            <mesh>
              <boxGeometry args={[0.26, 0.012, 0.18]} />
              <meshStandardMaterial color="#475569" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.09, -0.09]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.26, 0.16, 0.008]} />
              <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* ACCURATE TEACHER HUMAN FIGURE STANDING AT BOARD */}
      <group position={[1.2, 0, -depth / 2 + 1.1]} rotation={[0, Math.PI, 0]}>
        {/* Head with Realistic Hair, Glasses & Animated Swivel */}
        <group ref={teacherHeadRef} position={[0, 1.65, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.04, -0.02]} castShadow>
            <sphereGeometry args={[0.115, 10, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.01, 0.09]}>
            <boxGeometry args={[0.13, 0.03, 0.02]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
        </group>

        {/* Torso: Collared Shirt, Dark Tie & Navy Blazer */}
        <group position={[0, 1.20, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.54, 0.19]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.25, 0.09]}>
            <boxGeometry args={[0.11, 0.05, 0.03]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.11, 0.1]}>
            <boxGeometry args={[0.04, 0.24, 0.01]} />
            <meshStandardMaterial color="#991b1b" roughness={0.3} />
          </mesh>
        </group>

        {/* Left Arm Resting */}
        <mesh position={[0.21, 1.12, 0]} castShadow>
          <boxGeometry args={[0.07, 0.42, 0.07]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>

        {/* Right Arm: ANIMATED LECTURING GESTURE WITH CHALK */}
        <group ref={teacherArmRef} position={[-0.21, 1.38, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.07, 0.3, 0.07]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          <group position={[0, -0.3, 0]}>
            <mesh position={[0, -0.13, 0.09]} rotation={[0.6, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.26, 0.06]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
            </mesh>
            {/* White chalk piece pointing to blackboard */}
            <mesh position={[0, -0.26, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.06, 6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>

        {/* Legs & Shoes */}
        <mesh position={[-0.08, 0.47, 0]} castShadow>
          <boxGeometry args={[0.11, 0.9, 0.13]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.47, 0]} castShadow>
          <boxGeometry args={[0.11, 0.9, 0.13]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.03, 0.04]}>
          <boxGeometry args={[0.1, 0.05, 0.16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.08, 0.03, 0.04]}>
          <boxGeometry args={[0.1, 0.05, 0.16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>

      {/* 6. NEAT CLASSROOM BENCHES & SEATED 3D HUMAN STUDENTS */}
      {layout?.benches?.map((bench) => (
        <group key={bench.id} position={bench.position}>
          {/* Bench Solid Teak Tabletop */}
          <mesh position={[0, 0.71, 0]} castShadow receiveShadow>
            <boxGeometry args={[bench.width, 0.04, bench.depth]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.08} />
          </mesh>
          {/* Steel Frame Legs */}
          <mesh position={[-bench.width * 0.46, 0.34, 0]}>
            <boxGeometry args={[0.035, 0.68, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[bench.width * 0.46, 0.34, 0]}>
            <boxGeometry args={[0.035, 0.68, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
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
            {/* Ergonomic Molded Chair Cushion */}
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.40, 0.035, 0.38]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair Backrest */}
            <mesh position={[0, 0.65, 0.17]} castShadow>
              <boxGeometry args={[0.36, 0.20, 0.025]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair 4 Tubular Steel Legs */}
            <mesh position={[-0.15, 0.22, -0.14]}>
              <boxGeometry args={[0.025, 0.44, 0.025]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.15, 0.22, -0.14]}>
              <boxGeometry args={[0.025, 0.44, 0.025]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.15, 0.22, 0.14]}>
              <boxGeometry args={[0.025, 0.44, 0.025]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.15, 0.22, 0.14]}>
              <boxGeometry args={[0.025, 0.44, 0.025]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>

            {/* HIGH-ACCURACY SEATED 3D HUMAN STUDENT FIGURE */}
            {student && (
              <group
                position={[0, 0.46, 0]}
                rotation={[0, Math.PI, 0]} // Faces forward toward chalkboard
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
                <mesh position={[0, 0.04, 0.11]} castShadow>
                  <boxGeometry args={[0.25, 0.08, 0.28]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Calves down to floor */}
                <mesh position={[-0.07, -0.22, 0.23]} castShadow>
                  <boxGeometry args={[0.08, 0.44, 0.08]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0.07, -0.22, 0.23]} castShadow>
                  <boxGeometry args={[0.08, 0.44, 0.08]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>

                {/* Torso with Uniform / Avatar Color */}
                <mesh position={[0, 0.29, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.38, 0.17]} />
                  <meshStandardMaterial
                    color={student.avatarColor || '#38bdf8'}
                    roughness={0.4}
                    metalness={0.15}
                  />
                </mesh>

                {/* Head & Hair */}
                <mesh position={[0, 0.63, 0.02]} castShadow>
                  <sphereGeometry args={[0.10, 10, 10]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.67, 0]} castShadow>
                  <sphereGeometry args={[0.105, 10, 8]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>

                {/* Arms Reaching Towards Desk Taking Notes */}
                <mesh position={[-0.17, 0.23, 0.13]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.065, 0.22, 0.07]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>
                <mesh position={[0.17, 0.23, 0.13]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.065, 0.22, 0.07]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>

                {/* Desk Items: Open Notebook or Slim Laptop */}
                {hasLaptop ? (
                  <group position={[0, 0.26, 0.36]}>
                    <mesh>
                      <boxGeometry args={[0.20, 0.009, 0.14]} />
                      <meshStandardMaterial color="#475569" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.07, -0.06]} rotation={[-0.25, 0, 0]}>
                      <boxGeometry args={[0.20, 0.13, 0.007]} />
                      <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.6} />
                    </mesh>
                  </group>
                ) : (
                  <group position={[0, 0.255, 0.34]}>
                    <mesh>
                      <boxGeometry args={[0.16, 0.008, 0.22]} />
                      <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                    </mesh>
                  </group>
                )}

                {/* Floating Nametag for Hovered/Selected Student */}
                {(isHoveredStu || isSelectedStu) && (
                  <Html position={[0, 0.95, 0]} center distanceFactor={18}>
                    <div className="pointer-events-none px-2.5 py-1 rounded-xl bg-[#131219]/95 border border-[#9ff0ec] text-white shadow-2xl flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: student.avatarColor }}
                      />
                      <span className="font-bold">{student.name}</span>
                      <span className="text-[#9ff0ec]">• {student.usn || student.rollNo}</span>
                      <span className="text-emerald-400 text-[9px]">Present</span>
                    </div>
                  </Html>
                )}
              </group>
            )}
          </group>
        );
      })}

      {/* 7. HIGH-FIDELITY MOVING CEILING FAN */}
      <group position={[0, backWallHeight + 0.55, 0]}>
        {/* Ceiling Mount Flange */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.11, 0.06, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Downrod */}
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Motor Housing */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Central Spinner Dome */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.07, 12, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>

        {/* Moving 3 Aerofoil Blades (Rotating in useFrame) */}
        <group ref={fanBladesRef} position={[0, -0.30, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, bIdx) => (
            <group key={`b-${bIdx}`} rotation={[0, ang, 0]}>
              <mesh position={[0.50, 0, 0]} rotation={[0.18, 0, 0]} castShadow>
                <boxGeometry args={[0.85, 0.014, 0.11]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 8. SLEEK COMPACT NON-OVERLAPPING CLASSROOM BADGE */}
      {/* Placed neatly at the top rear wall cap so it NEVER obscures the classroom interior! */}
      {showLabels && (
        <Html
          position={[0, backWallHeight + 0.35, -depth / 2 + 0.1]}
          center
          distanceFactor={42}
          zIndexRange={[70, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectClassroom(id);
            }}
            className={`cursor-pointer px-2.5 py-1.5 rounded-xl border backdrop-blur-xl flex flex-col gap-1 transition-all select-none shadow-[0_8px_24px_rgba(0,0,0,0.8)] ${
              isSelected
                ? 'bg-[#006bff]/95 border-[#9ff0ec] text-white scale-110 shadow-[0_0_20px_rgba(0,107,255,0.9)] ring-2 ring-[#9ff0ec]/50'
                : hovered
                ? 'bg-[#181d2c]/95 border-[#9ff0ec] text-white scale-105'
                : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-[#9ff0ec]'
            }`}
            style={{ maxWidth: '175px' }}
          >
            {/* Header: Class Code & Power Content */}
            <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: occupancyColor }}
                />
                <span className="font-bold text-[11px] text-white tracking-tight font-classic">
                  {code || name}
                </span>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-amber-300">
                {activePowerKw} kW
              </span>
            </div>

            {/* Department & Moving Fan Status */}
            <div className="flex items-center justify-between text-[8.5px] text-[#b9b8bb] font-mono leading-none">
              <span>{department}</span>
              <span className="text-cyan-300 flex items-center gap-0.5 font-semibold">
                <span className="inline-block animate-spin text-[8px]">🌀</span>
                <span>Fan: ON</span>
              </span>
            </div>

            {/* Attendance & Present Count */}
            <div className="flex items-center justify-between text-[8.5px] font-mono pt-0.5">
              <span style={{ color: occupancyColor }} className="font-bold">
                {occupancyPct}% Att.
              </span>
              <span className="text-white/80 font-bold">
                {occupiedCount} / {totalSeats} Present
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
