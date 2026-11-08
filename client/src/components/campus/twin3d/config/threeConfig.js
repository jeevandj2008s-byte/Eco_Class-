/**
 * 3D Scene & Lighting Configuration
 * Aligned with professional architectural visualization standards
 */
export const THREE_CONFIG = {
  // 1. Lighting Configuration
  lights: {
    // ☀ Directional Light (Sun)
    sun: {
      color: '#fff8ea',          // Natural warm sunlight
      intensity: 2.6,           // High architectural solar intensity
      position: [75, 110, 65],   // High sun angle with visible solar disk
      castShadow: true,         // Only the sun casts shadows
      shadowMapSize: 2048,
      shadowBias: -0.0004,
      shadowBounds: {
        left: -120,
        right: 120,
        top: 120,
        bottom: -120,
        near: 0.5,
        far: 320
      }
    },
    // 🌤 Hemisphere Light (Sky & Ground Ambient Fill)
    sky: {
      skyColor: '#e0f2fe',      // Natural atmospheric sky daylight from above
      groundColor: '#252d3d',   // Architectural ground tone
      intensity: 0.95,          // Ambient fill that illuminates all interiors cleanly
      castShadow: false         // Purely ambient fill — no shadows
    },
    // 💡 Fill Light (Secondary Directional from Opposite Side)
    fill: {
      color: '#bae6fd',          // Cool bluish sky bounce to contrast warm sun
      intensity: 0.65,          // Balanced secondary illumination
      position: [-65, 55, -65], // Opposite angle to fill shadows
      castShadow: false         // Adds dimensionality — no shadows needed
    },
    // Subtle interior warm accent glow
    interiorAccent: {
      color: '#fef3c7',
      intensity: 0.45,
      position: [0, 24, 0],
      distance: 140
    }
  },

  // 2. Camera Configuration
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    defaultPosition: [0, 68, 88],
    defaultLookAt: [0, 2, 0],
    dampingFactor: 0.06
  },

  // 3. Environment & Atmosphere
  environment: {
    backgroundColor: '#0e1322',
    fogColor: '#0e1322',
    fogNear: 140,
    fogFar: 360,
    ambientOcclusion: true
  },

  // 4. Vehicle & Traffic Systems
  traffic: {
    speedMultiplier: 1.0,
    carColors: [
      '#0284c7', // Sky Blue
      '#dc2626', // Crimson Red
      '#f59e0b', // Amber Orange
      '#10b981', // Emerald Green
      '#475569', // Slate Grey
      '#ffffff', // Pure White
      '#1e1b4b', // Deep Indigo
      '#7c3aed'  // Electric Violet
    ]
  },

  // 5. Character & NPC Systems
  characters: {
    idleBreathingSpeed: 2.0,
    headTurnSpeed: 1.2,
    fanSpeed: 8.5
  }
};
