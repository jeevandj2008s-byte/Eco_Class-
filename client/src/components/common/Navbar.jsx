import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Shield,
  Activity,
  Layers,
  Sparkles,
  LifeBuoy,
  Settings,
  Menu,
  X,
  ChevronDown,
  Info,
  Sliders,
  User,
  LogOut,
  Copy,
  Check,
  ShieldCheck,
  PlusCircle,
  Command,
  Sun,
  Moon,
  Camera,
  QrCode
} from 'lucide-react';
import { useCampusStore } from '../../store/useCampusStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useThemeStore } from '../../store/useThemeStore.js';
import { formatINR, formatKw, sounds } from '../../lib/utils.js';
import { useNavbarScroll } from '../../lib/motion.js';

export default function Navbar({ onOpenCommandPalette, onOpenReportModal }) {
  const location = useLocation();
  const isScrolled = useNavbarScroll(15);
  const { telemetry } = useCampusStore();
  const { user, setDemoRole, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowRoleMenu(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/', label: 'Overview', icon: Activity, desc: 'Campus power KPIs' },
    { to: '/dashboard', label: 'Dashboard', icon: Zap, desc: 'Real-time telemetry' },
    { to: '/campus', label: 'Campus Map', icon: MapPin, desc: '2D/3D visual layout' },
    { to: '/vision', label: 'Vision Lab', icon: Camera, desc: 'Mobile AI camera' },
    { to: '/control', label: 'HVAC Control', icon: Sliders, desc: 'Automated setpoints' },
    { to: '/simulate', label: 'Simulator', icon: Layers, desc: 'Grid load testing' },
    { to: '/carbon', label: 'Carbon ESG', icon: Zap, desc: 'Green passport & CO2 auditing' },
    { to: '/helpdesk', label: 'Helpdesk', icon: LifeBuoy, desc: 'Incident reporting & work orders' },
    { to: '/coach', label: 'Aura AI', icon: Sparkles, desc: 'Gemini energy coach' },
    { to: '/admin', label: 'Admin', icon: Shield, desc: 'Governance & user roles' },
    { to: '/about', label: 'About', icon: Info, desc: 'BIT & Team' }
  ];

  const roleLabels = {
    admin: { title: 'Principal (Demo Principal)', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
    hod: { title: 'HOD (Demo HOD)', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    staff: { title: 'Faculty / Staff', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
    student: { title: 'Student (AIML)', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
    worker: { title: 'Technician / Worker', color: 'bg-orange-500/10 text-orange-300 border-orange-500/30' }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const userRoleKey = user?.role?.toLowerCase() || 'hod';
  const roleStyle = roleLabels[userRoleKey] || roleLabels.hod;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 px-3 sm:px-6 ${
      isScrolled
        ? 'bg-[#0d0c11]/85 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.8)] border-b border-white/[0.12] backdrop-blur-md py-2.5'
        : 'bg-[#0d0c11]/60 border-b border-white/[0.08] backdrop-blur-sm py-3'
    }`}>
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-2 lg:gap-4">
        {/* Logo and Institution Badge */}
        <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4d19b1] to-[#6f5adc] p-0.5 shadow-[0_0_20px_rgba(111,90,220,0.5)] group-hover:scale-105 transition-transform flex items-center justify-center border border-white/20">
            <Zap className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-white transition">
                AuraSync
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#9ff0ec]/15 text-[#9ff0ec] border border-[#9ff0ec]/30 font-semibold shadow-[0_0_10px_rgba(159,240,236,0.3)]">
                BIT
              </span>
            </div>
            <span className="text-[10px] text-[#b9b8bb] font-medium hidden sm:inline">Energy Twin • [YOUR TEAM NAME], BIT</span>
          </div>
        </Link>

        {/* Navigation Items (Responsive Horizontal Glass Bar) */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/[0.02] p-1 rounded-full border border-white/[0.12] backdrop-blur-md overflow-x-auto max-w-[650px] 2xl:max-w-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4d19b1]/60 to-[#6f5adc]/60 text-white shadow-[0_0_15px_rgba(111,90,220,0.4)] border border-white/20'
                    : 'text-[#b9b8bb] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#9ff0ec]' : 'text-[#b9b8bb]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Campus Telemetry Pill (Desktop) */}
        <div className="hidden 2xl:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.12] backdrop-blur-md text-xs shrink-0 badge-live-pulse shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#9ff0ec] animate-pulse shadow-[0_0_8px_#9ff0ec]" />
            <span className="text-white font-bold">{formatKw(telemetry?.campus?.totalRealKw || 142)}</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="text-[11px] text-[#9ff0ec] font-mono font-semibold">
            {formatINR(telemetry?.savingsTracker?.savedTodayRs || 4850)} saved
          </div>
        </div>

        {/* Right Section: Actions & ALWAYS-VISIBLE User Credentials */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Report Issue Button */}
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#4d19b1] to-[#6f5adc] hover:from-[#581dc7] hover:to-[#7d68e8] text-white font-semibold text-xs shadow-[0_0_20px_rgba(111,90,220,0.45)] border border-white/20 btn-pop btn-shine"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Waste</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.16] text-[#b9b8bb] hover:text-white text-xs transition backdrop-blur-md"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-[#9ff0ec]" />
            <span className="font-mono text-[10px] bg-white/10 border border-white/20 px-1 py-0.2 rounded text-white">⌘K</span>
          </button>

          {/* User Credentials Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.16] text-left transition backdrop-blur-md group shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
              title="Click to view credentials and session details"
            >
              {/* User Avatar Circle */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4d19b1] to-[#6f5adc] flex items-center justify-center font-bold text-white text-[10px] shrink-0 border border-white/20 shadow-[0_0_10px_rgba(111,90,220,0.4)]">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AU'}
              </div>

              {/* User Name & Role Pill */}
              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white truncate max-w-[110px] sm:max-w-[150px]">
                    {user?.name || 'Demo HOD'}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border uppercase font-extrabold ${roleStyle.color}`}>
                    {user?.role || 'HOD'}
                  </span>
                </div>
                <span className="text-[10px] text-[#b9b8bb] font-mono truncate max-w-[140px] sm:max-w-[180px] hidden sm:block">
                  {user?.email || 'hod.aiml@aurasync.demo'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#b9b8bb] group-hover:text-white transition shrink-0" />
            </button>

            {/* Comprehensive Credentials Card Modal / Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#131219]/95 border border-white/[0.16] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                {/* Header: Verified Session */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.12]">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#9ff0ec]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Logged In Session</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#9ff0ec]/10 text-[#9ff0ec] border border-[#9ff0ec]/30">
                    BIT Campus
                  </span>
                </div>

                {/* Full Credentials Box */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.1] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b9b8bb] block">Name:</span>
                    <span className="font-bold text-white text-xs block">{user?.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b9b8bb] block">College Email:</span>
                    <div className="flex items-center justify-between gap-1 font-mono text-[11px] text-[#9ff0ec]">
                      <span className="truncate">{user?.email}</span>
                      <button
                        onClick={() => handleCopy(user?.email, 'email')}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-[#d3d3d7] hover:text-white shrink-0"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b9b8bb] block">Department:</span>
                    <span className="text-[#d3d3d7] text-[11px] block">{user?.department}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.1] text-[10px]">
                    <span className="text-[#b9b8bb]">Default Passkey:</span>
                    <span className="font-mono font-bold text-[#9ff0ec] bg-white/10 border border-white/20 px-1.5 py-0.2 rounded">123456</span>
                  </div>
                </div>

                {/* Demo Role Switcher Chips */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-[#b9b8bb] font-bold">
                    Switch Demo Persona:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { role: 'admin', label: 'Principal', bg: 'hover:bg-amber-500/20 hover:text-amber-300' },
                      { role: 'hod', label: 'HOD AIML', bg: 'hover:bg-emerald-500/20 hover:text-emerald-300' },
                      { role: 'staff', label: 'Faculty', bg: 'hover:bg-blue-500/20 hover:text-blue-300' },
                      { role: 'student', label: 'Student', bg: 'hover:bg-purple-500/20 hover:text-purple-300' },
                      { role: 'worker', label: 'Technician', bg: 'hover:bg-orange-500/20 hover:text-orange-300' }
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          setDemoRole(item.role);
                          setShowRoleMenu(false);
                          sounds.playChime('chime');
                        }}
                        className={`px-2 py-1.5 rounded-lg text-left text-xs font-semibold border border-white/[0.12] bg-white/[0.02] transition ${item.bg} ${
                          user?.role === item.role ? 'border-[#6f5adc] bg-[#6f5adc]/20 text-[#9ff0ec]' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout / Switch Account Button */}
                <div className="mt-3 pt-2 border-t border-white/[0.12] flex items-center justify-between">
                  <Link
                    to="/login"
                    onClick={() => setShowRoleMenu(false)}
                    className="text-xs text-[#9ff0ec] hover:underline font-semibold"
                  >
                    Switch Account...
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.16] text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 p-3 rounded-2xl bg-[#131219]/95 border border-white/[0.16] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-2 animate-in fade-in slide-in-from-top-2 text-white">
          {/* Mobile Telemetry Summary */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.12] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-[#9ff0ec] animate-pulse shadow-[0_0_8px_#9ff0ec]" />
              <span>{formatKw(telemetry?.campus?.totalRealKw || 142)} Live Draw</span>
            </div>
            <span className="text-[#9ff0ec] font-semibold">
              {formatINR(telemetry?.savingsTracker?.savedTodayRs || 4850)} saved
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4d19b1]/60 to-[#6f5adc]/60 text-white border border-white/20'
                      : 'bg-white/[0.02] text-white hover:bg-white/[0.06] border border-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#9ff0ec]' : 'text-[#b9b8bb]'}`} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-[9px] text-[#b9b8bb] font-normal">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.12] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                closeMobile();
                onOpenReportModal();
              }}
              className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#4d19b1] to-[#6f5adc] text-white text-xs font-bold text-center shadow-[0_0_20px_rgba(111,90,220,0.45)] border border-white/20"
            >
              Report Waste
            </button>
            <button
              onClick={() => {
                closeMobile();
                onOpenCommandPalette();
              }}
              className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.16] text-white text-xs font-semibold hover:bg-white/[0.08]"
            >
              ⌘K Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
