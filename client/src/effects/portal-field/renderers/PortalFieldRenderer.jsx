import React, { useEffect, useRef } from 'react';

/**
 * PortalFieldRenderer
 * Radial vortex portal background with harmonic concentric energy pulses.
 */
export default function PortalFieldRenderer({
  speed = 1.0,
  density = 1.0,
  opacity = 1.0,
  palette
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let time = 0;
    let isVisible = true;

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) animId = requestAnimationFrame(render);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }
      time += 0.015 * speed;

      ctx.fillStyle = '#0d0c11';
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.45;
      const maxR = Math.min(width, height) * 0.6;

      ctx.save();
      const ringCount = Math.round(18 * density);
      for (let i = 0; i < ringCount; i++) {
        const progress = ((i / ringCount) + (time * 0.05)) % 1.0;
        const r = progress * maxR;
        const alpha = Math.sin(progress * Math.PI) * 0.35 * opacity;

        ctx.strokeStyle = `rgba(111, 90, 220, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center glow
      const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.8);
      radial.addColorStop(0, 'rgba(77, 25, 177, 0.22)');
      radial.addColorStop(0.5, 'rgba(111, 90, 220, 0.08)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [speed, density, opacity, palette]);

  return (
    <div className="portal-field-container">
      <canvas ref={canvasRef} className="portal-field-canvas" />
    </div>
  );
}
