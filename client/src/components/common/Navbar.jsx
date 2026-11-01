import React, { useState } from 'react';
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
    admin: { title: 'Principal (Demo Principal)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    hod: { title: 'HOD (Demo HOD)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    staff: { title: 'Faculty / Staff', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    student: { title: 'Student (AIML)', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    worker: { title: 'Technician / Worker', color: 'bg-orange-50 text-orange-800 border-orange-200' }
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
        ? 'bg-white/95 shadow-cal-card border-b border-[#d4e0ed] backdrop-blur-md py-2'
        : 'bg-white/90 border-b border-[#d4e0ed]/80 shadow-cal-sm backdrop-blur-sm py-2.5'
    }`}>
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-2 lg:gap-4">
        {/* Logo and Institution Badge */}
        <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#006bff] p-0.5 shadow-cal-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#0b3558]">
                AuraSync
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#e6f0ff] text-[#004eba] border border-[#d4e0ed] font-semibold">
                BIT
              </span>
            </div>
            <span className="text-[10px] text-[#476788] font-medium hidden sm:inline">Energy Twin • [YOUR TEAM NAME], BIT</span>
          </div>
        </Link>

        {/* Navigation Items (Responsive Horizontal Bar) */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#f0f3f8] p-1 rounded-xl border border-[#d4e0ed] overflow-x-auto max-w-[650px] 2xl:max-w-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#006bff] shadow-cal-sm border border-[#d4e0ed]'
                    : 'text-[#476788] hover:text-[#0b3558] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#006bff]' : 'text-[#476788]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Campus Telemetry Pill (Desktop) */}
        <div className="hidden 2xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs shrink-0 badge-live-pulse">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0b3558] font-bold">{formatKw(telemetry?.campus?.totalRealKw || 142)}</span>
          </div>
          <span className="text-[#d4e0ed]">|</span>
          <div className="text-[11px] text-[#006bff] font-mono font-semibold">
            {formatINR(telemetry?.savingsTracker?.savedTodayRs || 4850)} saved
          </div>
        </div>

        {/* Right Section: Actions & ALWAYS-VISIBLE User Credentials */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Report Issue Button */}
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn btn-pop btn-shine"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Waste</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f0f3f8] hover:bg-white border border-[#d4e0ed] text-[#476788] hover:text-[#0b3558] text-xs transition"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] bg-white border border-[#d4e0ed] px-1 py-0.2 rounded text-[#0b3558]">⌘K</span>
          </button>

          {/* User Credentials Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#f0f3f8] border border-[#d4e0ed] text-left transition shadow-cal-sm group"
              title="Click to view credentials and session details"
            >
              {/* User Avatar Circle */}
              <div className="w-7 h-7 rounded-lg bg-[#006bff] flex items-center justify-center font-bold text-white text-[10px] shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AU'}
              </div>

              {/* User Name & Role Pill */}
              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#0b3558] truncate max-w-[110px] sm:max-w-[150px]">
                    {user?.name || 'Demo HOD'}
                  </span>
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded border uppercase font-extrabold ${roleStyle.color}`}>
                    {user?.role || 'HOD'}
                  </span>
                </div>
                <span className="text-[10px] text-[#476788] font-mono truncate max-w-[140px] sm:max-w-[180px] hidden sm:block">
                  {user?.email || 'hod.aiml@aurasync.demo'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#476788] group-hover:text-[#0b3558] transition shrink-0" />
            </button>

            {/* Comprehensive Credentials Card Modal / Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#d4e0ed] p-4 shadow-cal-card z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header: Verified Session */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#d4e0ed]">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#006bff]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Logged In Session</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#e6f0ff] text-[#004eba] border border-[#d4e0ed]">
                    BIT Campus
                  </span>
                </div>

                {/* Full Credentials Box */}
                <div className="p-3 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#476788] block">Name:</span>
                    <span className="font-bold text-[#0b3558] text-xs block">{user?.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#476788] block">College Email:</span>
                    <div className="flex items-center justify-between gap-1 font-mono text-[11px] text-[#006bff]">
                      <span className="truncate">{user?.email}</span>
                      <button
                        onClick={() => handleCopy(user?.email, 'email')}
                        className="p-1 rounded bg-white hover:bg-[#e5ebf3] border border-[#d4e0ed] text-[#476788] hover:text-[#0b3558] shrink-0"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#476788] block">Department:</span>
                    <span className="text-[#476788] text-[11px] block">{user?.department}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#d4e0ed] text-[10px]">
                    <span className="text-[#476788]">Default Passkey:</span>
                    <span className="font-mono font-bold text-[#0b3558] bg-white border border-[#d4e0ed] px-1.5 py-0.2 rounded">123456</span>
                  </div>
                </div>

                {/* Demo Role Switcher Chips */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider text-[#476788] font-bold">
                    Switch Demo Persona:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { role: 'admin', label: 'Principal', bg: 'hover:bg-amber-50 hover:text-amber-900' },
                      { role: 'hod', label: 'HOD AIML', bg: 'hover:bg-emerald-50 hover:text-emerald-900' },
                      { role: 'staff', label: 'Faculty', bg: 'hover:bg-blue-50 hover:text-blue-900' },
                      { role: 'student', label: 'Student', bg: 'hover:bg-purple-50 hover:text-purple-900' },
                      { role: 'worker', label: 'Technician', bg: 'hover:bg-orange-50 hover:text-orange-900' }
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          setDemoRole(item.role);
                          setShowRoleMenu(false);
                          sounds.playChime('chime');
                        }}
                        className={`px-2 py-1.5 rounded-lg text-left text-xs font-semibold border border-[#d4e0ed] bg-[#f8f9fb] transition ${item.bg} ${
                          user?.role === item.role ? 'border-[#006bff] bg-blue-50/60 text-[#006bff]' : 'text-[#0b3558]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout / Switch Account Button */}
                <div className="mt-3 pt-2 border-t border-[#d4e0ed] flex items-center justify-between">
                  <Link
                    to="/login"
                    onClick={() => setShowRoleMenu(false)}
                    className="text-xs text-[#006bff] hover:underline font-semibold"
                  >
                    Switch Account...
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
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
            className="xl:hidden p-2 rounded-lg bg-white hover:bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 p-3 rounded-2xl bg-white border border-[#d4e0ed] shadow-cal-card space-y-2 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Telemetry Summary */}
          <div className="p-2.5 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#0b3558] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{formatKw(telemetry?.campus?.totalRealKw || 142)} Live Draw</span>
            </div>
            <span className="text-[#006bff] font-semibold">
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
                      ? 'bg-[#e6f0ff] text-[#006bff] border border-[#d4e0ed]'
                      : 'bg-[#f8f9fb] text-[#0b3558] hover:bg-[#f0f3f8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#006bff]' : 'text-[#476788]'}`} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-[9px] text-[#476788] font-normal">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#d4e0ed] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                closeMobile();
                onOpenReportModal();
              }}
              className="flex-1 py-2 rounded-lg bg-[#006bff] text-white text-xs font-bold text-center shadow-cal-btn"
            >
              Report Waste
            </button>
            <button
              onClick={() => {
                closeMobile();
                onOpenCommandPalette();
              }}
              className="px-3 py-2 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] text-xs font-semibold"
            >
              ⌘K Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
