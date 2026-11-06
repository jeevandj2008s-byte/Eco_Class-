import * as THREE from '../vendor/three.module.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { CONFIG } from '../config.js';

/**
 * camera.js — Camera controls and animated view transitions
 */
export function setupCamera(renderer) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, width / height, CONFIG.camera.near, CONFIG.camera.far);
  camera.position.set(...CONFIG.camera.position);

  // Setup Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera from going underneath ground
  controls.minDistance = 8;
  controls.maxDistance = 240;
  controls.target.set(...CONFIG.camera.lookAt);

  return { camera, controls };
}

export default setupCamera;

