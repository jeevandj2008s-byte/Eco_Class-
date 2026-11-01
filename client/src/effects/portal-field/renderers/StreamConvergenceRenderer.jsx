import React, { useEffect, useRef } from 'react';

/**
 * StreamConvergenceRenderer
 * Converging linear stream particles with focal depth compression.
 */
export default function StreamConvergenceRenderer({
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
    let isVisible = true;

    const streams = [];
    const count = Math.round(50 * density);

    const initStream = (s) => {
      s.x = Math.random() * width;
      s.y = Math.random() * height;
      s.speed = (2 + Math.random() * 3) * speed;
      s.length = 30 + Math.random() * 60;
      s.alpha = 0.15 + Math.random() * 0.35;
    };

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (streams.length === 0) {
        for (let i = 0; i < count; i++) {
          const s = {};
          initStream(s);
          streams.push(s);
        }
      }
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

      ctx.fillStyle = '#0d0c11';
      ctx.fillRect(0, 0, width, height);

      const targetX = width * 0.5;
      const targetY = height * 0.45;

      ctx.save();
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        const dx = targetX - s.x;
        const dy = targetY - s.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 15) {
          initStream(s);
          continue;
        }

        const angle = Math.atan2(dy, dx);
        s.x += Math.cos(angle) * s.speed;
        s.y += Math.sin(angle) * s.speed;

        const tailX = s.x - Math.cos(angle) * s.length;
        const tailY = s.y - Math.sin(angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(111, 90, 220, 0)');
        grad.addColorStop(1, `rgba(159, 240, 236, ${s.alpha * opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
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

