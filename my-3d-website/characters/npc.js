import * as THREE from '../vendor/three.module.js';
import { createCharacterMesh } from './loader.js';

/**
 * npc.js — Non-player characters and their placement routines
 */
export function setupNPCs(scene) {
  const group = new THREE.Group();
  group.name = 'npcs';

  const characters = [];
  const studentPalette = [0x38bdf8, 0xa78bfa, 0x34d399, 0xfbbf24, 0xf472b6];

  // Spawn sample pedestrian and courtyard students
  const studentSpots = [
    [-15, 0, 18],
    [-12, 0, 22],
    [5, 0, 15],
    [8, 0, 18],
    [24, 0, 2]
  ];

  studentSpots.forEach((spot, idx) => {
    const color = studentPalette[idx % studentPalette.length];
    const student = createCharacterMesh(color);
    student.position.set(...spot);
    group.add(student);
    characters.push(student);
  });

  scene.add(group);
  return { group, characters };
}

export default setupNPCs;

