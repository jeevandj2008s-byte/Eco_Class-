import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PROCESSED_BUILDINGS, FLOOR_HEIGHT } from '../../../config/buildings.config.js';
import { useTwin3DStore } from '../../../store/useTwin3DStore.js';

const tempObj = new THREE.Object3D();

export function InstancedFurniture() {
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);

  const deskMeshRef = useRef();
  const chairMeshRef = useRef();
  const teacherDeskRef = useRef();

  // Aggregate all furniture items with global scene transformation data
  const { deskTransforms, chairTransforms, teacherDeskTransforms } = useMemo(() => {
    const desks = [];
    const chairs = [];
    const teachers = [];

    PROCESSED_BUILDINGS.forEach((b) => {
      b.floors.forEach((f) => {
        const floorY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;

        f.classrooms.forEach((room) => {
          const roomWorldX = b.position[0] + room.offset[0];
          const roomWorldZ = b.position[2] + room.offset[2];
          const layout = room.layout;
          if (!layout) return;

          // Student Benches / Desks
          layout.benches.forEach((bench) => {
            desks.push({
              x: roomWorldX + bench.position[0],
              y: floorY,
              z: roomWorldZ + bench.position[2],
              w: bench.width,
              d: bench.depth
            });
          });

          // Student Chairs (Pad + Backrest + 4 Legs)
          layout.seats.forEach((seat) => {
            chairs.push({
              x: roomWorldX + seat.position[0],
              y: floorY,
              z: roomWorldZ + seat.position[2]
            });
          });

          // Teacher Podium Desk
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
      chairTransforms: chairs,
      teacherDeskTransforms: teachers
    };
  }, [explodedHeight]);

  // Procedural Student Bench Desk Geometry (Top slab + heavy-duty powder-coated steel legs)
  const deskGeometry = useMemo(() => {
    // 1. Tabletop
    const top = new THREE.BoxGeometry(1, 0.045, 1);
    top.translate(0, 0.725, 0);

    // 2. Left leg frame
    const leftLeg = new THREE.BoxGeometry(0.04, 0.70, 0.85);
    leftLeg.translate(-0.46, 0.35, 0);

    // 3. Right leg frame
    const rightLeg = new THREE.BoxGeometry(0.04, 0.70, 0.85);
    rightLeg.translate(0.46, 0.35, 0);

    // 4. Modesty panel / cross support
    const panel = new THREE.BoxGeometry(0.92, 0.28, 0.02);
    panel.translate(0, 0.52, -0.38);

    return mergeGeometries([top, leftLeg, rightLeg, panel]);
  }, []);

  // Procedural University Chair Geometry (Cushion at 0.45 + backrest at 0.67 + 4 steel legs)
  const chairGeometry = useMemo(() => {
    // 1. Seat Cushion (Center at Y = 0.45)
    const cushion = new THREE.BoxGeometry(0.42, 0.04, 0.40);
    cushion.translate(0, 0.45, 0);

    // 2. 4 Metal Legs down to floor Y = 0
    const legFL = new THREE.BoxGeometry(0.03, 0.43, 0.03);
    legFL.translate(-0.17, 0.215, -0.16);

    const legFR = new THREE.BoxGeometry(0.03, 0.43, 0.03);
    legFR.translate(0.17, 0.215, -0.16);

    const legBL = new THREE.BoxGeometry(0.03, 0.43, 0.03);
    legBL.translate(-0.17, 0.215, 0.16);

    const legBR = new THREE.BoxGeometry(0.03, 0.43, 0.03);
    legBR.translate(0.17, 0.215, 0.16);

    // 3. Backrest Upright Supports
    const spineL = new THREE.BoxGeometry(0.025, 0.26, 0.025);
    spineL.translate(-0.15, 0.58, 0.18);

    const spineR = new THREE.BoxGeometry(0.025, 0.26, 0.025);
    spineR.translate(0.15, 0.58, 0.18);

    // 4. Curved Backrest Pad
    const backrest = new THREE.BoxGeometry(0.40, 0.22, 0.03);
    backrest.translate(0, 0.67, 0.18);

    return mergeGeometries([cushion, legFL, legFR, legBL, legBR, spineL, spineR, backrest]);
  }, []);

  const teacherGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  // Update instance matrices
  useLayoutEffect(() => {
    // 1. Update Desks
    if (deskMeshRef.current && deskTransforms.length > 0) {
      deskTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y, item.z);
        tempObj.scale.set(item.w, 1.0, item.d);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        deskMeshRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      deskMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Update Chairs
    if (chairMeshRef.current && chairTransforms.length > 0) {
      chairTransforms.forEach((item, idx) => {
        tempObj.position.set(item.x, item.y, item.z);
        tempObj.scale.set(1.0, 1.0, 1.0);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();
        chairMeshRef.current.setMatrixAt(idx, tempObj.matrix);
      });
      chairMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Update Teacher Desks
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
  }, [deskTransforms, chairTransforms, teacherDeskTransforms]);

  return (
    <group name="instanced-campus-furniture">
      {/* Student Benches / Desks */}
      {deskTransforms.length > 0 && (
        <instancedMesh
          ref={deskMeshRef}
          args={[deskGeometry, null, deskTransforms.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#2e384d"
            roughness={0.45}
            metalness={0.25}
            envMapIntensity={0.6}
          />
        </instancedMesh>
      )}

      {/* Student Chairs (Seat pad + legs + backrest) */}
      {chairTransforms.length > 0 && (
        <instancedMesh
          ref={chairMeshRef}
          args={[chairGeometry, null, chairTransforms.length]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#192030"
            roughness={0.5}
            metalness={0.2}
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
            color="#273248"
            roughness={0.4}
            metalness={0.3}
          />
        </instancedMesh>
      )}
    </group>
  );
}
