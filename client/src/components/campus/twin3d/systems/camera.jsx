import React from 'react';
import { CameraRig } from '../CameraRig.jsx';

/**
 * Camera System: Handles Camera Controls & Animated Transitions Between Views
 *  - Campus Overview (Default wide hero view)
 *  - Building Block Zoom
 *  - Level 3 Isometric Floor Cutaway (Dollhouse 3/4 view)
 *  - Classroom Inside View
 *  - Individual Student Seat View
 */
export function CameraSystem() {
  return <CameraRig />;
}

export default CameraSystem;

