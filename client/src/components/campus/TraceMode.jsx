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
    <div className="absolute top-20 right-6 z-30 w-80 bg-[#131219]/95 border border-white/[0.16] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] p-4 text-xs text-white backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between border-b border-white/[0.1] pb-2">
        <div className="flex items-center gap-1.5 font-bold text-[#9ff0ec]">
          <Edit3 className="w-4 h-4" />
          <span>Polygon Trace Mode (Admin)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/[0.1] text-[#b9b8bb] hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <p className="text-[11px] text-[#b9b8bb] leading-relaxed">
        Click on the BIT map to place polygon points (percentage coordinates). Click first point to close polygon.
      </p>

      {/* Building selector */}
      <div className="space-y-1">
        <label className="text-[10px] text-[#bdf7ee] uppercase font-mono font-semibold tracking-wider">Select Building</label>
        <select
          value={activeBuildingId}
          onChange={(e) => setActiveBuildingId(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.16] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#006bff] cursor-pointer"
        >
          {buildings.map((b) => (
            <option key={b.id} value={b.id} className="bg-[#131219] text-white">
              {b.shortName || b.name} ({b.percentagePolygon?.length || 0} pts)
            </option>
          ))}
        </select>
      </div>

      {currentBuilding && (
        <div className="space-y-1 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.1] font-mono text-[10px]">
          <div className="text-[#9ff0ec] font-bold">Points ({currentBuilding.percentagePolygon?.length || 0}):</div>
          <div className="max-h-24 overflow-y-auto text-[#b9b8bb]">
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
          className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.16] text-[#9ff0ec] font-semibold flex items-center justify-center gap-1 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied JSON!' : 'Copy Config'}</span>
        </button>

        {onSaveHotspots && (
          <button
            onClick={() => onSaveHotspots(buildings)}
            className="py-1.5 px-3 rounded-lg bg-[#006bff] text-white font-semibold hover:bg-[#005be0] transition shadow-[0_0_15px_rgba(0,107,255,0.4)]"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
