import React from 'react';
import { MOTION_CONFIG } from '../../lib/motion.js';

export default function LivingCanvas() {
  if (!MOTION_CONFIG.ENABLED) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
      style={{
        background: `
          radial-gradient(circle 650px at 15% 15%, rgba(77, 25, 177, 0.18), transparent 70%),
          radial-gradient(circle 550px at 85% 40%, rgba(111, 90, 220, 0.15), transparent 70%),
          radial-gradient(circle 600px at 45% 85%, rgba(159, 240, 236, 0.08), transparent 75%)
        `,
        contain: 'strict'
      }}
    />
  );
}

