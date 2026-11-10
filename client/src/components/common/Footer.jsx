import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import institutionData from '../../config/institution.json';

export default function Footer() {
  const footerCards = [
    {
      to: '/about',
      label: 'AuraSync Twin',
      tag: 'Eco_Class',
      stat: 'Net-Zero',
      statColor: 'text-white',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: Zap,
      iconColor: 'text-[#9ff0ec]',
      desc: 'AI-driven Campus Digital Twin for real-time microgrid telemetry, computer vision occupancy optimization, and transparent carbon accounting.'
    },
    {
      to: '/campus',
      label: 'Campus Anchor',
      tag: 'V.V. Puram',
      stat: 'BIT Campus',
      statColor: 'text-[#9ff0ec]',
      borderColor: 'border-white/[0.12] hover:border-[#9ff0ec]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 18,22 C 32,22 46,26 62,24 C 76,22 88,2 108,2 C 128,2 142,14 142,30 C 142,46 128,56 112,56 L 20,56 C 8,56 0,46 0,34 C 0,22 8,22 18,22 Z',
      icon: MapPin,
      iconColor: 'text-[#9ff0ec]',
      desc: `Bangalore Institute of Technology, K.R Road, V.V puram ,Bangalore-50. "${institutionData.statements[1]}"`
    },
    {
      to: '/dashboard',
      label: 'Quick Modules',
      tag: '6 Hubs',
      stat: 'Live Twin',
      statColor: 'text-[#6f5adc]',
      borderColor: 'border-white/[0.12] hover:border-[#6f5adc]/60',
      blobColor: 'text-[#6f5adc]',
      blobPath: 'M 12,32 C 18,18 36,4 62,2 C 90,0 114,12 128,24 C 140,34 142,44 136,54 C 130,58 116,58 100,58 L 22,58 C 8,58 0,48 0,38 C 0,35 6,34 12,32 Z',
      icon: Layers,
      iconColor: 'text-[#6f5adc]',
      desc: 'Instant access to BIT Campus Map, Vision Lab, Control & Automation, ESG Passport, and Incident Helpdesk.'
    },
    {
      to: '/carbon',
      label: 'Standards & ESG',
      tag: 'Scope 2',
      stat: '0.71 kg',
      statColor: 'text-[#bdf7ee]',
      borderColor: 'border-white/[0.12] hover:border-[#bdf7ee]/60',
      blobColor: 'text-[#4d19b1]',
      blobPath: 'M 16,16 C 35,14 55,24 75,20 C 95,16 110,6 126,10 C 138,14 144,26 142,40 C 140,52 126,58 110,58 L 18,58 C 6,58 0,48 0,36 C 0,24 6,18 16,16 Z',
      icon: ShieldCheck,
      iconColor: 'text-[#bdf7ee]',
      desc: 'All currency in Indian Rupees (₹) via en-IN. Default India grid emission factor: 0.71 kg CO₂e/kWh. BESCOM HT tariff assumed at ₹8.25/kWh.'
    }
  ];

  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-transparent mt-24 pt-16 pb-32 px-4 sm:px-6 lg:px-8 text-[#d3d3d7] z-20">
      {/* Top subtle ambient glow hairline and violet haze */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#9ff0ec]/30 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#6f5adc]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header matching Core Innovations */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold text-[#bdf7ee] uppercase tracking-widest">
              Institutional Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-[1.15] mt-2">
              AuraSync Campus<br />
              <span className="text-[#9ff0ec]">
                Digital Twin Architecture
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#b9b8bb] flex items-center gap-1.5 font-normal">
              <span>Verified microgrid telemetry, institutional governance, and Net-Zero 2030 standards.</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9ff0ec]" />
            </p>
          </div>
        </div>

        {/* 4 Elevated Dark Glass Cards matching Core Innovations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {footerCards.map((c) => {
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

        {/* Bottom Sub-Bar: Built with ❤️ by Eco_Class, BIT */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b9b8bb]">
          <div className="flex items-center gap-2 text-center sm:text-left flex-wrap justify-center sm:justify-start">
            <span>Built with</span>
            <span className="text-rose-400">❤️</span>
            <span>by</span>
            <span className="font-bold text-white tracking-tight">Eco_Class, BIT</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-[#b9b8bb] hidden sm:inline">K.R Road, V.V puram ,Bangalore-50</span>
          </div>

          <p className="text-[11px] text-[#b9b8bb]/70 text-center sm:text-right font-mono">
            © 2026 Eco_Class, BIT. Built for Bangalore Institute of Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
