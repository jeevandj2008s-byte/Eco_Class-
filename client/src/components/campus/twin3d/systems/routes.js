import * as THREE from 'three';

/**
 * Routes System: Waypoints & Pathfinding for Campus Traffic & Characters
 */
export const CAMPUS_ROUTES = {
  // Perimeter North Road: Straight drive along top campus perimeter
  perimeterRoad: [
    new THREE.Vector3(-85, -0.38, -58),
    new THREE.Vector3(-40, -0.38, -58),
    new THREE.Vector3(0, -0.38, -58),
    new THREE.Vector3(40, -0.38, -58),
    new THREE.Vector3(85, -0.38, -58)
  ],

  // Main Gate to Parking Lot Driveway Loop
  entranceDriveway: [
    new THREE.Vector3(0, -0.38, 75),   // Main Gate
    new THREE.Vector3(0, -0.38, 45),   // Avenue
    new THREE.Vector3(0, -0.38, 24),   // Quad Junction
    new THREE.Vector3(25, -0.38, 24),  // Parking Entrance Barrier
    new THREE.Vector3(32, -0.38, 10),  // Parking Bay Aisle
    new THREE.Vector3(32, -0.38, -10), // Parking Exit
    new THREE.Vector3(0, -0.38, -10)   // Return loop
  ],

  // Pedestrian Walkways
  pedestrianCrossings: [
    { start: [-10, -0.36, -58], end: [10, -0.36, -58] },
    { start: [-5, -0.36, 24], end: [5, -0.36, 24] }
  ]
};

export default CAMPUS_ROUTES;

