import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Layers,
  Sparkles,
  TrendingDown,
  Activity,
  ArrowRight,
  ArrowLeft,
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
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const modules = [
    {
      to: '/dashboard',
      label: 'Command Center',
      tag: 'Live Telemetry',
      stat: '169%',
      statSub: 'return on energy investment',
      statColor: 'text-[#0b3558]',
      borderColor: 'border-[#d4e0ed] hover:border-[#0b3558]',
      blobColor: 'text-[#0b3558]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Activity,
      iconColor: 'text-[#0b3558]',
      desc: 'Real-time 142 kW microgrid draw, solar generation, and ghost gap monitoring.'
    },
    {
      to: '/campus',
      label: 'BIT Digital Twin',
      tag: 'Campus Map',
      stat: '160%',
      statSub: 'increase in spatial monitoring',
      statColor: 'text-[#006bff]',
      borderColor: 'border-[#b8d5ff] hover:border-[#006bff]',
      blobColor: 'text-[#006bff]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Layers,
      iconColor: 'text-[#006bff]',
      desc: 'Interactive 8-building twin with thermal heatmaps and device controls.'
    },
    {
      to: '/vision',
      label: 'Vision Lab',
      tag: 'Edge AI & Phone',
      stat: '20%',
      statSub: 'decrease in wasted kWh',
      statColor: 'text-[#ea580c]',
      borderColor: 'border-amber-200 hover:border-amber-400',
      blobColor: 'text-[#ea580c]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Camera,
      iconColor: 'text-amber-600',
      desc: 'COCO-SSD occupancy inference with phone camera wireless pairing.'
    },
    {
      to: '/control',
      label: 'Automation & Control',
      tag: 'Zero Latency',
      stat: '8 d',
      statSub: 'reduction in anomaly response',
      statColor: 'text-[#c026d3]',
      borderColor: 'border-fuchsia-200 hover:border-fuchsia-400',
      blobColor: 'text-[#c026d3]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Sliders,
      iconColor: 'text-fuchsia-600',
      desc: 'Campus Eco switch, load shedding, and 60-second safety undo window.'
    },
    {
      to: '/simulate',
      label: 'What-If Simulator',
      tag: 'Zustand Engine',
      stat: '1,000+',
      statSub: 'student agents modeled',
      statColor: 'text-[#006bff]',
      borderColor: 'border-blue-200 hover:border-[#006bff]',
      blobColor: 'text-[#006bff]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: TrendingDown,
      iconColor: 'text-[#006bff]',
      desc: '1,000+ student agents timetable simulation, weather, and tariff models.'
    },
    {
      to: '/carbon',
      label: 'Carbon ESG Passport',
      tag: 'Green Audit',
      stat: 'Scope 2',
      statSub: 'automated emissions tracking',
      statColor: 'text-[#10b981]',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      blobColor: 'text-[#10b981]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Zap,
      iconColor: 'text-emerald-600',
      desc: 'Scope 2 emission tracker, green badges, and 1-click PDF ESG export.'
    },
    {
      to: '/coach',
      label: 'Aura AI Energy Coach',
      tag: 'Google Gemini',
      stat: 'Gemini AI',
      statSub: 'ground truth telemetry advice',
      statColor: 'text-[#7c3aed]',
      borderColor: 'border-purple-200 hover:border-purple-400',
      blobColor: 'text-[#7c3aed]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Sparkles,
      iconColor: 'text-purple-600',
      desc: 'Ground truth campus telemetry conversational AI with actionable fixes.'
    },
    {
      to: '/helpdesk',
      label: 'Incident Helpdesk',
      tag: 'Crowdsourced',
      stat: '3-Tap',
      statSub: 'technician dispatch SLA',
      statColor: 'text-[#ea580c]',
      borderColor: 'border-amber-200 hover:border-amber-400',
      blobColor: 'text-[#ea580c]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: LifeBuoy,
      iconColor: 'text-amber-600',
      desc: '3-tap waste reporting, SLA tracking, and technician dispatch.'
    },
    {
      to: '/admin',
      label: 'Admin & HOD Console',
      tag: 'Access Governance',
      stat: '100%',
      statSub: 'governance audit integrity',
      statColor: 'text-[#0b3558]',
      borderColor: 'border-slate-200 hover:border-[#0b3558]',
      blobColor: 'text-[#0b3558]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Shield,
      iconColor: 'text-[#0b3558]',
      desc: 'Passkey PIN security, role simulation, and immutable audit logs.'
    },
    {
      to: '/about',
      label: 'About BIT & Team',
      tag: 'Institutional',
      stat: 'BIT 2026',
      statSub: 'sustainable educational campus',
      statColor: 'text-[#0d9488]',
      borderColor: 'border-teal-200 hover:border-teal-400',
      blobColor: 'text-[#0d9488]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Info,
      iconColor: 'text-teal-600',
      desc: 'Institutional vision, engineering roadmap, and white-label setup.'
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#f8f9fb] text-[#0b3558]">
      {/* Decorative Blobs (Coral Magenta & Sky Cyan behind hero) */}
      <div className="blob-magenta top-8 left-1/4 -translate-x-1/2 opacity-60 pointer-events-none" />
      <div className="blob-cyan top-20 right-10 opacity-50 pointer-events-none" />

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
          <span className="text-[#006bff]">
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

      {/* Complete Module Launcher Carousel: Direct 1-Click Access to All 10 Modules (Exact Image 1 Style) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title on Left and Carousel Controls on Right (Exact Image 1 Header) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0b3558] tracking-tight leading-[1.15]">
              Discover how campus operates<br />
              <span className="text-[#006bff]">with BIT Energy Twin</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#476788] flex items-center gap-1.5 font-medium">
              <span>Click any module below to open its dedicated view with live simulated telemetry and controls</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#006bff]" />
            </p>
          </div>

          {/* Carousel Arrows (Left & Right Buttons from Image 1) */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => scrollCarousel('left')}
              aria-label="Previous modules"
              className="w-10 h-10 rounded-full border border-[#d4e0ed] bg-white hover:bg-[#f0f3f8] flex items-center justify-center text-[#0b3558] shadow-cal-sm transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              aria-label="Next modules"
              className="w-10 h-10 rounded-full border border-[#d4e0ed] bg-white hover:bg-[#f0f3f8] flex items-center justify-center text-[#0b3558] shadow-cal-sm transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-8 px-1 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.to}
                to={m.to}
                className={`w-[290px] sm:w-[320px] shrink-0 snap-start min-h-[420px] rounded-[28px] bg-white border ${m.borderColor} shadow-cal-card hover:shadow-cal-card p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group`}
              >
                {/* Top: Brand Logo / Module Identifier */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-5 h-5 ${m.iconColor}`} />
                      <span className="font-extrabold text-sm tracking-tight text-[#0b3558] uppercase">
                        {m.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#f0f3f8] text-[#476788] border border-[#d4e0ed]">
                      {m.tag}
                    </span>
                  </div>

                  {/* Middle: Big bold metric number & description */}
                  <div className="mt-8 mb-6">
                    <div className={`text-5xl font-black tracking-tight ${m.statColor}`}>
                      {m.stat}
                    </div>
                    {m.statSub && (
                      <p className="mt-1 text-xs font-semibold text-[#0b3558]">
                        {m.statSub}
                      </p>
                    )}
                    <p className="mt-3 text-xs sm:text-sm text-[#476788] leading-relaxed font-normal">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom: The signature organic blob button from Image 1 */}
                <div className="relative inline-flex items-center mt-auto self-start">
                  <svg
                    viewBox="0 0 150 60"
                    className={`w-[136px] h-[52px] ${m.blobColor} transition-transform duration-300 group-hover:scale-105`}
                    fill="currentColor"
                  >
                    <path d={m.blobPath} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-start pl-5 text-xs font-bold text-white gap-2 pointer-events-none tracking-tight">
                    <span>Read now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
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
