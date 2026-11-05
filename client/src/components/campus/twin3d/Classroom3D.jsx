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
  const animateStudents = useTwin3DStore((s) => s.animateStudents);

  const isSelected = selectedClassroomId === id;
  const isFloorSelected = selectedBuildingId === buildingId && selectedFloorLevel === floorLevel;

  // Filter students allotted to this specific classroom
  const roomStudents = useMemo(() => {
    return students.filter((s) => s.classroomId === id);
  }, [students, id]);

  const totalSeats = layout?.seats?.length || 0;
  const occupiedCount = roomStudents.length;
  const occupancyPct = totalSeats > 0 ? Math.round((occupiedCount / totalSeats) * 100) : 0;

  // Occupancy color indicator
  const occupancyColor =
    occupancyPct >= 90 ? '#ef4444' : occupancyPct >= 70 ? '#f59e0b' : '#10b981';

  // Wall height for isometric cutaway dollhouse view
  const wallHeight = 1.6;

  // Animate ceiling fan
  useFrame((_, delta) => {
    if (!ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.ceilingFans) return;
    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 7.5;
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
      {/* 1. Volumetric Floor Slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width - 0.1, 0.1, depth - 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#1f2e47' : hovered ? '#1e2638' : '#141824'}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 2. Solid Extruded Perimeter Walls with Thickness */}
      {/* North Wall (where whiteboard sits) */}
      <mesh position={[0, wallHeight / 2, -depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, 0.22]} />
        <meshStandardMaterial color="#222838" roughness={0.7} />
      </mesh>
      {/* North Wall Lintel Cap */}
      <mesh position={[0, wallHeight + 0.02, -depth / 2]}>
        <boxGeometry args={[width + 0.04, 0.04, 0.26]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>

      {/* South Wall (Corridor boundary with real Door passage cutout) */}
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
      </group>

      {/* West Dividing Wall */}
      <mesh position={[-width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, wallHeight, depth]} />
        <meshStandardMaterial color="#1e2330" roughness={0.7} />
      </mesh>

      {/* East Dividing Wall */}
      <mesh position={[width / 2, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, wallHeight, depth]} />
        <meshStandardMaterial color="#1e2330" roughness={0.7} />
      </mesh>

      {/* 3. Front Wall Green Chalkboard */}
      <group position={[0, 1.1, -depth / 2 + 0.14]}>
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 1.0, 0.04]} />
          <meshStandardMaterial color="#14532d" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* Metal Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55) + 0.1, 1.08, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Wooden Chalk Tray */}
        <mesh position={[0, -0.52, 0.03]}>
          <boxGeometry args={[Math.min(4.8, width * 0.55), 0.04, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      </group>

      {/* 4. Teacher Podium Desk & Standing Teacher Figure */}
      {layout?.teacherDesk && (
        <group position={[layout.teacherDesk.position[0], 0, layout.teacherDesk.position[2]]}>
          {/* Desk Top */}
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[layout.teacherDesk.width, 0.05, layout.teacherDesk.depth]} />
            <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* Desk Legs */}
          <mesh position={[-layout.teacherDesk.width * 0.44, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, layout.teacherDesk.depth * 0.85]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[layout.teacherDesk.width * 0.44, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, layout.teacherDesk.depth * 0.85]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Modesty Panel */}
          <mesh position={[0, 0.4, -layout.teacherDesk.depth * 0.38]}>
            <boxGeometry args={[layout.teacherDesk.width * 0.85, 0.4, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      )}

      {/* Standing Teacher Figure at Board */}
      <group position={[1.4, 0, -depth / 2 + 1.2]} rotation={[0, Math.PI, 0]}>
        {/* Head */}
        <mesh position={[0, 1.68, 0]} castShadow>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </mesh>
        {/* Torso in Blazer */}
        <mesh position={[0, 1.22, 0]} castShadow>
          <boxGeometry args={[0.34, 0.56, 0.2]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.09, 0.48, 0]} castShadow>
          <boxGeometry args={[0.12, 0.92, 0.14]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 0.48, 0]} castShadow>
          <boxGeometry args={[0.12, 0.92, 0.14]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>
      </group>

      {/* 5. REAL 3D BENCHES IN NEAT ROWS & SEATED 3D STUDENTS */}
      {layout?.benches?.map((bench) => (
        <group key={bench.id} position={bench.position}>
          {/* Bench Warm Wooden Tabletop */}
          <mesh position={[0, 0.725, 0]} castShadow receiveShadow>
            <boxGeometry args={[bench.width, 0.045, bench.depth]} />
            <meshStandardMaterial color="#854d0e" roughness={0.5} metalness={0.05} />
          </mesh>
          {/* Steel Frame Legs */}
          <mesh position={[-bench.width * 0.46, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[bench.width * 0.46, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.7, bench.depth * 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Chairs & Seated Students for Each Seat Position */}
      {layout?.seats?.map((seat) => {
        // Find if this seat is occupied by a student
        const student = roomStudents.find((s) => s.seatId === seat.id);
        const isHoveredStu = hoveredStudentId === student?.id;
        const isSelectedStu = selectedStudentId === student?.id;

        return (
          <group key={seat.id} position={[seat.position[0], 0, seat.position[2]]}>
            {/* 3D Chair (Seat Cushion + Backrest + Legs) */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.04, 0.40]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair Backrest */}
            <mesh position={[0, 0.67, 0.18]} castShadow>
              <boxGeometry args={[0.38, 0.22, 0.03]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Chair 4 Legs */}
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

            {/* SEATED 3D HUMAN STUDENT FIGURE (On Occupied Seats) */}
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
                {/* Seated Thighs (flush on seat) */}
                <mesh position={[0, 0.045, 0.12]} castShadow>
                  <boxGeometry args={[0.26, 0.09, 0.3]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Shins & Calves down to floor */}
                <mesh position={[-0.07, -0.23, 0.24]} castShadow>
                  <boxGeometry args={[0.09, 0.46, 0.09]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0.07, -0.23, 0.24]} castShadow>
                  <boxGeometry args={[0.09, 0.46, 0.09]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                {/* Torso with Uniform / Avatar Color */}
                <mesh position={[0, 0.30, 0]} castShadow>
                  <boxGeometry args={[0.30, 0.40, 0.18]} />
                  <meshStandardMaterial
                    color={student.avatarColor || '#38bdf8'}
                    roughness={0.4}
                    metalness={0.15}
                  />
                </mesh>
                {/* Head */}
                <mesh position={[0, 0.65, 0.02]} castShadow>
                  <sphereGeometry args={[0.11, 8, 8]} />
                  <meshStandardMaterial color="#fed7aa" roughness={0.6} />
                </mesh>
                {/* Arms reaching towards desk */}
                <mesh position={[-0.18, 0.24, 0.12]} rotation={[0.4, 0, 0]}>
                  <boxGeometry args={[0.07, 0.22, 0.08]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>
                <mesh position={[0.18, 0.24, 0.12]} rotation={[0.4, 0, 0]}>
                  <boxGeometry args={[0.07, 0.22, 0.08]} />
                  <meshStandardMaterial color={student.avatarColor || '#38bdf8'} />
                </mesh>

                {/* Floating Nametag for Hovered/Selected Student */}
                {(isHoveredStu || isSelectedStu) && (
                  <Html position={[0, 0.95, 0]} center distanceFactor={16}>
                    <div className="pointer-events-none px-2.5 py-1 rounded-xl bg-[#131219]/95 border border-[#9ff0ec] text-white shadow-xl flex items-center gap-2 whitespace-nowrap text-[10px] font-mono">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: student.avatarColor }}
                      />
                      <span className="font-bold">{student.name}</span>
                      <span className="text-[#9ff0ec]">• {student.usn || student.rollNo}</span>
                    </div>
                  </Html>
                )}
              </group>
            )}
          </group>
        );
      })}

      {/* 6. ROTATING CEILING FAN */}
      <group position={[0, wallHeight + 0.6, 0]}>
        {/* Downrod */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Hub */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.4} />
        </mesh>
        {/* Rotating 3 Blades */}
        <group ref={fanBladesRef} position={[0, -0.32, 0]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, bIdx) => (
            <group key={`b-${bIdx}`} rotation={[0, ang, 0]}>
              <mesh position={[0.55, 0, 0]} rotation={[0.15, 0, 0]} castShadow>
                <boxGeometry args={[0.9, 0.015, 0.12]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 7. FLOATING OCCUPANCY BADGE & ROOM TITLE (Visible in Cutaway & Block View) */}
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
            className={`cursor-pointer px-3.5 py-1.5 rounded-2xl border backdrop-blur-xl flex items-center gap-2.5 transition-all select-none shadow-[0_12px_32px_rgba(0,0,0,0.7)] ${
              isSelected
                ? 'bg-[#006bff] border-[#9ff0ec] text-white scale-110 shadow-[0_0_24px_rgba(0,107,255,0.9)]'
                : hovered
                ? 'bg-[#181d2c]/95 border-[#9ff0ec] text-white scale-105'
                : 'bg-[#10131d]/90 border-white/20 text-[#c9c3da] hover:border-[#9ff0ec]'
            }`}
          >
            {/* Color-coded Occupancy Ring Badge */}
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full border-2 font-mono text-[9px] font-bold text-white shadow-sm"
              style={{
                borderColor: occupancyColor,
                backgroundColor: `${occupancyColor}33`
              }}
            >
              ●
            </div>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white tracking-tight">
                {code || name}
              </span>
              <span className="text-[9px] font-mono text-[#c9c3da]">
                {department}
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
