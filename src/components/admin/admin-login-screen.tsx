'use client';

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onGoToCustomerApp: () => void;
}

export default function AdminLoginScreen({ onLoginSuccess, onGoToCustomerApp }: AdminLoginScreenProps) {
  const { setUserRole, updateProfile } = useAppStore();

  const [emailOrPhone, setEmailOrPhone] = useState('admin@printnest.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setUserRole('admin');
      updateProfile('Master Admin', emailOrPhone.includes('@') ? emailOrPhone : 'admin@printnest.com');
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  const handleQuickDemoAdmin = () => {
    setUserRole('admin');
    updateProfile('Master Admin', 'admin@printnest.com');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between items-center p-6 font-sans select-none relative">
      
      {/* Top Header Switch */}
      <div className="w-full max-w-sm flex justify-between items-center text-xs font-bold text-slate-400">
        <span>9:41</span>
        <button 
          onClick={onGoToCustomerApp}
          className="text-xs text-[#16A34A] hover:underline cursor-pointer"
        >
          Customer App →
        </button>
      </div>

      {/* CENTER LOGIN CONTAINER (PIXEL-PERFECT MATCH TO REFERENCE MOCKUP) */}
      <div className="max-w-sm w-full my-auto space-y-6 text-center animate-fade-in">
        
        {/* Green Printer Vector Icon Logo & Brand Header */}
        <div className="space-y-1">
          <div className="w-16 h-16 mx-auto flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
              <rect x="14" y="24" width="36" height="22" rx="6" fill="#16A34A" />
              <path d="M20 24V14C20 12.3431 21.3431 11 23 11H41C42.6569 11 44 12.3431 44 14V24" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
              <rect x="20" y="38" width="24" height="15" rx="3" fill="white" stroke="#16A34A" strokeWidth="3" />
              <line x1="25" y1="44" x2="39" y2="44" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="48" x2="35" y2="48" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="21" cy="30" r="2" fill="white" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight font-sans">
            <span className="text-[#16A34A]">Print</span>
            <span className="text-slate-900 ml-0.5">Nest</span>
          </h1>
          <span className="text-[#16A34A] text-sm font-bold tracking-tight block">
            Admin Panel
          </span>
        </div>

        {/* Greeting Section */}
        <div className="space-y-1 pt-2">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5 font-sans">
            Welcome Back! <span className="inline-block animate-bounce origin-bottom-right">👋</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Sign in to continue to your admin panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          
          {/* Email or Phone */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Email or Phone
            </label>
            <input 
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Enter email or phone number"
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/20 transition-all shadow-2xs"
              required
            />
          </div>

          {/* Password */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3.5 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]/20 transition-all shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex justify-between items-center text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#16A34A] rounded cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button 
              type="button"
              onClick={() => alert('Demo Mode: Enter password "admin123" to sign in.')}
              className="text-[#16A34A] font-bold hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Primary Green Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0f7a26] hover:bg-[#15803d] text-white py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider: or continue with */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons (Google & Apple) */}
        <div className="grid grid-cols-2 gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.39c.68-.82 1.14-1.96 1.01-3.1-.98.04-2.18.66-2.88 1.48-.63.73-1.18 1.9-1.03 3.02 1.1.09 2.22-.57 2.9-1.4" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

      </div>

      {/* FOOTER: SECURE ADMIN ACCESS BADGE */}
      <div className="w-full text-center py-4">
        <span className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Secure Admin Access</span>
        </span>
      </div>

    </div>
  );
}
