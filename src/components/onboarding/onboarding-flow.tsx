'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle2, Award, GraduationCap, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

// SVG Leaf representing the floating graphics in onboarding background
const RealisticLeaf = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 120 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    <path 
      d="M10 40 C 35 15, 85 15, 110 40 C 85 65, 35 65, 10 40 Z" 
      fill="url(#leafGrad)"
    />
    <path 
      d="M5 40 L 115 40" 
      stroke="#14532d" 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <path d="M35 40 Q 45 30 50 25" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M55 40 Q 65 30 70 25" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M75 40 Q 85 30 90 25" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M35 40 Q 45 50 50 55" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M55 40 Q 65 50 70 55" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M75 40 Q 85 50 90 55" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<'splash' | 'login' | 'signup' | 'success'>('splash');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('kaushav@printnest.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  
  // Signup Form States
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const { updateProfile } = useAppStore();

  // Progress Bar Simulation for Splash Screen
  useEffect(() => {
    if (step !== 'splash') return;
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait 300ms and switch to login
          setTimeout(() => setStep('login'), 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4; // increment randomly
      });
    }, 80);

    return () => clearInterval(interval);
  }, [step]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = loginEmail.split('@')[0];
    const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    updateProfile(capitalized, loginEmail);
    onComplete();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    updateProfile(`${signupFirstName} ${signupLastName}`, signupEmail);
    onComplete();
  };

  const handleSocialLogin = () => {
    updateProfile('Kaushav', 'kaushav@printnest.com');
    onComplete();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white  flex flex-col font-sans select-none transition-colors duration-300">
      
      {/* Floating Animated Leaf & Geometry Graphics Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Top-Left soft green quarter circle backdrop */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-[#e6f4ea] rounded-full opacity-80"></div>

        {/* Bottom-Right Concentric Arcs (drawn mathematically via SVGs for pixel-perfect curves) */}
        <svg viewBox="0 0 400 400" className="absolute bottom-0 right-0 w-[420px] h-[420px] pointer-events-none opacity-85" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="300" fill="none" stroke="#e6f4ea" strokeWidth="42" />
          <circle cx="400" cy="400" r="180" fill="none" stroke="#e6f4ea" strokeWidth="58" />
        </svg>

        {/* Floating leaf 1 (Top right) - blurred depth of field */}
        <RealisticLeaf 
          className="absolute w-44 h-28 right-[-5%] top-[8%] opacity-80 animate-float1"
          style={{ filter: 'blur(5px)', transform: 'rotate(35deg)' }}
        />
        
        {/* Floating leaf 2 (Bottom left) - foreground blur */}
        <RealisticLeaf 
          className="absolute w-64 h-40 left-[-6%] bottom-[4%] opacity-90 animate-float2"
          style={{ filter: 'blur(10px)', transform: 'rotate(-40deg)' }}
        />

        {/* Background geometry outlines (Circles and Pluses matching reference layout) */}
        <div className="absolute inset-0 z-0">
          {/* Left circles */}
          <div className="absolute left-[31.5%] top-[39.5%] w-3 h-3 rounded-full border border-[#16a34a]/30"></div>
          <div className="absolute left-[15%] top-[49%] w-3.5 h-3.5 rounded-full border border-[#16a34a]/30"></div>
          
          {/* Right circles */}
          <div className="absolute right-[33.5%] top-[35.5%] w-2.5 h-2.5 rounded-full border border-[#16a34a]/30"></div>
          <div className="absolute right-[21%] top-[43.5%] w-3.5 h-3.5 rounded-full border border-[#16a34a]/30"></div>
          
          {/* Pluses */}
          <span className="absolute left-[34.5%] top-[43%] text-[9px] text-[#16a34a]/40 font-bold font-sans">+</span>
          <span className="absolute left-[18.5%] top-[53%] text-[9px] text-[#16a34a]/40 font-bold font-sans">+</span>
          <span className="absolute right-[37.5%] top-[42.5%] text-[9px] text-[#16a34a]/40 font-bold font-sans">+</span>
          <span className="absolute right-[24.5%] top-[48%] text-[9px] text-[#16a34a]/40 font-bold font-sans">+</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(35deg); }
          50% { transform: translateY(-10px) rotate(38deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(-40deg); }
          50% { transform: translateY(12px) rotate(-45deg); }
        }
        .animate-float1 {
          animation: float1 7s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 9s ease-in-out infinite;
        }
      `}</style>

      {/* ================================= STEP: SPLASH SCREEN ================================= */}
      {step === 'splash' && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 max-w-xl mx-auto w-full">
          {/* Printer Graphic */}
          <div className="relative w-80 h-64 flex items-center justify-center animate-fade-in-up">
            {/* Soft Green Backdrop behind the printer */}
            <div className="w-52 h-52 rounded-full bg-[#edf7ed] absolute z-0 blur-[1px]"></div>
            
            {/* Printer illustration */}
            <img 
              src="/printer_illustration.jpg" 
              alt="PrintNest Printer illustration"
              className="relative z-10 w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Logo Title */}
          <div className="mt-6 text-center z-10">
            <h1 className="text-5xl font-extrabold tracking-tight flex items-center justify-center font-sans">
              <span className="text-[#16a34a]">Print</span>
              <span className="text-[#111111] ml-0.5">Nest</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide mt-3 flex items-center justify-center gap-0.5">
              Print<span className="text-[#16a34a] font-bold">.</span> Bind<span className="text-[#16a34a] font-bold">.</span> Deliver<span className="text-[#16a34a] font-bold">.</span> Done<span className="text-[#16a34a] font-bold">.</span>
            </p>
          </div>

          {/* Loader Progress Bar */}
          <div className="w-72 mt-12 space-y-3 z-10">
            <div className="w-full h-1 bg-[#e6f0e7] rounded-full overflow-hidden">
              <div 
                className="bg-[#16a34a] h-full rounded-full transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[11px] font-medium tracking-widest text-slate-400 text-center">
              Loading...
            </p>
          </div>
        </div>
      )}

      {/* ================================= STEP: LOGIN ================================= */}
      {step === 'login' && (
        <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative z-10">
          {/* Logo Top Left */}
          <div className="flex items-center gap-1.5 self-start mb-6 md:mb-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-extrabold text-xs">
              P
            </div>
            <div className="text-left leading-none">
              <span className="font-extrabold text-sm tracking-tight text-slate-800  flex items-center">
                <span className="text-[#22c55e]">Print</span>Nest
              </span>
              <span className="text-[8px] text-slate-400 font-medium block">Print. Bind. Deliver. Done.</span>
            </div>
          </div>

          {/* Core Content: Split Grid */}
          <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center">
            
            {/* Left Column (Desktop Illustration) */}
            <div className="hidden lg:flex lg:col-span-6 flex-col text-left space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-800  leading-tight">
                  Your <span className="text-[#22c55e]">prints</span>,<br />our priority.
                </h2>
                <p className="text-slate-500  text-sm mt-3.5 leading-relaxed max-w-sm">
                  Fast, reliable and high quality printing services, anytime you need.
                </p>
              </div>

              {/* Printer Graphic */}
              <div className="w-80 h-64 relative flex items-center justify-center self-start">
                <img 
                  src="/printer_illustration.jpg" 
                  alt="Printer Illustration" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Features footer row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/50  max-w-lg">
                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Fast & Reliable</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Get your prints done quickly and on time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Premium Quality</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Exceptional print quality for every need.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Student Friendly</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Special offers and pricing for students.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Form Card) */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto relative animate-fade-in delay-100">
              <div className="bg-white  border border-slate-200/50  rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50  text-left space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 ">
                    Welcome <span className="text-[#22c55e]">back!</span>
                  </h3>
                  <p className="text-xs text-slate-500  mt-1.5">
                    Login to continue to your account
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold text-slate-700 ">
                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="mail@address.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-400">Password</label>
                      <button 
                        type="button" 
                        onClick={() => alert('Demo Mode: Try inputting any test email/password to Log In.')}
                        className="text-[10px] text-[#22c55e] font-bold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 rounded-xl font-extrabold text-sm transition-transform hover:scale-[1.01] shadow-md shadow-emerald-500/10 cursor-pointer text-center mt-6"
                  >
                    Log In
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-slate-100 "></div>
                  <span className="relative bg-white  px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    or continue with
                  </span>
                </div>

                {/* Social Login buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200  hover:bg-slate-50  rounded-xl text-[11px] font-bold text-slate-700  transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200  hover:bg-slate-50  rounded-xl text-[11px] font-bold text-slate-700  transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-current">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.32 3.65 10.42 7.37 10.28c1.39.05 2.19.78 3.01.78.83 0 1.93-.89 3.45-.73 1.5.09 2.61.73 3.29 1.74-3.1 1.86-2.59 5.86.35 7.06-.59 1.48-1.44 2.92-2.42 3.93zM15.47 5.7c.05-1.92-1.39-3.71-3.32-3.7-2.09.05-3.72 1.93-3.62 3.82 2 .05 3.81-1.86 3.62-3.82z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Footer Switcher */}
                <p className="text-center text-xs text-slate-500  pt-2">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setStep('signup')}
                    className="text-[#22c55e] font-extrabold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>

              </div>
            </div>

          </div>

          {/* Mobile bottom spacer */}
          <div className="h-6 md:h-0"></div>
        </div>
      )}

      {/* ================================= STEP: SIGNUP ================================= */}
      {step === 'signup' && (
        <div className="flex-1 flex flex-col justify-between p-6 md:p-12 relative z-10">
          {/* Logo Top Left */}
          <div className="flex items-center gap-1.5 self-start mb-6 md:mb-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-extrabold text-xs">
              P
            </div>
            <div className="text-left leading-none">
              <span className="font-extrabold text-sm tracking-tight text-slate-800  flex items-center">
                <span className="text-[#22c55e]">Print</span>Nest
              </span>
              <span className="text-[8px] text-slate-400 font-medium block">Print. Bind. Deliver. Done.</span>
            </div>
          </div>

          {/* Core Content: Split Grid */}
          <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center">
            
            {/* Left Column (Desktop Illustration) */}
            <div className="hidden lg:flex lg:col-span-6 flex-col text-left space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-800  leading-tight">
                  Everything you need,<br /><span className="text-[#22c55e]">printed</span> perfectly.
                </h2>
                <p className="text-slate-500  text-sm mt-3.5 leading-relaxed max-w-sm">
                  Create an account and get access to fast, reliable and high quality printing services.
                </p>
              </div>

              {/* Printer Graphic */}
              <div className="w-80 h-64 relative flex items-center justify-center self-start">
                <img 
                  src="/printer_illustration.jpg" 
                  alt="Printer Illustration" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Features footer row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/50  max-w-lg">
                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Fast & Reliable</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Get your prints done quickly and on time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Premium Quality</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Exceptional print quality for every need.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                  <div className="p-1 bg-[#22c55e]/10 text-[#22c55e] rounded-lg shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-800 ">Student Friendly</h4>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">Special offers and pricing for students.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Form Card) */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto relative animate-fade-in delay-100">
              <div className="bg-white  border border-slate-200/50  rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50  text-left space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 ">
                    Create <span className="text-[#22c55e]">your</span> account
                  </h3>
                  <p className="text-xs text-slate-500  mt-1.5 leading-tight">
                    Sign up to get started with <span className="text-[#22c55e] font-semibold underline underline-offset-2">PrintNest</span>
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700 ">
                  {/* First & Last Name (Side by Side) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          placeholder="John"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          placeholder="Doe"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="john.doe@gmail.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={signupMobile}
                        onChange={(e) => setSignupMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200  bg-transparent text-slate-900  focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-350 accent-[#22c55e] w-4 h-4 shrink-0 focus:outline-none focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-[10px] font-medium leading-relaxed text-slate-500  cursor-pointer">
                      I agree to the{' '}
                      <span className="text-[#22c55e] font-extrabold hover:underline">Terms & Conditions</span>
                      {' '}and{' '}
                      <span className="text-[#22c55e] font-extrabold hover:underline">Privacy Policy</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-3 rounded-xl font-extrabold text-sm transition-transform hover:scale-[1.01] shadow-md shadow-emerald-500/10 cursor-pointer text-center mt-4"
                  >
                    Sign Up
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-slate-100 "></div>
                  <span className="relative bg-white  px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    or continue with
                  </span>
                </div>

                {/* Social Login buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200  hover:bg-slate-50  rounded-xl text-[11px] font-bold text-slate-700  transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={handleSocialLogin}
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200  hover:bg-slate-50  rounded-xl text-[11px] font-bold text-slate-700  transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-current">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.32 3.65 10.42 7.37 10.28c1.39.05 2.19.78 3.01.78.83 0 1.93-.89 3.45-.73 1.5.09 2.61.73 3.29 1.74-3.1 1.86-2.59 5.86.35 7.06-.59 1.48-1.44 2.92-2.42 3.93zM15.47 5.7c.05-1.92-1.39-3.71-3.32-3.7-2.09.05-3.72 1.93-3.62 3.82 2 .05 3.81-1.86 3.62-3.82z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Footer Switcher */}
                <p className="text-center text-xs text-slate-500  pt-2">
                  Already have an account?{' '}
                  <button
                    onClick={() => setStep('login')}
                    className="text-[#22c55e] font-extrabold hover:underline"
                  >
                    Log In
                  </button>
                </p>

              </div>
            </div>

          </div>

          {/* Mobile bottom spacer */}
          <div className="h-6 md:h-0"></div>
        </div>
      )}
      {/* ================================= STEP: SUCCESS MODAL/OVERLAY ================================= */}
      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 max-w-md mx-auto w-full animate-fade-in-up">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6 w-full">
            <div className="w-16 h-16 bg-[#edf7ed] text-[#16a34a] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 animate-pulse-slow" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-800">
                Authentication Successful!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Welcome to <span className="text-[#16a34a] font-bold">PrintNest</span>. You have successfully authenticated into the prototype workspace.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Account Credentials</span>
              <p className="text-xs font-bold text-slate-800">
                User Name: <span className="font-semibold text-slate-650">Kaushav</span>
              </p>
              <p className="text-xs font-bold text-slate-800">
                Primary Email: <span className="font-semibold text-slate-650">kaushav@printnest.com</span>
              </p>
              <p className="text-xs font-bold text-slate-800">
                Prototype Status: <span className="font-bold text-[#16a34a]">Ready</span>
              </p>
            </div>

            <button
              onClick={() => setStep('login')}
              className="w-full bg-[#16a34a] hover:bg-emerald-700 text-white py-3 rounded-xl font-extrabold text-xs transition-transform hover:scale-[1.01] shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Sign Out / Reset
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
