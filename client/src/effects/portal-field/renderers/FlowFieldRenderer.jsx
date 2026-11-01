import React, { useEffect, useRef } from 'react';

/**
 * FlowFieldRenderer
 * Canvas 2D ambient particle vector flow field with smooth organic drift.
 */
export default function FlowFieldRenderer({
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

    const count = Math.round(90 * density);
    const particles = [];

    const resetParticle = (p) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.vx = 0;
      p.vy = 0;
      p.life = Math.random() * 200 + 100;
      p.maxLife = p.life;
      p.size = Math.random() * 2 + 1;
    };

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        for (let i = 0; i < count; i++) {
          const p = {};
          resetParticle(p);
          particles.push(p);
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
      time += 0.008 * speed;

      // Dark trailing clear
      ctx.fillStyle = 'rgba(13, 12, 17, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle =
          Math.sin(p.x * 0.004 + time) * Math.cos(p.y * 0.004 + time) * Math.PI * 2;
        p.vx = Math.cos(angle) * (1.2 * speed);
        p.vy = Math.sin(angle) * (1.2 * speed);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life <= 0) {
          resetParticle(p);
        }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * opacity;
        ctx.fillStyle = `rgba(159, 240, 236, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
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

