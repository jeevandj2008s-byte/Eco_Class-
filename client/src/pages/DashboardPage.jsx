import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Activity,
  Layers,
  Sparkles,
  LifeBuoy,
  TrendingDown,
  Sun,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  Compass,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  UserCheck,
  Mail,
  Building2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import CampusMap2D from '../components/campus/CampusMap2D.jsx';
import { useCampusStore } from '../store/useCampusStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useIslandStore } from '../store/useIslandStore.js';
import { formatINR, formatKw, formatNumberIN, sounds } from '../lib/utils.js';
import campusConfig from '../config/campus.json';

export default function DashboardPage({ onOpenMasterSwitch, onOpenReportModal }) {
  const { telemetry, activeOverlay } = useCampusStore();
  const { user } = useAuthStore();
  const { pushEvent } = useIslandStore();

  const historyData = [
    { dayLabel: '18 Oct', realKwh: 3420, ghostKwh: 2650 },
    { dayLabel: '19 Oct', realKwh: 3510, ghostKwh: 2700 },
    { dayLabel: '20 Oct', realKwh: 3680, ghostKwh: 2800 },
    { dayLabel: '21 Oct', realKwh: 3200, ghostKwh: 2500 },
    { dayLabel: '22 Oct', realKwh: 3890, ghostKwh: 2950 },
    { dayLabel: '23 Oct', realKwh: 3740, ghostKwh: 2850 },
    { dayLabel: '24 Oct', realKwh: 3100, ghostKwh: 2400 },
    { dayLabel: '25 Oct', realKwh: 3350, ghostKwh: 2550 },
    { dayLabel: '26 Oct', realKwh: 3600, ghostKwh: 2750 },
    { dayLabel: '27 Oct', realKwh: 3950, ghostKwh: 2900 },
    { dayLabel: '28 Oct', realKwh: 4050, ghostKwh: 3100 },
    { dayLabel: '29 Oct', realKwh: 3820, ghostKwh: 2880 },
    { dayLabel: '30 Oct', realKwh: 3650, ghostKwh: 2780 },
    { dayLabel: '31 Oct', realKwh: 3480, ghostKwh: 2690 }
  ];

  const campus = telemetry?.campus || {
    totalRealKw: 142.5,
    totalGhostKw: 108.2,
    ghostGapKw: 34.3,
    solarGenerationKw: 78.4,
    carbonIntensityKgPerHr: 53.8,
    currentCostRsPerHr: 625.3,
    demandUtilizationPct: 20.5
  };

  const population = telemetry?.population || {
    studentsPresent: 650,
    totalCampusOccupancy: 885
  };

  const anomalies = telemetry?.ghostAnomalies || [];
  const savings = telemetry?.savingsTracker || { savedTodayRs: 4850, savedTodayKwh: 588, savedTodayCo2Kg: 417 };

  const handleBustGhost = async (anomaly) => {
    try {
      await fetch('/api/control/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: anomaly.deviceId, state: 'off' })
      });
      pushEvent({
        type: 'AUTO_CONTROL',
        title: 'Ghost Load Busted!',
        message: `Turned off ${anomaly.title}. Saved ${anomaly.wasteRsPerHour} Rs/hr.`,
        severity: 'info'
      });
      sounds.playChime('success');
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 text-[#0b3558]">
      {/* Top Header / Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#bdf7ee]">
              Live Microgrid Twin Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.15] mt-1">
            BIT Energy Command Center
          </h1>
          <p className="text-xs text-[#b9b8bb] mt-1 font-normal">
            K.R Road, V.V puram ,Bangalore-50 • Powered by Eco_Class, BIT
          </p>
        </div>

        {/* Quick Master Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenMasterSwitch}
            className="btn-pop btn-shine px-4 py-2.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Campus Eco Switch</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="btn-pop px-4 py-2.5 rounded-lg bg-white hover:bg-[#f0f3f8] text-[#0b3558] font-semibold text-xs border border-[#d4e0ed] shadow-cal-sm flex items-center gap-1.5"
          >
            <LifeBuoy className="w-4 h-4 text-rose-500" />
            <span>Report Waste</span>
          </button>
          <Link
            to="/coach"
            className="btn-pop px-4 py-2.5 rounded-lg bg-[#0b3558] hover:bg-[#08253e] text-white font-semibold text-xs shadow-cal-btn flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask Aura AI</span>
          </Link>
        </div>
      </div>

      {/* Active Session Credentials Status Card */}
      <div className="p-3.5 rounded-xl bg-white border border-[#d4e0ed] shadow-cal-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#006bff] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-cal-sm">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AU'}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0b3558] text-xs">{user?.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#e6f0ff] text-[#004eba] text-[10px] font-mono font-bold uppercase border border-[#d4e0ed]">
                {user?.role || 'HOD'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#476788] font-mono truncate">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-white/50" /> {user?.email}</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-white/50" /> {user?.department}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
          <span className="text-[#004eba] flex items-center gap-1.5 bg-[#e6f0ff] px-2.5 py-1 rounded-full border border-[#d4e0ed]">
            <span className="w-2 h-2 rounded-full bg-[#006bff] animate-pulse" />
            <span>Active Session Verified</span>
          </span>
        </div>
      </div>

      {/* KPI Telemetry Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Real Draw */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
          <div className="text-[11px] font-medium text-[#476788] flex items-center justify-between">
            <span>Real Draw</span>
            <Activity className="w-3.5 h-3.5 text-[#006bff]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#0b3558] mt-1.5">
            {formatKw(campus.totalRealKw)}
          </div>
          <div className="text-[10px] text-[#a6bbd1] mt-1">Grid + Solar Combined</div>
        </div>

        {/* Ghost Ideal */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
          <div className="text-[11px] font-medium text-[#476788] flex items-center justify-between">
            <span>Ghost Ideal</span>
            <Compass className="w-3.5 h-3.5 text-[#004eba]" />
          </div>
          <div className="text-xl font-mono font-bold text-[#004eba] mt-1.5">
            {formatKw(campus.totalGhostKw)}
          </div>
          <div className="text-[10px] text-[#a6bbd1] mt-1">Occupancy Baseline</div>
        </div>

        {/* Waste Gap */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-rose-200 shadow-cal-card">
          <div className="text-[11px] font-medium text-rose-600 flex items-center justify-between">
            <span>Waste Gap</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-mono font-bold text-rose-600 mt-1.5">
            {formatKw(campus.ghostGapKw)}
          </div>
          <div className="text-[10px] text-rose-600/80 mt-1 font-mono font-medium">
            {formatINR(Math.round(campus.ghostGapKw * 8.25))}/h loss
          </div>
        </div>

        {/* Rooftop Solar */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-amber-200 shadow-cal-card">
          <div className="text-[11px] font-medium text-amber-700 flex items-center justify-between">
            <span>Rooftop Solar</span>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-mono font-bold text-amber-700 mt-1.5">
            {formatKw(campus.solarGenerationKw)}
          </div>
          <div className="text-[10px] text-amber-600/80 mt-1">3 Campus Arrays</div>
        </div>

        {/* Hourly Cost */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
          <div className="text-[11px] font-medium text-[#476788] flex items-center justify-between">
            <span>Current Cost</span>
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-700 mt-1.5">
            {formatINR(campus.currentCostRsPerHr)}/h
          </div>
          <div className="text-[10px] text-[#a6bbd1] mt-1">BESCOM HT-2 Tariff</div>
        </div>

        {/* Carbon Intensity */}
        <div className="card-lift p-4 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card">
          <div className="text-[11px] font-medium text-[#476788] flex items-center justify-between">
            <span>Carbon Rate</span>
            <Flame className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-mono font-bold text-purple-700 mt-1.5">
            {campus.carbonIntensityKgPerHr} <span className="text-xs font-normal">kg/h</span>
          </div>
          <div className="text-[10px] text-[#a6bbd1] mt-1">0.71 kg CO₂e/kWh</div>
        </div>
      </div>

      {/* Main Split Grid: Interactive Campus Twin (Left) & Real vs Ghost Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Campus Twin Interactive View */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#006bff]" />
              <h3 className="text-sm font-bold text-[#0b3558]">
                BIT Campus Map
              </h3>
            </div>

            <Link
              to="/campus"
              className="text-xs text-[#006bff] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Full Screen Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[430px] w-full rounded-2xl overflow-hidden bg-white border border-[#d4e0ed] shadow-cal-card relative">
            <CampusMap2D activeOverlay={activeOverlay} />
          </div>
        </div>

        {/* Right: Real vs Ghost Telemetry Chart & Ghosts List */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Real vs Ghost 14-Day Recharts Curve */}
          <div className="p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#0b3558]">Real vs Ideal Ghost Twin</h3>
                <p className="text-[10px] text-[#476788]">14-Day Microgrid Telemetry (kWh)</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#006bff]">
                  <span className="w-2 h-2 rounded-full bg-[#006bff]" /> Real
                </span>
                <span className="flex items-center gap-1 text-[#9ff0ec]">
                  <span className="w-2 h-2 rounded-full bg-[#9ff0ec]" /> Ideal Ghost
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006bff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#006bff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGhost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ff0ec" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#9ff0ec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="dayLabel" stroke="#b9b8bb" fontSize={9} tickLine={false} />
                  <YAxis stroke="#b9b8bb" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131219', borderColor: 'rgba(255, 255, 255, 0.16)', color: '#ffffff', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)' }}
                    formatter={(val) => [`${formatNumberIN(val)} kWh`]}
                  />
                  <Area type="monotone" dataKey="realKwh" stroke="#006bff" strokeWidth={2} fillOpacity={1} fill="url(#colorReal)" />
                  <Area type="monotone" dataKey="ghostKwh" stroke="#9ff0ec" strokeWidth={2} fillOpacity={1} fill="url(#colorGhost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Energy Ghosts Detected */}
          <div className="p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Active Energy Ghosts ({anomalies.length})
              </h3>
              <span className="text-[10px] text-[#b9b8bb]">Automated CV & Telemetry</span>
            </div>

            <div className="space-y-2">
              {anomalies.slice(0, 2).map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-rose-600 truncate">{anomaly.title}</h4>
                    <p className="text-[10px] text-[#476788] font-mono">
                      Wasting: {anomaly.wasteWatts}W • {formatINR(anomaly.wasteRsPerHour)}/h
                    </p>
                  </div>
                  <button
                    onClick={() => handleBustGhost(anomaly)}
                    className="btn-pop px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-cal-btn shrink-0"
                  >
                    Bust Ghost
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buildings Telemetry Cards Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#006bff]" />
            Campus Blocks Breakdown
          </h3>
          <span className="text-xs text-[#b9b8bb]">Total Sanctioned: 750 kVA BESCOM HT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {campusConfig.campus.buildings.slice(0, 4).map((b) => {
            const bData = telemetry?.buildings?.[b.id] || { realKw: 32, gapKw: 4, occupancy: 120 };
            return (
              <div
                key={b.id}
                className="card-lift p-4 rounded-2xl bg-white border border-[#d4e0ed] hover:border-[#006bff] shadow-cal-card transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b3558] truncate max-w-[150px]">{b.shortCode || b.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    bData.gapKw > 10 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {bData.gapKw > 10 ? 'Waste Alert' : 'Normal'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed]">
                    <div className="text-[10px] text-[#476788] font-sans">Power Draw</div>
                    <div className="font-bold text-[#0b3558] mt-0.5">{bData.realKw} kW</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f8f9fb] border border-[#d4e0ed]">
                    <div className="text-[10px] text-[#476788] font-sans">Occupancy</div>
                    <div className="font-bold text-[#006bff] mt-0.5">{bData.occupancy} people</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
