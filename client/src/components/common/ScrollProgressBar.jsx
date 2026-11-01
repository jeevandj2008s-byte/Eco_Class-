import React from 'react';
import { useScrollProgress, MOTION_CONFIG } from '../../lib/motion.js';

export default function ScrollProgressBar() {
  if (!MOTION_CONFIG.ENABLED) return null;
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="scroll-progress-line"
      style={{ width: `${progress}%` }}
    />
  );
}

