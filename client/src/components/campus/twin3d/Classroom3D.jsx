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

  // Architectural Dollhouse Low-Wall Heights for Unobstructed Sightlines
  const backWallHeight = 1.25;
  const sideWallHeight = 0.85;
  const frontCutawayHeight = 0.32; // Cut low so camera sees inside unobstructed!

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
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.06, 0.1, depth - 0.06]} />
        <meshStandardMaterial
          color={isSelected ? '#20293d' : hovered ? '#1e2638' : '#171c28'}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Architectural Skirting & Perimeter Room Boundary */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[width - 0.04, 0.015, depth - 0.04]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : hovered ? '#9ff0ec' : '#334155'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* 2. ARCHITECTURAL DOLLHOUSE CUTAWAY WALLS */}
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

      {/* East Dividing Wall with REALISTIC ARCHITECTURAL GLASS WINDOWS & FRAMING */}
      <group position={[width / 2 - 0.1, 0, 0]}>
        <mesh position={[0, sideWallHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, sideWallHeight, depth]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
        {/* Aluminum Window Framing */}
        <mesh position={[0, sideWallHeight * 0.65, 0]}>
          <boxGeometry args={[0.08, 0.42, depth * 0.62]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Ultra-Clear Architectural Glass Panes */}
        <mesh position={[0, sideWallHeight * 0.65, 0]}>
          <boxGeometry args={[0.02, 0.38, depth * 0.58]} />
          <meshStandardMaterial
            color="#7dd3fc"
            transparent
            opacity={0.32}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>
        {/* Vertical Aluminum Glass Mullions */}
        {[-depth * 0.18, 0, depth * 0.18].map((mz, mi) => (
          <mesh key={`mullion-${mi}`} position={[0, sideWallHeight * 0.65, mz]}>
            <boxGeometry args={[0.04, 0.38, 0.025]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* South (Front) Corridor Wall: CUT DOWN LOW (0.32m) so Classroom Interior is 100% Visible! */}
      <group position={[0, 0, depth / 2 - 0.1]}>
        <mesh position={[-width * 0.28, frontCutawayHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.44, frontCutawayHeight, 0.2]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} />
        </mesh>
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
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(4.4, width * 0.58), 0.72, 0.03]} />
          <meshStandardMaterial color="#0f3e26" roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[Math.min(4.4, width * 0.58) + 0.08, 0.78, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.38, 0.03]}>
          <boxGeometry args={[Math.min(4.4, width * 0.58), 0.03, 0.06]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[-0.3, -0.36, 0.03]}>
          <cylinderGeometry args={[0.007, 0.007, 0.04, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, -0.36, 0.03]}>
          <cylinderGeometry args={[0.007, 0.007, 0.04, 6]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.05, 0.018]}>
          <planeGeometry args={[Math.min(3.8, width * 0.5), 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* 4. ELECTRICAL INFRASTRUCTURE & METERING */}
      {/* Sub-Distribution Board (DB) */}
      <group position={[-width / 2 + 0.22, 0.85, -depth / 2 + 0.9]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.42, 0.34]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.038, 0, 0]}>
          <boxGeometry args={[0.008, 0.38, 0.3]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <mesh position={[0.043, 0.12, 0]}>
          <boxGeometry args={[0.002, 0.06, 0.08]} />
          <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.5} />
        </mesh>
        {/* 3-Phase Indicator LEDs */}
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

      {/* Smart IoT Energy Sub-Meter */}
      <group position={[-width / 2 + 0.22, 0.85, -depth / 2 + 1.45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.3, 0.24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.032, 0.04, 0]}>
          <boxGeometry args={[0.004, 0.11, 0.18]} />
          <meshStandardMaterial
            color="#083344"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
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
        <mesh position={[0.032, -0.07, 0.05]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* EMT Conduit Pipes */}
      <mesh position={[-width / 2 + 0.22, (0.85 + backWallHeight) / 2, -depth / 2 + 0.9]}>
        <cylinderGeometry args={[0.014, 0.014, backWallHeight - 0.55, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      <mesh position={[0, backWallHeight - 0.06, -depth / 2 + 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, width * 0.88, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.88} roughness={0.15} />
      </mesh>
      <mesh position={[0, backWallHeight - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, depth * 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Overhead LED Troffers */}
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

      {/* 5. TEACHER PODIUM & ANIMATED TEACHER FIGURE */}
      {layout?.teacherDesk && (
        <group position={[layout.teacherDesk.position[0], 0, layout.teacherDesk.position[2]]}>
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[layout.teacherDesk.width, 0.04, layout.teacherDesk.depth]} />
            <meshStandardMaterial color="#3b2d20" roughness={0.4} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[layout.teacherDesk.width * 0.88, 0.68, layout.teacherDesk.depth * 0.75]} />
            <meshStandardMaterial color="#2d2218" roughness={0.5} />
          </mesh>
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

      {/* Teacher Human Model Standing at Blackboard */}
      <group position={[1.2, 0, -depth / 2 + 1.1]} rotation={[0, Math.PI, 0]}>
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

        <mesh position={[0.21, 1.12, 0]} castShadow>
          <boxGeometry args={[0.07, 0.42, 0.07]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>

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
            <mesh position={[0, -0.26, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.06, 6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>

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

      {/* 6. NEAT BENCHES & SEATED 3D STUDENTS */}
      {layout?.benches?.map((bench) => (
        <group key={bench.id} position={bench.position}>
          <mesh position={[0, 0.71, 0]} castShadow receiveShadow>
            <boxGeometry args={[bench.width, 0.04, bench.depth]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.08} />
          </mesh>
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
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.40, 0.035, 0.38]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.65, 0.17]} castShadow>
              <boxGeometry args={[0.36, 0.20, 0.025]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
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

            {/* SEATED 3D HUMAN STUDENT FIGURE */}
            {student && (
              <group
                position={[0, 0.46, 0]}
                rotation={[0, Math.PI, 0]}
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
                <mesh position={[0, 0.04, 0.11]} castShadow>
                  <boxGeometry args={[0.25, 0.08, 0.28]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[-0.07, -0.22, 0.23]} castShadow>
                  <boxGeometry args={[0.08, 0.44, 0.08]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0.07, -0.22, 0.23]} castShadow>
                  <boxGeometry args={[0.08, 0.44, 0.08]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>

                <mesh position={[0, 0.29, 0]} castShadow>
                  <boxGeometry args={[0.28, 0.38, 0.17]} />
                  <meshStandardMaterial
                    color={student.avatarColor || '#38bdf8'}
                    roughness={0.4}
                    metalness={0.15}
                  />
                </mesh>

                <mesh position={[0, 0.63, 0.02]} castShadow>
                  <sphereGeometry args={[0.10, 10, 10]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.67, 0]} castShadow>
                  <sphereGeometry args={[0.105, 10, 8]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>

                <mesh position={[-0.17, 0.23, 0.13]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.065, 0.22, 0.07]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>
                <mesh position={[0.17, 0.23, 0.13]} rotation={[0.45, 0, 0]}>
                  <boxGeometry args={[0.065, 0.22, 0.07]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>

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
              </group>
            )}
          </group>
        );
      })}

      {/* 7. HIGH-FIDELITY MOVING CEILING FAN */}
      <group position={[0, backWallHeight + 0.55, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.11, 0.06, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.07, 12, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>

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

      {/* 8. ULTRA-COMPACT SLEEK MICRO-PILL (Rendered ONLY in Floor View, Auto-Hides in Class View) */}
      {/* Zero 3D overlays exist in Class View so the glass windows and interior are 100% visible! */}
      {!selectedClassroomId && showLabels && (
        <Html
          position={[0, backWallHeight + 0.18, -depth / 2 + 0.1]}
          center
          zIndexRange={[60, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectClassroom(id);
            }}
            className={`cursor-pointer px-2 py-0.5 rounded-md border backdrop-blur-md flex items-center gap-1.5 transition-colors select-none shadow-sm ${
              isSelected
                ? 'bg-[#006bff]/95 border-[#9ff0ec] text-white ring-1 ring-[#9ff0ec]/50'
                : hovered
                ? 'bg-[#181d2c]/95 border-white/40 text-white'
                : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-white/40'
            }`}
            style={{ whiteSpace: 'nowrap' }}
            title={`Click to open ${code || name} Class View`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: occupancyColor }}
            />
            <span className="font-bold text-[10px] text-white font-classic tracking-tight">
              {code || name}
            </span>
            <span className="text-[9px] font-mono text-amber-300 font-semibold">
              {activePowerKw} kW
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

export default Classroom3D;
