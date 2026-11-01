import React, { useEffect, useRef } from 'react';

/**
 * BellFieldRenderer
 * Harmonic bell curve frequency distribution wave field.
 */
export default function BellFieldRenderer({
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
      time += 0.012 * speed;

      ctx.fillStyle = '#0d0c11';
      ctx.fillRect(0, 0, width, height);

      const lines = Math.round(14 * density);
      const cx = width * 0.5;

      ctx.save();
      for (let i = 0; i < lines; i++) {
        const t = (i / lines) * Math.PI * 2 + time;
        const cy = height * 0.5 + Math.sin(t) * 40;
        const amp = 80 + Math.cos(t * 0.5) * 40;
        const sigma = 140;

        ctx.strokeStyle = `rgba(159, 240, 236, ${0.12 * opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const dx = x - cx;
          const y = cy - Math.exp(-(dx * dx) / (2 * sigma * sigma)) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
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

