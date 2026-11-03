import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';
import {
  PROCESSED_BUILDINGS,
  FLOOR_HEIGHT,
  findClassroomHierarchy,
  BUILDINGS_CONFIG,
  PARKING_CONFIG,
  BLOCK_LABELS_CONFIG,
  CONNECTING_BRIDGES,
  ANIMATION_CONFIG
} from '../../config/buildings.config.js';

const CAR_COLORS = ['#0284c7', '#dc2626', '#f59e0b', '#10b981', '#ffffff', '#7c3aed'];

export function IsometricCampus3D({ telemetry }) {
  const canvasRef = useRef(null);

  // Store state
  const selectedBuildingId = useTwin3DStore((s) => s.selectedBuildingId);
  const selectedFloorLevel = useTwin3DStore((s) => s.selectedFloorLevel);
  const selectedClassroomId = useTwin3DStore((s) => s.selectedClassroomId);
  const selectedStudentId = useTwin3DStore((s) => s.selectedStudentId);
  const hoveredStudentId = useTwin3DStore((s) => s.hoveredStudentId);
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const showStudents = useTwin3DStore((s) => s.showStudents);
  const animateStudents = useTwin3DStore((s) => s.animateStudents);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const students = useTwin3DStore((s) => s.students);

  // Store actions
  const selectCampus = useTwin3DStore((s) => s.selectCampus);
  const selectBuilding = useTwin3DStore((s) => s.selectBuilding);
  const selectFloor = useTwin3DStore((s) => s.selectFloor);
  const selectClassroom = useTwin3DStore((s) => s.selectClassroom);
  const selectStudent = useTwin3DStore((s) => s.selectStudent);
  const setHoveredStudentId = useTwin3DStore((s) => s.setHoveredStudentId);

  // Camera Orbit, Pan & Zoom State
  const cameraState = useRef({
    rotY: 0.785, // 45 degrees
    rotX: 0.58,  // ~33 degrees tilt
    zoom: 6.8,   // Scale factor
    targetLookAt: [0, 6, 0],
    pan: [0, 20],
    isDragging: false,
    dragStart: [0, 0],
    camStartRot: [0, 0],
    camStartPan: [0, 0],
    isPanDrag: false
  });

  // Smooth camera flight target
  const flightTarget = useRef({
    targetRotY: 0.785,
    targetRotX: 0.58,
    targetZoom: 6.8,
    targetLookAt: [0, 6, 0],
    active: false,
    progress: 1.0
  });

  // Calculate target camera parameters whenever selection changes
  useEffect(() => {
    let tLook = [0, 6, 0];
    let tZoom = 6.8;
    let tRotY = 0.785;
    let tRotX = 0.58;

    if (selectedStudentId) {
      const student = students.find((s) => s.id === selectedStudentId);
      if (student) {
        const hierarchy = findClassroomHierarchy(student.classroomId);
        if (hierarchy) {
          const { building, floor, classroom } = hierarchy;
          const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
          const seat = classroom.layout?.seats?.find((st) => st.id === student.seatId);
          const sx = building.position[0] + classroom.offset[0] + (seat ? seat.position[0] : 0);
          const sz = building.position[2] + classroom.offset[2] + (seat ? seat.position[2] : 0);
          const sy = floorY + (seat ? seat.position[1] : 0.45);

          tLook = [sx, sy, sz];
          tZoom = 38.0;
          tRotX = 0.45;
        }
      }
    } else if (selectedClassroomId) {
      const hierarchy = findClassroomHierarchy(selectedClassroomId);
      if (hierarchy) {
        const { building, floor, classroom } = hierarchy;
        const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
        const rx = building.position[0] + classroom.offset[0];
        const rz = building.position[2] + classroom.offset[2];

        tLook = [rx, floorY + 1.2, rz];
        tZoom = 24.0;
        tRotX = 0.52;
      }
    } else if (selectedBuildingId) {
      const building = BUILDINGS_CONFIG.find((b) => b.id === selectedBuildingId);
      if (building) {
        const by = (building.floorCount * FLOOR_HEIGHT) / 2;
        tLook = [building.position[0], by, building.position[2]];
        tZoom = selectedFloorLevel ? 16.0 : 11.0;
        tRotX = 0.55;
      }
    }

    flightTarget.current = {
      targetRotY: tRotY,
      targetRotX: tRotX,
      targetZoom: tZoom,
      targetLookAt: tLook,
      active: true,
      progress: 0.0
    };
  }, [selectedBuildingId, selectedFloorLevel, selectedClassroomId, selectedStudentId, explodedHeight, students]);

  // Project 3D point (x, y, z) to 2D Screen space (sx, sy)
  const project3D = useCallback((x, y, z, width, height) => {
    const cam = cameraState.current;
    const relX = x - cam.targetLookAt[0];
    const relY = y - cam.targetLookAt[1];
    const relZ = z - cam.targetLookAt[2];

    // Y-axis rotation
    const cosY = Math.cos(cam.rotY);
    const sinY = Math.sin(cam.rotY);
    const x1 = relX * cosY - relZ * sinY;
    const z1 = relX * sinY + relZ * cosY;

    // X-axis tilt (pitch)
    const cosX = Math.cos(cam.rotX);
    const sinX = Math.sin(cam.rotX);
    const y2 = relY * cosX - z1 * sinX;
    const z2 = relY * sinX + z1 * cosX;

    const scale = cam.zoom;
    const screenX = width / 2 + cam.pan[0] + x1 * scale;
    const screenY = height / 2 + cam.pan[1] - y2 * scale;

    return { x: screenX, y: screenY, depth: z2 };
  }, []);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      const width = canvas.width = canvas.clientWidth * window.devicePixelRatio;
      const height = canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const viewW = canvas.clientWidth;
      const viewH = canvas.clientHeight;

      // Smooth Flight Lerp
      const ft = flightTarget.current;
      const cam = cameraState.current;
      if (ft.active) {
        ft.progress = Math.min(1.0, ft.progress + 0.04);
        cam.zoom += (ft.targetZoom - cam.zoom) * 0.1;
        cam.rotY += (ft.targetRotY - cam.rotY) * 0.1;
        cam.rotX += (ft.targetRotX - cam.rotX) * 0.1;
        cam.targetLookAt[0] += (ft.targetLookAt[0] - cam.targetLookAt[0]) * 0.1;
        cam.targetLookAt[1] += (ft.targetLookAt[1] - cam.targetLookAt[1]) * 0.1;
        cam.targetLookAt[2] += (ft.targetLookAt[2] - cam.targetLookAt[2]) * 0.1;
        if (ft.progress >= 0.99) ft.active = false;
      }

      // Atmospheric Translucent Tint (allowing cosmic stars to show through)
      ctx.fillStyle = 'rgba(7, 8, 14, 0.45)';
      ctx.fillRect(0, 0, viewW, viewH);

      // 1. Campus Ground Grid
      ctx.strokeStyle = 'rgba(0, 107, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 75;
      const step = 8;
      for (let g = -gridSize; g <= gridSize; g += step) {
        const p1 = project3D(g, 0, -gridSize, viewW, viewH);
        const p2 = project3D(g, 0, gridSize, viewW, viewH);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(-gridSize, 0, g, viewW, viewH);
        const p4 = project3D(gridSize, 0, g, viewW, viewH);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // North Highway Road
      const r1 = project3D(-75, 0, -62, viewW, viewH);
      const r2 = project3D(75, 0, -62, viewW, viewH);
      const r3 = project3D(75, 0, -50, viewW, viewH);
      const r4 = project3D(-75, 0, -50, viewW, viewH);
      ctx.fillStyle = '#0f1422';
      ctx.beginPath();
      ctx.moveTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.lineTo(r4.x, r4.y);
      ctx.closePath();
      ctx.fill();

      // Access Road to Parking & Entrance
      const pr1 = project3D(-4, 0, 50, viewW, viewH);
      const pr2 = project3D(6, 0, 50, viewW, viewH);
      const pr3 = project3D(6, 0, 20, viewW, viewH);
      const pr4 = project3D(-4, 0, 20, viewW, viewH);
      ctx.fillStyle = '#101524';
      ctx.beginPath();
      ctx.moveTo(pr1.x, pr1.y);
      ctx.lineTo(pr2.x, pr2.y);
      ctx.lineTo(pr3.x, pr3.y);
      ctx.lineTo(pr4.x, pr4.y);
      ctx.closePath();
      ctx.fill();

      // 2. Render Parking Lot Facility
      const pk = PARKING_CONFIG;
      const pw2 = pk.width / 2;
      const pd2 = pk.depth / 2;
      const pk1 = project3D(pk.position[0] - pw2, 0, pk.position[2] - pd2, viewW, viewH);
      const pk2 = project3D(pk.position[0] + pw2, 0, pk.position[2] - pd2, viewW, viewH);
      const pk3 = project3D(pk.position[0] + pw2, 0, pk.position[2] + pd2, viewW, viewH);
      const pk4 = project3D(pk.position[0] - pw2, 0, pk.position[2] + pd2, viewW, viewH);

      ctx.fillStyle = '#0e131f';
      ctx.beginPath();
      ctx.moveTo(pk1.x, pk1.y);
      ctx.lineTo(pk2.x, pk2.y);
      ctx.lineTo(pk3.x, pk3.y);
      ctx.lineTo(pk4.x, pk4.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#006bff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Render Parked Cars in Parking Lot
      for (let r = 0; r < pk.rows; r++) {
        const pz = pk.position[2] + (r === 0 ? -pd2 / 2 : pd2 / 2);
        for (let c = 0; c < pk.baysPerRow; c++) {
          if ((r + c) % 3 === 0) continue; // Some vacant bays
          const px = pk.position[0] - pw2 + 3.0 + c * pk.bayWidth;
          const cp = project3D(px, 0.35, pz, viewW, viewH);
          ctx.fillStyle = CAR_COLORS[(r * 3 + c) % CAR_COLORS.length];
          ctx.beginPath();
          ctx.roundRect(cp.x - 7, cp.y - 12, 14, 24, 3);
          ctx.fill();
        }
      }

      // Animated Barrier Arm at Parking Gate
      const gateP = project3D(pk.position[0] + pw2 - 3.5, 1.2, pk.position[2] + pd2, viewW, viewH);
      const barrierAngle = ANIMATION_CONFIG.barrierArm ? ((Math.sin(time * 1.4) + 1) / 2) * 0.7 : 0;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gateP.x, gateP.y);
      ctx.lineTo(gateP.x - Math.cos(barrierAngle) * 22, gateP.y - Math.sin(barrierAngle) * 22);
      ctx.stroke();

      // Parking Floating Sign
      if (showLabels && cam.zoom <= 16) {
        const pSign = project3D(pk.position[0], 5.0, pk.position[2], viewW, viewH);
        ctx.fillStyle = '#006bff';
        ctx.beginPath();
        ctx.roundRect(pSign.x - 30, pSign.y - 10, 60, 20, 6);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PARKING', pSign.x, pSign.y + 4);
      }

      // 3. Render Sky-Bridges between blocks
      CONNECTING_BRIDGES.forEach((br) => {
        const bp1 = project3D(br.start[0], br.start[1], br.start[2], viewW, viewH);
        const bp2 = project3D(br.end[0], br.end[1], br.end[2], viewW, viewH);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bp1.x, bp1.y);
        ctx.lineTo(bp2.x, bp2.y);
        ctx.stroke();
      });

      // 4. Render Buildings & Courtyard
      PROCESSED_BUILDINGS.forEach((b) => {
        const isBSelected = selectedBuildingId === b.id;
        const isInspecting = isBSelected && (selectedFloorLevel !== null || selectedClassroomId !== null);
        const isCutaway = xrayMode || isInspecting;

        const hw = b.width / 2;
        const hd = b.depth / 2;
        const bx = b.position[0];
        const bz = b.position[2];

        // Foundation slab
        const f1 = project3D(bx - hw, -0.2, bz - hd, viewW, viewH);
        const f2 = project3D(bx + hw, -0.2, bz - hd, viewW, viewH);
        const f3 = project3D(bx + hw, -0.2, bz + hd, viewW, viewH);
        const f4 = project3D(bx - hw, -0.2, bz + hd, viewW, viewH);

        ctx.fillStyle = '#0c0f17';
        ctx.beginPath();
        ctx.moveTo(f1.x, f1.y);
        ctx.lineTo(f2.x, f2.y);
        ctx.lineTo(f3.x, f3.y);
        ctx.lineTo(f4.x, f4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isBSelected ? '#006bff' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = isBSelected ? 2 : 1;
        ctx.stroke();

        // Courtyard Quad Garden for Block A
        if (b.courtyard?.enabled) {
          const cw2 = b.courtyard.width / 2;
          const cd2 = b.courtyard.depth / 2;
          const q1 = project3D(bx - cw2, 0.05, bz - cd2, viewW, viewH);
          const q2 = project3D(bx + cw2, 0.05, bz - cd2, viewW, viewH);
          const q3 = project3D(bx + cw2, 0.05, bz + cd2, viewW, viewH);
          const q4 = project3D(bx - cw2, 0.05, bz + cd2, viewW, viewH);

          ctx.fillStyle = '#0f3323';
          ctx.beginPath();
          ctx.moveTo(q1.x, q1.y);
          ctx.lineTo(q2.x, q2.y);
          ctx.lineTo(q3.x, q3.y);
          ctx.lineTo(q4.x, q4.y);
          ctx.closePath();
          ctx.fill();

          // Central Fountain Shimmer
          const fountainP = project3D(bx, 0.25, bz, viewW, viewH);
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(fountainP.x, fountainP.y, 8 + Math.sin(time * 3.0) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render Floors
        b.floors.forEach((floor) => {
          const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
          const isAbove = isBSelected && selectedFloorLevel !== null && floor.level > selectedFloorLevel;
          if (xrayMode && isAbove) return;

          const isFSelected = isBSelected && selectedFloorLevel === floor.level;

          // Floor Plate
          const fl1 = project3D(bx - hw + 0.2, floorY, bz - hd + 0.2, viewW, viewH);
          const fl2 = project3D(bx + hw - 0.2, floorY, bz - hd + 0.2, viewW, viewH);
          const fl3 = project3D(bx + hw - 0.2, floorY, bz + hd - 0.2, viewW, viewH);
          const fl4 = project3D(bx - hw + 0.2, floorY, bz + hd - 0.2, viewW, viewH);

          ctx.fillStyle = isFSelected ? 'rgba(0, 107, 255, 0.15)' : 'rgba(17, 20, 29, 0.85)';
          ctx.beginPath();
          ctx.moveTo(fl1.x, fl1.y);
          ctx.lineTo(fl2.x, fl2.y);
          ctx.lineTo(fl3.x, fl3.y);
          ctx.lineTo(fl4.x, fl4.y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = isFSelected ? '#9ff0ec' : 'rgba(255, 255, 255, 0.12)';
          ctx.stroke();

          // Render Classrooms on this floor
          floor.classrooms.forEach((room) => {
            const isRSelected = selectedClassroomId === room.id;
            const rx = bx + room.offset[0];
            const rz = bz + room.offset[2];
            const rw = room.width / 2;
            const rd = room.depth / 2;

            // Classroom Boundary
            const c1 = project3D(rx - rw, floorY + 0.05, rz - rd, viewW, viewH);
            const c2 = project3D(rx + rw, floorY + 0.05, rz - rd, viewW, viewH);
            const c3 = project3D(rx + rw, floorY + 0.05, rz + rd, viewW, viewH);
            const c4 = project3D(rx - rw, floorY + 0.05, rz + rd, viewW, viewH);

            ctx.fillStyle = isRSelected ? 'rgba(0, 107, 255, 0.25)' : 'rgba(28, 34, 48, 0.8)';
            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.lineTo(c3.x, c3.y);
            ctx.lineTo(c4.x, c4.y);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = isRSelected ? '#9ff0ec' : 'rgba(96, 165, 250, 0.25)';
            ctx.lineWidth = isRSelected ? 2 : 1;
            ctx.stroke();

            // Teaching Green Board
            const wb1 = project3D(rx - 1.8, floorY + 1.2, rz - rd + 0.1, viewW, viewH);
            const wb2 = project3D(rx + 1.8, floorY + 1.2, rz - rd + 0.1, viewW, viewH);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(wb1.x, wb1.y);
            ctx.lineTo(wb2.x, wb2.y);
            ctx.stroke();

            // Standing Teacher Figure
            const teachP = project3D(rx + 0.6, floorY + 0.9, rz - rd + 1.2, viewW, viewH);
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.arc(teachP.x, teachP.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Desks
            const layout = room.layout;
            if (layout && layout.benches) {
              layout.benches.forEach((bench) => {
                const bw = bench.width / 2;
                const bd = bench.depth / 2;
                const bxPos = rx + bench.position[0];
                const bzPos = rz + bench.position[2];
                const byPos = floorY + 0.65;

                const b1 = project3D(bxPos - bw, byPos, bzPos - bd, viewW, viewH);
                const b2 = project3D(bxPos + bw, byPos, bzPos - bd, viewW, viewH);
                const b3 = project3D(bxPos + bw, byPos, bzPos + bd, viewW, viewH);
                const b4 = project3D(bxPos - bw, byPos, bzPos + bd, viewW, viewH);

                ctx.fillStyle = '#22283a';
                ctx.beginPath();
                ctx.moveTo(b1.x, b1.y);
                ctx.lineTo(b2.x, b2.y);
                ctx.lineTo(b3.x, b3.y);
                ctx.lineTo(b4.x, b4.y);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.stroke();
              });
            }

            // Floating Room Label
            if (showLabels && cam.zoom > 10) {
              const rCenter = project3D(rx, floorY + 2.8, rz, viewW, viewH);
              ctx.font = 'bold 11px Inter, sans-serif';
              const text = room.code || room.name;
              const textW = ctx.measureText(text).width;

              ctx.fillStyle = isRSelected ? '#006bff' : 'rgba(19, 18, 25, 0.85)';
              ctx.strokeStyle = isRSelected ? '#9ff0ec' : 'rgba(255, 255, 255, 0.2)';
              ctx.beginPath();
              ctx.roundRect(rCenter.x - textW / 2 - 6, rCenter.y - 12, textW + 12, 18, 5);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.fillText(text, rCenter.x, rCenter.y + 1);
            }
          });
        });

        // 5. Render Seated Students
        if (showStudents) {
          students.forEach((stu, idx) => {
            if (stu.buildingId !== b.id) return;
            const hierarchy = findClassroomHierarchy(stu.classroomId);
            if (!hierarchy) return;

            const { floor, classroom } = hierarchy;
            const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
            const seat = classroom.layout?.seats?.find((st) => st.id === stu.seatId);
            if (!seat) return;

            const sx = b.position[0] + classroom.offset[0] + seat.position[0];
            const sz = b.position[2] + classroom.offset[2] + seat.position[2];
            const sy = floorY + seat.position[1];

            const breathOffset = (animateStudents && ANIMATION_CONFIG.studentsIdle) ? Math.sin(time * 2.2 + idx * 0.4) * 0.04 : 0;
            const headP = project3D(sx, sy + 0.65 + breathOffset, sz, viewW, viewH);
            const torsoP = project3D(sx, sy + 0.35 + breathOffset, sz, viewW, viewH);

            const isHovered = hoveredStudentId === stu.id;
            const isSelectedStu = selectedStudentId === stu.id;
            const radius = Math.max(2.5, cam.zoom * 0.22);

            // Torso
            ctx.fillStyle = stu.avatarColor || '#38bdf8';
            ctx.beginPath();
            ctx.arc(torsoP.x, torsoP.y, radius * 1.1, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(headP.x, headP.y, radius * 0.85, 0, Math.PI * 2);
            ctx.fill();

            if (isSelectedStu || isHovered) {
              ctx.strokeStyle = '#9ff0ec';
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            // Student Floating Nametag on Hover / Select
            if (isHovered || isSelectedStu) {
              ctx.font = 'bold 11px Inter, sans-serif';
              const nameText = `${stu.name} (${stu.usn || stu.rollNo})`;
              const nw = ctx.measureText(nameText).width;

              ctx.fillStyle = 'rgba(19, 18, 25, 0.95)';
              ctx.strokeStyle = '#9ff0ec';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.roundRect(headP.x - nw / 2 - 8, headP.y - 24, nw + 16, 20, 6);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.fillText(nameText, headP.x, headP.y - 10);
            }
          });
        }

        // 6. Block Floating Billboard Label
        if (showLabels && cam.zoom <= 14) {
          const totalH = b.floorCount * FLOOR_HEIGHT + (b.floorCount - 1) * explodedHeight * 3.5;
          const beaconP = project3D(bx, totalH + 3.0, bz, viewW, viewH);
          const labelCfg = BLOCK_LABELS_CONFIG.find((l) => l.id === b.id) || { shortName: b.code || b.name, name: b.name };

          ctx.font = 'bold 12px Inter, sans-serif';
          const bText = labelCfg.name;
          const bw = ctx.measureText(bText).width;

          ctx.fillStyle = isBSelected ? '#006bff' : 'rgba(19, 18, 25, 0.9)';
          ctx.strokeStyle = isBSelected ? '#9ff0ec' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = isBSelected ? 2 : 1;
          ctx.beginPath();
          ctx.roundRect(beaconP.x - bw / 2 - 10, beaconP.y - 14, bw + 20, 24, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(bText, beaconP.x, beaconP.y + 2);
        }
      });
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [
    project3D,
    selectedBuildingId,
    selectedFloorLevel,
    selectedClassroomId,
    selectedStudentId,
    hoveredStudentId,
    xrayMode,
    explodedHeight,
    showStudents,
    animateStudents,
    showLabels,
    students
  ]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e) => {
    const cam = cameraState.current;
    cam.isDragging = true;
    cam.isPanDrag = e.button === 2 || e.shiftKey;
    cam.dragStart = [e.clientX, e.clientY];
    cam.camStartRot = [cam.rotY, cam.rotX];
    cam.camStartPan = [...cam.pan];
    flightTarget.current.active = false;
  };

  const handlePointerMove = (e) => {
    const cam = cameraState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (cam.isDragging) {
      const dx = e.clientX - cam.dragStart[0];
      const dy = e.clientY - cam.dragStart[1];

      if (cam.isPanDrag) {
        cam.pan = [cam.camStartPan[0] + dx, cam.camStartPan[1] + dy];
      } else {
        cam.rotY = cam.camStartRot[0] + dx * 0.008;
        cam.rotX = Math.max(0.15, Math.min(1.45, cam.camStartRot[1] + dy * 0.006));
      }
    } else {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundStu = null;
      if (showStudents) {
        for (const stu of students) {
          const hierarchy = findClassroomHierarchy(stu.classroomId);
          if (!hierarchy) continue;
          const { building, floor, classroom } = hierarchy;
          const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
          const seat = classroom.layout?.seats?.find((st) => st.id === stu.seatId);
          if (!seat) continue;

          const sx = building.position[0] + classroom.offset[0] + seat.position[0];
          const sz = building.position[2] + classroom.offset[2] + seat.position[2];
          const sy = floorY + seat.position[1];

          const p = project3D(sx, sy + 0.45, sz, canvas.clientWidth, canvas.clientHeight);
          const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (dist < 14) {
            foundStu = stu.id;
            break;
          }
        }
      }
      setHoveredStudentId(foundStu);
      canvas.style.cursor = foundStu ? 'pointer' : cam.isDragging ? 'grabbing' : 'grab';
    }
  };

  const handlePointerUp = (e) => {
    const cam = cameraState.current;
    const wasDraggingDist = Math.hypot(e.clientX - cam.dragStart[0], e.clientY - cam.dragStart[1]);
    cam.isDragging = false;

    if (wasDraggingDist < 5) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (showStudents) {
        for (const stu of students) {
          const hierarchy = findClassroomHierarchy(stu.classroomId);
          if (!hierarchy) continue;
          const { building, floor, classroom } = hierarchy;
          const floorY = (floor.level - 1) * FLOOR_HEIGHT + (floor.level - 1) * explodedHeight * 3.5;
          const seat = classroom.layout?.seats?.find((st) => st.id === stu.seatId);
          if (!seat) continue;

          const sx = building.position[0] + classroom.offset[0] + seat.position[0];
          const sz = building.position[2] + classroom.offset[2] + seat.position[2];
          const sy = floorY + seat.position[1];

          const p = project3D(sx, sy + 0.45, sz, canvas.clientWidth, canvas.clientHeight);
          if (Math.hypot(p.x - mouseX, p.y - mouseY) < 14) {
            selectStudent(stu.id);
            return;
          }
        }
      }

      for (const b of PROCESSED_BUILDINGS) {
        for (const f of b.floors) {
          for (const room of f.classrooms) {
            const floorY = (f.level - 1) * FLOOR_HEIGHT + (f.level - 1) * explodedHeight * 3.5;
            const rx = b.position[0] + room.offset[0];
            const rz = b.position[2] + room.offset[2];
            const p = project3D(rx, floorY + 0.2, rz, canvas.clientWidth, canvas.clientHeight);

            if (Math.hypot(p.x - mouseX, p.y - mouseY) < room.width * cam.zoom * 0.45) {
              selectClassroom(room.id);
              return;
            }
          }
        }
      }

      for (const b of PROCESSED_BUILDINGS) {
        const p = project3D(b.position[0], 2, b.position[2], canvas.clientWidth, canvas.clientHeight);
        if (Math.hypot(p.x - mouseX, p.y - mouseY) < b.width * cam.zoom * 0.35) {
          selectBuilding(b.id);
          return;
        }
      }
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const cam = cameraState.current;
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    cam.zoom = Math.max(3.2, Math.min(55.0, cam.zoom * zoomFactor));
    flightTarget.current.active = false;
  };

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Engine Compatibility Pill */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1.5 rounded-xl bg-[#131219]/90 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Engine: Universal Real-Time Twin</span>
      </div>
    </div>
  );
}
