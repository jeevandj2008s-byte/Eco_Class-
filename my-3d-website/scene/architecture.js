import * as THREE from '../vendor/three.module.js';

/**
 * architecture.js — Buildings, floors, walls — the structural shell
 */
export function setupArchitecture(scene) {
  const group = new THREE.Group();
  group.name = 'architecture';

  const buildingDefs = [
    { id: 'bit-main', name: 'BIT Main Block', pos: [-30, 0, 10], w: 42, h: 14.4, d: 52, color: 0xdfdcd5, glass: 0x0a101d },
    { id: 'bit-block-2', name: 'BIT Block 2', pos: [12, 0, -22], w: 32, h: 10.8, d: 24, color: 0xd6d3cb, glass: 0x0b111e },
    { id: 'bit-mechanical', name: 'BIT Mechanical', pos: [45, 0, -38], w: 26, h: 7.2, d: 28, color: 0xd2cfc7, glass: 0x090e1a },
    { id: 'bit-block-3', name: 'BIT Block 3', pos: [46, 0, 0], w: 22, h: 10.8, d: 24, color: 0xddd9d0, glass: 0x0b111e },
    { id: 'bit-block-4', name: 'BIT Block 4', pos: [32, 0, 10], w: 6, h: 10.8, d: 38, color: 0xd9d6ce, glass: 0x0a0f1c },
    { id: 'bit-block-5', name: 'BIT Block 5', pos: [50, 0, 36], w: 18, h: 10.8, d: 36, color: 0xd4d0c7, glass: 0x0b111d },
    { id: 'bit-guest-house', name: 'BIT Guest House', pos: [38, 0, 62], w: 16, h: 7.2, d: 18, color: 0xe3dfd7, glass: 0x0c1220 }
  ];

  buildingDefs.forEach((b) => {
    const bGroup = new THREE.Group();
    bGroup.name = b.id;
    bGroup.position.set(...b.pos);

    // 1. Plinth Foundation
    const plinthGeo = new THREE.BoxGeometry(b.w + 1.2, 0.4, b.d + 1.2);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x121622, roughness: 0.8 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, 0.2, 0);
    plinth.receiveShadow = true;
    bGroup.add(plinth);

    // 2. Solid Architectural Building Facade
    const bodyGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const bodyMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.65, metalness: 0.1 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, b.h / 2 + 0.4, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    bGroup.add(body);

    // 3. Roof Slab with Parapet
    const roofGeo = new THREE.BoxGeometry(b.w + 0.6, 0.35, b.d + 0.6);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e2433, roughness: 0.7 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, b.h + 0.4 + 0.18, 0);
    roof.castShadow = true;
    bGroup.add(roof);

    // Parapet trim
    const parapetGeo = new THREE.BoxGeometry(b.w + 0.8, 0.6, b.d + 0.8);
    const parapetMat = new THREE.MeshStandardMaterial({ color: 0x2c3547, roughness: 0.8 });
    const parapet = new THREE.Mesh(parapetGeo, parapetMat);
    parapet.position.set(0, b.h + 0.4 + 0.6, 0);
    bGroup.add(parapet);

    // 4. Rows of Recessed Glass Windows
    const floors = Math.round(b.h / 3.6);
    const winMat = new THREE.MeshStandardMaterial({ color: b.glass, roughness: 0.1, metalness: 0.9 });
    for (let f = 0; f < floors; f++) {
      const winY = 0.4 + f * 3.6 + 1.8;
      // Front & Back Windows
      const winRowF = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.82, 1.4, 0.08), winMat);
      winRowF.position.set(0, winY, b.d / 2 + 0.04);
      bGroup.add(winRowF);

      const winRowB = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.82, 1.4, 0.08), winMat);
      winRowB.position.set(0, winY, -(b.d / 2 + 0.04));
      bGroup.add(winRowB);
    }

    group.add(bGroup);
  });

  // Connecting Sky-Bridges
  const bridgeGeo = new THREE.BoxGeometry(3.6, 2.8, 14);
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const bridge1 = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge1.position.set(22, 5.4, -10);
  bridge1.castShadow = true;
  group.add(bridge1);

  scene.add(group);
  return { group };
}

export default setupArchitecture;

