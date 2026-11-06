import * as THREE from '../vendor/three.module.js';

/**
 * furniture.js — Chairs, desks, props, decorations & animated ceiling fans
 */
export function setupFurniture(scene) {
  const group = new THREE.Group();
  group.name = 'furniture';

  const fans = [];

  // Ceiling Fan Builder
  function createFan(x, y, z) {
    const fan = new THREE.Group();
    fan.position.set(x, y, z);

    // Rod
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    rod.position.y = 0.3;
    fan.add(rod);

    // Blades Rotor
    const rotor = new THREE.Group();
    rotor.position.y = 0.05;

    [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.01, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
      );
      blade.rotation.y = angle;
      blade.position.set(Math.cos(angle) * 0.45, 0, Math.sin(angle) * 0.45);
      rotor.add(blade);
    });

    fan.add(rotor);
    fans.push(rotor);
    return fan;
  }

  // Add sample rooftop and interior props
  group.add(createFan(-20, 14, 10));
  group.add(createFan(-30, 14, 10));
  group.add(createFan(12, 10.5, -22));

  scene.add(group);
  return { group, fans };
}

export default setupFurniture;
