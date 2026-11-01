import React from 'react';
import { MOTION_CONFIG } from '../../lib/motion.js';

export default function LivingCanvas() {
  if (!MOTION_CONFIG.ENABLED) return null;

  // 12 subtle procedural particles (desktop), zero layout shift, pure CSS transforms
  const particles = [
    { id: 1, top: '12%', left: '8%', size: 4, delay: '0s', dur: '4.2s' },
    { id: 2, top: '28%', left: '88%', size: 5, delay: '1.2s', dur: '5.1s' },
    { id: 3, top: '45%', left: '16%', size: 3, delay: '0.6s', dur: '3.8s' },
    { id: 4, top: '62%', left: '82%', size: 6, delay: '2.1s', dur: '4.6s' },
    { id: 5, top: '78%', left: '24%', size: 4, delay: '1.8s', dur: '5.4s' },
    { id: 6, top: '88%', left: '72%', size: 5, delay: '0.9s', dur: '4.0s' },
    { id: 7, top: '20%', left: '50%', size: 4, delay: '2.5s', dur: '4.8s' },
    { id: 8, top: '55%', left: '46%', size: 3, delay: '1.5s', dur: '3.5s' },
    { id: 9, top: '38%', left: '94%', size: 5, delay: '3.0s', dur: '5.2s' },
    { id: 10, top: '82%', left: '6%', size: 4, delay: '2.3s', dur: '4.4s' },
    { id: 11, top: '15%', left: '76%', size: 3, delay: '0.4s', dur: '3.9s' },
    { id: 12, top: '70%', left: '38%', size: 4, delay: '1.9s', dur: '4.7s' },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none"
    >
      {/* Soft Ambient Floating Orbs */}
      <div
        className="living-orb-1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#006bff]/10 to-[#0099ff]/15 blur-3xl"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <div
        className="living-orb-2 absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gradient-to-bl from-[#e55cff]/10 to-[#006bff]/10 blur-3xl"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <div
        className="living-orb-1 absolute -bottom-32 left-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#0099ff]/10 to-transparent blur-3xl"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* Micro-sparkle dust particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-particle absolute rounded-full bg-[#006bff]/30"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

