import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, ShieldCheck, MapPin } from 'lucide-react';
import institutionData from '../../config/institution.json';

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-white/[0.1] bg-[#0d0c11]/80 backdrop-blur-xl mt-24 pt-16 pb-12 px-4 sm:px-8 lg:px-12 text-[#d3d3d7] overflow-hidden z-20">
      {/* Top subtle ambient glow hairline and violet haze */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#9ff0ec]/30 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#6f5adc]/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Col 1: Brand & Team (span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4d19b1] to-[#6f5adc] text-white flex items-center justify-center font-bold shadow-[0_0_20px_rgba(111,90,220,0.5)] border border-white/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">AuraSync</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#9ff0ec]/15 text-[#9ff0ec] border border-[#9ff0ec]/30 font-semibold shadow-[0_0_10px_rgba(159,240,236,0.3)]">
                  BIT
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-[#b9b8bb] leading-relaxed max-w-sm font-normal">
              AI-driven Campus Digital Twin for real-time microgrid telemetry, computer vision occupancy optimization, and transparent carbon accounting.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] text-xs text-[#d3d3d7]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>Developed by <strong className="text-white font-semibold">Eco_Class, BIT</strong></span>
            </div>
          </div>

          {/* Col 2: Institution & Campus (span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ff0ec] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9ff0ec]" />
              Institution & Campus
            </h4>
            <div className="space-y-1">
              <p className="text-sm text-white font-bold tracking-tight">
                {institutionData.institutionName}
              </p>
              <p className="text-xs text-[#b9b8bb] leading-relaxed">
                K.R Road, V.V puram ,Bangalore-50
              </p>
            </div>
            <p className="text-xs text-[#b9b8bb]/80 italic border-l-2 border-[#6f5adc]/50 pl-2.5 pt-1">
              "{institutionData.statements[1]}"
            </p>
          </div>

          {/* Col 3: Quick Navigation (span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ff0ec]">
              Quick Modules
            </h4>
            <ul className="text-xs space-y-2 text-[#b9b8bb]">
              <li>
                <Link to="/campus" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  BIT Campus Map
                </Link>
              </li>
              <li>
                <Link to="/vision" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  Computer Vision Lab
                </Link>
              </li>
              <li>
                <Link to="/control" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  Control & Automation
                </Link>
              </li>
              <li>
                <Link to="/carbon" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  Carbon ESG Passport
                </Link>
              </li>
              <li>
                <Link to="/helpdesk" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  Campus Helpdesk
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition font-medium">
                  About BIT & Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Problem Statement & Assumptions (span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ff0ec] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9ff0ec]" />
              Assumptions & Standards
            </h4>
            <p className="text-xs text-[#b9b8bb] leading-relaxed">
              All currency in Indian Rupees (₹) via en-IN. Default India grid emission factor: 0.71 kg CO₂e/kWh. BESCOM HT tariff assumed at ₹8.25/kWh (editable in Settings).
            </p>
            <div className="pt-1">
              <span className="inline-block text-[11px] font-mono text-[#bdf7ee] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                Net-Zero Campus Framework
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Bar: Built with ❤️ by Eco_Class, BIT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b9b8bb]">
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
