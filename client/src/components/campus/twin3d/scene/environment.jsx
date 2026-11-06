import React, { useRef } from 'react';
import { THREE_CONFIG } from '../config/threeConfig.js';

/**
 * Environment System: Sky, Lighting, Fog & Atmospheric Quality
 * Follows the 3-point architectural exterior lighting setup:
 *  1. ☀ Directional Light (Sun) - Warm #ffefd7, high angle, shadow casting
 *  2. 🌤 Hemisphere Light (Sky) - Warm white sky, muted green/grey ground, ambient fill
 *  3. 💡 Fill Light (Secondary) - Cool bluish directional from opposite angle, no shadows
 */
export function Environment() {
  const sunLightRef = useRef();
  const { sun, sky, fill, interiorAccent } = THREE_CONFIG.lights;

  return (
    <group name="scene-environment">
      {/* 1. ☀ Directional Light (Sun): Parallel sunlight rays from high angle */}
      <directionalLight
        ref={sunLightRef}
        name="sun-light"
        position={sun.position}
        intensity={sun.intensity}
        color={sun.color}
        castShadow={sun.castShadow}
        shadow-mapSize-width={sun.shadowMapSize}
        shadow-mapSize-height={sun.shadowMapSize}
        shadow-camera-far={sun.shadowBounds.far}
        shadow-camera-near={sun.shadowBounds.near}
        shadow-camera-left={sun.shadowBounds.left}
        shadow-camera-right={sun.shadowBounds.right}
        shadow-camera-top={sun.shadowBounds.top}
        shadow-camera-bottom={sun.shadowBounds.bottom}
        shadow-bias={sun.shadowBias}
      />

      {/* 2. 🌤 Hemisphere Light (Sky): Sky color from above, ground color from below */}
      <hemisphereLight
        name="sky-ambient-fill"
        color={sky.skyColor}
        groundColor={sky.groundColor}
        intensity={sky.intensity}
        // Purely ambient fill — no shadows to prevent pitch-black areas
      />

      {/* 3. 💡 Fill Light (Secondary): Cool bluish directional from opposite side */}
      <directionalLight
        name="secondary-fill-light"
        position={fill.position}
        intensity={fill.intensity}
        color={fill.color}
        castShadow={false}
        // Adds dimensionality and subtle blue bounce to contrast the warm sun
      />

      {/* 4. Warm Interior Accent Point Light */}
      <pointLight
        name="interior-warm-glow"
        position={interiorAccent.position}
        intensity={interiorAccent.intensity}
        color={interiorAccent.color}
        distance={interiorAccent.distance}
      />
    </group>
  );
}

export default Environment;

