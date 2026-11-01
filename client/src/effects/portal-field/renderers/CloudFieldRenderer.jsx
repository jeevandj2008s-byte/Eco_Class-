import React, { useEffect, useRef } from 'react';

/**
 * CloudFieldRenderer
 * Authored atmospheric night sky with layered undulating strata cloud waves,
 * twinkling celestial starfield, and periodic glowing shooting stars.
 */
export default function CloudFieldRenderer({
  speed = 1.0,
  density = 1.0,
  opacity = 1.0,
  palette
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let time = 0;
    let isVisible = true;
    let mouseX = 0;
    let targetParallax = 0;
    let currentParallax = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Deterministic pseudo-random generator
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // 1. Generate Starfield
    const starCount = Math.round(75 * density);
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: rnd(),
        y: rnd() * 0.62, // Upper 62% of viewport
        size: 0.8 + rnd() * 1.3,
        baseAlpha: 0.3 + rnd() * 0.55,
        twinkleSpeed: 0.8 + rnd() * 2.2,
        phase: rnd() * Math.PI * 2
      });
    }

    // 2. Shooting Star (Meteor) State
    const meteors = [];
    let nextMeteorTime = 1.5;

    const spawnMeteor = () => {
      const angle = (32 + (rnd() - 0.5) * 8) * (Math.PI / 180);
      const startX = width * (0.1 + rnd() * 0.7);
      const startY = height * (0.05 + rnd() * 0.3);
      const travelDist = 180 + rnd() * 180;
      const travelSpeed = 7 + rnd() * 5;

      meteors.push({
        x: startX,
        y: startY,
        startX,
        startY,
        dx: Math.cos(angle) * travelSpeed,
        dy: Math.sin(angle) * travelSpeed,
        tailLength: 70 + rnd() * 60,
        distTraveled: 0,
        maxDist: travelDist,
        alpha: 1.0
      });
    };

    // 3. Strata Cloud Wave Definitions (4 Harmonic Layers)
    const layers = [
      {
        baseFraction: 0.46,
        amplitude1: 18,
        freq1: 0.0035,
        speed1: 0.008 * speed,
        amplitude2: 12,
        freq2: 0.007,
        speed2: -0.006 * speed,
        crestColor: 'rgba(175, 125, 255, 0.40)',
        gradient: (h) => {
          const g = ctx.createLinearGradient(0, h * 0.5, 0, h);
          g.addColorStop(0, 'rgba(75, 34, 130, 0.45)');
          g.addColorStop(1, 'rgba(38, 14, 72, 0.75)');
          return g;
        },
        parallaxMult: 0.3
      },
      {
        baseFraction: 0.36,
        amplitude1: 22,
        freq1: 0.0042,
        speed1: -0.012 * speed,
        amplitude2: 14,
        freq2: 0.0085,
        speed2: 0.009 * speed,
        crestColor: 'rgba(150, 95, 235, 0.35)',
        gradient: (h) => {
          const g = ctx.createLinearGradient(0, h * 0.6, 0, h);
          g.addColorStop(0, 'rgba(53, 22, 98, 0.65)');
          g.addColorStop(1, 'rgba(27, 8, 51, 0.85)');
          return g;
        },
        parallaxMult: 0.55
      },
      {
        baseFraction: 0.25,
        amplitude1: 24,
        freq1: 0.005,
        speed1: 0.015 * speed,
        amplitude2: 16,
        freq2: 0.01,
        speed2: -0.011 * speed,
        crestColor: 'rgba(125, 75, 205, 0.30)',
        gradient: (h) => {
          const g = ctx.createLinearGradient(0, h * 0.7, 0, h);
          g.addColorStop(0, 'rgba(35, 12, 68, 0.85)');
          g.addColorStop(1, 'rgba(18, 4, 34, 0.95)');
          return g;
        },
        parallaxMult: 0.8
      },
      {
        baseFraction: 0.14,
        amplitude1: 20,
        freq1: 0.006,
        speed1: -0.018 * speed,
        amplitude2: 12,
        freq2: 0.012,
        speed2: 0.014 * speed,
        crestColor: 'rgba(105, 55, 180, 0.25)',
        gradient: (h) => {
          const g = ctx.createLinearGradient(0, h * 0.8, 0, h);
          g.addColorStop(0, 'rgba(21, 5, 42, 0.95)');
          g.addColorStop(1, '#0d0c11');
          return g;
        },
        parallaxMult: 1.0
      }
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const onMouseMove = (e) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      targetParallax = mouseX * 24;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion && !animId) {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Main Render Loop
    let lastStamp = performance.now();
    const render = (stamp) => {
      if (!isVisible) {
        animId = null;
        return;
      }

      const dt = Math.min((stamp - lastStamp) / 1000, 0.1);
      lastStamp = stamp;
      time += dt * speed;

      currentParallax += (targetParallax - currentParallax) * 0.06;

      // 1. Sky Background Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#07050b');
      skyGrad.addColorStop(0.35, '#110620');
      skyGrad.addColorStop(0.65, '#200a39');
      skyGrad.addColorStop(0.85, '#2d0f50');
      skyGrad.addColorStop(1, '#150628');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Horizon Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(
        width * 0.5 + currentParallax * 0.4,
        height * 0.56,
        10,
        width * 0.5 + currentParallax * 0.4,
        height * 0.56,
        width * 0.65
      );
      glowGrad.addColorStop(0, 'rgba(88, 30, 155, 0.28)');
      glowGrad.addColorStop(0.5, 'rgba(55, 18, 105, 0.14)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = (s.x * width + currentParallax * 0.2) % width;
        const sy = s.y * height;
        const twinkle = Math.sin(time * s.twinkleSpeed + s.phase);
        const alpha = Math.max(0.08, Math.min(1.0, s.baseAlpha + twinkle * 0.35));

        ctx.fillStyle = `rgba(235, 225, 255, ${alpha * opacity})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Update & Render Shooting Stars
      nextMeteorTime -= dt;
      if (nextMeteorTime <= 0) {
        spawnMeteor();
        nextMeteorTime = 2.4 + rnd() * 3.2; // Spawn every 2.4 - 5.6s
      }

      ctx.save();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.dx;
        m.y += m.dy;
        const step = Math.hypot(m.dx, m.dy);
        m.distTraveled += step;

        const progress = m.distTraveled / m.maxDist;
        if (progress >= 1.0) {
          meteors.splice(i, 1);
          continue;
        }

        m.alpha = progress < 0.2 ? progress / 0.2 : 1.0 - (progress - 0.2) / 0.8;

        const angle = Math.atan2(m.dy, m.dx);
        const tailX = m.x - Math.cos(angle) * m.tailLength;
        const tailY = m.y - Math.sin(angle) * m.tailLength;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, 'rgba(159, 240, 236, 0)');
        meteorGrad.addColorStop(0.7, `rgba(185, 140, 255, ${m.alpha * 0.5 * opacity})`);
        meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha * opacity})`);

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Glowing core head
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha * opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Render Layered Strata Cloud Waves
      const stepX = Math.max(6, Math.floor(width / 160));
      for (let li = 0; li < layers.length; li++) {
        const l = layers[li];
        const baseY = height * (1 - l.baseFraction);
        const parallaxOffset = currentParallax * l.parallaxMult;

        ctx.save();
        ctx.fillStyle = l.gradient(height);
        ctx.strokeStyle = l.crestColor;
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width + stepX; x += stepX) {
          const px = x + parallaxOffset;
          const y =
            baseY +
            Math.sin(px * l.freq1 + time * l.speed1) * l.amplitude1 +
            Math.cos(px * l.freq2 + time * l.speed2) * l.amplitude2;

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    // Initial render
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [speed, density, opacity, palette]);

  return (
    <div className="portal-field-container">
      <canvas ref={canvasRef} className="portal-field-canvas" />
    </div>
  );
}

