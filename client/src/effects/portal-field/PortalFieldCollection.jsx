import React, { Suspense, lazy } from 'react';
import './styles.css';

// Lazy-loaded variant sources so inactive renderers and loops are never allocated
const CloudFieldRenderer = lazy(() => import('./renderers/CloudFieldRenderer.jsx'));
const FlowFieldRenderer = lazy(() => import('./renderers/FlowFieldRenderer.jsx'));
const PortalFieldRenderer = lazy(() => import('./renderers/PortalFieldRenderer.jsx'));
const BellFieldRenderer = lazy(() => import('./renderers/BellFieldRenderer.jsx'));
const StreamConvergenceRenderer = lazy(() => import('./renderers/StreamConvergenceRenderer.jsx'));

/**
 * PortalFieldCollection
 * Public entrypoint for the ambient field collection.
 * Variants: "cloud-field" (default / Cloud Field), "flow-field", "portal-field", "bell-field", "stream-convergence"
 */
export function PortalFieldCollection({
  variant = 'cloud-field',
  speed = 1.0,
  density = 1.0,
  opacity = 1.0,
  palette,
  className = ''
}) {
  const renderField = () => {
    const props = { speed, density, opacity, palette };
    switch (variant) {
      case 'cloud-field':
      case 'strata-cloud':
        return <CloudFieldRenderer {...props} />;
      case 'flow-field':
        return <FlowFieldRenderer {...props} />;
      case 'portal-field':
        return <PortalFieldRenderer {...props} />;
      case 'bell-field':
        return <BellFieldRenderer {...props} />;
      case 'stream-convergence':
        return <StreamConvergenceRenderer {...props} />;
      default:
        return <CloudFieldRenderer {...props} />;
    }
  };

  return (
    <div className={`portal-field-container ${className}`}>
      <Suspense fallback={null}>
        {renderField()}
      </Suspense>
    </div>
  );
}

export default PortalFieldCollection;

