import * as THREE from '../vendor/three.module.js';

/**
 * loader.js — Loads or generates 3D character geometries and rigs
 */
export function createCharacterMesh(color = 0x38bdf8) {
  const char = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.45, 0.18),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
  );
  torso.position.y = 0.65;
  torso.castShadow = true;
  char.add(torso);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 })
  );
  head.position.y = 0.98;
  head.castShadow = true;
  char.add(head);

  // Legs
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.45, 0.11),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
  );
  legL.position.set(-0.08, 0.22, 0);
  legL.castShadow = true;
  char.add(legL);

  const legR = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.45, 0.11),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
  );
  legR.position.set(0.08, 0.22, 0);
  legR.castShadow = true;
  char.add(legR);

  return char;
}

export default createCharacterMesh;

