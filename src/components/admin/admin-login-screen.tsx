'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, UserCheck, Key, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onGoToCustomerApp: () => void;
}

export default function AdminLoginScreen({ onLoginSuccess, onGoToCustomerApp }: AdminLoginScreenProps) {
  const { setUserRole, updateProfile } = useAppStore();

  const [email, setEmail] = useState('admin@printnest.com');
  const [password, setPassword] = useState('admin123');
  const [targetRole, setTargetRole] = useState<'admin' | 'staff' | 'delivery_partner'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      if (email.includes('admin') || email.includes('staff') || password === 'admin123') {
        setUserRole(targetRole);
        updateProfile('Master Admin', email);
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setErrorMessage('Invalid administrator credentials. Try demo credentials: admin@printnest.com');
      }
    }, 600);
  };

  const handleQuickDemoAdmin = () => {
    setUserRole('admin');
    updateProfile('Master Admin', 'admin@printnest.com');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#07130a] text-slate-100 flex flex-col justify-center items-center p-4 md:p-8 font-sans relative select-none">
      
      {/* Ambient Emerald Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6 text-left">
        
        {/* Top Header & Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-[#16A34A] shadow-inner">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-extrabold tracking-widest text-[#16A34A] uppercase block">
            ADMINISTRATION PORTAL
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            PrintNest Admin Login
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Authorized access only for Admins, Staff & Delivery Partners
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {/* Target Role Selector */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Panel Access Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-800/70 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setTargetRole('admin')}
                className={`py-2 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${targetRole === 'admin' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('staff')}
                className={`py-2 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${targetRole === 'staff' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => setTargetRole('delivery_partner')}
                className={`py-2 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${targetRole === 'delivery_partner' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Delivery
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@printnest.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:border-[#16A34A]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:border-[#16A34A]"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#16A34A] hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo One-Click Login */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-extrabold border border-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>One-Click Master Admin Login (Demo)</span>
          </button>

          <button
            type="button"
            onClick={onGoToCustomerApp}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-white transition-colors py-1 block"
          >
            ← Back to Customer App
          </button>
        </div>

      </div>
    </div>
  );
}
