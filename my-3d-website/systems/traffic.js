import * as THREE from '../vendor/three.module.js';

/**
 * traffic.js — Vehicle routing and junction logic
 */
export function setupTraffic(scene) {
  const group = new THREE.Group();
  group.name = 'traffic';

  // Moving Vehicle 1: Blue EV Sedan on Perimeter Road
  const car1 = new THREE.Group();
  car1.position.set(-85, -0.15, -55);

  const body1 = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.75, 1.9),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 })
  );
  body1.position.y = 0.35;
  body1.castShadow = true;
  car1.add(body1);

  const cabin1 = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.6, 1.65),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 })
  );
  cabin1.position.set(-0.2, 0.85, 0);
  cabin1.castShadow = true;
  car1.add(cabin1);

  group.add(car1);

  // Moving Vehicle 2: Campus Shuttle on Entrance Avenue
  const car2 = new THREE.Group();
  car2.position.set(-2.5, -0.15, 75);
  car2.rotation.y = -Math.PI / 2;

  const body2 = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.9, 2.0),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.25 })
  );
  body2.position.y = 0.45;
  body2.castShadow = true;
  car2.add(body2);

  group.add(car2);
  scene.add(group);

  return {
    group,
    updateVehicles(delta) {
      // Car 1 moves west to east
      car1.position.x += delta * 15.0;
      if (car1.position.x > 85) car1.position.x = -85;

      // Car 2 moves south to north
      car2.position.z -= delta * 8.0;
      if (car2.position.z < 24) car2.position.z = 75;
    }
  };
}

export default setupTraffic;
