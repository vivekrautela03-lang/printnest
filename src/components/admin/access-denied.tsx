'use client';

import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

interface AccessDeniedProps {
  onGoHome: () => void;
  onGoToLogin: () => void;
}

export default function AccessDenied({ onGoHome, onGoToLogin }: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-[#09110b] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 space-y-5 shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldAlert className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest block">SECURITY SHIELD GUARD</span>
          <h2 className="text-2xl font-extrabold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            You do not have administrative privileges to view this page. Admin authorization is required for platform console tools.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={onGoHome}
            className="w-full bg-[#16A34A] hover:bg-emerald-600 text-white py-3 rounded-2xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Customer Home</span>
          </button>

          <button
            onClick={onGoToLogin}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Admin Login Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
