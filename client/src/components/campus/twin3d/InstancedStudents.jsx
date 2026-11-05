import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { findClassroomHierarchy, FLOOR_HEIGHT, ANIMATION_CONFIG } from '../../../config/buildings.config.js';

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

  /**
   * Anatomically proportioned seated humanoid model.
   * Coordinate origin (0, 0, 0) is placed at the bottom of the seated pelvis,
   * resting flush on top of the chair seat pad.
   * Local +Z is the forward facing direction (towards the desk and whiteboard).
   */
  const humanoidGeometry = useMemo(() => {
    // 1. Thighs / Pelvis - resting flat on chair cushion (Y from 0 to 0.09, Z extending forward)
    const thighs = new THREE.BoxGeometry(0.28, 0.09, 0.32);
    thighs.translate(0, 0.045, 0.12);

    // 2. Shins / Calves - dropping vertically from knees (Z = +0.24) straight down to floor (Y = -0.47)
    const leftShin = new THREE.BoxGeometry(0.11, 0.46, 0.10);
    leftShin.translate(-0.08, -0.23, 0.24);

    const rightShin = new THREE.BoxGeometry(0.11, 0.46, 0.10);
    rightShin.translate(0.08, -0.23, 0.24);

    // 3. Shoes / Feet - planted flat on classroom floor at Y = -0.47
    const leftFoot = new THREE.BoxGeometry(0.11, 0.06, 0.16);
    leftFoot.translate(-0.08, -0.44, 0.27);

    const rightFoot = new THREE.BoxGeometry(0.11, 0.06, 0.16);
    rightFoot.translate(0.08, -0.44, 0.27);

    // 4. Torso - sitting upright on top of pelvis against chair backrest
    const torso = new THREE.BoxGeometry(0.32, 0.42, 0.18);
    torso.translate(0, 0.30, 0.0);

    // 5. Neck & Head
    const head = new THREE.SphereGeometry(0.12, 10, 10);
    head.translate(0, 0.65, 0.02);

    // 6. Arms - upper arms and forearms resting forward towards the bench desk
    const leftArm = new THREE.BoxGeometry(0.08, 0.24, 0.09);
    leftArm.translate(-0.19, 0.32, 0.06);

    const rightArm = new THREE.BoxGeometry(0.08, 0.24, 0.09);
    rightArm.translate(0.19, 0.32, 0.06);

    const leftForearm = new THREE.BoxGeometry(0.07, 0.06, 0.20);
    leftForearm.translate(-0.16, 0.21, 0.18);

    const rightForearm = new THREE.BoxGeometry(0.07, 0.06, 0.20);
    rightForearm.translate(0.16, 0.21, 0.18);

    const merged = mergeGeometries([
      thighs,
      leftShin,
      rightShin,
      leftFoot,
      rightFoot,
      torso,
      head,
      leftArm,
      rightArm,
      leftForearm,
      rightForearm
    ]);
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
      // Seat cushion top surface is at floorY + seatRelY + 0.02 (0.45 + 0.02 = 0.47)
      const seatRelY = seat ? seat.position[1] : 0.45;
      const seatRelZ = seat ? seat.position[2] : 0;

      return {
        ...s,
        index: idx,
        worldX: roomWorldX + seatRelX,
        worldY: floorY + seatRelY + 0.02, // Pelvis bottom touches the seat pad
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
      // Face forward towards the whiteboard & desk (rotation Y = Math.PI)
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

  // Subtle idle breathing & posture animation
  useFrame((state) => {
    if (!animateStudents || !ANIMATION_CONFIG.enabled || !ANIMATION_CONFIG.studentsIdle || !meshRef.current || studentData.length === 0) return;
    const t = state.clock.getElapsedTime();

    studentData.forEach((s, idx) => {
      const phase = idx * 0.35;
      const breathY = Math.sin(t * 1.8 + phase) * 0.008;
      const swayRot = Math.cos(t * 1.2 + phase) * 0.015;

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
          roughness={0.35}
          metalness={0.2}
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
          <div className="pointer-events-none px-3 py-1.5 rounded-xl bg-[#131219]/95 border border-[#9ff0ec]/40 shadow-[0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col items-center gap-0.5 whitespace-nowrap animate-fade-in select-none">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: activeStudent.avatarColor }}
              />
              <span className="text-xs font-bold text-white tracking-tight">{activeStudent.name}</span>
            </div>
            <div className="text-[10px] text-[#9ff0ec] font-mono flex items-center gap-1.5">
              <span>{activeStudent.usn || activeStudent.rollNo}</span>
              <span>•</span>
              <span className="text-[#c9c3da]">{activeStudent.classroomId}</span>
              <span>•</span>
              <span className="text-amber-300">Row {activeStudent.row + 1} Seat {activeStudent.seatIndex + 1}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
