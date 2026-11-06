import * as THREE from '../vendor/three.module.js';
import { CONFIG } from '../config.js';

/**
 * neighbourhood.js — Outdoor world: terrain ground, perimeter walls, roads & trees
 */
export function setupNeighbourhood(scene) {
  const group = new THREE.Group();
  group.name = 'neighbourhood';

  // 1. Terrain Ground Baseplate
  const terrainGeo = new THREE.BoxGeometry(190, 0.4, 190);
  const terrainMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.terrain, roughness: 0.9 });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.position.set(0, -0.6, 0);
  terrain.receiveShadow = true;
  group.add(terrain);

  // 2. Perimeter Blueprint Trace Ring
  const ringGeo = new THREE.RingGeometry(88, 90, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: CONFIG.colors.accentCyan, wireframe: true, transparent: true, opacity: 0.15 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, -0.2, 0);
  group.add(ring);

  // 3. Perimeter Boundary Walls
  const wallMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.boundaryWall, roughness: 0.7 });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(160, 1.6, 0.4), wallMat);
  backWall.position.set(0, 0.6, -75);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  group.add(backWall);

  const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(65, 1.6, 0.4), wallMat);
  frontWallL.position.set(-45, 0.6, 75);
  frontWallL.castShadow = true;
  group.add(frontWallL);

  const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(65, 1.6, 0.4), wallMat);
  frontWallR.position.set(45, 0.6, 75);
  frontWallR.castShadow = true;
  group.add(frontWallR);

  // Gate Pillars
  const pillarGeo = new THREE.BoxGeometry(1.6, 3.6, 1.6);
  const pillarMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.accentCyan, emissive: CONFIG.colors.accentCyan, emissiveIntensity: 0.25 });
  const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
  pillarL.position.set(-14, 1.8, 75);
  pillarL.castShadow = true;
  group.add(pillarL);

  const pillarR = new THREE.Mesh(pillarGeo, pillarMat);
  pillarR.position.set(14, 1.8, 75);
  pillarR.castShadow = true;
  group.add(pillarR);

  // 4. Roads
  const roadMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.road, roughness: 0.7 });
  const topRoad = new THREE.Mesh(new THREE.BoxGeometry(180, 0.05, 12), roadMat);
  topRoad.position.set(0, -0.38, -58);
  topRoad.receiveShadow = true;
  group.add(topRoad);

  const markingMat = new THREE.MeshBasicMaterial({ color: CONFIG.colors.roadMarking, transparent: true, opacity: 0.8 });
  const centerLine = new THREE.Mesh(new THREE.BoxGeometry(170, 0.02, 0.4), markingMat);
  centerLine.position.set(0, -0.35, -58);
  group.add(centerLine);

  // Access Avenue
  const avenue = new THREE.Mesh(new THREE.BoxGeometry(12, 0.05, 52), roadMat);
  avenue.position.set(0, -0.38, 50);
  avenue.receiveShadow = true;
  group.add(avenue);

  // 5. Swaying Campus Trees
  const treesGroup = new THREE.Group();
  treesGroup.name = 'trees';

  const treePositions = [
    [-65, 0, -45], [-65, 0, -15], [-65, 0, 15], [-65, 0, 45],
    [68, 0, -45], [68, 0, -15], [68, 0, 15], [68, 0, 45],
    [-30, 0, -50], [20, 0, -50], [-35, 0, 68], [35, 0, 68]
  ];

  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.42, 3.6, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3b1d11, roughness: 0.9 });
  const foliageGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const foliageMatA = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
  const foliageMatB = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.75 });

  treePositions.forEach((pos, idx) => {
    const tree = new THREE.Group();
    tree.position.set(...pos);

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 1.8, 0);
    trunk.castShadow = true;
    tree.add(trunk);

    const foliage = new THREE.Mesh(foliageGeo, idx % 2 === 0 ? foliageMatA : foliageMatB);
    foliage.position.set(0, 4.4, 0);
    foliage.castShadow = true;
    tree.add(foliage);

    treesGroup.add(tree);
  });

  group.add(treesGroup);
  scene.add(group);

  return { group, treesGroup };
}

export default setupNeighbourhood;
