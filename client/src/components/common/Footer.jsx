import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, ShieldCheck, MapPin, Globe } from 'lucide-react';
import institutionData from '../../config/institution.json';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.1] bg-[#0d0c11]/90 backdrop-blur-md mt-20 py-12 px-6 sm:px-12 text-[#d3d3d7]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Team */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4d19b1] to-[#6f5adc] text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(111,90,220,0.4)]">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-base text-white">AuraSync Energy Twin</span>
          </div>
          <p className="text-xs text-[#b9b8bb] leading-relaxed">
            AI-driven Campus Digital Twin for real-time microgrid telemetry, computer vision occupancy optimization, and transparent carbon accounting.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.12] backdrop-blur-md shadow-lg text-xs text-[#d3d3d7]">
            Developed by <span className="font-bold text-white">[YOUR TEAM NAME], BIT</span>
          </div>
        </div>

        {/* Col 2: Institution Tie-In */}
        <div className="space-y-2.5 md:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9ff0ec] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#9ff0ec]" />
            Institution & Campus
          </h4>
          <p className="text-xs text-white font-bold">
            {institutionData.institutionName}
          </p>
          <p className="text-xs text-[#b9b8bb] leading-relaxed">
            {institutionData.location} • PIN: {institutionData.pincode}
          </p>
          <div className="pt-2 text-xs text-[#b9b8bb] italic">
            "{institutionData.statements[1]}"
          </div>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9ff0ec]">Quick Modules</h4>
          <ul className="text-xs space-y-2 text-[#b9b8bb]">
            <li><Link to="/campus" className="hover:text-[#9ff0ec] hover:underline transition font-medium">BIT Campus Map</Link></li>
            <li><Link to="/vision" className="hover:text-[#9ff0ec] hover:underline transition font-medium">Computer Vision Lab</Link></li>
            <li><Link to="/control" className="hover:text-[#9ff0ec] hover:underline transition font-medium">Control & Campus Master Switch</Link></li>
            <li><Link to="/carbon" className="hover:text-[#9ff0ec] hover:underline transition font-medium">Carbon ESG & Net-Zero Center</Link></li>
            <li><Link to="/helpdesk" className="hover:text-[#9ff0ec] hover:underline transition font-medium">Campus Helpdesk & Worker App</Link></li>
            <li><Link to="/about" className="hover:text-[#9ff0ec] hover:underline transition font-medium">About BIT & Team</Link></li>
          </ul>
        </div>

        {/* Col 4: Problem Statement & Assumptions */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9ff0ec] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9ff0ec]" />
            Assumptions & Standards
          </h4>
          <p className="text-xs text-[#b9b8bb] leading-relaxed">
            All currency in Indian Rupees (₹) via en-IN. Default India grid emission factor: 0.71 kg CO₂e/kWh. BESCOM HT tariff assumed at ₹8.25/kWh (editable in Settings).
          </p>
          <p className="text-[11px] text-[#b9b8bb]/70">
            © 2026 [YOUR TEAM NAME], BIT. Built for BIT and every sustainable campus that follows.
          </p>
        </div>
      </div>
    </footer>
  );
}
