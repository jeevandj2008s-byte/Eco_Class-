import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';
import { BUILDINGS_CONFIG, FLOOR_HEIGHT, findClassroomHierarchy } from '../../../config/buildings.config.js';

export function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef();

  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const students = useTwin3DStore((s) => s.students);

  // Target vectors for smooth cinematic easing
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 72, 92));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef(0);

  // Cinematic flyover state
  const [isFlyOver, setIsFlyOver] = useState(false);
  const flyOverProgress = useRef(0);

  useEffect(() => {
    window.__triggerCampusFlyOver = () => {
      setIsFlyOver(true);
      flyOverProgress.current = 0;
    };
    return () => {
      delete window.__triggerCampusFlyOver;
    };
  }, []);

  // Compute camera target based on current navigation depth
  useEffect(() => {
    setIsFlyOver(false);
    let newLookAt = new THREE.Vector3(0, 2, 0);
    let newCamPos = new THREE.Vector3(0, 72, 92);

    if (selectedStudentId) {
      // 1. STUDENT FOCUS
      const student = students.find((s) => s.id === selectedStudentId);
      if (student) {
        const hierarchy = findClassroomHierarchy(student.classroomId);
        if (hierarchy) {
          const { building, floor, classroom } = hierarchy;
          const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
          const roomWorldX = building.position[0] + classroom.offset[0];
          const roomWorldZ = building.position[2] + classroom.offset[2];

          const seat = classroom.layout?.seats?.find((s) => s.id === student.seatId);
          const seatRelX = seat ? seat.position[0] : 0;
          const seatRelY = seat ? seat.position[1] : 0.45;
          const seatRelZ = seat ? seat.position[2] : 0;

          const studentWorldX = roomWorldX + seatRelX;
          const studentWorldY = floorY + seatRelY + 0.35;
          const studentWorldZ = roomWorldZ + seatRelZ;

          newLookAt.set(studentWorldX, studentWorldY, studentWorldZ);
          newCamPos.set(studentWorldX + 1.2, studentWorldY + 1.2, studentWorldZ + 2.2);
        }
      }
    } else if (selectedClassroomId) {
      // 2. DEDICATED CLASSROOM VIEW (Close-up Isometric Dollhouse Cutaway)
      const hierarchy = findClassroomHierarchy(selectedClassroomId);
      if (hierarchy) {
        const { building, floor, classroom } = hierarchy;
        const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
        const roomWorldX = building.position[0] + classroom.offset[0];
        const roomWorldZ = building.position[2] + classroom.offset[2];

        // Focus inside the classroom: unobstructed angle looking across benches to teacher and chalkboard
        newLookAt.set(roomWorldX, floorY + 0.85, roomWorldZ - 0.3);
        newCamPos.set(
          roomWorldX + (classroom.width || 7.5) * 0.2,
          floorY + 3.2,
          roomWorldZ + (classroom.depth || 6.5) * 0.72
        );
      }
    } else if (selectedFloorLevel && selectedBuildingId) {
      // 3. FLOOR VIEW (Optimized closer 3/4 dollhouse framing showing square block rooms)
      const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
      if (building) {
        const floorY = (selectedFloorLevel - 1) * FLOOR_HEIGHT + (selectedFloorLevel - 1) * explodedHeight * 3.5;
        newLookAt.set(building.position[0], floorY + 1.0, building.position[2]);
        // Crisp 35° isometric angle close enough to see moving fans and desks inside each block
        newCamPos.set(
          building.position[0] + building.width * 0.35,
          floorY + 11.2,
          building.position[2] + building.depth * 0.52
        );
      }
    } else if (selectedBuildingId) {
      // 4. BLOCK VIEW
      const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
      if (building) {
        const buildingCenterY = (building.floorCount * FLOOR_HEIGHT) / 2;
        newLookAt.set(building.position[0], buildingCenterY, building.position[2]);
        newCamPos.set(building.position[0] + 12, buildingCenterY + 22, building.position[2] + 42);
      }
    }

    targetLookAt.current.copy(newLookAt);
    targetCamPos.current.copy(newCamPos);
    setIsTransitioning(true);
    transitionTimer.current = 0;
  }, [selectedBuildingId, selectedFloorLevel, selectedClassroomId, selectedStudentId, explodedHeight, students]);

  // Smooth lerp frame loop & optional flyover
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (isFlyOver) {
      flyOverProgress.current += delta * 0.12;
      const t = flyOverProgress.current;
      const radius = 95;
      const camX = Math.sin(t) * radius;
      const camZ = Math.cos(t) * radius;
      const camY = 48 + Math.sin(t * 2) * 12;

      camera.position.set(camX, camY, camZ);
      controlsRef.current.target.set(0, 8, 0);
      controlsRef.current.update();

      if (t >= Math.PI * 2) {
        setIsFlyOver(false);
      }
      return;
    }

    if (isTransitioning) {
      transitionTimer.current += delta;
      const t = Math.min(transitionTimer.current / 1.1, 1.0);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);

      camera.position.lerp(targetCamPos.current, ease * 0.18);
      controlsRef.current.target.lerp(targetLookAt.current, ease * 0.18);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.05
      ) {
        camera.position.copy(targetCamPos.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
        setIsTransitioning(false);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05} // Do not dip below ground plate
      minDistance={2.5}
      maxDistance={240}
    />
  );
}

export default CameraRig;
