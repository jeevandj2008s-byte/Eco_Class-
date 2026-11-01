import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, ShieldCheck, MapPin, Globe } from 'lucide-react';
import institutionData from '../../config/institution.json';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#d4e0ed] bg-[#f8f9fb] mt-20 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Team */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#006bff] text-white flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-base text-[#0b3558]">AuraSync Energy Twin</span>
          </div>
          <p className="text-xs text-[#476788] leading-relaxed">
            AI-driven Campus Digital Twin for real-time microgrid telemetry, computer vision occupancy optimization, and transparent carbon accounting.
          </p>
          <div className="p-3 rounded-xl bg-white border border-[#d4e0ed] shadow-cal-sm text-xs text-[#476788]">
            Developed by <span className="font-bold text-[#0b3558]">[YOUR TEAM NAME], BIT</span>
          </div>
        </div>

        {/* Col 2: Institution Tie-In */}
        <div className="space-y-2.5 md:col-span-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#476788] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#006bff]" />
            Institution & Campus
          </h4>
          <p className="text-xs text-[#0b3558] font-bold">
            {institutionData.institutionName}
          </p>
          <p className="text-xs text-[#476788] leading-relaxed">
            {institutionData.location} • PIN: {institutionData.pincode}
          </p>
          <div className="pt-2 text-xs text-[#476788] italic">
            "{institutionData.statements[1]}"
          </div>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#476788]">Quick Modules</h4>
          <ul className="text-xs space-y-2 text-[#476788]">
            <li><Link to="/campus" className="hover:text-[#006bff] hover:underline transition font-medium">BIT Campus Map</Link></li>
            <li><Link to="/vision" className="hover:text-[#006bff] hover:underline transition font-medium">Computer Vision Lab</Link></li>
            <li><Link to="/control" className="hover:text-[#006bff] hover:underline transition font-medium">Control & Campus Master Switch</Link></li>
            <li><Link to="/carbon" className="hover:text-[#006bff] hover:underline transition font-medium">Carbon ESG & Net-Zero Center</Link></li>
            <li><Link to="/helpdesk" className="hover:text-[#006bff] hover:underline transition font-medium">Campus Helpdesk & Worker App</Link></li>
            <li><Link to="/about" className="hover:text-[#006bff] hover:underline transition font-medium">About BIT & Team</Link></li>
          </ul>
        </div>

        {/* Col 4: Problem Statement & Assumptions */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#476788] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006bff]" />
            Assumptions & Standards
          </h4>
          <p className="text-xs text-[#476788] leading-relaxed">
            All currency in Indian Rupees (₹) via en-IN. Default India grid emission factor: 0.71 kg CO₂e/kWh. BESCOM HT tariff assumed at ₹8.25/kWh (editable in Settings).
          </p>
          <p className="text-[11px] text-[#a6bbd1]">
            © 2026 [YOUR TEAM NAME], BIT. Built for BIT and every sustainable campus that follows.
          </p>
        </div>
      </div>
    </footer>
  );
}
