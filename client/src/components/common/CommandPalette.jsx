import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Zap,
  Layers,
  Camera,
  Sliders,
  TrendingDown,
  LifeBuoy,
  Sparkles,
  ShieldAlert,
  Building,
  Sun,
  Moon,
  HelpCircle,
  Shield,
  Palette,
  Monitor,
  Move,
  RotateCcw,
  CheckCircle2,
  CornerDownLeft,
  X
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore.js';
import { useThemeStore } from '../../store/useThemeStore.js';
import { useIslandStore } from '../../store/useIslandStore.js';
import { sounds } from '../../lib/utils.js';

export default function CommandPalette({ isOpen, onClose, onOpenMasterSwitch, onOpenReportModal }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const { setOverlay, selectBuilding } = useCampusStore();
  const { theme, setTheme, setDisplayScale } = useThemeStore();
  const { resetIsland } = useIslandStore();

  // Focus input automatically whenever palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = [
    // Navigation
    { id: 'c-dash', title: 'Open Command Dashboard', cat: 'Navigation', icon: Zap, action: () => { navigate('/dashboard'); onClose(); } },
    { id: 'c-twin', title: 'Open BIT Campus Map', cat: 'Navigation', icon: Layers, action: () => { navigate('/campus'); onClose(); } },
    { id: 'c-vision', title: 'Launch Computer Vision Lab & Phone Stream', cat: 'Navigation', icon: Camera, action: () => { navigate('/vision'); onClose(); } },
    { id: 'c-control', title: 'Open Control Center & Relays', cat: 'Navigation', icon: Sliders, action: () => { navigate('/control'); onClose(); } },
    { id: 'c-whatif', title: 'Open What-If Energy Simulator', cat: 'Navigation', icon: TrendingDown, action: () => { navigate('/simulate'); onClose(); } },
    { id: 'c-carbon', title: 'Open Carbon & ESG Center', cat: 'Navigation', icon: Zap, action: () => { navigate('/carbon'); onClose(); } },
    { id: 'c-helpdesk', title: 'Open Campus Helpdesk & Incident Board', cat: 'Navigation', icon: LifeBuoy, action: () => { navigate('/helpdesk'); onClose(); } },
    { id: 'c-coach', title: 'Ask Aura AI Gemini Energy Coach', cat: 'Navigation', icon: Sparkles, action: () => { navigate('/coach'); onClose(); } },
    { id: 'c-admin', title: 'Open Admin & HOD Governance Console', cat: 'Navigation', icon: Shield, action: () => { navigate('/admin'); onClose(); } },
    { id: 'c-settings', title: 'Open System Settings & Display Sizing', cat: 'Navigation', icon: Sliders, action: () => { navigate('/settings'); onClose(); } },

    // HOD & Emergency Actions
    { id: 'c-master', title: 'Trigger Campus Eco Master Switch', cat: 'HOD Actions', icon: Sliders, action: () => { onOpenMasterSwitch(); onClose(); } },
    { id: 'c-report', title: 'Report an Energy Waste / Maintenance Issue', cat: 'Actions', icon: LifeBuoy, action: () => { onOpenReportModal(); onClose(); } },
    { id: 'c-gap', title: 'Toggle Live Power Heatmap Overlay', cat: 'Campus Overlays', icon: Layers, action: () => { setOverlay('HEATMAP'); navigate('/campus'); onClose(); } },
    { id: 'c-solar', title: 'Toggle Rooftop Solar Generation Overlay', cat: 'Campus Overlays', icon: Sun, action: () => { setOverlay('SOLAR'); navigate('/campus'); onClose(); } },
    { id: 'c-occ', title: 'Toggle Occupancy Flow Overlay', cat: 'Campus Overlays', icon: Zap, action: () => { setOverlay('OCCUPANCY'); navigate('/campus'); onClose(); } },

    // System Utilities
    { id: 'c-island', title: 'Reset Dynamic Island Position', cat: 'Interface', icon: Move, action: () => { resetIsland(); onClose(); } },
    { id: 'c-help', title: 'Open Keyboard Shortcuts Cheat-Sheet', cat: 'Interface', icon: HelpCircle, action: () => { setShowCheatSheet(true); } }
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.cat.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside list
  useEffect(() => {
    if (!isOpen && !showCheatSheet) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showCheatSheet) setShowCheatSheet(false);
        else onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          sounds.playChime('bubble');
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showCheatSheet, filtered, selectedIndex, onClose]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen && !showCheatSheet) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[99999999] flex items-start justify-center pt-20 p-4 bg-[#0b3558]/40 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card overflow-hidden flex flex-col">
        {showCheatSheet ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#d4e0ed] pb-3">
              <h3 className="text-base font-bold text-[#0b3558] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#006bff]" />
                Keyboard Shortcuts Cheat-Sheet
              </h3>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-1 rounded-lg text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Command Palette</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#006bff] font-mono">Ctrl/Cmd + K</kbd>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Navigate List</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#006bff] font-mono">↑ / ↓</kbd>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Execute Command</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#006bff] font-mono">Enter ↵</kbd>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Close Window</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#476788] font-mono">Esc</kbd>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Move Dynamic Island</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#006bff] font-mono">M key</kbd>
              </div>
              <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex justify-between">
                <span className="text-[#0b3558] font-medium">Sim Debug Drawer</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#d4e0ed] text-[#006bff] font-mono">Ctrl+Shift+D</kbd>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 p-4 border-b border-[#d4e0ed] bg-white">
              <Search className="w-5 h-5 text-[#006bff] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command, page, theme, building or action..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#0b3558] placeholder-[#a6bbd1] font-medium"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono text-[#476788] px-1.5 py-0.5 rounded bg-[#f0f3f8] border border-[#d4e0ed]">
                  ↑↓ Navigate
                </span>
                <span className="text-[10px] font-mono text-[#006bff] px-1.5 py-0.5 rounded bg-[#e6f0ff] border border-[#d4e0ed] font-bold">
                  ↵ Select
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div ref={listRef} className="max-h-84 overflow-y-auto p-2 space-y-1 bg-white">
              {filtered.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playChime('bubble');
                      item.action();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                      isSelected
                        ? 'bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] shadow-cal-sm'
                        : 'hover:bg-[#f8f9fb] border border-transparent text-[#0b3558]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg transition shrink-0 ${
                        isSelected
                          ? 'bg-[#006bff] text-white shadow-cal-btn'
                          : 'bg-[#f0f3f8] text-[#476788]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`font-semibold truncate ${isSelected ? 'text-[#006bff]' : 'text-[#0b3558]'}`}>
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-mono text-[#004eba] uppercase px-2 py-0.5 rounded-full bg-[#e6f0ff] border border-[#d4e0ed]">
                        {item.cat}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#006bff]" />
                      )}
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-10 text-xs text-[#476788] space-y-1">
                  <div>No matching commands found for "{query}".</div>
                  <div className="text-[10px] text-[#a6bbd1]">Try searching for "admin", "theme", "twin", or "vision".</div>
                </div>
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="p-3 px-4 bg-[#f8f9fb] border-t border-[#d4e0ed] flex items-center justify-between text-[11px] text-[#476788] font-mono">
              <span>BIT AuraSync Quick Navigator</span>
              <button
                onClick={() => setShowCheatSheet(true)}
                className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Shortcuts (?)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
