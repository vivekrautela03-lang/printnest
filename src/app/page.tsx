'use client';

import React, { useState, useEffect } from 'react';
import OnboardingFlow from '@/components/onboarding/onboarding-flow';
import CustomerDashboard from '@/components/customer/customer-dashboard';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-[#16a34a] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-4 font-semibold">Bootstrapping PrintNest...</p>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return <CustomerDashboard onSignOut={() => setShowOnboarding(true)} />;
}
