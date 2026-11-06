/**
 * performance.js — Quality profiles & device capability detection
 */
export function getPerformanceSettings() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const memory = navigator.deviceMemory || 4;

  return {
    isMobile,
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    shadowMapSize: isMobile || memory < 4 ? 1024 : 2048,
    antialias: !isMobile
  };
}

export default getPerformanceSettings;

