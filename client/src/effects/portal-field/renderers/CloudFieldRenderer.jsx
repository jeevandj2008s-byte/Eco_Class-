import React, { useEffect, useRef } from 'react';

/**
 * CloudFieldRenderer (High-Performance 60 FPS GPU-Optimized)
 * Authored atmospheric night sky with layered undulating strata cloud waves,
 * twinkling celestial starfield, and periodic glowing shooting stars.
 * Optimized with gradient caching, batch star rendering, 60 FPS lock, and DPR capping.
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
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let time = 0;
    let isVisible = true;
    let rawMouseX = 0;
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
        y: rnd() * 0.62,
        size: 0.8 + rnd() * 1.3,
        baseAlpha: 0.35 + rnd() * 0.5,
        twinkleSpeed: 0.8 + rnd() * 2.2,
        phase: rnd() * Math.PI * 2
      });
    }

    // 2. Shooting Star (Meteor) State
    const meteors = [];
    let nextMeteorTime = 1.8;

    const spawnMeteor = () => {
      if (meteors.length >= 3) return; // Cap simultaneous meteors
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
        parallaxMult: 1.0
      }
    ];

    // Pre-allocated Cached Gradients (rebuilt only on resize, NEVER in render loop)
    let cachedSkyGrad = null;
    let cachedGlowGrad = null;
    let cachedLayerGrads = [];

    const rebuildGradients = () => {
      if (height <= 0 || width <= 0) return;

      // Sky Gradient
      cachedSkyGrad = ctx.createLinearGradient(0, 0, 0, height);
      cachedSkyGrad.addColorStop(0, '#07050b');
      cachedSkyGrad.addColorStop(0.35, '#110620');
      cachedSkyGrad.addColorStop(0.65, '#200a39');
      cachedSkyGrad.addColorStop(0.85, '#2d0f50');
      cachedSkyGrad.addColorStop(1, '#150628');

      // Atmospheric Glow
      cachedGlowGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.56,
        10,
        width * 0.5,
        height * 0.56,
        width * 0.65
      );
      cachedGlowGrad.addColorStop(0, 'rgba(88, 30, 155, 0.28)');
      cachedGlowGrad.addColorStop(0.5, 'rgba(55, 18, 105, 0.14)');
      cachedGlowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      // Layer Gradients
      cachedLayerGrads = [
        (() => {
          const g = ctx.createLinearGradient(0, height * 0.5, 0, height);
          g.addColorStop(0, 'rgba(75, 34, 130, 0.45)');
          g.addColorStop(1, 'rgba(38, 14, 72, 0.75)');
          return g;
        })(),
        (() => {
          const g = ctx.createLinearGradient(0, height * 0.6, 0, height);
          g.addColorStop(0, 'rgba(53, 22, 98, 0.65)');
          g.addColorStop(1, 'rgba(27, 8, 51, 0.85)');
          return g;
        })(),
        (() => {
          const g = ctx.createLinearGradient(0, height * 0.7, 0, height);
          g.addColorStop(0, 'rgba(35, 12, 68, 0.85)');
          g.addColorStop(1, 'rgba(18, 4, 34, 0.95)');
          return g;
        })(),
        (() => {
          const g = ctx.createLinearGradient(0, height * 0.8, 0, height);
          g.addColorStop(0, 'rgba(21, 5, 42, 0.95)');
          g.addColorStop(1, '#0d0c11');
          return g;
        })()
      ];
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      rawMouseX = width * 0.5;

      // Optimal DPR capping: 1.25 gives crisp visuals with 60% less GPU memory overhead than 2.0
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      rebuildGradients();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Passive mouse listener (Zero calculation in event handler)
    const onMouseMove = (e) => {
      rawMouseX = e.clientX;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion && !animId) {
        lastStamp = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Main 60 FPS Target Render Loop
    const TARGET_FPS = 60;
    const FRAME_MS = 1000 / TARGET_FPS;
    let lastStamp = performance.now();

    const render = (stamp) => {
      if (!isVisible) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(render);

      // Frame interval capping (prevents 120Hz/144Hz displays from burning GPU cycles)
      const elapsed = stamp - lastStamp;
      if (elapsed < FRAME_MS - 1.5) {
        return;
      }
      const dt = Math.min(elapsed / 1000, 0.05);
      lastStamp = stamp - (elapsed % FRAME_MS);

      time += dt * speed;

      // Parallax easing
      targetParallax = ((rawMouseX / width) - 0.5) * 24;
      currentParallax += (targetParallax - currentParallax) * 0.05;

      // 1. Sky Background Gradient (Reused Cached Gradient)
      if (cachedSkyGrad) {
        ctx.fillStyle = cachedSkyGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Horizon Atmospheric Glow (Reused Cached Gradient)
      if (cachedGlowGrad) {
        ctx.fillStyle = cachedGlowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Batched Star Rendering (Single Path Draw Call for maximum throughput)
      ctx.fillStyle = `rgba(235, 225, 255, ${0.72 * opacity})`;
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = (s.x * width + currentParallax * 0.15) % width;
        const sy = s.y * height;
        ctx.moveTo(sx + s.size, sy);
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      }
      ctx.fill();

      // 4. Update & Render Shooting Stars (Meteors)
      nextMeteorTime -= dt;
      if (nextMeteorTime <= 0) {
        spawnMeteor();
        nextMeteorTime = 2.8 + rnd() * 3.5;
      }

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
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha * opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Render Layered Strata Cloud Waves (Optimized step spacing)
      const stepX = Math.max(16, Math.floor(width / 80));
      for (let li = 0; li < layers.length; li++) {
        const l = layers[li];
        const baseY = height * (1 - l.baseFraction);
        const parallaxOffset = currentParallax * l.parallaxMult;

        ctx.fillStyle = cachedLayerGrads[li] || '#150628';
        ctx.strokeStyle = l.crestColor;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width + stepX; x += stepX) {
          const px = x + parallaxOffset;
          const y =
            baseY +
            Math.sin(px * l.freq1 + time * l.speed1) * l.amplitude1 +
            Math.cos(px * l.freq2 + time * l.speed2) * l.amplitude2;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    };

    // Initial render
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
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
