import React, { useState } from 'react';
import { Edit3, Check, Copy, Trash2, Plus, RotateCcw } from 'lucide-react';
import { sounds } from '../../lib/utils.js';

export default function TraceMode({
  isActive,
  onClose,
  buildings,
  activeBuildingId,
  setActiveBuildingId,
  onSaveHotspots
}) {
  const [copied, setCopied] = useState(false);

  if (!isActive) return null;
  const currentBuilding = buildings.find((b) => b.id === activeBuildingId);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(buildings, null, 2));
    setCopied(true);
    sounds.playChime('bubble');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-20 right-6 z-30 w-80 bg-white/95 border border-[#d4e0ed] rounded-2xl shadow-cal-card p-4 text-xs text-[#0b3558] backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between border-b border-[#d4e0ed] pb-2">
        <div className="flex items-center gap-1.5 font-bold text-[#006bff]">
          <Edit3 className="w-4 h-4" />
          <span>Polygon Trace Mode (Admin)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#f0f3f8] text-[#476788] hover:text-[#0b3558]"
        >
          ✕
        </button>
      </div>

      <p className="text-[11px] text-[#476788] leading-relaxed">
        Click on the BIT map to place polygon points (percentage coordinates). Click first point to close polygon.
      </p>

      {/* Building selector */}
      <div className="space-y-1">
        <label className="text-[10px] text-[#476788] uppercase font-mono font-semibold">Select Building</label>
        <select
          value={activeBuildingId}
          onChange={(e) => setActiveBuildingId(e.target.value)}
          className="w-full bg-[#f8f9fb] border border-[#d4e0ed] rounded-xl px-2.5 py-1.5 text-xs text-[#0b3558] focus:outline-none focus:border-[#006bff] cursor-pointer"
        >
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.shortName || b.name} ({b.percentagePolygon?.length || 0} pts)
            </option>
          ))}
        </select>
      </div>

      {currentBuilding && (
        <div className="space-y-1 bg-[#f8f9fb] p-2.5 rounded-xl border border-[#d4e0ed] font-mono text-[10px]">
          <div className="text-[#006bff] font-bold">Points ({currentBuilding.percentagePolygon?.length || 0}):</div>
          <div className="max-h-24 overflow-y-auto text-[#476788]">
            {currentBuilding.percentagePolygon?.map(([x, y], idx) => (
              <div key={idx}>
                {idx + 1}: [{x}%, {y}%]
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleCopyJson}
          className="flex-1 py-1.5 px-3 rounded-lg bg-[#e6f0ff] hover:bg-[#d8e8ff] border border-[#b8d5ff] text-[#006bff] font-semibold flex items-center justify-center gap-1 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON!' : 'Copy Config'}</span>
        </button>

        {onSaveHotspots && (
          <button
            onClick={() => onSaveHotspots(buildings)}
            className="py-1.5 px-3 rounded-lg bg-[#006bff] text-white font-semibold hover:bg-[#005be0] transition shadow-cal-btn"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
