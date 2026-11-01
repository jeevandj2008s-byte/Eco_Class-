import React from 'react';
import { MOTION_CONFIG } from '../../lib/motion.js';
import { PortalFieldCollection } from '../../effects/portal-field/PortalFieldCollection.jsx';

export default function LivingCanvas() {
  if (!MOTION_CONFIG.ENABLED) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
    >
      <PortalFieldCollection
        variant="cloud-field"
        speed={1.0}
        density={1.0}
        opacity={1.0}
      />
    </div>
  );
}
