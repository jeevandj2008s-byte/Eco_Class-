import * as THREE from '../vendor/three.module.js';

/**
 * routes.js — Waypoints and pathfinding for characters and campus vehicles
 */
export const CAMPUS_ROUTES = {
  perimeterDriveway: [
    new THREE.Vector3(-85, -0.15, -55),
    new THREE.Vector3(85, -0.15, -55)
  ],
  mainAvenue: [
    new THREE.Vector3(-2.5, -0.15, 75),
    new THREE.Vector3(-2.5, -0.15, 24)
  ]
};

export default CAMPUS_ROUTES;

