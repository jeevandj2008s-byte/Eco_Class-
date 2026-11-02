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

    // High performance rAF loop for both lead dot and smooth follower ring
    const renderLoop = () => {
      if (isVisible) {
        // Fast direct transform for lead dot
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.75 : 1})`;

        // Snappy physics follower (0.6 lerp eliminates rubber-band input latency feel)
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;
        ringX += dx * 0.6;
        ringY += dy * 0.6;

        const scale = isHovering ? 1.35 : isClicking ? 0.85 : 1;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;

        // Settle quickly and sleep
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

      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }

      // Throttled check for hover on clickable elements (every 80ms)
      const now = performance.now();
      const target = e.target;
      if (target !== lastTarget && (now - lastHoverCheck > 80)) {
        lastTarget = target;
        lastHoverCheck = now;
        if (target && typeof target.closest === 'function') {
          const clickable = target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer');
          if (clickable && !isHovering) {
            isHovering = true;
            ring.style.borderColor = '#9ff0ec';
            ring.style.backgroundColor = 'rgba(159, 240, 236, 0.12)';
          } else if (!clickable && isHovering) {
            isHovering = false;
            ring.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            ring.style.backgroundColor = 'transparent';
          }
        }
      }
    };

    const onMouseDown = (e) => {
      isClicking = true;
      if (!animId) animId = requestAnimationFrame(renderLoop);

      // Trigger transient expanding ripple
      if (ripple) {
        if (rippleTimeoutId) clearTimeout(rippleTimeoutId);

        ripple.style.transition = 'none';
        ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(0.3)`;
        ripple.style.opacity = '0.9';
        ripple.style.display = 'block';

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
      if (!animId) animId = requestAnimationFrame(renderLoop);
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
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (rippleTimeoutId) clearTimeout(rippleTimeoutId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Precision Lead Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#9ff0ec] pointer-events-none z-[99999] opacity-0 shadow-[0_0_8px_#9ff0ec] will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Trailing Physics Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-white/25 pointer-events-none z-[99998] opacity-0 will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'opacity 0.2s ease, border-color 0.15s ease, background-color 0.15s ease'
        }}
      />

      {/* Anime Transient Click Ripple */}
      <div
        ref={rippleRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#9ff0ec] pointer-events-none z-[99997] hidden will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(0.3)'
        }}
      />
    </>
  );
}
