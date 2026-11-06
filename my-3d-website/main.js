import * as THREE from './vendor/three.module.js';
import { CONFIG } from './config.js';
import { setupEnvironment } from './scene/environment.js';
import { setupNeighbourhood } from './scene/neighbourhood.js';
import { setupArchitecture } from './scene/architecture.js';
import { setupFurniture } from './scene/furniture.js';
import { setupNPCs } from './characters/npc.js';
import { createCharacterController } from './characters/controller.js';
import { setupCamera } from './systems/camera.js';
import { setupTraffic } from './systems/traffic.js';
import { getPerformanceSettings } from './systems/performance.js';

// ==============================================================
// Step 1 — SETUP (runs only once when the page loads)
// ==============================================================
const width = window.innerWidth;
const height = window.innerHeight;
const perf = getPerformanceSettings();

const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.colors.background);

const renderer = new THREE.WebGLRenderer({ antialias: perf.antialias });
renderer.setSize(width, height);
renderer.setPixelRatio(perf.pixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Setup Camera & Orbit Controls
const { camera, controls } = setupCamera(renderer);

// Initialize Scene Systems
setupEnvironment(scene);
const { treesGroup } = setupNeighbourhood(scene);
setupArchitecture(scene);
const { fans } = setupFurniture(scene);
const { characters } = setupNPCs(scene);
const { updateCharacters } = createCharacterController(characters);
const { updateVehicles } = setupTraffic(scene);

// Handle Window Resizing
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ==============================================================
// Step 2 — ANIMATION LOOP (runs ~60 times per second)
// ==============================================================
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // 1. Update camera from mouse or touch input
  controls.update();

  // 2. Move & animate all characters forward by delta time
  updateCharacters(delta);

  // 3. Move all vehicles forward
  updateVehicles(delta);

  // 4. Animate ceiling fans and swaying nature
  if (fans) {
    fans.forEach((rotor) => {
      rotor.rotation.y += delta * 7.5;
    });
  }
  if (treesGroup) {
    treesGroup.children.forEach((tree, idx) => {
      tree.rotation.z = Math.sin(elapsed * 1.5 + idx * 0.8) * 0.02;
    });
  }

  // 5. Draw the current frame
  renderer.render(scene, camera);
});

console.log('🏛️ BIT Campus 3D Scene successfully initialized.');
