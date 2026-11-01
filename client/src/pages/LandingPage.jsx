import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Layers,
  Sparkles,
  TrendingDown,
  Activity,
  ArrowRight,
  Compass,
  CheckCircle2,
  Camera,
  Sliders,
  LifeBuoy,
  Shield,
  Info
} from 'lucide-react';
import { formatINR, formatCo2 } from '../lib/utils.js';
import institutionData from '../config/institution.json';

export default function LandingPage() {
  const modules = [
    {
      to: '/dashboard',
      label: 'Command Center',
      tag: 'Live Telemetry',
      icon: Activity,
      color: 'bg-[#e6f0ff] text-[#006bff]',
      desc: 'Real-time 142 kW microgrid draw, solar generation, and ghost gap monitoring.'
    },
    {
      to: '/campus',
      label: 'BIT Digital Twin',
      tag: 'Campus Map',
      icon: Layers,
      color: 'bg-[#e6f0ff] text-[#006bff]',
      desc: 'Interactive 8-building twin with thermal heatmaps and device controls.'
    },
    {
      to: '/vision',
      label: 'Vision Lab',
      tag: 'Edge AI & Phone',
      icon: Camera,
      color: 'bg-purple-50 text-purple-700',
      desc: 'COCO-SSD occupancy inference with phone camera wireless pairing.'
    },
    {
      to: '/control',
      label: 'Automation & Control',
      tag: 'Zero Latency',
      icon: Sliders,
      color: 'bg-amber-50 text-amber-700',
      desc: 'Campus Eco switch, load shedding, and 60-second safety undo window.'
    },
    {
      to: '/simulate',
      label: 'What-If Simulator',
      tag: 'Zustand Engine',
      icon: TrendingDown,
      color: 'bg-blue-50 text-blue-700',
      desc: '1,000+ student agents timetable simulation, weather, and tariff models.'
    },
    {
      to: '/carbon',
      label: 'Carbon ESG Passport',
      tag: 'Green Audit',
      icon: Zap,
      color: 'bg-emerald-50 text-emerald-700',
      desc: 'Scope 2 emission tracker, green badges, and 1-click PDF ESG export.'
    },
    {
      to: '/coach',
      label: 'Aura AI Energy Coach',
      tag: 'Google Gemini',
      icon: Sparkles,
      color: 'bg-pink-50 text-pink-700',
      desc: 'Ground truth campus telemetry conversational AI with actionable fixes.'
    },
    {
      to: '/helpdesk',
      label: 'Incident Helpdesk',
      tag: 'Crowdsourced',
      icon: LifeBuoy,
      color: 'bg-yellow-50 text-yellow-700',
      desc: '3-tap waste reporting, SLA tracking, and technician dispatch kanban.'
    },
    {
      to: '/admin',
      label: 'Admin & HOD Console',
      tag: 'Access Governance',
      icon: Shield,
      color: 'bg-indigo-50 text-indigo-700',
      desc: 'Passkey PIN security, role simulation, and immutable audit logs.'
    },
    {
      to: '/about',
      label: 'About BIT & Team',
      tag: 'Institutional',
      icon: Info,
      color: 'bg-slate-100 text-slate-700',
      desc: 'Institutional vision, engineering roadmap, and white-label setup.'
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#f8f9fb]">
      {/* Decorative Blobs (Coral Magenta & Sky Cyan behind hero) */}
      <div className="blob-magenta top-12 left-1/4 -translate-x-1/2" />
      <div className="blob-cyan top-28 right-12" />

      {/* Hero Section */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 max-w-6xl mx-auto relative z-10">
        {/* Hackathon Badge */}
        <div className="badge-live-pulse inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6f0ff] border border-[#d4e0ed] text-[#004eba] text-xs font-semibold mb-6 shadow-cal-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#006bff]" />
          <span>BIT Hackathon 2026 • AI-Powered Campus Microgrid Digital Twin</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-[#0b3558] max-w-4xl">
          Sustainable Energy.
          <br />
          <span className="text-[#006bff] text-shimmer">
            Reimagined in Real-Time.
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-lg text-[#476788] max-w-2xl leading-relaxed">
          AuraSync creates a living digital twin of <span className="text-[#0b3558] font-semibold">{institutionData.institutionName}</span>.
          Uniting computer vision occupancy, synthetic IoT telemetry, and GenAI coaching to bust energy ghosts campus-wide.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="btn-pop btn-shine flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-sm shadow-cal-btn"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            to="/campus"
            className="btn-pop flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-[#f0f3f8] text-[#0b3558] font-semibold text-sm border border-[#d4e0ed] shadow-cal-sm"
          >
            <Layers className="w-4 h-4 text-[#006bff]" />
            <span>Explore BIT Campus Map</span>
          </Link>
          <Link
            to="/coach"
            className="btn-pop flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white hover:bg-[#f0f3f8] text-[#0b3558] font-semibold text-sm border border-[#d4e0ed] shadow-cal-sm"
          >
            <Sparkles className="w-4 h-4 text-[#006bff]" />
            <span>Ask Aura AI</span>
          </Link>
        </div>

        {/* Projected Campus Impact Counters */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-lift p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0b3558]">
              {formatINR(1250000)}
            </div>
            <div className="text-xs text-[#476788] mt-1 font-medium">Annual Projected Savings</div>
          </div>
          <div className="card-lift p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#006bff]">
              {formatCo2(94200)}
            </div>
            <div className="text-xs text-[#476788] mt-1 font-medium">CO₂ Avoided Yearly</div>
          </div>
          <div className="card-lift p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0b3558]">
              260 kWp
            </div>
            <div className="text-xs text-[#476788] mt-1 font-medium">Rooftop Solar Modeled</div>
          </div>
          <div className="card-lift p-5 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600">
              84 / 100
            </div>
            <div className="text-xs text-[#476788] mt-1 font-medium">Green Campus Score</div>
          </div>
        </div>
      </section>

      {/* Complete Module Launcher Grid: Direct 1-Click Access to All 10 Modules */}
      <section className="py-14 max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#004eba] uppercase tracking-widest">Interactive Modules</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b3558] mt-1">
            Explore All Campus Energy Twin Systems
          </h2>
          <p className="text-xs sm:text-sm text-[#476788] mt-2">
            Click any module below to open its dedicated view with live simulated telemetry and controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.to}
                to={m.to}
                className="card-lift p-5 rounded-2xl bg-white border border-[#d4e0ed] hover:border-[#006bff] shadow-cal-card hover:shadow-cal-card transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color} group-hover:scale-110 transition shadow-cal-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f0f3f8] text-[#476788] font-semibold border border-[#d4e0ed]">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0b3558] group-hover:text-[#006bff] transition">
                    {m.label}
                  </h3>
                  <p className="text-xs text-[#476788] mt-1.5 leading-relaxed line-clamp-2">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d4e0ed] flex items-center justify-between text-xs font-semibold text-[#006bff]">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Institution Tie-In & Statement Strip */}
      <section className="py-12 border-y border-[#d4e0ed] bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#004eba] uppercase tracking-widest">
              Bangalore Institute of Technology
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0b3558] mt-1">
              Fostering Sustainable Educational Ecosystems
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm">
              <CheckCircle2 className="w-5 h-5 text-[#006bff] mb-2" />
              <p className="text-xs text-[#0b3558] leading-relaxed font-medium">
                "{institutionData.statements[0]}"
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm">
              <CheckCircle2 className="w-5 h-5 text-[#006bff] mb-2" />
              <p className="text-xs text-[#0b3558] leading-relaxed font-medium">
                "{institutionData.statements[1]}"
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] shadow-cal-sm">
              <CheckCircle2 className="w-5 h-5 text-[#006bff] mb-2" />
              <p className="text-xs text-[#0b3558] leading-relaxed font-medium">
                "{institutionData.statements[3]}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 relative">
        <div className="blob-cyan -bottom-10 -left-10" />

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#004eba] uppercase tracking-widest">Core Innovations</span>
          <h2 className="text-3xl font-bold text-[#0b3558] mt-2">
            Engineered for Campus Net-Zero Goals
          </h2>
          <p className="text-sm text-[#476788] mt-2">
            Fully simulated with progressive hardware support for physical smart meters, relays, and IP cameras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <Link
            to="/campus"
            className="card-lift p-6 rounded-2xl bg-white border border-[#d4e0ed] hover:border-[#006bff] shadow-cal-card transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e6f0ff] text-[#006bff] flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-cal-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0b3558] group-hover:text-[#006bff] transition">Full-Scale BIT Campus Map</h4>
            <p className="text-xs text-[#476788] mt-2 leading-relaxed">
              Models BIT Main Block, Administration Block, Engineering Block A, Engineering Block B, Sports Court, Hostel, and EV Charging Hub.
            </p>
            <span className="text-xs text-[#006bff] font-bold mt-4 inline-flex items-center gap-1">
              Launch Campus Map <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/control"
            className="card-lift p-6 rounded-2xl bg-white border border-[#d4e0ed] hover:border-[#006bff] shadow-cal-card transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e6f0ff] text-[#006bff] flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-cal-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0b3558] group-hover:text-[#006bff] transition">Ghost Twin Technology</h4>
            <p className="text-xs text-[#476788] mt-2 leading-relaxed">
              Compares Real vs Ghost ideal consumption to isolate 8 deterministic energy ghosts: empty room ACs, continuous geysers, and idling projectors.
            </p>
            <span className="text-xs text-[#006bff] font-bold mt-4 inline-flex items-center gap-1">
              Open Control Center <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/coach"
            className="card-lift p-6 rounded-2xl bg-white border border-[#d4e0ed] hover:border-[#006bff] shadow-cal-card transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#e6f0ff] text-[#006bff] flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-cal-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0b3558] group-hover:text-[#006bff] transition">Aura AI Energy Coach</h4>
            <p className="text-xs text-[#476788] mt-2 leading-relaxed">
              Google Gemini-backed advisor with offline fallback generating ranked quantified advice in Indian Rupees (₹) and kg CO₂ across CFO, Eco, and Student personas.
            </p>
            <span className="text-xs text-[#006bff] font-bold mt-4 inline-flex items-center gap-1">
              Chat with Aura AI <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Credit Banner */}
      <section className="py-8 bg-white border-t border-[#d4e0ed] text-center px-4">
        <p className="text-xs text-[#476788] font-medium">
          Built with ❤️ by <span className="font-bold text-[#0b3558]">[YOUR TEAM NAME], BIT</span> • [BIT ADDRESS]
        </p>
      </section>
    </div>
  );
}
