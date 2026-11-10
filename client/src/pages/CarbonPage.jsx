import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Leaf,
  Sun,
  Award,
  Download,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatINR, formatCo2, formatNumberIN, sounds } from '../lib/utils.js';
import institutionData from '../config/institution.json';

export default function CarbonPage() {
  const [carbonData, setCarbonData] = useState(null);
  const [passport, setPassport] = useState(null);
  const [pledgeInput, setPledgeInput] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    fetch('/api/carbon/summary')
      .then(res => res.json())
      .then(json => { if (json.success) setCarbonData(json.data); })
      .catch(() => {});

    fetch('/api/carbon/passport')
      .then(res => res.json())
      .then(json => { if (json.success) setPassport(json.data); })
      .catch(() => {});
  }, []);

  const [pledgeFeedback, setPledgeFeedback] = useState(null);

  const handlePledge = async (e) => {
    e.preventDefault();
    if (!pledgeInput) return;
    setPledgeFeedback(null);
    try {
      const res = await fetch('/api/carbon/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pledgeText: pledgeInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sounds.playChime('success');
        setPledgeFeedback({ type: 'success', message: data.message });
        setPledgeInput('');
        // Refresh passport to show updated points and pledge
        fetch('/api/carbon/passport')
          .then(r => r.json())
          .then(json => { if (json.success) setPassport(json.data); })
          .catch(() => {});
      } else {
        sounds.playChime('alert');
        setPledgeFeedback({
          type: 'error',
          message: data.error || 'Pledge rejected: Please enter a genuine sustainability action for BIT.'
        });
      }
    } catch (err) {
      setPledgeFeedback({ type: 'error', message: 'Network error submitting pledge. Please retry.' });
    }
  };

  // Generate Green Audit PDF Report with jsPDF
  const generateEsgPdf = () => {
    setIsGeneratingPdf(true);
    sounds.playChime('bubble');

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Header Title
        doc.setFontSize(18);
        doc.setTextColor(11, 53, 88); // Ink Navy
        doc.text("BIT CAMPUS SUSTAINABILITY & ESG REPORT", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(71, 103, 136); // Slate Gray
        doc.text("Bangalore Institute of Technology, Bengaluru", 14, 27);
        doc.text("Developed by Eco_Class, BIT • October 2026", 14, 33);

        doc.setLineWidth(0.5);
        doc.setDrawColor(212, 224, 237); // Hairline
        doc.line(14, 37, 196, 37);

        // Summary Highlights
        doc.setFontSize(12);
        doc.setTextColor(11, 53, 88);
        doc.text("1. Executive Summary & KPIs", 14, 46);

        doc.autoTable({
          startY: 50,
          head: [['Metric', 'Value', 'Benchmark Notes']],
          body: [
            ['Total Monthly Emissions', '84,210 kg CO2e', 'Within target allocation'],
            ['Avoided via Solar & Optimization', '18,450 kg CO2e', '21.9% reduction'],
            ['Total Cost Savings', 'Rs 1,52,210', 'Calculated at BESCOM HT Rs 8.25/kWh'],
            ['Green Campus Score', '84 / 100', 'Top 5% among technical campuses in Karnataka'],
            ['Grid Baseline Factor', '0.71 kg CO2e/kWh', 'CEA National Grid Standard']
          ],
          theme: 'striped',
          headStyles: { fillColor: [0, 107, 255] }
        });

        // Scope 1, 2, 3 Breakdown Table
        doc.setFontSize(12);
        doc.setTextColor(11, 53, 88);
        doc.text("2. Greenhouse Gas Protocol Accounting (Scope 1, 2 & 3)", 14, doc.lastAutoTable.finalY + 12);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 16,
          head: [['Scope Category', 'Emissions (kg CO2e)', 'Share (%)', 'Key Primary Sources']],
          body: [
            ['Scope 1 (Direct)', '9,400 kg', '11.2%', 'Diesel DG Backup Sets, Mess Canteen LPG'],
            ['Scope 2 (Indirect Grid)', '58,600 kg', '69.6%', 'BESCOM 11kV Grid Electricity Imports'],
            ['Scope 3 (Other Indirect)', '16,210 kg', '19.2%', 'Student Bus Commute, Municipal Water, Waste']
          ],
          theme: 'grid',
          headStyles: { fillColor: [11, 53, 88] }
        });

        // Disclaimer Note
        doc.setFontSize(9);
        doc.setTextColor(166, 187, 209);
        doc.text(
          "Notice: Internal Sustainability Audit Template. Tariff & emission assumptions based on BESCOM schedules.",
          14,
          doc.lastAutoTable.finalY + 15
        );

        doc.save("BIT_AuraSync_ESG_Sustainability_Report_2026.pdf");
        setIsGeneratingPdf(false);
        sounds.playChime('success');
      } catch (err) {
        setIsGeneratingPdf(false);
        alert('Failed to generate PDF: ' + err.message);
      }
    }, 600);
  };

  const scope = carbonData?.scopeBreakdown;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#9ff0ec]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#9ff0ec]">
              Campus ESG & Carbon Accounting Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
            Scope 1, 2, 3 Emissions & Net-Zero 2030 Pathway
          </h1>
          <p className="text-xs text-[#b9b8bb] mt-1">
            Aligned with GHG Protocol • Realtime BESCOM Grid Factor 0.71 kg CO₂e/kWh
          </p>
        </div>

        {/* PDF Export Button */}
        <button
          onClick={generateEsgPdf}
          disabled={isGeneratingPdf}
          className="btn-pop btn-shine px-5 py-3 rounded-lg bg-gradient-to-r from-[#4d19b1] to-[#6f5adc] hover:from-[#581dc7] hover:to-[#7d68e8] text-white font-semibold text-xs shadow-[0_0_20px_rgba(111,90,220,0.45)] border border-white/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#9ff0ec]" />
          <span>{isGeneratingPdf ? 'Compiling PDF Report...' : 'Download Green Audit PDF'}</span>
        </button>
      </div>

      {/* Scope 1, Scope 2, Scope 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Scope 1 */}
        <div className="card-lift p-5 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">Scope 1 (Direct)</span>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {scope?.scope1?.pct || 11.2}%
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-[#0b3558]">
            {formatCo2(scope?.scope1?.totalKg || 9400)}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[#d4e0ed] text-xs text-[#476788]">
            {scope?.scope1?.sources.map((s, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="text-[#476788] truncate max-w-[160px]">{s.name}</span>
                <span className="font-mono text-[#0b3558] font-semibold">{s.kg} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scope 2 */}
        <div className="card-lift p-5 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">Scope 2 (Grid Electricity)</span>
            <span className="text-xs font-mono font-bold text-[#006bff] bg-[#e6f0ff] px-2 py-0.5 rounded-full border border-[#b8d5ff]">
              {scope?.scope2?.pct || 69.6}%
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-[#0b3558]">
            {formatCo2(scope?.scope2?.totalKg || 58600)}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[#d4e0ed] text-xs text-[#476788]">
            {scope?.scope2?.sources.map((s, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="text-[#476788] truncate max-w-[160px]">{s.name}</span>
                <span className="font-mono text-[#006bff] font-semibold">{s.kg} kg</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scope 3 */}
        <div className="card-lift p-5 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">Scope 3 (Commute & Waste)</span>
            <span className="text-xs font-mono font-bold text-[#004eba] bg-[#f0f3f8] px-2 py-0.5 rounded-full border border-[#d4e0ed]">
              {scope?.scope3?.pct || 19.2}%
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-[#0b3558]">
            {formatCo2(scope?.scope3?.totalKg || 16210)}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[#d4e0ed] text-xs text-[#476788]">
            {scope?.scope3?.sources.map((s, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="text-[#476788] truncate max-w-[160px]">{s.name}</span>
                <span className="font-mono text-[#0b3558] font-semibold">{s.kg} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carbon-Aware Hourly Scheduling Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0b3558] flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Carbon-Aware Load Shifting Schedule
            </h3>
            <p className="text-xs text-[#476788] mt-0.5">
              Shift flexible loads (EV Charging Hub, STP pumps, hostel geysers) to green solar hours
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            ☀️ Cleanest Window: 11:00 - 14:30 IST
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {carbonData?.carbonAwareHourSchedule?.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition ${
                item.status === 'cleanest'
                  ? 'bg-[#e6f0ff] border-[#006bff]/40 text-[#0b3558] shadow-cal-sm'
                  : 'bg-[#f8f9fb] border-[#d4e0ed] text-[#476788]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#0b3558]">
                <span>{item.hour}</span>
                <span className="font-mono text-[#006bff]">{item.intensityKgKwh} kg/kWh</span>
              </div>
              <p className="text-[11px] text-[#476788] mt-2">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Carbon Passport & Pledge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0b3558] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#006bff]" />
              Your Personal Carbon Passport
            </h3>
            <span className="text-xs font-mono font-bold text-[#006bff] bg-[#e6f0ff] px-2.5 py-1 rounded-xl border border-[#b8d5ff]">
              {passport?.ecoScorePoints || 420} Eco Points
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed]">
              <div className="text-[10px] text-[#476788] font-sans font-medium">Monthly Footprint</div>
              <div className="text-sm font-bold text-[#006bff] mt-0.5">{passport?.monthlyFootprintKg || 18.4} kg CO₂e</div>
              <div className="text-[9px] text-[#476788] font-sans mt-0.5">Campus Avg: 24.8 kg</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed]">
              <div className="text-[10px] text-[#476788] font-sans font-medium">Green Streak</div>
              <div className="text-sm font-bold text-amber-600 mt-0.5">{passport?.streakDays || 19} Days Active</div>
              <div className="text-[9px] text-[#476788] font-sans mt-0.5">Top 10% in AIML Dept</div>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-[#0b3558]">Earned Badges</div>
            <div className="flex flex-wrap gap-2">
              {passport?.badges?.map((b) => (
                <div key={b.id} className="p-2.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] text-xs flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-[#0b3558] text-[11px]">{b.name}</div>
                    <div className="text-[9px] text-[#476788]">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Eco Pledge */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0b3558] flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#006bff]" />
              Take an Eco Pledge for BIT
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e6f0ff] text-[#006bff] border border-[#b8d5ff] font-semibold">
              Verified Eco AI (+25 Pts)
            </span>
          </div>

          <p className="text-xs text-[#476788]">
            Submit a verified energy-saving action (e.g., turning off empty classroom AC, taking stairs, unplugging idle chargers) to earn Green Points. Non-environmental or random inputs will be rejected.
          </p>

          {/* Quick Verified Eco Pledges */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#476788]">Quick Verified Commitments:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Switched off classroom lights and fans when leaving Lab 204',
                'Took the stairs instead of the elevator to 3rd floor',
                'Reported dripping washroom tap for water conservation',
                'Unplugged laptop charger from socket after 100% full charge'
              ].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => {
                    setPledgeInput(quick);
                    setPledgeFeedback(null);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#f8f9fb] hover:bg-[#e6f0ff] border border-[#d4e0ed] hover:border-[#006bff]/30 text-[11px] text-[#476788] hover:text-[#006bff] text-left transition"
                >
                  <span className="flex items-center gap-1.5"><Leaf className="w-3 h-3 text-emerald-400 shrink-0" /> <span>{quick}</span></span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Banner */}
          {pledgeFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-150 ${
                pledgeFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <span className="text-sm">{pledgeFeedback.type === 'success' ? '✅' : '❌'}</span>
              <span className="leading-relaxed font-medium">{pledgeFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePledge} className="space-y-3">
            <input
              type="text"
              required
              placeholder="e.g. Switched off Classroom 103 lights and fans after lab session"
              value={pledgeInput}
              onChange={(e) => {
                setPledgeInput(e.target.value);
                if (pledgeFeedback) setPledgeFeedback(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] text-xs text-[#0b3558] placeholder-[#a6bbd1] focus:outline-none focus:border-[#006bff] focus:bg-white transition"
            />
            <button
              type="submit"
              className="btn-pop btn-shine w-full py-2.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn"
            >
              Commit Eco Pledge (+25 Points)
            </button>
          </form>

          <div className="text-[11px] text-[#476788] italic pt-1">
            "{institutionData.statements[2]}"
          </div>
        </div>
      </div>
    </div>
  );
}
