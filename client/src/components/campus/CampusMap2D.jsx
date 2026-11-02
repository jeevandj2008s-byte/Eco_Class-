import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Users,
  Flame,
  Sun,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Info,
  Shield,
  Layers,
  Edit3,
  MapPin,
  Camera,
  BatteryCharging
} from 'lucide-react';
import { formatINR, formatKw, sounds } from '../../lib/utils.js';
import TraceMode from './TraceMode.jsx';
import defaultHotspots from '../../config/bit-hotspots.json';

export default function CampusMap2D({
  activeOverlay = 'HEATMAP',
  telemetry,
  onSelectBuilding
}) {
  const [hotspots, setHotspots] = useState(defaultHotspots.buildings || []);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const CANVAS_WIDTH = defaultHotspots.campus?.canvas?.width || 832;
  const CANVAS_HEIGHT = defaultHotspots.campus?.canvas?.height || 767;

  // Pan & Zoom Viewport Transform
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Admin Trace Mode State
  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceBuildingId, setTraceBuildingId] = useState(defaultHotspots.buildings[0]?.id || 'bit-main');

  // Handle Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setTransform((prev) => {
      const nextScale = Math.min(Math.max(prev.scale * zoomFactor, 0.5), 4.0);
      return { ...prev, scale: nextScale };
    });
  };

  // Mouse Drag to Pan
  const handleMouseDown = (e) => {
    if (isTraceMode) return;
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dynamic centering and fit-to-screen scale factor based on container size
  useEffect(() => {
    const handleFitScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth && clientHeight) {
        const scaleX = clientWidth / CANVAS_WIDTH;
        const scaleY = clientHeight / CANVAS_HEIGHT;
        const initialScale = Math.min(scaleX, scaleY, 1.2) * 0.92;
        setTransform({ scale: Math.max(initialScale, 0.4), x: 0, y: 0 });
      }
    };
    handleFitScale();
    window.addEventListener('resize', handleFitScale);
    return () => window.removeEventListener('resize', handleFitScale);
  }, [CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Reset View
  const handleResetView = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const scaleX = clientWidth / CANVAS_WIDTH;
      const scaleY = clientHeight / CANVAS_HEIGHT;
      const initialScale = Math.min(scaleX, scaleY, 1.2) * 0.92;
      setTransform({ scale: Math.max(initialScale, 0.4), x: 0, y: 0 });
    } else {
      setTransform({ scale: 1, x: 0, y: 0 });
    }
    sounds.playChime('bubble');
  };

  // Trace Mode Click Handler
  const handleImageClick = (e) => {
    if (!isTraceMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

    setHotspots((prev) =>
      prev.map((b) => {
        if (b.id === traceBuildingId) {
          const currentPts = b.percentagePolygon || [];
          return { ...b, percentagePolygon: [...currentPts, [xPct, yPct]] };
        }
        return b;
      })
    );
    sounds.playChime('bubble');
  };

  // Helper: Get Building Live Data from Telemetry
  const getBuildingTelemetry = (id) => {
    let fromTel = null;
    if (telemetry?.buildings) {
      if (Array.isArray(telemetry.buildings)) {
        fromTel = telemetry.buildings.find((b) => b.id === id || b.buildingId === id);
      } else if (typeof telemetry.buildings === 'object') {
        fromTel = telemetry.buildings[id] || Object.values(telemetry.buildings).find((b) => b?.id === id || b?.buildingId === id);
      }
    }
    const base = hotspots.find((b) => b.id === id);
    const realKw = fromTel?.realKw || base?.baselineKw || 40;
    const ghostKw = fromTel?.ghostKw || (base?.baselineKw ? base.baselineKw * 0.75 : 30);
    const wasteGapKw = Math.max(0, Number((realKw - ghostKw).toFixed(1)));
    const occupants = fromTel?.occupants ?? fromTel?.occupancy ?? 120;
    const hasAnomaly = (telemetry?.ghostAnomalies || []).some((a) => a.roomId?.startsWith(id) || id === 'bit-main');

    return {
      realKw,
      ghostKw,
      wasteGapKw,
      occupants,
      hasAnomaly,
      costRsPerHour: Math.round(realKw * 8.25),
      co2KgPerHour: Number((realKw * 0.71).toFixed(1))
    };
  };

  // Helper: Compute Overlay Style for Building Polygon
  const getPolygonStyle = (building) => {
    const data = getBuildingTelemetry(building.id);
    const isHovered = hoveredBuilding?.id === building.id;

    if (activeOverlay === 'HEATMAP') {
      const baseline = building.baselineKw || 40;
      const ratio = data.realKw / baseline;
      let fillColor = 'rgba(16, 185, 129, 0.5)'; // emerald (<50% baseline)
      let strokeColor = '#10b981';
      if (ratio > 1.0) {
        fillColor = 'rgba(244, 63, 94, 0.65)'; // red (>100% baseline)
        strokeColor = '#f43f5e';
      } else if (ratio > 0.8) {
        fillColor = 'rgba(249, 115, 22, 0.6)'; // orange (80-100% baseline)
        strokeColor = '#f97316';
      } else if (ratio >= 0.5) {
        fillColor = 'rgba(245, 158, 11, 0.55)'; // yellow (50-80% baseline)
        strokeColor = '#f59e0b';
      }
      return {
        fill: isHovered ? fillColor.replace(/[\d\.]+\)$/, '0.85)') : fillColor,
        stroke: strokeColor,
        strokeWidth: isHovered ? 3.5 : 2
      };
    }

    if (activeOverlay === 'SOLAR') {
      const hasSolar = (building.solarCapacityKw || 0) > 0;
      return {
        fill: hasSolar ? 'rgba(251, 191, 36, 0.55)' : 'rgba(30, 41, 59, 0.4)',
        stroke: hasSolar ? '#f59e0b' : '#64748b',
        strokeWidth: isHovered ? 3.5 : 1.5
      };
    }

    if (activeOverlay === 'OCCUPANCY') {
      const occ = data.occupants;
      const alpha = Math.min(0.8, Math.max(0.25, occ / 400));
      return {
        fill: `rgba(6, 182, 212, ${alpha})`,
        stroke: '#06b6d4',
        strokeWidth: isHovered ? 3.5 : 1.5
      };
    }

    // Default neutral blueprint styling
    return {
      fill: isHovered ? 'rgba(56, 189, 248, 0.5)' : 'rgba(56, 189, 248, 0.25)',
      stroke: '#38bdf8',
      strokeWidth: isHovered ? 3 : 2
    };
  };

  // Convert percentage polygon points to SVG path d string supporting holes
  const formatPolygonPath = (building) => {
    const pts = building.percentagePolygon;
    if (!pts || pts.length === 0) return '';
    let d = 'M ' + pts.map(([x, y]) => `${(x * CANVAS_WIDTH) / 100} ${(y * CANVAS_HEIGHT) / 100}`).join(' L ') + ' Z';
    if (building.holes && building.holes.length > 0) {
      building.holes.forEach((hole) => {
        if (hole && hole.length > 0) {
          d += ' M ' + hole.map(([x, y]) => `${(x * CANVAS_WIDTH) / 100} ${(y * CANVAS_HEIGHT) / 100}`).join(' L ') + ' Z';
        }
      });
    }
    return d;
  };

  // Calculate polygon centroid for overlay badge placement
  const getPolygonCentroid = (pts) => {
    if (!pts || pts.length === 0) return { x: 50, y: 50 };
    const sum = pts.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
    return {
      x: sum[0] / pts.length,
      y: sum[1] / pts.length
    };
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-full bg-[#0a0910] overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
    >
      {/* Zoom Controls & Admin Trace Mode Toggle */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2">
        <button
          onClick={() => setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale * 1.25, 4.0) }))}
          className="p-2.5 rounded-xl bg-white hover:bg-[#f0f3f8] text-[#0b3558] border border-[#d4e0ed] transition shadow-cal-sm"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#006bff]" />
        </button>
        <button
          onClick={() => setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.5) }))}
          className="p-2.5 rounded-xl bg-white hover:bg-[#f0f3f8] text-[#0b3558] border border-[#d4e0ed] transition shadow-cal-sm"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#006bff]" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2.5 rounded-xl bg-white hover:bg-[#f0f3f8] text-[#0b3558] border border-[#d4e0ed] transition shadow-cal-sm"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-[#476788]" />
        </button>
        <button
          onClick={() => {
            setIsTraceMode(!isTraceMode);
            sounds.playChime('chime');
          }}
          className={`p-2.5 rounded-xl border transition shadow-cal-sm ${
            isTraceMode
              ? 'bg-[#006bff] text-white border-[#006bff] shadow-cal-btn'
              : 'bg-white hover:bg-[#f0f3f8] text-[#476788] border-[#d4e0ed]'
          }`}
          title="Toggle Admin Trace Mode"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Admin Trace Mode Panel */}
      <TraceMode
        isActive={isTraceMode}
        onClose={() => setIsTraceMode(false)}
        buildings={hotspots}
        activeBuildingId={traceBuildingId}
        setActiveBuildingId={setTraceBuildingId}
      />

      {/* Interactive Map Transform Canvas */}
      <div
        className="relative origin-center transition-transform duration-75 ease-out rounded-2xl shadow-2xl overflow-hidden"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          margin: 'auto'
        }}
        onClick={handleImageClick}
      >
        {/* Base Layer: Original BIT Schematic Vector Graphic */}
        <img
          src="/bit-map.svg"
          alt="Bangalore Institute of Technology Campus Map"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        {/* SVG Polygon Overlay Layer with Courtyard Cutouts */}
        <svg
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          {hotspots.map((building) => {
            const style = getPolygonStyle(building);
            const data = getBuildingTelemetry(building.id);
            const pathD = formatPolygonPath(building);

            return (
              <g
                key={building.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                  setHoveredBuilding(building);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                  sounds.playChime('bubble');
                }}
                onMouseMove={(e) => {
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playChime('success');
                  if (onSelectBuilding) onSelectBuilding(building);
                }}
              >
                {/* Clickable Building Footprint Path with Courtyard Hole Support */}
                <path
                  d={pathD}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  fillRule="evenodd"
                  className="filter drop-shadow-md transition-all duration-200 hover:filter-none"
                />

                {/* Pulsating Red Ring on Ghost-Gap Anomaly */}
                {data.hasAnomaly && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth={4}
                    fillRule="evenodd"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML Badges & Icons Overlay Layer */}
        {hotspots.map((building) => {
          const centroid = getPolygonCentroid(building.percentagePolygon);
          const data = getBuildingTelemetry(building.id);

          return (
            <div
              key={`badge-${building.id}`}
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center select-none"
              style={{ left: `${centroid.x}%`, top: `${centroid.y}%` }}
            >
              {/* Building Label Tag */}
              <div className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1">
                <span>{building.shortName || building.name}</span>
                {building.assumedLocation && (
                  <span className="text-[9px] text-amber-400 font-mono">(Assumed)</span>
                )}
              </div>

              {/* Dynamic Overlay Badges */}
              <div className="flex items-center gap-1 mt-1">
                {activeOverlay === 'HEATMAP' && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    data.wasteGapKw > 10
                      ? 'bg-rose-500/80 text-white'
                      : data.wasteGapKw > 5
                      ? 'bg-amber-500/80 text-black'
                      : 'bg-emerald-500/80 text-black'
                  }`}>
                    {data.realKw} kW
                  </span>
                )}

                {activeOverlay === 'OCCUPANCY' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/80 text-black text-[10px] font-mono font-bold flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>{data.occupants}</span>
                  </span>
                )}

                {activeOverlay === 'SOLAR' && (building.solarCapacityKw || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/80 text-black text-[10px] font-mono font-bold flex items-center gap-1">
                    <Sun className="w-2.5 h-2.5" />
                    <span>{building.solarCapacityKw} kW</span>
                  </span>
                )}

                {/* Ghost Waste Warning Badge */}
                {data.wasteGapKw > 0 && activeOverlay === 'HEATMAP' && (
                  <span className="px-1 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[9px] font-mono animate-pulse">
                    +{data.wasteGapKw} kW waste
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Left Disclaimer Watermark */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none px-3.5 py-1.5 rounded-xl bg-[#131219]/90 border border-white/[0.14] text-[10px] text-[#b9b8bb] font-mono shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9ff0ec] animate-pulse" />
        <span>Schematic layout traced from public map data; not to scale.</span>
      </div>

      {/* Hover Tooltip (Campus Control Dark Glass System) */}
      {hoveredBuilding && (
        <div
          className="fixed z-40 pointer-events-none p-4 rounded-2xl bg-[#131219]/95 border border-white/[0.16] text-white shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl space-y-2 min-w-[250px]"
          style={{
            left: Math.min(tooltipPos.x + 15, window.innerWidth - 270),
            top: Math.min(tooltipPos.y + 15, window.innerHeight - 240)
          }}
        >
          <div>
            <div className="font-extrabold text-sm text-white tracking-tight">
              {hoveredBuilding.label || hoveredBuilding.name}
            </div>
            <div className="text-[10px] text-[#bdf7ee] font-mono uppercase tracking-wider mt-0.5">
              {hoveredBuilding.department} • {hoveredBuilding.floors || 1} Floors
            </div>
          </div>

          <div className="border-t border-white/[0.1] pt-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#b9b8bb] block">Real Power:</span>
              <span className="font-bold text-white">
                {getBuildingTelemetry(hoveredBuilding.id).realKw} kW
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#b9b8bb] block">Solar Power:</span>
              <span className="font-bold text-amber-400">
                {hoveredBuilding.solarCapacityKw ? `${hoveredBuilding.solarCapacityKw} kW` : 'None'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#b9b8bb] block">Ghost Gap:</span>
              <span className={`font-bold ${getBuildingTelemetry(hoveredBuilding.id).wasteGapKw > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {getBuildingTelemetry(hoveredBuilding.id).wasteGapKw} kW
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#b9b8bb] block">Hourly Cost:</span>
              <span className="font-bold text-[#9ff0ec]">
                ₹{getBuildingTelemetry(hoveredBuilding.id).costRsPerHour}/hr
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#b9b8bb] italic pt-1 border-t border-white/[0.08] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#9ff0ec]" />
            <span>Click building footprint to inspect circuits</span>
          </div>
        </div>
      )}
    </div>
  );
}
