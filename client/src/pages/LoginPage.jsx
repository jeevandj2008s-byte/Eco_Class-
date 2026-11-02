import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { sounds } from '../lib/utils.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('hod.aiml@aurasync.demo');
  const [password, setPassword] = useState('Hod@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts array for quick 1-click testing
  const demoAccounts = [
    { label: 'Admin (Demo Principal)', email: 'admin@aurasync.demo', pass: 'Admin@12345', role: 'admin' },
    { label: 'HOD (Demo HOD)', email: 'hod.aiml@aurasync.demo', pass: 'Hod@12345', role: 'hod' },
    { label: 'Faculty (Demo Faculty)', email: 'faculty@aurasync.demo', pass: 'Faculty@12345', role: 'staff' },
    { label: 'Student (Demo Student)', email: 'student@aurasync.demo', pass: 'Student@12345', role: 'student' },
    { label: 'Worker (Demo Worker)', email: 'worker@aurasync.demo', pass: 'Worker@12345', role: 'worker' }
  ];

  const handleDemoSelect = (account) => {
    setEmail(account.email);
    setPassword(account.pass);
    setError(null);
    sounds.playChime('bubble');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      sounds.playChime('success');
      navigate('/dashboard');
    } else {
      sounds.playChime('alert');
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-4 relative bg-[#f8f9fb]">
      {/* Decorative Blobs */}
      <div className="blob-magenta -top-10 left-1/3" />
      <div className="blob-cyan -bottom-10 right-1/3" />

      <div className="w-full max-w-md rounded-2xl bg-white border border-[#d4e0ed] p-8 shadow-cal-card relative z-10 overflow-hidden text-[#0b3558]">
        {/* Top Signal Blue Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#006bff]" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#006bff] mx-auto mb-3 flex items-center justify-center shadow-cal-sm text-white">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">AuraSync Energy Twin</h2>
          <p className="text-xs text-[#b9b8bb] mt-1 font-normal">Bangalore Institute of Technology</p>
        </div>

        {/* Demo Credentials Fast Chip Selector */}
        <div className="mb-5 p-4 rounded-xl bg-[#f8f9fb] border border-[#d4e0ed] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bdf7ee] uppercase tracking-widest flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#006bff]" />
              1-Click Demo Accounts & Credentials
            </span>
            <span className="text-[10px] text-[#476788] font-mono">BIT Hackathon</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoSelect(acc)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                  email === acc.email
                    ? 'bg-[#006bff] border-[#006bff] text-white font-bold shadow-cal-btn'
                    : 'bg-white border-[#d4e0ed] text-[#0b3558] hover:bg-[#f0f3f8]'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>

          {/* Prominently visible credential details for currently selected demo account */}
          <div className="p-3 rounded-lg bg-white border border-[#d4e0ed] text-[11px] font-mono space-y-1 shadow-cal-sm">
            <div className="flex items-center justify-between text-[#476788]">
              <span>Selected Email:</span>
              <span className="text-[#0b3558] font-bold select-all">{email}</span>
            </div>
            <div className="flex items-center justify-between text-[#476788]">
              <span>Password:</span>
              <span className="text-[#006bff] font-bold select-all">{password}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#0b3558] block mb-1">
              College Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#a6bbd1] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hod.aiml@aurasync.demo"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] placeholder-[#a6bbd1] focus:outline-none focus:bg-white focus:border-[#006bff]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b3558] block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a6bbd1] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] placeholder-[#a6bbd1] focus:outline-none focus:bg-white focus:border-[#006bff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#a6bbd1] hover:text-[#0b3558]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#006bff] hover:bg-[#005be0] text-white font-semibold text-xs shadow-cal-btn transition disabled:opacity-50"
          >
            {isLoading ? 'Authenticating with JWT...' : 'Sign In to Command Center'}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-[#476788]">
          Developed by <span className="text-[#0b3558] font-semibold">Eco_Class, BIT</span>
        </div>
      </div>
    </div>
  );
}
