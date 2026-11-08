import React, { useRef } from 'react';
import * as THREE from 'three';
import { THREE_CONFIG } from '../config/threeConfig.js';

/**
 * Environment System: Sky, Visible Sun, Atmospheric Lighting & Architectural Radiance
 *  1. ☀ Visible Physical Sun Disc & Radial Golden Corona in Sky ([75, 110, 65])
 *  2. 🌤 Realistic Architectural Sky Dome (Zenith to Horizon Gradient)
 *  3. 💡 High-CRI 3-Point Architectural Lighting:
 *     - Directional Sun Light (#fff9ea, intensity 2.6, shadow-mapped)
 *     - Hemisphere Sky & Ground Fill Light (#e0f2fe / #2e3a4e, intensity 0.95)
 *     - Cool Bluish Ambient Secondary Fill (#bae6fd, intensity 0.6)
 *     - Interior Warm Point Illuminations
 */
export function Environment() {
  const sunLightRef = useRef();
  const sunPos = [75, 110, 65];

  return (
    <group name="scene-environment">
      {/* 1. ☀ VISIBLE PHYSICAL SUN DISC & GOLDEN CORONA IN SKY */}
      <group position={sunPos} name="visible-sun-celestial">
        {/* Core Sun Disc */}
        <mesh>
          <sphereGeometry args={[5.2, 24, 24]} />
          <meshBasicMaterial color="#fffbeb" />
        </mesh>
        {/* Inner Golden Corona */}
        <mesh>
          <sphereGeometry args={[7.8, 20, 20]} />
          <meshBasicMaterial
            color="#fef08a"
            transparent
            opacity={0.55}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Outer Solar Atmospheric Glow */}
        <mesh>
          <sphereGeometry args={[13.5, 20, 20]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.22}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* 2. 🌤 REALISTIC ARCHITECTURAL SKY DOME (Surrounding the Campus) */}
      <mesh position={[0, -20, 0]} name="atmospheric-sky-dome">
        <sphereGeometry args={[420, 32, 16]} />
        <meshBasicMaterial
          color="#111827"
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3. ☀ DIRECTIONAL SUN LIGHT (Parallel Warm Sunlight Rays) */}
      <directionalLight
        ref={sunLightRef}
        name="sun-light"
        position={sunPos}
        intensity={2.6}
        color="#fff8ea"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={320}
        shadow-camera-near={0.5}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0004}
      />

      {/* 4. 🌤 HEMISPHERE SKY LIGHT (Natural Ambient Fill — Eliminates Pitch-Black Areas) */}
      <hemisphereLight
        name="sky-ambient-fill"
        color="#e0f2fe"
        groundColor="#252d3d"
        intensity={0.95}
      />

      {/* 5. 💡 COOL BLUISH SECONDARY FILL LIGHT (Adds Dimensionality from Opposite Side) */}
      <directionalLight
        name="secondary-fill-light"
        position={[-65, 55, -65]}
        intensity={0.65}
        color="#bae6fd"
        castShadow={false}
      />

      {/* 6. WARM INTERIOR CAMPUS GLOW ACCENT */}
      <pointLight
        name="campus-warm-glow"
        position={[0, 24, 0]}
        intensity={0.45}
        color="#fef3c7"
        distance={140}
        decay={2}
      />
    </group>
  );
}

export default Environment;
