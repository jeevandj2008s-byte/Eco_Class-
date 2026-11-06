/**
 * 3D Scene & Lighting Configuration
 * Aligned with professional architectural visualization standards
 */
export const THREE_CONFIG = {
  // 1. Lighting Configuration
  lights: {
    // ☀ Directional Light (Sun)
    sun: {
      color: '#ffefd7',          // Natural warm sunlight
      intensity: 2.2,           // Range 1.8 to 2.5
      position: [65, 95, 55],    // High and at an angle like a real sun
      castShadow: true,         // Only the sun casts shadows
      shadowMapSize: 2048,
      shadowBias: -0.0005,
      shadowBounds: {
        left: -100,
        right: 100,
        top: 100,
        bottom: -100,
        near: 0.5,
        far: 280
      }
    },
    // 🌤 Hemisphere Light (Sky & Ground Ambient Fill)
    sky: {
      skyColor: '#fffbf0',      // Warm white from above
      groundColor: '#364238',   // Muted green/grey from ground
      intensity: 0.85,          // Ambient fill that prevents pitch-black shadows
      castShadow: false         // Purely ambient fill — no shadows
    },
    // 💡 Fill Light (Secondary Directional from Opposite Side)
    fill: {
      color: '#9ec5fe',          // Cool bluish color to contrast warm sun
      intensity: 0.5,           // Low intensity 0.4 to 0.6
      position: [-55, 45, -55], // Opposite angle to fill shadows
      castShadow: false         // Adds dimensionality — no shadows needed
    },
    // Subtle interior warm accent glow
    interiorAccent: {
      color: '#fef3c7',
      intensity: 0.35,
      position: [-10, 16, 5],
      distance: 120
    }
  },

  // 2. Camera Configuration
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    defaultPosition: [0, 68, 88],
    defaultLookAt: [0, 2, 0],
    dampingFactor: 0.05
  },

  // 3. Environment & Atmosphere
  environment: {
    backgroundColor: '#07080e',
    fogColor: '#07080e',
    fogNear: 100,
    fogFar: 280,
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
    fanSpeed: 7.5
  }
};

