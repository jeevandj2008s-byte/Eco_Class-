/**
 * config.js — All user settings, colors, text & names kept separate and clean
 */
export const CONFIG = {
  // Institutional Details
  campus: {
    name: 'Bangalore Institute of Technology (BIT)',
    shortName: 'BIT Campus',
    tagline: 'Sustainable Microgrid & Architectural Digital Twin',
    location: 'K.R. Road, V.V. Puram, Bengaluru'
  },

  // Lighting Settings (3-Point Architectural Exterior Standard)
  lights: {
    // ☀ Directional Light (Sun)
    sun: {
      color: 0xffefd7,          // Natural warm sunlight
      intensity: 2.2,           // Between 1.8 and 2.5
      position: [65, 95, 55],    // High and at an angle
      castShadow: true          // Only the sun casts shadows
    },
    // 🌤 Hemisphere Light (Sky)
    sky: {
      skyColor: 0xfffbf0,       // Warm white sky fill
      groundColor: 0x364238,    // Muted green/grey ground bounce
      intensity: 0.85           // Purely ambient fill — prevents pitch-black shadows
    },
    // 💡 Fill Light (Secondary Directional from Opposite Angle)
    fill: {
      color: 0x9ec5fe,          // Cool bluish color to contrast warm sun
      intensity: 0.5,           // Low intensity between 0.4 and 0.6
      position: [-55, 45, -55], // Opposite angle
      castShadow: false         // Adds dimensionality — no shadows needed
    }
  },

  // Camera Defaults
  camera: {
    fov: 50,
    near: 0.1,
    far: 1000,
    position: [0, 68, 88],
    lookAt: [0, 2, 0]
  },

  // Colors
  colors: {
    background: 0x07080e,
    terrain: 0x080a11,
    road: 0x0f1422,
    roadMarking: 0xfbbf24,
    boundaryWall: 0x1e293b,
    accentCyan: 0x006bff,
    accentPurple: 0x6f5adc
  }
};

export default CONFIG;
