import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { PROCESSED_BUILDINGS, FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

const tempMatrix = new THREE.Matrix4();
const tempObj = new THREE.Object3D();

export function InstancedFurniture() {
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);

  const deskMeshRef = useRef();
  const seatPadRef = useRef();
  const seatBackRef = useRef();
  const teacherDeskRef = useRef();

  // Aggregate all furniture items with global scene transformation data
  const { deskTransforms, seatTransforms, teacherDeskTransforms } = useMemo(() => {
    const desks = [];
    const seats = [];
    const teachers = [];

    PROCESSED_BUILDINGS.forEach((b) => {
      // If a building is selected, we can optionally focus or render all
      b.floors.forEach((f) => {
        const floorY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;

        f.classrooms.forEach((room) => {
          const roomWorldX = b.position[0] + room.offset[0];
          const roomWorldZ = b.position[2] + room.offset[2];
          const layout = room.layout;
          if (!layout) return;

          // Desks
          layout.benches.forEach((bench) => {
            desks.push({
              x: roomWorldX + bench.position[0],
              y: floorY + 0.73,
              z: roomWorldZ + bench.position[2],
              w: bench.width,
              d: bench.depth
            });
          });

          // Seats
          layout.seats.forEach((seat) => {
            seats.push({
              x: roomWorldX + seat.position[0],
              y: floorY + seat.position[1],
              z: roomWorldZ + seat.position[2]
            });
          });

          // Teacher Desk
          if (layout.teacherDesk) {
            teachers.push({
              x: roomWorldX + layout.teacherDesk.position[0],
              y: floorY + layout.teacherDesk.height / 2,
              z: roomWorldZ + layout.teacherDesk.position[2],
              w: layout.teacherDesk.width,
              d: layout.teacherDesk.depth,
              h: layout.teacherDesk.height
            });
          }
        });
      });
    });

    return {
      deskTransforms: desks,
      seatTransforms: seats,
      teacherDeskTransforms: teachers
    };
  }, [explodedHeight]);

  // Update instance matrices on geometry update or exploded height slide
  useLayoutEffect(() => {
    // 1. Update Desks
    if (deskMeshRef.current && deskTransforms.length > 0) {
      deskTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y, item.z);
        tempObj.scale.set(item.w, 0.05, item.d);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        deskMeshRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      deskMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Update Seat Pads
    if (seatPadRef.current && seatTransforms.length > 0) {
      seatTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y, item.z);
        tempObj.scale.set(0.42, 0.04, 0.40);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        seatPadRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      seatPadRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Update Seat Backrests
    if (seatBackRef.current && seatTransforms.length > 0) {
      seatTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y + 0.22, item.z + 0.18);
        tempObj.scale.set(0.40, 0.24, 0.03);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        seatBackRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      seatBackRef.current.instanceMatrix.needsUpdate = true;
    }

    // 4. Update Teacher Desks
    if (teacherDeskRef.current && teacherDeskTransforms.length > 0) {
      teacherDeskTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y, item.z);
        tempObj.scale.set(item.w, item.h, item.d);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        teacherDeskRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      teacherDeskRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [deskTransforms, seatTransforms, teacherDeskTransforms]);

  const deskGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const teacherGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <group name="instanced-campus-furniture">
      {/* Student Desks */}
      {deskTransforms.length > 0 && (
        <instancedMesh
          ref={deskMeshRef}
          args={[deskGeom, null, deskTransforms.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#1e2230"
            roughness={0.4}
            metalness={0.2}
            envMapIntensity={0.5}
          />
        </instancedMesh>
      )}

      {/* Seat Pads */}
      {seatTransforms.length > 0 && (
        <instancedMesh
          ref={seatPadRef}
          args={[deskGeom, null, seatTransforms.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#10141f"
            roughness={0.6}
            metalness={0.1}
          />
        </instancedMesh>
      )}

      {/* Seat Backrests */}
      {seatTransforms.length > 0 && (
        <instancedMesh
          ref={seatBackRef}
          args={[deskGeom, null, seatTransforms.length]}
          castShadow
        >
          <meshStandardMaterial
            color="#151a28"
            roughness={0.5}
            metalness={0.1}
          />
        </instancedMesh>
      )}

      {/* Teacher Podium Desks */}
      {teacherDeskTransforms.length > 0 && (
        <instancedMesh
          ref={teacherDeskRef}
          args={[teacherGeom, null, teacherDeskTransforms.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#2a334a"
            roughness={0.35}
            metalness={0.3}
          />
        </instancedMesh>
      )}
    </group>
  );
}

