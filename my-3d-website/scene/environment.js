import * as THREE from '../vendor/three.module.js';
import { CONFIG } from '../config.js';

/**
 * environment.js — Sky, Lighting, Fog & Atmosphere
 */
export function setupEnvironment(scene) {
  const { sun, sky, fill } = CONFIG.lights;

  // 1. ☀ Directional Light (Sun)
  const sunLight = new THREE.DirectionalLight(sun.color, sun.intensity);
  sunLight.position.set(...sun.position);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 280;
  sunLight.shadow.camera.left = -100;
  sunLight.shadow.camera.right = 100;
  sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.bottom = -100;
  scene.add(sunLight);

  // 2. 🌤 Hemisphere Light (Sky)
  const hemiLight = new THREE.HemisphereLight(sky.skyColor, sky.groundColor, sky.intensity);
  scene.add(hemiLight);

  // 3. 💡 Fill Light (Secondary Directional from Opposite Angle)
  const fillLight = new THREE.DirectionalLight(fill.color, fill.intensity);
  fillLight.position.set(...fill.position);
  fillLight.castShadow = false;
  scene.add(fillLight);

  // 4. Subtle Warm Interior Ambient Glow
  const ambientPoint = new THREE.PointLight(0xfef3c7, 0.35, 120);
  ambientPoint.position.set(-10, 16, 5);
  scene.add(ambientPoint);

  // 5. Scene Fog
  scene.fog = new THREE.Fog(CONFIG.colors.background, 100, 280);

  return { sunLight, hemiLight, fillLight };
}

export default setupEnvironment;

