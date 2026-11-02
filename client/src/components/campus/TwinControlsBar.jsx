import React, { useState } from 'react';
import {
  Eye,
  Layers,
  Users,
  Activity,
  Tag,
  UserPlus,
  Upload,
  Download,
  RotateCcw,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useTwin3DStore } from '../../store/useTwin3DStore.js';

export function TwinControlsBar() {
  const xrayMode = useTwin3DStore((s) => s.xrayMode);
  const setXrayMode = useTwin3DStore((s) => s.setXrayMode);
  const explodedHeight = useTwin3DStore((s) => s.explodedHeight);
  const setExplodedHeight = useTwin3DStore((s) => s.setExplodedHeight);
  const showStudents = useTwin3DStore((s) => s.showStudents);
  const setShowStudents = useTwin3DStore((s) => s.setShowStudents);
  const animateStudents = useTwin3DStore((s) => s.animateStudents);
  const setAnimateStudents = useTwin3DStore((s) => s.setAnimateStudents);
  const showLabels = useTwin3DStore((s) => s.showLabels);
  const setShowLabels = useTwin3DStore((s) => s.setShowLabels);

  const openAddModal = useTwin3DStore((s) => s.openAddModal);
  const openImportModal = useTwin3DStore((s) => s.openImportModal);
  const exportJson = useTwin3DStore((s) => s.exportJson);
  const resetToSeedData = useTwin3DStore((s) => s.resetToSeedData);

  const [isExplodePopoverOpen, setIsExplodePopoverOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-[#131219]/90 border border-white/[0.14] shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl select-none">
      {/* 1. X-Ray / Cutaway Toggle */}
      <button
        onClick={() => setXrayMode()}
        title="Toggle X-Ray Cutaway Mode"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          xrayMode
            ? 'bg-[#006bff] text-white shadow-[0_0_16px_rgba(0,107,255,0.6)]'
            : 'text-[#b9b8bb] hover:text-white hover:bg-white/5'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>X-Ray</span>
      </button>

      {/* 2. Exploded View Slider Button / Popover */}
      <div className="relative">
        <button
          onClick={() => setIsExplodePopoverOpen(!isExplodePopoverOpen)}
          title="Floor Explosion Slider"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            explodedHeight > 0
              ? 'bg-[#9ff0ec]/15 border border-[#9ff0ec]/30 text-[#9ff0ec]'
              : 'text-[#b9b8bb] hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Explode</span>
          {explodedHeight > 0 && <span className="font-mono text-[10px]">({explodedHeight.toFixed(1)}x)</span>}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {isExplodePopoverOpen && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 p-3.5 rounded-2xl bg-[#131219]/95 border border-white/[0.16] shadow-[0_16px_36px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in flex flex-col gap-2.5 z-30">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Exploded Floors</span>
              <span className="font-mono text-[11px] text-[#9ff0ec]">{explodedHeight.toFixed(1)}x</span>
            </div>

            <input
              type="range"
              min="0"
              max="4.0"
              step="0.2"
              value={explodedHeight}
              onChange={(e) => setExplodedHeight(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#9ff0ec]"
            />

            <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
              <button
                onClick={() => setExplodedHeight(0)}
                className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da] cursor-pointer"
              >
                Reset (0)
              </button>
              <button
                onClick={() => setExplodedHeight(1.5)}
                className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da] cursor-pointer"
              >
                Split (1.5x)
              </button>
              <button
                onClick={() => setExplodedHeight(3.0)}
                className="flex-1 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/10 text-[#c9c3da] cursor-pointer"
              >
                Max (3x)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-[1px] h-4 bg-white/10" />

      {/* 3. Students Layer Toggle */}
      <button
        onClick={() => setShowStudents()}
        title="Toggle Student Avatars"
        className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
          showStudents
            ? 'bg-white/10 text-[#9ff0ec]'
            : 'text-[#b9b8bb]/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
      </button>

      {/* 4. Idle Motion Toggle */}
      <button
        onClick={() => setAnimateStudents()}
        title="Toggle Student Idle Animations"
        className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
          animateStudents
            ? 'bg-white/10 text-emerald-400'
            : 'text-[#b9b8bb]/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Activity className="w-3.5 h-3.5" />
      </button>

      {/* 5. Labels Toggle */}
      <button
        onClick={() => setShowLabels()}
        title="Toggle 3D Floating Labels"
        className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
          showLabels
            ? 'bg-white/10 text-[#9ff0ec]'
            : 'text-[#b9b8bb]/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-white/10" />

      {/* 6. Add Student Action */}
      <button
        onClick={() => openAddModal()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006bff] hover:bg-[#0058d4] text-white text-xs font-semibold transition-all shadow-[0_2px_12px_rgba(0,107,255,0.4)] cursor-pointer"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Add Student</span>
      </button>

      {/* 7. Bulk Import Action */}
      <button
        onClick={() => openImportModal()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-[#c9c3da] hover:text-white text-xs font-semibold transition-all cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Import CSV</span>
      </button>

      {/* 8. Export JSON */}
      <button
        onClick={exportJson}
        title="Export Campus Digital Twin JSON"
        className="p-2 rounded-xl text-[#b9b8bb] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
      </button>

      {/* 9. Reset Demo */}
      <button
        onClick={resetToSeedData}
        title="Reset to Demo Rosters"
        className="p-2 rounded-xl text-[#b9b8bb] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

