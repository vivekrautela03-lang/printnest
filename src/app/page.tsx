'use client';

import React, { useState, useEffect } from 'react';
import OnboardingFlow from '@/components/onboarding/onboarding-flow';
import CustomerDashboard from '@/components/customer/customer-dashboard';
import AdminLoginScreen from '@/components/admin/admin-login-screen';
import AdminFullPanel from '@/components/admin/admin-full-panel';
import AccessDenied from '@/components/admin/access-denied';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { user } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // App Panel Routing State: 'customer' | 'admin_login' | 'admin_console'
  const [panelMode, setPanelMode] = useState<'customer' | 'admin_login' | 'admin_console'>('customer');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#16A34A] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-4 font-semibold">Bootstrapping PrintNest Platform...</p>
      </div>
    );
  }

  // 1. Admin Login View
  if (panelMode === 'admin_login') {
    return (
      <AdminLoginScreen 
        onLoginSuccess={() => setPanelMode('admin_console')}
        onGoToCustomerApp={() => setPanelMode('customer')}
      />
    );
  }

  // 2. Admin Console View (With Role Guard)
  if (panelMode === 'admin_console') {
    if (!user || user.role === 'customer') {
      return (
        <AccessDenied 
          onGoHome={() => setPanelMode('customer')}
          onGoToLogin={() => setPanelMode('admin_login')}
        />
      );
    }

    return (
      <AdminFullPanel 
        onSignOut={() => setPanelMode('admin_login')}
        onGoToCustomerApp={() => setPanelMode('customer')}
      />
    );
  }

  // 3. Customer Panel View (Onboarding vs Main App)
  if (showOnboarding) {
    return (
      <div className="relative">
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
        
        {/* Floating Admin Quick Access Switch */}
        <button
          onClick={() => setPanelMode('admin_login')}
          className="fixed top-4 right-4 z-50 bg-slate-900/90 text-emerald-400 hover:text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold border border-emerald-500/30 shadow-lg cursor-pointer transition-all"
        >
          🔑 Admin Portal Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <CustomerDashboard onSignOut={() => setShowOnboarding(true)} />

      {/* Floating Admin Portal Switch Button */}
      <button
        onClick={() => setPanelMode('admin_login')}
        className="fixed top-4 right-20 z-40 bg-slate-900 text-emerald-400 hover:bg-[#16A34A] hover:text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold border border-emerald-500/30 shadow-md cursor-pointer transition-all active:scale-95"
      >
        🔑 Admin Console
      </button>
    </div>
  );
}
