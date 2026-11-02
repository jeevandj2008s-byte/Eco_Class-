import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { findClassroomHierarchy, FLOOR_HEIGHT } from '../../../config/buildings.config.js';

const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();

export function InstancedStudents() {
  const meshRef = useRef();
  const students = useTwin3DStore((s) => s.students);
  const showStudents = useTwin3DStore((s) => s.showStudents);
  const animateStudents = useTwin3DStore((s) => s.animateStudents);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const hoveredStudentId = useTwin3DStore((s) => s.hoveredStudentId);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);
  const setHoveredStudentId = useTwin3DStore((s) => s.setHoveredStudentId);

  const [hoverIndex, setHoverIndex] = useState(null);

  // Pre-generate human geometry
  const humanoidGeometry = useMemo(() => {
    const head = new THREE.SphereGeometry(0.12, 8, 8);
    head.translate(0, 0.72, 0);

    const torso = new THREE.BoxGeometry(0.32, 0.44, 0.20);
    torso.translate(0, 0.44, 0);

    const thighs = new THREE.BoxGeometry(0.28, 0.12, 0.32);
    thighs.translate(0, 0.20, 0.16);

    const shins = new THREE.BoxGeometry(0.28, 0.32, 0.12);
    shins.translate(0, -0.04, 0.28);

    const merged = mergeGeometries([head, torso, thighs, shins]);
    return merged;
  }, []);

  // Compute student scene coordinates and color palette
  const studentData = useMemo(() => {
    return students.map((s, idx) => {
      const hierarchy = findClassroomHierarchy(s.classroomId);
      if (!hierarchy) return null;

      const { building, floor, classroom } = hierarchy;
      const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
      const roomWorldX = building.position[0] + classroom.offset[0];
      const roomWorldZ = building.position[2] + classroom.offset[2];

      const seat = classroom.layout?.seats?.find((st) => st.id === s.seatId);
      const seatRelX = seat ? seat.position[0] : 0;
      const seatRelY = seat ? seat.position[1] : 0.45;
      const seatRelZ = seat ? seat.position[2] : 0;

      return {
        ...s,
        index: idx,
        worldX: roomWorldX + seatRelX,
        worldY: floorY + seatRelY,
        worldZ: roomWorldZ + seatRelZ,
        color: s.avatarColor || '#38bdf8'
      };
    }).filter(Boolean);
  }, [students, explodedHeight]);

  // Apply instance matrices and colors
  useLayoutEffect(() => {
    if (!meshRef.current || studentData.length === 0) return;

    studentData.forEach((s, idx) => {
      tempObj.position.set(s.worldX, s.worldY, s.worldZ);
      // Face towards the front whiteboard (rotation Y = Math.PI)
      tempObj.rotation.set(0, Math.PI, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();

      meshRef.current.setMatrixAt(idx, tempObj.matrix);

      tempColor.set(s.color);
      meshRef.current.setColorAt(idx, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [studentData]);

  // Subtle idle breathing animation
  useFrame((state) => {
    if (!animateStudents || !meshRef.current || studentData.length === 0) return;
    const t = state.clock.getElapsedTime();

    // Subtle sinusoidal breathing on Y axis
    studentData.forEach((s, idx) => {
      // Individual phase offset based on index
      const phase = idx * 0.35;
      const breathY = Math.sin(t * 1.8 + phase) * 0.015;
      const swayRot = Math.cos(t * 1.2 + phase) * 0.02;

      tempObj.position.set(s.worldX, s.worldY + breathY, s.worldZ);
      tempObj.rotation.set(0, Math.PI + swayRot, 0);
      tempObj.scale.set(1, 1, 1);
      tempObj.updateMatrix();

      meshRef.current.setMatrixAt(idx, tempObj.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!showStudents || studentData.length === 0) return null;

  // Active tooltip target (hovered or selected)
  const activeStudent = studentData.find((s) => s.id === (hoveredStudentId || selectedStudentId));

  return (
    <group name="instanced-campus-students">
      <instancedMesh
        ref={meshRef}
        args={[humanoidGeometry, null, studentData.length]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          const id = e.instanceId;
          if (id !== undefined && studentData[id]) {
            setHoverIndex(id);
            setHoveredStudentId(studentData[id].id);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoverIndex(null);
          setHoveredStudentId(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          const id = e.instanceId;
          if (id !== undefined && studentData[id]) {
            selectStudent(studentData[id].id);
          }
        }}
      >
        <meshStandardMaterial
          roughness={0.4}
          metalness={0.15}
          envMapIntensity={0.8}
        />
      </instancedMesh>

      {/* Floating 3D Nametag for hovered or selected student */}
      {activeStudent && (
        <Html
          position={[activeStudent.worldX, activeStudent.worldY + 0.95, activeStudent.worldZ]}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
        >
          <div className="pointer-events-none px-3 py-1.5 rounded-xl bg-[#131219]/95 border border-[#9ff0ec]/30 shadow-[0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col items-center gap-0.5 whitespace-nowrap animate-fade-in select-none">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: activeStudent.avatarColor }}
              />
              <span className="text-xs font-bold text-white tracking-tight">{activeStudent.name}</span>
            </div>
            <div className="text-[10px] text-[#9ff0ec] font-mono flex items-center gap-1.5">
              <span>{activeStudent.usn || activeStudent.rollNo}</span>
              <span>•</span>
              <span className="text-[#c9c3da]">{activeStudent.classroomId}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

