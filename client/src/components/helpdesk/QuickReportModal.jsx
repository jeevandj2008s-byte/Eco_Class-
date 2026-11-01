import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  Zap,
  Trash2,
  Camera,
  CheckCircle2,
  Building,
  Upload,
  ArrowRight
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useIslandStore } from '../../store/useIslandStore.js';
import { sounds } from '../../lib/utils.js';
import confetti from 'canvas-confetti';

const CATEGORIES = [
  { id: 'lighting', label: 'Lighting', icon: Zap, color: 'text-amber-500' },
  { id: 'hvac', label: 'AC / HVAC', icon: Flame, color: 'text-rose-500' },
  { id: 'waste', label: 'Waste Bin', icon: Trash2, color: 'text-emerald-500' },
  { id: 'safety', label: 'Electrical Hazard', icon: AlertTriangle, color: 'text-cyan-500' }
];

export default function QuickReportModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('lighting');
  const [buildingId, setBuildingId] = useState('bit-main');
  const [urgency, setUrgency] = useState('normal');
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const { pushEvent } = useIslandStore();

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          buildingId,
          urgency,
          photoUrl: imagePreview,
          reporterEmail: user?.email || 'student@aurasync.demo'
        })
      });

      sounds.playChime('success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });

      pushEvent({
        type: urgency === 'emergency' ? 'SECURITY' : 'ACHIEVEMENT',
        title: 'Report Submitted Successfully',
        message: `${title} logged in Helpdesk with SLA timer active.`,
        severity: urgency === 'emergency' ? 'critical' : 'info'
      });

      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-[#0b3558]/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[#d4e0ed] p-6 shadow-cal-card relative overflow-hidden text-[#0b3558]">
        {/* Blue Highlight Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#006bff]" />

        <div className="flex items-center justify-between pb-3 border-b border-[#d4e0ed]">
          <div>
            <h3 className="text-base font-bold text-[#0b3558]">3-Tap Campus Quick Report</h3>
            <p className="text-xs text-[#476788]">BIT Smart Helpdesk • Resolving issues in minutes</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#f0f3f8] hover:bg-[#e5ebf3] text-[#476788] hover:text-[#0b3558] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Step 1: Category Tiles */}
          <div>
            <label className="text-[11px] font-bold text-[#476788] uppercase tracking-wider block mb-2">
              1. Tap Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 text-center transition border ${
                      isSelected
                        ? 'bg-[#e6f0ff] border-[#006bff] text-[#006bff] shadow-cal-sm font-bold'
                        : 'bg-[#f8f9fb] border-[#d4e0ed] text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                    <span className="text-[10px] font-semibold truncate w-full">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Issue Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#476788] uppercase tracking-wider block mb-1">
                Campus Location
              </label>
              <select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] focus:outline-none focus:border-[#006bff] focus:bg-white"
              >
                <option value="bit-main">BIT Main Block</option>
                <option value="admin-block">Administration Block</option>
                <option value="bit-mech-civil">Engineering Block A</option>
                <option value="engg-block-b">Engineering Block B</option>
                <option value="hostel">Hostel</option>
                <option value="sports-court">Sports Court</option>
                <option value="ev-hub">EV Charging Hub</option>
                <option value="green-belt">Green Belt</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#476788] uppercase tracking-wider block mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] focus:outline-none focus:border-[#006bff] focus:bg-white"
              >
                <option value="low">Low (Within 48h)</option>
                <option value="normal">Normal (Within 24h)</option>
                <option value="high">High (Within 4h)</option>
                <option value="emergency">🚨 EMERGENCY (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#476788] uppercase tracking-wider block mb-1">
              Issue Summary
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Overflowing dry-waste bin near canteen courtyard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] placeholder-[#a6bbd1] focus:outline-none focus:border-[#006bff] focus:bg-white"
            />
          </div>

          {/* Photo Proof Upload / Camera */}
          <div>
            <label className="text-[11px] font-bold text-[#476788] uppercase tracking-wider block mb-1">
              Photo Evidence (Camera or Gallery)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f3f8] hover:bg-[#e5ebf3] border border-[#d4e0ed] text-xs text-[#0b3558] transition shadow-cal-sm">
                <Camera className="w-4 h-4 text-[#006bff]" />
                <span>Snap / Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#006bff]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 text-[8px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title}
              className="w-full py-2.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-bold text-xs shadow-cal-btn transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Dispatching to HOD & Cloud...' : 'Submit Campus Report (Under 20s)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
