'use client';

import React, { useState, useRef } from 'react';
import { 
  Bell, Search, Plus, Home as HomeIcon, History, User, FileText, 
  CheckCircle2, X, UploadCloud, Sparkles, ArrowRight, ArrowLeft, Image as ImageIcon,
  Printer, BookOpen, Layers, RefreshCw, Scissors, Maximize, Wand2, 
  Check, Trash2, Phone, MessageSquare, Download, CreditCard, Wallet, MapPin, Calendar, Clock, ShieldCheck,
  ChevronDown, ChevronRight, Camera as CameraIcon, Mail, Heart, Award, Ticket
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CustomerDashboardProps {
  onSignOut?: () => void;
}

export default function CustomerDashboard({ onSignOut }: CustomerDashboardProps) {
  const { user, orders, placeOrder, topUpWallet } = useAppStore();

  // Native File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadType, setCurrentUploadType] = useState<string>('all');

  // Master Screen Navigation Flow:
  // 'dashboard' | 'all_tools' | 'upload' | 'print_options' | 'cart' | 'payment' | 'payment_success' | 'track_order' | 'order_details' | 'profile_screen'
  const [currentScreen, setCurrentScreen] = useState<
    'dashboard' | 'all_tools' | 'upload' | 'print_options' | 'cart' | 'payment' | 'payment_success' | 'track_order' | 'order_details' | 'profile_screen'
  >('dashboard');

  // File Upload State (Screen 1)
  const [allowedFileType, setAllowedFileType] = useState<'all' | 'pdf' | 'image'>('all');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    pages: number;
    size: string;
    type: 'pdf' | 'image';
    previewUrl?: string;
  } | null>({
    name: 'Notes.pdf',
    pages: 12,
    size: '2.4 MB',
    type: 'pdf'
  });

  // Print Settings State (Screen 2)
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Legal' | 'Letter'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [printSide, setPrintSide] = useState<'single' | 'double'>('double');
  const [binding, setBinding] = useState<'none' | 'spiral' | 'hard' | 'soft' | 'staple'>('spiral');
  const [pageRange, setPageRange] = useState<'all' | 'custom'>('all');
  const [customPageText, setCustomPageText] = useState('1-5, 8, 11-13');
  const [paperQuality, setPaperQuality] = useState<'normal' | 'premium' | 'glossy'>('normal');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'pickup'>('home');

  // Cart & Payment States
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'paylater' | 'cash'>('upi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Active Modals & Search
  const [activeModal, setActiveModal] = useState<'none' | 'notifications' | 'profile' | 'admin'>('none');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Price Calculation Engine
  const baseRate = printType === 'color' ? 8 : 2;
  const pagesCount = uploadedFile ? uploadedFile.pages : 12;
  const bindingCost = binding === 'spiral' ? 40 : binding === 'hard' ? 150 : binding === 'soft' ? 90 : binding === 'staple' ? 10 : 0;
  const deliveryCharge = deliveryMethod === 'home' ? 10 : 0;
  const qualityMultiplier = paperQuality === 'premium' ? 1.5 : paperQuality === 'glossy' ? 2 : 1;

  const printingSubtotal = Math.round(copies * pagesCount * baseRate * qualityMultiplier);
  const orderSubtotal = printingSubtotal + bindingCost;
  const totalAmountBeforeDiscount = orderSubtotal + deliveryCharge;
  const finalTotalAmount = Math.max(0, totalAmountBeforeDiscount - discountAmount);

  // File Upload Helper to trigger browser input/camera
  const triggerFileInput = (type: string, accept: string, capture?: string) => {
    setCurrentUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      if (capture) {
        fileInputRef.current.setAttribute('capture', capture);
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  // Handle File Selected Event
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      setUploadedFile({
        name: file.name,
        pages: isPdf ? Math.max(1, Math.floor(file.size / 40000)) : 1,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: isPdf ? 'pdf' : 'image'
      });
      setCurrentScreen('print_options');
    } else {
      handleFallbackUpload(currentUploadType);
    }
  };

  // Fallback Upload Handler (Simulates realistic file selection if native picker is cancelled)
  const handleFallbackUpload = (type: string) => {
    const fallbacks: Record<string, { name: string; pages: number; size: string; type: 'pdf' | 'image' }> = {
      all: { name: 'My_Document.pdf', pages: 8, size: '1.8 MB', type: 'pdf' },
      camera: { name: 'Camera_Photo_Scan.jpg', pages: 1, size: '3.2 MB', type: 'image' },
      pdf: { name: 'Notes_Document.pdf', pages: 12, size: '2.4 MB', type: 'pdf' },
      scanner: { name: 'Scanned_Doc_HD.pdf', pages: 4, size: '1.5 MB', type: 'pdf' },
      gallery: { name: 'Photo_Gallery_HQ.jpg', pages: 1, size: '2.9 MB', type: 'image' },
      doc: { name: 'Report_Assignment.docx', pages: 6, size: '1.1 MB', type: 'pdf' },
      xls: { name: 'Financial_Spreadsheet.xlsx', pages: 3, size: '0.8 MB', type: 'pdf' },
      ppt: { name: 'Project_Presentation.pptx', pages: 15, size: '4.5 MB', type: 'pdf' },
    };
    const selected = fallbacks[type] || fallbacks['all'];
    setUploadedFile(selected);
    setCurrentScreen('print_options');
  };

  // 8 Exact Upload Services Matching Image 2
  const uploadServicesGrid = [
    {
      id: 'all_files',
      label: 'All Files',
      circleBg: 'bg-[#fffbeb] border border-amber-100',
      action: () => triggerFileInput('all', '*/*'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <path d="M3 7A2 2 0 0 1 5 5H9L11 7H19A2 2 0 0 1 21 9V17A2 2 0 0 1 19 19H5A2 2 0 0 1 3 17V7Z" fill="#f59e0b" fillOpacity="0.25" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
          <path d="M3 9H21" stroke="#d97706" strokeWidth="1.8" />
        </svg>
      )
    },
    {
      id: 'camera',
      label: 'Camera',
      circleBg: 'bg-[#e0f2fe] border border-sky-100',
      action: () => triggerFileInput('camera', 'image/*', 'environment'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="3" fill="#0284c7" />
          <path d="M9 6L10.5 4H13.5L15 6" fill="#0284c7" />
          <circle cx="12" cy="13" r="4" fill="white" />
          <circle cx="12" cy="13" r="2.2" fill="#0284c7" />
        </svg>
      )
    },
    {
      id: 'pdf',
      label: 'PDF',
      circleBg: 'bg-[#fef2f2] border border-rose-100',
      action: () => triggerFileInput('pdf', '.pdf,application/pdf'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#dc2626" />
          <path d="M14 2V8H20" fill="#b91c1c" />
          <rect x="6" y="11" width="12" height="7" rx="1.5" fill="white" />
          <text x="7.2" y="16.2" fill="#dc2626" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">PDF</text>
        </svg>
      )
    },
    {
      id: 'scanner',
      label: 'Scanner',
      circleBg: 'bg-[#f0fdf4] border border-emerald-100',
      action: () => triggerFileInput('scanner', 'image/*', 'environment'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="7" width="10" height="10" rx="1.5" fill="#16a34a" fillOpacity="0.25" />
          <line x1="9" y1="10" x2="15" y2="10" stroke="#16a34a" strokeWidth="1.8" />
          <line x1="9" y1="12" x2="15" y2="12" stroke="#16a34a" strokeWidth="1.8" />
          <line x1="9" y1="14" x2="13" y2="14" stroke="#16a34a" strokeWidth="1.8" />
        </svg>
      )
    },
    {
      id: 'gallery',
      label: 'Gallery',
      circleBg: 'bg-[#f3e8ff] border border-purple-100',
      action: () => triggerFileInput('gallery', 'image/*'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#7e22ce" />
          <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="2" fill="white" />
        </svg>
      )
    },
    {
      id: 'doc',
      label: 'DOC',
      circleBg: 'bg-[#e0f2fe] border border-sky-100',
      action: () => triggerFileInput('doc', '.doc,.docx,.txt'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <path d="M5 3C5 1.89543 5.89543 1 7 1H15L20 6V21C20 22.1046 19.1046 23 18 23H7C5.89543 23 5 22.1046 5 21V3Z" fill="#0284c7" />
          <path d="M15 1V6H20" fill="#0369a1" />
          <line x1="9" y1="11" x2="16" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="15" x2="16" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'xls',
      label: 'XLS',
      circleBg: 'bg-[#f0fdf4] border border-emerald-100',
      action: () => triggerFileInput('xls', '.xls,.xlsx,.csv'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#15803d" />
          <rect x="6" y="6" width="12" height="3" rx="0.5" fill="white" />
          <rect x="6" y="10.5" width="5.5" height="3" rx="0.5" fill="white" fillOpacity="0.85" />
          <rect x="12.5" y="10.5" width="5.5" height="3" rx="0.5" fill="white" fillOpacity="0.85" />
          <rect x="6" y="15" width="5.5" height="3" rx="0.5" fill="white" fillOpacity="0.85" />
          <rect x="12.5" y="15" width="5.5" height="3" rx="0.5" fill="white" fillOpacity="0.85" />
        </svg>
      )
    },
    {
      id: 'ppt',
      label: 'PPT',
      circleBg: 'bg-[#fff7ed] border border-orange-100',
      action: () => triggerFileInput('ppt', '.ppt,.pptx'),
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#ea580c" />
          <path d="M10 8L16 12L10 16V8Z" fill="white" />
        </svg>
      )
    }
  ];

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'PRINTFIRST' || promoCode.toUpperCase() === 'PRINTNEST') {
      setPromoApplied(true);
      setDiscountAmount(10);
    } else {
      alert('Invalid promo code! Try "PRINTFIRST" for ₹10 off.');
    }
  };

  // Payment Submit Handler
  const handleCompletePayment = () => {
    placeOrder(selectedPaymentMethod === 'wallet' ? 'wallet' : 'card', '248, Rajpur Road, Dehradun');
    setCurrentScreen('payment_success');
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] text-slate-800 flex flex-col font-sans select-none relative pb-24">
      
      {/* Hidden Native File Selector */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileSelected} 
      />

      {/* Container Wrapper */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 text-left">
        
        {/* ========================================================================================= */}
        {/* SCREEN 0: DASHBOARD (HOME SCREEN) */}
        {/* ========================================================================================= */}
        {currentScreen === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Personalized Header */}
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
                  Hi, {user?.name || 'Kaushav'} <span className="inline-block animate-bounce origin-bottom-right">👋</span>
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  What would you like to do today?
                </p>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setActiveModal('notifications')}
                  className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 relative hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95 bg-white"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-ping"></span>
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                </button>
              </div>
            </div>

            {/* Permanent Green Highlight Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, documents..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border-2 border-[#86efac] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 text-xs font-semibold text-slate-700 placeholder:text-slate-400 transition-all shadow-xs"
              />
            </div>

            {/* Promotional Banner Card */}
            <div className="p-6 rounded-3xl bg-[#0f7a26] text-white relative overflow-hidden border border-emerald-600/10 shadow-md flex justify-between items-center min-h-[180px]">
              <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden z-0 opacity-15">
                <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
                  <circle cx="150" cy="100" r="80" fill="none" stroke="white" strokeWidth="6" />
                  <circle cx="150" cy="100" r="50" fill="none" stroke="white" strokeWidth="8" />
                </svg>
              </div>

              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-white absolute left-[51%] top-[38%] opacity-90 animate-pulse pointer-events-none z-10">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>

              <div className="space-y-4 max-w-sm relative z-10 text-left">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-extrabold leading-tight">
                    Print Today,<br />Pickup Tomorrow!
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-medium tracking-wide">
                    Fast. Reliable. Student Friendly.
                  </p>
                </div>
                <button
                  onClick={() => triggerFileInput('all', '*/*')}
                  className="bg-white hover:bg-slate-50 text-[#0f7a26] text-[11px] font-extrabold py-2 px-5 rounded-full transition-transform hover:scale-[1.03] shadow-md cursor-pointer active:scale-95"
                >
                  Order Now
                </button>
              </div>

              <div className="hidden md:block w-72 h-44 relative shrink-0 z-10">
                <img 
                  src="/printer_illustration.jpg" 
                  alt="PrintNest Studio printer"
                  className="w-full h-full object-contain brightness-105"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>

            {/* Upload Files To Order Printouts (MATCHING IMAGE 2 EXACTLY) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                  Upload Files To Order <span className="text-[#16A34A]">Printouts</span>
                </h3>
              </div>

              {/* 8 Cards Grid Matching Image 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {uploadServicesGrid.map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={opt.action}
                    className="p-5 md:p-6 border border-slate-100/90 rounded-[22px] bg-white flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer hover:shadow-lg hover:border-[#16A34A]/40 transition-all duration-200 active:scale-95 shadow-xs group"
                  >
                    <div className={`w-16 h-16 rounded-full ${opt.circleBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                      {opt.icon}
                    </div>

                    <span className="text-xs md:text-sm font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-[#16A34A] transition-colors">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 font-sans">Recent Orders</h4>
                <button 
                  onClick={() => setCurrentScreen('track_order')}
                  className="text-xs font-bold text-[#16A34A] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div 
                  onClick={() => setCurrentScreen('track_order')}
                  className="p-4 border border-slate-100 rounded-2xl bg-white flex items-center justify-between gap-4 flex-1 cursor-pointer hover:border-emerald-500/30 transition-all hover:shadow-md active:scale-95"
                >
                  <div className="flex items-center gap-3.5 max-w-[70%]">
                    <div className="w-11 h-11 bg-rose-50 border border-rose-100 rounded-xl flex flex-col items-center justify-center shrink-0 text-rose-600 font-extrabold text-[9px] leading-none space-y-0.5">
                      <FileText className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span className="bg-rose-500 text-white text-[7px] px-1 py-[0.5px] rounded font-mono font-bold">PDF</span>
                    </div>
                    
                    <div className="text-left leading-tight">
                      <span className="text-xs font-extrabold text-slate-900 font-mono block">
                        PRT00054
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        12 May 2024
                      </span>
                    </div>
                  </div>

                  <div className="text-right leading-none shrink-0 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 py-0.5 px-2 rounded-full inline-block">
                      In Progress
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 font-mono block mt-1">
                      ₹216.00
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => triggerFileInput('all', '*/*')}
                  className="w-full sm:w-28 min-h-[64px] border-2 border-dashed border-slate-200 hover:border-[#16A34A] rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#16A34A] transition-colors cursor-pointer shrink-0 active:scale-95 bg-white"
                >
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* SCREEN: MY PROFILE */}
        {/* ========================================================================================= */}
        {currentScreen === 'profile_screen' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans">My Profile</h2>
                <p className="text-xs text-slate-400 font-medium">Manage your account and preferences</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveModal('notifications')}
                  className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 relative hover:bg-slate-50 bg-white"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 bg-white shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Kaushav" className="w-full h-full object-cover" />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="p-6 border border-slate-100 rounded-3xl bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 overflow-hidden shadow-xs">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Kaushav Sharma" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-white text-[#16A34A] rounded-full border border-slate-200 flex items-center justify-center shadow-xs hover:bg-emerald-50 cursor-pointer">
                    <CameraIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">Kaushav Sharma</h3>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      Verified ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> kaushav@example.com
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> +91 98765 43210
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Dehradun, Uttarakhand, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-center space-y-1 px-3">
                  <div className="w-10 h-10 bg-emerald-50 text-[#16A34A] rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 block font-mono">24</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Orders</span>
                </div>

                <div className="h-10 w-px bg-slate-100"></div>

                <div className="text-center space-y-1 px-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 block font-mono">120</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PrintNest Credits</span>
                </div>

                <div className="h-10 w-px bg-slate-100"></div>

                <div className="text-center space-y-1 px-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900 block font-sans">Silver</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Membership</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-100 rounded-3xl bg-white space-y-4 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-900">Account Settings</h4>

                <div className="space-y-1">
                  {[
                    { title: 'Personal Information', desc: 'Update your name, email and phone number', icon: User },
                    { title: 'Addresses', desc: 'Manage your delivery addresses', icon: MapPin },
                    { title: 'Payment Methods', desc: 'Add or manage your payment methods', icon: CreditCard },
                    { title: 'Print Preferences', desc: 'Set your default print settings', icon: Printer },
                    { title: 'Notifications', desc: 'Manage your notification preferences', icon: Bell },
                    { title: 'Security', desc: 'Change password and security settings', icon: ShieldCheck },
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => alert(`Opened ${item.title}`)}
                      className="p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-emerald-50 text-[#16A34A] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-[#16A34A] transition-colors">{item.title}</h5>
                          <p className="text-[10.5px] text-slate-400 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 border border-slate-100 rounded-3xl bg-white space-y-4 text-left shadow-sm">
                  <h4 className="text-sm font-extrabold text-slate-900">My Wallet</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-100 text-[#16A34A] rounded-xl flex items-center justify-center">
                          <Wallet className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">PrintNest Credits</span>
                          <span className="text-base font-extrabold text-slate-900 font-mono">120</span>
                        </div>
                      </div>
                      <button onClick={() => topUpWallet(500)} className="w-full py-2 border border-[#16A34A] text-[#16A34A] hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                        + Add Credits
                      </button>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                          <Ticket className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Offers & Rewards</span>
                          <span className="text-base font-extrabold text-slate-900 font-mono">5</span>
                        </div>
                      </div>
                      <button onClick={() => setActiveModal('notifications')} className="w-full py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                        View Rewards
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-slate-100 rounded-3xl bg-white space-y-4 text-left shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-extrabold text-slate-900">Recent Orders</h4>
                    <button onClick={() => setCurrentScreen('track_order')} className="text-xs font-bold text-[#16A34A] hover:underline">View All</button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 'PRT00054', date: '12 May 2024', status: 'In Progress', statusColor: 'text-[#16A34A] bg-emerald-50', amount: '₹216.00' },
                      { id: 'PRT00053', date: '10 May 2024', status: 'Delivered', statusColor: 'text-[#16A34A] bg-emerald-50', amount: '₹128.00' },
                      { id: 'PRT00052', date: '08 May 2024', status: 'Delivered', statusColor: 'text-[#16A34A] bg-emerald-50', amount: '₹85.00' },
                    ].map((ord) => (
                      <div key={ord.id} onClick={() => setCurrentScreen('track_order')} className="p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-slate-900 group-hover:text-[#16A34A]">{ord.id}</h5>
                            <span className="text-[10px] text-slate-400 font-medium">{ord.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${ord.statusColor}`}>{ord.status}</span>
                          <span className="text-xs font-extrabold font-mono text-slate-900">{ord.amount}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setCurrentScreen('track_order')} className="w-full text-center text-xs font-bold text-[#16A34A] hover:underline pt-2">
                    View All Orders →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: ALL TOOLS (EXACT MATCH TO IMAGE 2) */}
        {currentScreen === 'all_tools' && (
          <div className="space-y-7 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer bg-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                  All Tools
                </h2>
              </div>

              <button 
                onClick={() => setActiveModal('notifications')}
                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 relative hover:bg-slate-50 cursor-pointer bg-white"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
              </button>
            </div>

            {/* Upload Files To Order Printouts (MATCHING IMAGE 2 EXACTLY) */}
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                Upload Files To Order <span className="text-[#16A34A]">Printouts</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {uploadServicesGrid.map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={opt.action}
                    className="p-5 md:p-6 border border-slate-100/90 rounded-[22px] bg-white flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer hover:shadow-lg hover:border-[#16A34A]/40 transition-all duration-200 active:scale-95 shadow-xs group"
                  >
                    <div className={`w-16 h-16 rounded-full ${opt.circleBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs`}>
                      {opt.icon}
                    </div>

                    <span className="text-xs md:text-sm font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-[#16A34A] transition-colors">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN: PRINT OPTIONS */}
        {currentScreen === 'print_options' && (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-in text-left">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer bg-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                  Print Options
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Configure print modes, copies, paper quality & delivery</p>
              </div>
            </div>

            <div className="p-3.5 border border-slate-100 rounded-2xl bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">{uploadedFile?.name || 'Notes.pdf'}</h5>
                  <span className="text-[10px] text-slate-400">{pagesCount} Pages • {uploadedFile?.size || '2.4 MB'}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg">Verified</span>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-2xl bg-white">
                <span className="font-extrabold text-slate-800">Copies</span>
                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button onClick={() => setCopies(Math.max(1, copies - 1))} className="w-8 h-8 rounded-lg bg-white border text-slate-700 font-extrabold flex items-center justify-center text-sm shadow-xs cursor-pointer">-</button>
                  <span className="w-6 text-center font-extrabold font-mono text-sm">{copies}</span>
                  <button onClick={() => setCopies(copies + 1)} className="w-8 h-8 rounded-lg bg-white border text-slate-700 font-extrabold flex items-center justify-center text-sm shadow-xs cursor-pointer">+</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Print Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPrintType('bw')} className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${printType === 'bw' ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]' : 'border-slate-200 bg-white text-slate-700'}`}>Black & White (₹2/p)</button>
                  <button onClick={() => setPrintType('color')} className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${printType === 'color' ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]' : 'border-slate-200 bg-white text-slate-700'}`}>Colour (₹8/p)</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Paper Size</label>
                  <select value={paperSize} onChange={(e) => setPaperSize(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold focus:outline-none">
                    <option value="A4">A4 (Standard)</option>
                    <option value="A3">A3 (Poster Size)</option>
                    <option value="Legal">Legal</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Orientation</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={() => setOrientation('portrait')} className={`p-2.5 rounded-xl border text-center font-bold ${orientation === 'portrait' ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]' : 'border-slate-200 bg-white'}`}>Portrait</button>
                    <button onClick={() => setOrientation('landscape')} className={`p-2.5 rounded-xl border text-center font-bold ${orientation === 'landscape' ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]' : 'border-slate-200 bg-white'}`}>Landscape</button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Binding Style</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[11px]">
                  {[
                    { id: 'none', label: 'No Binding' },
                    { id: 'spiral', label: 'Spiral (₹40)' },
                    { id: 'soft', label: 'Soft (₹90)' },
                    { id: 'hard', label: 'Hard (₹150)' },
                    { id: 'staple', label: 'Staple (₹10)' }
                  ].map((b) => (
                    <button 
                      key={b.id} 
                      onClick={() => setBinding(b.id as any)} 
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${binding === b.id ? 'border-[#16A34A] bg-emerald-50 text-[#16A34A]' : 'border-slate-200 bg-white text-slate-700'}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Price</span>
                  <span className="text-xl font-extrabold text-[#16A34A] font-mono">₹{printingSubtotal + bindingCost}.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery</span>
                  <span className="text-xs font-bold text-slate-700">Tomorrow, 12PM - 4PM</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreen('cart')}
                className="w-full bg-[#16A34A] hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                Add to Cart →
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: CART */}
        {currentScreen === 'cart' && (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('print_options')}
                  className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer bg-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                  Cart (Review Order)
                </h2>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-2xl bg-white flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex flex-col items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="w-5 h-5 fill-current opacity-85" />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{uploadedFile?.name || 'Notes.pdf'}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {pagesCount} Pages • Copies: {copies} • {printType === 'color' ? 'Color' : 'B&W'} • {binding.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono block">₹{orderSubtotal}.00</span>
                <button onClick={() => setCurrentScreen('print_options')} className="text-[10px] text-slate-400 hover:text-rose-500 font-bold underline mt-1">Edit</button>
              </div>
            </div>

            <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Printing Subtotal:</span>
                <span className="font-mono">₹{printingSubtotal}.00</span>
              </div>
              {bindingCost > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Binding Charge ({binding}):</span>
                  <span className="font-mono">₹{bindingCost}.00</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-mono">₹{deliveryCharge}.00</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-[#16A34A]">
                  <span>Promo Discount (PRINTFIRST):</span>
                  <span className="font-mono">-₹10.00</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2.5 flex justify-between text-slate-900 text-sm font-extrabold">
                <span>Total Amount:</span>
                <span className="font-mono text-[#16A34A]">₹{finalTotalAmount}.00</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentScreen('payment')}
                className="w-full bg-[#16A34A] hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 py-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: PAYMENT */}
        {currentScreen === 'payment' && (
          <div className="space-y-6 max-w-xl mx-auto animate-fade-in text-left">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <button 
                onClick={() => setCurrentScreen('cart')}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer bg-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                Payment Checkout
              </h2>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-700">Total Amount Payable</span>
              <span className="text-xl font-extrabold text-[#16A34A] font-mono">₹{finalTotalAmount}.00</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)} 
                placeholder="Enter Promo Code (e.g. PRINTFIRST)" 
                className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold uppercase placeholder:normal-case focus:outline-none"
              />
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-4 rounded-xl cursor-pointer">
                Apply
              </button>
            </form>

            <div className="space-y-3">
              <label className="text-[10px] text-slate-400 uppercase font-bold block">Choose a Payment Method</label>

              {[
                { id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm)', icon: '🟢' },
                { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                { id: 'netbanking', label: 'Net Banking (All Banks)', icon: '🏦' },
                { id: 'wallet', label: `Wallet Balance (₹${user?.walletBalance || 1250})`, icon: '👛' },
                { id: 'paylater', label: 'Pay Later (Pay in 30 days)', icon: '⏳' },
                { id: 'cash', label: 'Cash on Pickup', icon: '💵' },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${selectedPaymentMethod === method.id ? 'border-[#16A34A] bg-emerald-50/50 shadow-xs' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs font-bold text-slate-800">{method.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPaymentMethod === method.id ? 'border-[#16A34A] bg-[#16A34A]' : 'border-slate-300'}`}>
                    {selectedPaymentMethod === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 pt-2">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" /> Secured by Razorpay</span>
              <span>• 256-Bit SSL</span>
            </div>

            <button
              onClick={handleCompletePayment}
              className="w-full bg-[#16A34A] hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-[0.99]"
            >
              Pay ₹{finalTotalAmount}.00
            </button>
          </div>
        )}

        {/* SCREEN: PAYMENT SUCCESS */}
        {currentScreen === 'payment_success' && (
          <div className="space-y-6 max-w-md mx-auto py-8 animate-fade-in text-center">
            <div className="relative w-20 h-20 bg-emerald-50 text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-11 h-11 stroke-[2.2] animate-bounce" />
              <div className="absolute -top-1 -right-1 text-emerald-500 animate-ping">✨</div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900">Payment Successful!</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your order has been placed successfully. You will receive real-time printing updates shortly.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-left text-xs font-semibold space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Order ID:</span>
                <span className="font-mono font-extrabold text-slate-900">PRT00054</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Transaction ID:</span>
                <span className="font-mono font-bold text-slate-700">TXN99823410</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <span className="font-mono font-extrabold text-[#16A34A]">₹{finalTotalAmount}.00</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Delivery:</span>
                <span className="font-bold text-slate-800">Tomorrow, 2PM - 4PM</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setCurrentScreen('track_order')}
                className="w-full bg-[#16A34A] hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                Track Order
              </button>

              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 py-1"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* SCREEN: TRACK ORDER / ORDER DETAILS */}
        {(currentScreen === 'track_order' || currentScreen === 'order_details') && (
          <div className="space-y-6 max-w-md mx-auto animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer bg-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                    {currentScreen === 'track_order' ? 'Track Order' : 'Order Details'}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">Order #PRT00054 • Placed on 12 May 2024</p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-lg">₹{finalTotalAmount}.00</span>
            </div>

            {currentScreen === 'track_order' && (
              <div className="space-y-6">
                <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Live Status Timeline</h4>

                  <div className="relative pl-6 space-y-5 border-l-2 border-slate-100">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">✓</div>
                      <h5 className="text-xs font-bold text-slate-900">Order Received</h5>
                      <span className="text-[10px] text-slate-400 block">12 May 2024, 9:30 AM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">✓</div>
                      <h5 className="text-xs font-bold text-slate-900">Printing Started</h5>
                      <span className="text-[10px] text-slate-400 block">12 May 2024, 11:00 AM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">✓</div>
                      <h5 className="text-xs font-bold text-slate-900">Spiral Binding Completed</h5>
                      <span className="text-[10px] text-slate-400 block">12 May 2024, 02:15 PM</span>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px]">✓</div>
                      <h5 className="text-xs font-bold text-slate-900">Ready for Pickup / Delivery</h5>
                      <span className="text-[10px] text-slate-400 block">12 May 2024, 04:30 PM</span>
                    </div>

                    <div className="relative opacity-60">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">○</div>
                      <h5 className="text-xs font-bold text-slate-700">Out for Delivery</h5>
                      <span className="text-[10px] text-slate-400 block">Pending dispatch</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Type</span>
                    <span className="text-slate-800">Home Delivery</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Time</span>
                    <span className="text-slate-800">Tomorrow, 2PM - 4PM</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setCurrentScreen('order_details')} className="bg-[#16A34A] text-white py-3 rounded-xl font-extrabold text-xs text-center">
                    View Order Details
                  </button>
                  <button onClick={() => alert('Support line: +91 98765 43210')} className="bg-slate-100 text-slate-700 py-3 rounded-xl font-extrabold text-xs text-center">
                    Contact Support
                  </button>
                </div>
              </div>
            )}

            {currentScreen === 'order_details' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="p-4 border border-slate-100 rounded-2xl bg-white space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Order Items</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">{uploadedFile?.name || 'Notes.pdf'} ({pagesCount} Pages)</span>
                    <span className="font-mono font-bold">₹{orderSubtotal}.00</span>
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl bg-white space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</h4>
                  <p className="font-bold text-slate-800">Kaushav</p>
                  <p className="text-slate-500">248, Rajpur Road, Dehradun, Uttarakhand - 248001</p>
                </div>

                <button onClick={() => setCurrentScreen('track_order')} className="w-full bg-[#16A34A] text-white py-3.5 rounded-2xl font-extrabold text-xs text-center">
                  Back to Order Tracking
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 inset-x-0 h-14 bg-white border-t border-slate-100 flex justify-around items-center z-30 select-none shadow-lg">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${currentScreen === 'dashboard' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <HomeIcon className="w-4.5 h-4.5 shrink-0 fill-current" />
          <span className="text-[8px] font-extrabold tracking-wide uppercase leading-none">Home</span>
        </button>

        <button
          onClick={() => setCurrentScreen('track_order')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${currentScreen === 'track_order' || currentScreen === 'order_details' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <History className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold tracking-wide uppercase leading-none">Orders</span>
        </button>

        <button
          onClick={() => triggerFileInput('all', '*/*')}
          className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-[#16A34A] text-white -translate-y-3 shadow-lg active:scale-95 transition-all cursor-pointer"
          title="Configure Printing"
        >
          <Plus className="w-5.5 h-5.5 shrink-0" />
        </button>

        <button
          onClick={() => setActiveModal('notifications')}
          className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <Bell className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold tracking-wide uppercase leading-none">Notifications</span>
        </button>

        <button
          onClick={() => setCurrentScreen('profile_screen')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${currentScreen === 'profile_screen' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <User className="w-4.5 h-4.5 shrink-0 fill-current" />
          <span className="text-[8px] font-extrabold tracking-wide uppercase leading-none">Profile</span>
        </button>
      </nav>

      {/* Notifications Modal */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left border border-slate-100 relative">
            <button onClick={() => setActiveModal('none')} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>
            <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-[#16A34A]" /><h3 className="text-base font-bold text-slate-900">Alerts & Notifications</h3></div>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border text-xs"><span className="font-bold text-slate-800">🎉 Order Delivered!</span><p className="text-[10px] text-slate-500">Order #PRN-6582 binding finalized.</p></div>
              <div className="p-3 bg-slate-50 rounded-2xl border text-xs"><span className="font-bold text-slate-800">⚙️ Printing Progress</span><p className="text-[10px] text-slate-500">Order #PRT00054 is currently printing.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PANEL CONSOLE MODAL */}
      {activeModal === 'admin' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 text-left border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal('none')} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>

            <div>
              <span className="text-[10px] font-extrabold text-[#16A34A] uppercase tracking-wider">PLATFORM ADMINISTRATION</span>
              <h3 className="text-lg font-extrabold text-slate-900">Administrator Console</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] text-emerald-600 font-bold block">Estimated Revenue</span>
                <span className="text-base font-extrabold text-emerald-900 font-mono">₹48,250</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-[10px] text-blue-600 font-bold block">Deliveries Completed</span>
                <span className="text-base font-extrabold text-blue-900 font-mono">142</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[10px] text-amber-600 font-bold block">Active Printers</span>
                <span className="text-base font-extrabold text-amber-900 font-mono">3 Online</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-[10px] text-purple-600 font-bold block">Platform Users</span>
                <span className="text-base font-extrabold text-purple-900 font-mono">1,280</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Weekly Gross Revenue (INR)</span>
                <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-100 px-2 py-0.5 rounded-full">+14.8% MoM</span>
              </div>
              <div className="h-28 w-full">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <path d="M0,80 Q50,40 100,60 T200,20 T300,50 L300,100 L0,100 Z" fill="rgba(22, 163, 74, 0.15)" />
                  <path d="M0,80 Q50,40 100,60 T200,20 T300,50" fill="none" stroke="#16A34A" strokeWidth="3" />
                  <circle cx="200" cy="20" r="4" fill="#16A34A" />
                </svg>
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[10px] space-y-1">
              <p>11:45:00 AM - System initialized.</p>
              <p>11:46:12 AM - InkJet Pro Studio: Order #PRT00054 printing started.</p>
              <p>11:47:05 AM - Razorpay webhook: Payment TXN99823410 verified (₹36.00).</p>
            </div>

            <button onClick={() => alert('GST Invoice report compiled!')} className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-extrabold text-xs shadow-md">
              Download GST Tax Invoices (CSV/PDF)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
