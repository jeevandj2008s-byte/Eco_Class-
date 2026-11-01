/**
 * BIT AuraSync Motion Design System Utilities & Hooks
 * Centralized, modular, and 100% removable via master switch.
 */

import { useState, useEffect } from 'react';

export const MOTION_CONFIG = {
  // Master kill-switch to turn off all JS-driven motion
  ENABLED: true,

  // Token Durations (ms)
  DURATIONS: {
    instant: 120,
    fast: 200,
    base: 350,
    slow: 600,
    hero: 900
  },

  // Token Easings
  EASINGS: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    soft: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

/**
 * Tracks window scroll progress (0 to 100%)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!MOTION_CONFIG.ENABLED) return;

    let ticking = false;
    const updateScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

/**
 * Detects if the page has scrolled past a given pixel threshold (for sticky header elevation)
 */
export function useNavbarScroll(threshold = 20) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!MOTION_CONFIG.ENABLED) return;

    let ticking = false;
    const checkScroll = () => {
      setIsScrolled(window.scrollY > threshold);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    checkScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return isScrolled;
}

/**
 * Smooth count-up animation for numeric stats when entering view
 */
export function useCountUp(targetNumber, duration = 800) {
  const [current, setCurrent] = useState(targetNumber);

  useEffect(() => {
    if (!MOTION_CONFIG.ENABLED || typeof targetNumber !== 'number' || isNaN(targetNumber)) {
      setCurrent(targetNumber);
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(targetNumber);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(start + (targetNumber - start) * ease);
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [targetNumber, duration]);

  return current;
}
