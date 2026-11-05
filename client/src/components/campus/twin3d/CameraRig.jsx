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

  // Desired target & position vectors for lerping
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 68, 88));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef(0);

  // Optional Cinematic Fly-over state
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

  // Recalculate target when selection changes
  useEffect(() => {
    setIsFlyOver(false);
    let newLookAt = new THREE.Vector3(0, 2, 0);
    let newCamPos = new THREE.Vector3(0, 68, 88);

    if (selectedStudentId) {
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
      const hierarchy = findClassroomHierarchy(selectedClassroomId);
      if (hierarchy) {
        const { building, floor, classroom } = hierarchy;
        const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
        const roomWorldX = building.position[0] + classroom.offset[0];
        const roomWorldZ = building.position[2] + classroom.offset[2];

        newLookAt.set(roomWorldX, floorY + 1.2, roomWorldZ);
        newCamPos.set(roomWorldX + 2.2, floorY + 6.2, roomWorldZ + 8.2);
      }
    } else if (selectedFloorLevel && selectedBuildingId) {
      const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
      if (building) {
        const floorY = (selectedFloorLevel - 1) * FLOOR_HEIGHT + (selectedFloorLevel - 1) * explodedHeight * 3.5;
        newLookAt.set(building.position[0], floorY + 1.2, building.position[2]);
        // 3/4 Isometric cutaway angle framing all classrooms, benches, and seated students
        newCamPos.set(
          building.position[0] + building.width * 0.3,
          floorY + 15.0,
          building.position[2] + building.depth * 0.65
        );
      }
    } else if (selectedBuildingId) {
      const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
      if (building) {
        const buildingCenterY = (building.floorCount * FLOOR_HEIGHT) / 2;
        newLookAt.set(building.position[0], buildingCenterY, building.position[2]);
        newCamPos.set(building.position[0] + 10, buildingCenterY + 22, building.position[2] + 40);
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
      flyOverProgress.current += delta * 0.25;
      const angle = flyOverProgress.current;
      const radius = 105;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = 70 + Math.sin(angle * 2) * 8;
      controlsRef.current.target.set(0, 5, 0);
      controlsRef.current.update();
      if (flyOverProgress.current > Math.PI * 2) {
        setIsFlyOver(false);
      }
      return;
    }

    if (isTransitioning) {
      transitionTimer.current += delta;
      const lerpSpeed = Math.min(1, delta * 3.5);

      camera.position.lerp(targetCamPos.current, lerpSpeed);
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(targetCamPos.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

      if ((distPos < 0.08 && distTarget < 0.08) || transitionTimer.current > 3.0) {
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
      maxPolarAngle={Math.PI / 2.05}
      minDistance={1.2}
      maxDistance={240}
      target={[0, 2, 0]}
    />
  );
}
