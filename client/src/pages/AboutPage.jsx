import React from 'react';
import {
  Info,
  MapPin,
  Users,
  Award,
  Zap,
  CheckCircle2,
  Building,
  ArrowRight,
  Globe,
  Sparkles
} from 'lucide-react';
import institutionData from '../config/institution.json';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 relative">
      {/* Decorative Brand Accent Blobs */}
      <div className="blob-magenta top-6 -left-12 -z-10" />
      <div className="blob-cyan top-48 -right-12 -z-10" />

      {/* Header */}
      <div className="p-8 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0ff] border border-[#b8d5ff] text-[#006bff] text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Developed by Eco_Class, BIT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b3558] tracking-tight">
          AuraSync Energy Twin
        </h1>
        <p className="text-xs sm:text-sm text-[#476788] max-w-2xl mx-auto leading-relaxed">
          Pioneering Campus Digital Twin Architecture for {institutionData.institutionName}.
          Engineered for institutional scale, real-time energy telemetry, and transparent ESG governance.
        </p>
      </div>

      {/* Institution Background: Bangalore Institute of Technology */}
      <section className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-[#006bff]" />
          <h2 className="text-base font-bold text-[#0b3558]">Bangalore Institute of Technology</h2>
        </div>
        <p className="text-xs text-[#476788] leading-relaxed">
          {institutionData.statements[0]} [ADD BIT INFO HERE] Located at {institutionData.location}, BIT fosters premier engineering excellence, technological innovation, and green infrastructure initiatives.
        </p>

        {/* Statements Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {institutionData.statements.slice(1, 7).map((stmt, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] text-xs text-[#0b3558] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006bff] shrink-0 mt-0.5" />
              <span>{stmt}</span>
            </div>
          ))}
        </div>
      </section>

      {/* The Engineering Team Card */}
      <section className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#006bff]" />
            <h2 className="text-base font-bold text-[#0b3558]">The Engineering Team: Eco_Class, BIT</h2>
          </div>
          <span className="text-xs font-mono text-[#006bff] font-bold bg-[#e6f0ff] px-3 py-1 rounded-full border border-[#b8d5ff]">
            Engineering Department • BIT
          </span>
        </div>

        <p className="text-xs text-[#476788] leading-relaxed">
          Eco_Class, BIT comprises engineers from Bangalore Institute of Technology, specializing in computer vision edge inferencing, distributed IoT data pipelines, and campus digital twins.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] text-center">
            <div className="font-bold text-[#0b3558]">Campus 2D Map</div>
            <div className="text-[11px] text-[#476788] mt-1">Interactive BIT Campus Architecture & Hotspots</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] text-center">
            <div className="font-bold text-[#0b3558]">Synthetic IoT Engine</div>
            <div className="text-[11px] text-[#476788] mt-1">Agent-based college population & ghost loads</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#f8f9fb] border border-[#d4e0ed] text-center">
            <div className="font-bold text-[#0b3558]">Aura AI Coach</div>
            <div className="text-[11px] text-[#476788] mt-1">Quantified Indian Rupee (₹) & Carbon strategies</div>
          </div>
        </div>
      </section>

      {/* Multi-Campus Switcher & Onboarding Blueprint */}
      <section className="p-6 rounded-3xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0b3558] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#006bff]" />
              Adopt AuraSync for Your College Campus
            </h3>
            <p className="text-xs text-[#476788] mt-0.5">
              Config-driven architecture via campus.json enables plug-and-play adoption across any university.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
