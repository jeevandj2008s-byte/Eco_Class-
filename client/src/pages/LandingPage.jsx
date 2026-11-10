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
  ShieldCheck,
  Info,
  MapPin
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
      stat: '142 kW',
      statColor: 'text-white',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Activity,
      iconColor: 'text-[#9ff0ec]',
      color: 'bg-white/[0.04] text-[#9ff0ec]',
      desc: 'Real-time 142 kW microgrid draw, solar generation, and ghost gap monitoring.'
    },
    {
      to: '/campus',
      label: 'BIT Digital Twin',
      tag: 'Campus Map',
      stat: '8 Blocks',
      statColor: 'text-[#9ff0ec]',
      borderColor: 'border-white/[0.12] hover:border-[#9ff0ec]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Layers,
      iconColor: 'text-[#9ff0ec]',
      color: 'bg-white/[0.04] text-[#9ff0ec]',
      desc: 'Interactive 8-building twin with thermal heatmaps and device controls.'
    },
    {
      to: '/vision',
      label: 'Vision Lab',
      tag: 'Edge AI & Phone',
      stat: 'Edge AI',
      statColor: 'text-[#bdf7ee]',
      borderColor: 'border-white/[0.12] hover:border-[#bdf7ee]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Camera,
      iconColor: 'text-[#bdf7ee]',
      color: 'bg-white/[0.04] text-[#bdf7ee]',
      desc: 'COCO-SSD occupancy inference with phone camera wireless pairing.'
    },
    {
      to: '/control',
      label: 'Automation & Control',
      tag: 'Zero Latency',
      stat: '0 Latency',
      statColor: 'text-[#6f5adc]',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Sliders,
      iconColor: 'text-[#6f5adc]',
      color: 'bg-white/[0.04] text-[#6f5adc]',
      desc: 'Campus Eco switch, load shedding, and 60-second safety undo window.'
    },
    {
      to: '/simulate',
      label: 'What-If Simulator',
      tag: 'Zustand Engine',
      stat: '1,000+',
      statColor: 'text-[#9ff0ec]',
      borderColor: 'border-white/[0.12] hover:border-[#9ff0ec]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: TrendingDown,
      iconColor: 'text-[#9ff0ec]',
      color: 'bg-white/[0.04] text-[#9ff0ec]',
      desc: '1,000+ student agents timetable simulation, weather, and tariff models.'
    },
    {
      to: '/carbon',
      label: 'Carbon ESG Passport',
      tag: 'Green Audit',
      stat: 'Scope 2',
      statColor: 'text-emerald-400',
      borderColor: 'border-white/[0.12] hover:border-emerald-400/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Zap,
      iconColor: 'text-emerald-400',
      color: 'bg-white/[0.04] text-emerald-400',
      desc: 'Scope 2 emission tracker, green badges, and 1-click PDF ESG export.'
    },
    {
      to: '/coach',
      label: 'Aura AI Energy Coach',
      tag: 'Google Gemini',
      stat: 'Gemini AI',
      statColor: 'text-[#bdf7ee]',
      borderColor: 'border-white/[0.12] hover:border-[#bdf7ee]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Sparkles,
      iconColor: 'text-[#bdf7ee]',
      color: 'bg-white/[0.04] text-[#bdf7ee]',
      desc: 'Ground truth campus telemetry conversational AI with actionable fixes.'
    },
    {
      to: '/helpdesk',
      label: 'Incident Helpdesk',
      tag: 'Crowdsourced',
      stat: '3-Tap',
      statColor: 'text-amber-400',
      borderColor: 'border-white/[0.12] hover:border-amber-400/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: LifeBuoy,
      iconColor: 'text-amber-400',
      color: 'bg-white/[0.04] text-amber-400',
      desc: '3-tap waste reporting, SLA tracking, and technician dispatch kanban.'
    },
    {
      to: '/admin',
      label: 'Admin & HOD Console',
      tag: 'Access Governance',
      stat: 'Passkey',
      statColor: 'text-[#6f5adc]',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Shield,
      iconColor: 'text-[#6f5adc]',
      color: 'bg-white/[0.04] text-[#6f5adc]',
      desc: 'Passkey PIN security, role simulation, and immutable audit logs.'
    },
    {
      to: '/about',
      label: 'About BIT & Team',
      tag: 'Institutional',
      stat: 'BIT 2026',
      statColor: 'text-white',
      borderColor: 'border-white/[0.12] hover:border-white/40',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Info,
      iconColor: 'text-[#b9b8bb]',
      color: 'bg-white/[0.04] text-white',
      desc: 'Institutional vision, engineering roadmap, and white-label setup.'
    }
  ];

    const institutionCards = [
    {
      to: '/campus',
      label: 'Campus Anchor',
      tag: 'V.V. Puram',
      stat: '560004',
      statColor: 'text-white',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: MapPin,
      iconColor: 'text-[#9ff0ec]',
      desc: `"${institutionData.statements[0]}"`
    },
    {
      to: '/dashboard',
      label: 'Energy Telemetry',
      tag: 'Real-Time IoT',
      stat: '142 kW',
      statColor: 'text-[#9ff0ec]',
      borderColor: 'border-white/[0.12] hover:border-[#9ff0ec]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Activity,
      iconColor: 'text-[#9ff0ec]',
      desc: `"${institutionData.statements[1]}"`
    },
    {
      to: '/carbon',
      label: 'Scope 2 Mitigation',
      tag: 'Net-Zero 2030',
      stat: '260 kWp',
      statColor: 'text-[#bdf7ee]',
      borderColor: 'border-white/[0.12] hover:border-[#bdf7ee]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: CheckCircle2,
      iconColor: 'text-[#bdf7ee]',
      desc: `"${institutionData.statements[3]}"`
    }
  ];

  const innovationCards = [
    {
      to: '/campus',
      label: 'Campus Map',
      tag: '8 Buildings',
      stat: '8 Blocks',
      statColor: 'text-[#9ff0ec]',
      borderColor: 'border-white/[0.12] hover:border-[#9ff0ec]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: Layers,
      iconColor: 'text-[#9ff0ec]',
      desc: 'Models BIT Main Block, Administration Block, Engineering Block A, Engineering Block B, Sports Court, Hostel, and EV Charging Hub.'
    },
    {
      to: '/control',
      label: 'Ghost Twin',
      tag: 'Zero Latency',
      stat: '0 Latency',
      statColor: 'text-[#6f5adc]',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Compass,
      iconColor: 'text-[#6f5adc]',
      desc: 'Compares Real vs Ghost ideal consumption to isolate 8 deterministic energy ghosts: empty room ACs, continuous geysers, and idling projectors.'
    },
    {
      to: '/coach',
      label: 'Aura AI Coach',
      tag: 'Google Gemini',
      stat: 'Gemini AI',
      statColor: 'text-[#bdf7ee]',
      borderColor: 'border-white/[0.12] hover:border-[#bdf7ee]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Sparkles,
      iconColor: 'text-[#bdf7ee]',
      desc: 'Google Gemini-backed advisor with offline fallback generating ranked quantified advice in Indian Rupees (₹) and kg CO₂ across CFO, Eco, and Student personas.'
    }
  ];

return (
    <div className="relative w-full overflow-hidden bg-transparent text-white">
      {/* Decorative Ambient Glow Orbs */}
      <div className="blob-magenta top-8 left-1/4 -translate-x-1/2 opacity-70" />
      <div className="blob-cyan top-20 right-10 opacity-60" />

      {/* Hero Section: 2-Column Landscape Strata Infrastructure Layout */}
      <section className="min-h-[85vh] lg:min-h-[880px] flex items-center px-4 sm:px-6 lg:px-12 pt-10 pb-16 max-w-[1720px] mx-auto relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Subline, CTAs & Stats */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Hackathon Status Pill */}
            <div className="badge-live-pulse inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.16] text-[#bdf7ee] text-xs font-semibold mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#9ff0ec]" />
              <span>BIT Hackathon 2026 • AI-Powered Campus Microgrid Digital Twin</span>
            </div>

            {/* 3-Line Headline fading from white to soft grey */}
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-display font-extrabold tracking-tight leading-[1.08] text-white max-w-2xl">
              <span className="block text-white">Sustainable Energy.</span>
              <span className="block text-white">Reimagined in</span>
              <span className="block text-[#9ff0ec]">Real-Time.</span>
            </h1>

            {/* Subline in light grey */}
            <p className="mt-6 text-sm sm:text-base lg:text-lg text-[#d3d3d7] max-w-xl leading-relaxed font-normal">
              AuraSync creates a living digital twin of <span className="text-white font-semibold">{institutionData.institutionName}</span>.
              Uniting computer vision occupancy, synthetic IoT telemetry, and GenAI coaching to bust energy ghosts campus-wide.
            </p>

            {/* Action Buttons: Solid Primary + Quiet Dark Glass Secondary */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#006bff] hover:bg-[#1a7aff] text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <Activity className="w-4 h-4 text-white" />
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/campus"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium text-sm border border-white/[0.14] transition-colors"
              >
                <Layers className="w-4 h-4 text-[#9ff0ec]" />
                <span>Explore BIT Campus Map</span>
              </Link>
              <Link
                to="/coach"
                className="btn-pop flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-[#d3d3d7] hover:text-white font-semibold text-sm border border-white/[0.12] backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-[#6f5adc]" />
                <span>Ask Aura AI</span>
              </Link>
            </div>

            {/* Projected Campus Impact Stats Row */}
            <div className="mt-12 pt-8 border-t border-white/[0.1] w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="pr-4 border-r border-white/[0.1]">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {formatINR(1250000)}
                </div>
                <div className="text-xs text-[#b9b8bb] mt-1 font-normal">Annual Projected Savings</div>
              </div>
              <div className="px-2 sm:px-4 border-r border-white/[0.1]">
                <div className="text-2xl sm:text-3xl font-display font-bold text-[#9ff0ec] tracking-tight">
                  {formatCo2(94200)}
                </div>
                <div className="text-xs text-[#b9b8bb] mt-1 font-normal">CO₂ Avoided Yearly</div>
              </div>
              <div className="px-2 sm:px-4 border-r border-white/[0.1]">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  260 kWp
                </div>
                <div className="text-xs text-[#b9b8bb] mt-1 font-normal">Rooftop Solar Modeled</div>
              </div>
              <div className="pl-4">
                <div className="text-2xl sm:text-3xl font-display font-bold text-[#bdf7ee] tracking-tight">
                  84 / 100
                </div>
                <div className="text-xs text-[#b9b8bb] mt-1 font-normal">Green Campus Score</div>
              </div>
            </div>
          </div>

          {/* Right Column: Square Artwork Area with Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center">
              {/* Radial Haze Behind Slabs */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,90,220,0.22)_0%,rgba(77,25,177,0.1)_45%,transparent_70%)] rounded-full pointer-events-none" />

              {/* Masked Video Artwork Loop (Optimized via Hardware Overlay) */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <video
                  src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/435a4fe7-e43b-4e7c-af78-0be083e73569.mp4"
                  poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/782a4a52-4c1e-4471-bb0c-aa232927f4a6.webp"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                {/* Hardware-accelerated smooth vignette fade to #0d0c11 */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_55%,#0d0c11_98%)]" />
              </div>

              {/* Floating Glass Card 1: Upper-Left */}
              <div className="absolute -top-3 -left-3 sm:top-4 sm:-left-6 w-[260px] sm:w-[280px] p-4 rounded-[18px] bg-[#131219]/90 border border-white/[0.16] shadow-[0_16px_36px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] animate-float will-change-transform transform-gpu z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#9ff0ec]/10 border border-[#9ff0ec]/30 flex items-center justify-center text-[#9ff0ec] shrink-0 shadow-[0_0_12px_rgba(159,240,236,0.3)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdf7ee] block">
                      Campus Telemetry
                    </span>
                    <p className="text-xs font-semibold text-white leading-snug truncate">
                      BIT Digital Twin: Live 8-Block Telemetry
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Glass Card 2: Lower-Right */}
              <div className="absolute -bottom-3 -right-3 sm:bottom-6 sm:-right-6 w-[260px] sm:w-[280px] p-4 rounded-[18px] bg-[#131219]/90 border border-white/[0.16] shadow-[0_16px_36px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] animate-float will-change-transform transform-gpu z-20" style={{ animationDelay: '2.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6f5adc]/15 border border-[#6f5adc]/35 flex items-center justify-center text-[#9ff0ec] shrink-0 shadow-[0_0_12px_rgba(111,90,220,0.4)]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#bdf7ee] block">
                      Automated Defense
                    </span>
                    <p className="text-xs font-semibold text-white leading-snug truncate">
                      Zero-Latency: 60s Ghost Load Shedding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Complete Module Launcher Carousel: Direct 1-Click Access to All 10 Modules (Exact Image 1 Style) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title on Left and Carousel Controls on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.15]">
              Explore All Campus<br />
              <span className="text-[#9ff0ec]">
                Energy Twin Systems
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#b9b8bb] flex items-center gap-1.5 font-normal">
              <span>Click any module below to open its dedicated view with live simulated telemetry and controls</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9ff0ec]" />
            </p>
          </div>

          {/* Carousel Arrows (Left & Right Buttons from Image 1) */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => scrollCarousel('left')}
              aria-label="Previous modules"
              className="w-9 h-9 rounded-lg border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white backdrop-blur-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              aria-label="Next modules"
              className="w-9 h-9 rounded-lg border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white backdrop-blur-md transition-colors"
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
                className={`w-[290px] sm:w-[320px] shrink-0 snap-start min-h-[420px] rounded-[28px] bg-[#131219]/80 border ${m.borderColor} shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 group`}
              >
                {/* Top: Brand Logo / Module Identifier */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${m.iconColor}`} />
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                        {m.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                      {m.tag}
                    </span>
                  </div>

                  {/* Middle: Big bold metric number & description */}
                  <div className="mt-8 mb-6">
                    <div className={`text-5xl font-black tracking-tight ${m.statColor}`}>
                      {m.stat}
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed font-normal">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom: The signature organic blob button from Image 1 */}
                <div className="relative inline-flex items-center mt-auto self-start">
                  <svg
                    viewBox="0 0 150 60"
                    className={`w-[136px] h-[52px] ${m.blobColor} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]`}
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
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/[0.08]">
        {/* Header with Title on Left */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-[#9ff0ec] uppercase tracking-widest">
              Bangalore Institute of Technology •
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.15] mt-2">
              Fostering Sustainable<br />
              <span className="text-[#9ff0ec]">
                Educational Ecosystems
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#b9b8bb] flex items-center gap-1.5 font-normal">
              <span>Campus microgrid telemetry, institutional governance, and verified Net-Zero impact</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9ff0ec]" />
            </p>
          </div>
        </div>

        {/* 3 Unified Dark Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {institutionCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to + c.label}
                to={c.to}
                className={`w-full min-h-[420px] rounded-[28px] bg-[#131219]/80 border ${c.borderColor} shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 group`}
              >
                {/* Top: Brand Logo / Module Identifier */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${c.iconColor}`} />
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                        {c.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                      {c.tag}
                    </span>
                  </div>

                  {/* Middle: Big bold metric number & description */}
                  <div className="mt-8 mb-6">
                    <div className={`text-5xl font-black tracking-tight ${c.statColor}`}>
                      {c.stat}
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom: The signature organic blob button */}
                <div className="relative inline-flex items-center mt-auto self-start">
                  <svg
                    viewBox="0 0 150 60"
                    className={`w-[136px] h-[52px] ${c.blobColor} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]`}
                    fill="currentColor"
                  >
                    <path d={c.blobPath} />
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

      {/* Feature Showcase Grid: Core Innovations */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/[0.08]">
        {/* Header with Title on Left */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-[#bdf7ee] uppercase tracking-widest">
              Core Innovations
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.15] mt-2">
              Engineered for<br />
              <span className="text-[#9ff0ec]">
                Campus Net-Zero Goals
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#b9b8bb] flex items-center gap-1.5 font-normal">
              <span>Fully simulated with progressive hardware support for physical smart meters, relays, and IP cameras.</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9ff0ec]" />
            </p>
          </div>
        </div>

        {/* 3 Unified Dark Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {innovationCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to + c.label}
                to={c.to}
                className={`w-full min-h-[420px] rounded-[28px] bg-[#131219]/80 border ${c.borderColor} shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 group`}
              >
                {/* Top: Brand Logo / Module Identifier */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${c.iconColor}`} />
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                        {c.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-[#9ff0ec] border border-white/[0.12]">
                      {c.tag}
                    </span>
                  </div>

                  {/* Middle: Big bold metric number & description */}
                  <div className="mt-8 mb-6">
                    <div className={`text-5xl font-black tracking-tight ${c.statColor}`}>
                      {c.stat}
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-[#d3d3d7] leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom: The signature organic blob button */}
                <div className="relative inline-flex items-center mt-auto self-start">
                  <svg
                    viewBox="0 0 150 60"
                    className={`w-[136px] h-[52px] ${c.blobColor} transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]`}
                    fill="currentColor"
                  >
                    <path d={c.blobPath} />
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
    </div>
  );
}
