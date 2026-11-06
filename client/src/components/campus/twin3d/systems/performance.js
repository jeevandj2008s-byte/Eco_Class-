/**
 * Performance System: Quality Profiles & Device Capability Detection
 */

export const QUALITY_PROFILES = {
  HIGH: {
    shadowMapSize: 2048,
    maxPixelRatio: 2,
    antialias: true,
    animatedSway: true,
    animatedTraffic: true
  },
  MEDIUM: {
    shadowMapSize: 1024,
    maxPixelRatio: 1.5,
    antialias: true,
    animatedSway: true,
    animatedTraffic: true
  },
  LOW: {
    shadowMapSize: 512,
    maxPixelRatio: 1,
    antialias: false,
    animatedSway: false,
    animatedTraffic: false
  }
};

/**
 * Detects device hardware tier (Mobile vs Desktop, GPU performance heuristic)
 */
export function detectDeviceProfile() {
  if (typeof window === 'undefined') return QUALITY_PROFILES.HIGH;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (isMobile || memory < 4 || cores < 4) {
    return QUALITY_PROFILES.MEDIUM;
  }

  return QUALITY_PROFILES.HIGH;
}

export default detectDeviceProfile;
