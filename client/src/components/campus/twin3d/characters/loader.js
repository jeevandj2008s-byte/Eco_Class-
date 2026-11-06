import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural Humanoid Character Geometry Loader
 * Generates lightweight, anatomically proportioned seated students and standing teachers
 */
export function createSeatedHumanoidGeometry() {
  // 1. Thighs / Pelvis - resting flat on chair cushion
  const thighs = new THREE.BoxGeometry(0.28, 0.09, 0.32);
  thighs.translate(0, 0.045, 0.12);

  // 2. Shins / Calves - dropping vertically from knees straight down to floor
  const leftShin = new THREE.BoxGeometry(0.11, 0.46, 0.10);
  leftShin.translate(-0.08, -0.23, 0.24);

  const rightShin = new THREE.BoxGeometry(0.11, 0.46, 0.10);
  rightShin.translate(0.08, -0.23, 0.24);

  // 3. Shoes / Feet - planted flat on floor
  const leftFoot = new THREE.BoxGeometry(0.11, 0.06, 0.16);
  leftFoot.translate(-0.08, -0.44, 0.27);

  const rightFoot = new THREE.BoxGeometry(0.11, 0.06, 0.16);
  rightFoot.translate(0.08, -0.44, 0.27);

  // 4. Torso - sitting upright against backrest
  const torso = new THREE.BoxGeometry(0.32, 0.42, 0.18);
  torso.translate(0, 0.30, 0.0);

  // 5. Neck & Head
  const head = new THREE.SphereGeometry(0.12, 10, 10);
  head.translate(0, 0.65, 0.02);

  // 6. Arms - resting forward on bench desk
  const leftArm = new THREE.BoxGeometry(0.08, 0.24, 0.09);
  leftArm.translate(-0.19, 0.32, 0.06);

  const rightArm = new THREE.BoxGeometry(0.08, 0.24, 0.09);
  rightArm.translate(0.19, 0.32, 0.06);

  const leftForearm = new THREE.BoxGeometry(0.07, 0.06, 0.20);
  leftForearm.translate(-0.16, 0.21, 0.18);

  const rightForearm = new THREE.BoxGeometry(0.07, 0.06, 0.20);
  rightForearm.translate(0.16, 0.21, 0.18);

  return mergeGeometries([
    thighs,
    leftShin,
    rightShin,
    leftFoot,
    rightFoot,
    torso,
    head,
    leftArm,
    rightArm,
    leftForearm,
    rightForearm
  ]);
}

export function createStandingTeacherGeometry() {
  // Standing instructor geometry
  const legs = new THREE.BoxGeometry(0.24, 0.85, 0.16);
  legs.translate(0, 0.425, 0);

  const torso = new THREE.BoxGeometry(0.34, 0.52, 0.20);
  torso.translate(0, 1.11, 0);

  const head = new THREE.SphereGeometry(0.13, 10, 10);
  head.translate(0, 1.50, 0);

  const pointerArm = new THREE.BoxGeometry(0.08, 0.08, 0.45);
  pointerArm.translate(0.22, 1.25, 0.22);

  return mergeGeometries([legs, torso, head, pointerArm]);
}

