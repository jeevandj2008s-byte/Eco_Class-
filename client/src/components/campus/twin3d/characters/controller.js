import * as THREE from 'three';

const tempObj = new THREE.Object3D();

/**
 * Character Controller: Handles Movement & Animation States (Idle / Sitting / Breathing)
 * Called ~60 times per second in the main animation loop:
 *   updateCharacters(delta)
 */
export function updateCharacters(delta, meshRef, studentData, elapsedTime, isAnimated = true) {
  if (!meshRef || !meshRef.current || !studentData || studentData.length === 0) return;

  const mesh = meshRef.current;

  studentData.forEach((s, idx) => {
    if (!s) return;

    // Subtle natural human micro-motion (idle breathing + slight head turns)
    const breath = isAnimated ? Math.sin(elapsedTime * 2.2 + idx * 0.7) * 0.008 : 0;
    const sway = isAnimated ? Math.cos(elapsedTime * 1.4 + idx * 0.5) * 0.006 : 0;

    tempObj.position.set(s.x + sway, s.y + breath, s.z);
    tempObj.rotation.set(0, s.rotY || 0, 0);

    // Apply scale (slight pulse if highlighted or selected)
    const scale = s.isSelected ? 1.15 : s.isHovered ? 1.08 : 1.0;
    tempObj.scale.set(scale, scale, scale);

    tempObj.updateMatrix();
    mesh.setMatrixAt(idx, tempObj.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
}

export default updateCharacters;
