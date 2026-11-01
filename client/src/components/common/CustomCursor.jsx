import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    // Only run on desktop/devices with a fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let animId = null;
    let rippleTimeoutId = null;
    let lastHoverCheck = 0;
    let lastTarget = null;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const ripple = rippleRef.current;

    if (!dot || !ring || !ripple) return;

    // Smooth physics lerp loop for the trailing ring (stops when at rest to preserve 100% CPU/GPU)
    const renderLoop = () => {
      if (isVisible) {
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;
        ringX += dx * 0.28;
        ringY += dy * 0.28;

        const scale = isHovering ? 1.35 : isClicking ? 0.85 : 1;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;

        // If ring is still catching up, keep looping; otherwise sleep
        if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
          animId = requestAnimationFrame(renderLoop);
        } else {
          animId = null;
        }
      } else {
        animId = null;
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }

      // Direct zero-lag DOM transform for lead dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.75 : 1})`;

      // Wake up ring lerp loop if sleeping
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }

      // Throttled check for hover on clickable elements to prevent main thread lockup
      const now = performance.now();
      const target = e.target;
      if (target !== lastTarget && (now - lastHoverCheck > 60)) {
        lastTarget = target;
        lastHoverCheck = now;
        if (target && typeof target.closest === 'function') {
          const clickable = target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer');
          if (clickable && !isHovering) {
            isHovering = true;
            ring.style.borderColor = '#6f5adc';
            ring.style.backgroundColor = 'rgba(111, 90, 220, 0.15)';
            ring.style.boxShadow = '0 0 16px rgba(111, 90, 220, 0.4)';
          } else if (!clickable && isHovering) {
            isHovering = false;
            ring.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            ring.style.backgroundColor = 'transparent';
            ring.style.boxShadow = 'none';
          }
        }
      }
    };

    const onMouseDown = (e) => {
      isClicking = true;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.65)`;

      // Trigger transient expanding ripple animation that NEVER gets stuck
      if (ripple) {
        if (rippleTimeoutId) clearTimeout(rippleTimeoutId);

        ripple.style.transition = 'none';
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(0.3)`;
        ripple.style.opacity = '0.9';
        ripple.style.display = 'block';

        // Force browser reflow to apply instant reset before animation
        void ripple.offsetWidth;

        ripple.style.transition = 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms ease-out';
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(2.4)`;
        ripple.style.opacity = '0';

        rippleTimeoutId = setTimeout(() => {
          if (ripple) {
            ripple.style.display = 'none';
          }
        }, 330);
      }
    };

    const onMouseUp = () => {
      isClicking = false;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      if (!animId) animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animId) cancelAnimationFrame(animId);
      if (rippleTimeoutId) clearTimeout(rippleTimeoutId);
    };
  }, []);

  return (
    <>
      {/* 1. Precise Lead Dot: follows mouse instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999999] w-2 h-2 rounded-full bg-[#006bff] shadow-[0_0_8px_rgba(0,107,255,0.5)] opacity-0 transition-opacity duration-150 hidden md:block will-change-transform"
      />

      {/* 2. Smooth Fluid Trailing Ring: lerps seamlessly without lag */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999998] w-8 h-8 rounded-full border border-[#006bff]/50 opacity-0 transition-[border-color,background-color,box-shadow] duration-150 hidden md:block will-change-transform"
      />

      {/* 3. Click Ripple: Only blooms on click, never gets stuck */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[999997] w-8 h-8 rounded-full border-2 border-[#006bff] bg-[#006bff]/20 hidden"
      />
    </>
  );
}
