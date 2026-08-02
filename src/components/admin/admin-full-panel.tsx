'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Wrench, BarChart3, Truck, Ticket, CreditCard, 
  Package, Settings, Search, Bell, Plus, CheckCircle2, XCircle, RefreshCw, Download, 
  ShieldCheck, Lock, Eye, Edit3, Trash2, Check, AlertTriangle, ArrowUpRight, ArrowDownRight, UserCheck, DollarSign, LogOut, ArrowLeft,
  Menu, Calendar, ChevronDown, Clock, FileText, ArrowUp, ArrowDown, TrendingUp
} from 'lucide-react';
import { useAppStore, Order, ServiceItem } from '@/store/useAppStore';

interface AdminFullPanelProps {
  onSignOut: () => void;
  onGoToCustomerApp: () => void;
}

export default function AdminFullPanel({ onSignOut, onGoToCustomerApp }: AdminFullPanelProps) {
  const { 
    user, orders, updateOrderStatus, 
    services, addService, updateService, deleteService, toggleServiceStatus,
    customersList, toggleBlockCustomer,
    deliveryPartners, updatePartnerStatus, assignOrderToPartner,
    couponsList, addCoupon, deleteCoupon,
    inventoryItems, updateInventoryStock,
    notifications
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'customers' | 'services' | 'reports' | 'delivery' | 'coupons' | 'payments' | 'inventory' | 'settings'
  >('overview');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Orders Tab Filter & Selected Order Modal
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Add Service Form Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Printing');
  const [newServiceBwPrice, setNewServiceBwPrice] = useState('2.00');
  const [newServiceColorPrice, setNewServiceColorPrice] = useState('8.00');

  // Add Coupon Form Modal
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponValue, setNewCouponValue] = useState('10');

  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="min-h-screen bg-[#fafbfa] text-slate-800 flex flex-col md:flex-row font-sans select-none pb-20 md:pb-0 relative">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-100 flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen">
        <div className="space-y-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              P
            </div>
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1 font-sans">
                Print<span className="text-[#16A34A]">Nest</span>
              </h2>
              <span className="text-[9px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider block mt-0.5">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold text-left">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: `Orders (${pendingOrdersCount})`, icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'services', label: 'Services & Rates', icon: Wrench },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'delivery', label: 'Delivery Partners', icon: Truck },
              { id: 'coupons', label: 'Coupons', icon: Ticket },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${activeTab === nav.id ? 'bg-[#16A34A] text-white shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <nav.icon className="w-4 h-4 shrink-0" />
                <span>{nav.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={onGoToCustomerApp}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2"><ArrowLeft className="w-3.5 h-3.5" /> Customer App</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-all cursor-pointer border border-rose-100"
          >
            <span className="flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex md:hidden animate-fade-in">
          <div className="w-72 bg-white h-full p-5 space-y-6 flex flex-col justify-between text-left">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-xs">P</div>
                  <span className="font-extrabold text-slate-900">PrintNest Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>

              <nav className="space-y-1 text-xs font-bold">
                {[
                  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'services', label: 'Services', icon: Wrench },
                  { id: 'reports', label: 'Reports', icon: BarChart3 },
                  { id: 'delivery', label: 'Delivery', icon: Truck },
                  { id: 'coupons', label: 'Coupons', icon: Ticket },
                  { id: 'inventory', label: 'Inventory', icon: Package },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((nav) => (
                  <button
                    key={nav.id}
                    onClick={() => { setActiveTab(nav.id as any); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === nav.id ? 'bg-[#16A34A] text-white font-extrabold' : 'text-slate-600'}`}
                  >
                    <nav.icon className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <button onClick={onGoToCustomerApp} className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
              ← Switch to Customer App
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 max-w-5xl mx-auto w-full px-4 md:px-8 py-5 space-y-5">
        
        {/* TOP NAVBAR (MATCHING REFERENCE EXACTLY) */}
        <header className="flex justify-between items-center py-2 border-b border-slate-100/80">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans tracking-tight mx-auto md:mx-0">
            Dashboard
          </h1>

          <div className="relative">
            <button className="w-9 h-9 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-slate-600 relative hover:bg-slate-50 cursor-pointer shadow-2xs">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* ========================================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD (MATCHING REFERENCE SCREENSHOT EXACTLY) */}
        {/* ========================================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in text-left">
            
            {/* Greeting Row & Date Picker Pill */}
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">Welcome back,</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans flex items-center gap-1.5">
                  Admin <span className="inline-block animate-bounce origin-bottom-right">👋</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">Here's what's happening today.</p>
              </div>

              {/* Date Filter Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs text-slate-700 text-xs font-extrabold cursor-pointer hover:border-slate-300 transition-colors">
                <span>12 May 2024</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* 4 STAT METRIC CARDS (2x2 GRID MATCHING REFERENCE) */}
            <div className="grid grid-cols-2 gap-3.5 md:gap-4">
              
              {/* Card 1: Total Orders */}
              <div className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xs space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block tracking-tight">1,248</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                    <span>12.5%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Revenue */}
              <div className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xs space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Total Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                    <span className="text-sm font-extrabold font-mono">₹</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block tracking-tight">₹1,24,560</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                    <span>15.8%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Pending Orders */}
              <div className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xs space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Pending Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block tracking-tight">320</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                    <span>5.2%</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Completed Orders */}
              <div className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xs space-y-3 relative">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Completed Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono block tracking-tight">928</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                    <span>18.3%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* REVENUE OVERVIEW CHART CARD (MATCHING REFERENCE) */}
            <div className="p-5 sm:p-6 bg-white border border-slate-100 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-slate-900 font-sans">Revenue Overview</h3>
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 cursor-pointer">
                  <span>This Week</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">₹1,24,560</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3 stroke-[2.5]" /> 15.8% <span className="text-slate-400 font-normal text-[10px] ml-0.5">vs last week</span>
                  </span>
                </div>
              </div>

              {/* Exact Line Chart Visual with Green Filled Dots */}
              <div className="h-48 w-full pt-2">
                <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="30" y1="20" x2="390" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="60" x2="390" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="30" y1="100" x2="390" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="5" y="24" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">40K</text>
                  <text x="5" y="64" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">20K</text>
                  <text x="15" y="104" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">0</text>

                  {/* Gradient Area Fill */}
                  <path 
                    d="M 35,95 Q 60,60 90,75 T 150,45 T 210,85 T 270,40 T 330,65 T 385,25 L 385,100 L 35,100 Z" 
                    fill="url(#chartGradient)" 
                  />

                  {/* Green Smooth Curve Line */}
                  <path 
                    d="M 35,95 Q 60,60 90,75 T 150,45 T 210,85 T 270,40 T 330,65 T 385,25" 
                    fill="none" 
                    stroke="#16A34A" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />

                  {/* Data Points (Green Dots) */}
                  <circle cx="35" cy="95" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="90" cy="75" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="150" cy="45" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="210" cy="85" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="270" cy="40" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="330" cy="65" r="3.5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                  <circle cx="385" cy="25" r="4.5" fill="#16A34A" stroke="white" strokeWidth="2" />

                  {/* Date X-Axis Labels */}
                  <text x="30" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">06 May</text>
                  <text x="90" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">07 May</text>
                  <text x="150" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">08 May</text>
                  <text x="210" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">09 May</text>
                  <text x="270" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">10 May</text>
                  <text x="330" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">11 May</text>
                  <text x="385" y="118" fontSize="8" fill="#94a3b8" textAnchor="middle">12 May</text>
                </svg>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div className="flex flex-wrap gap-2">
              {['All', 'Received', 'Printing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${orderStatusFilter === st ? 'bg-[#16A34A] text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-extrabold text-slate-900">{ord.orderCode}</td>
                        <td className="p-3"><span className="font-bold text-slate-900 block">{ord.customerName}</span><span className="text-[10px] text-slate-400">{ord.customerPhone}</span></td>
                        <td className="p-3 text-slate-500">{ord.date}</td>
                        <td className="p-3 font-mono font-extrabold text-[#16A34A]">₹{ord.total}.00</td>
                        <td className="p-3"><span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-full">{ord.status}</span></td>
                        <td className="p-3 text-right">
                          <button onClick={() => setSelectedOrder(ord)} className="bg-[#16A34A] text-white px-3 py-1.5 rounded-xl text-xs font-bold">Manage Order</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left relative">
                  <button onClick={() => setSelectedOrder(null)} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>
                  <h3 className="text-base font-extrabold text-slate-900">Manage Order #{selectedOrder.orderCode}</h3>
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                    <p className="font-bold">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                    <p className="text-slate-500">{selectedOrder.address}</p>
                    <span className="font-extrabold text-[#16A34A]">₹{selectedOrder.total}.00</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'Printing'); setSelectedOrder(null); }} className="p-2.5 bg-blue-600 text-white rounded-xl">⚙️ Printing</button>
                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'Out for Delivery'); setSelectedOrder(null); }} className="p-2.5 bg-amber-600 text-white rounded-xl">🚚 Dispatch</button>
                    <button onClick={() => { updateOrderStatus(selectedOrder.id, 'Delivered'); setSelectedOrder(null); }} className="p-2.5 bg-[#16A34A] text-white rounded-xl col-span-2">✅ Delivered</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OTHER TABS (CUSTOMERS, SERVICES, ETC) */}
        {activeTab === 'customers' && (
          <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-xs text-left">
            <h3 className="text-sm font-extrabold mb-3">Customer Directory</h3>
            <div className="space-y-2">
              {customersList.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center text-xs">
                  <div><span className="font-extrabold text-slate-900 block">{c.name}</span><span className="text-[10px] text-slate-400">{c.email}</span></div>
                  <button onClick={() => toggleBlockCustomer(c.id)} className={`px-3 py-1 rounded-xl text-xs font-bold ${c.isBlocked ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'}`}>{c.isBlocked ? 'Unblock' : 'Block'}</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MOBILE BOTTOM NAVIGATION (MATCHING REFERENCE UI) */}
      <nav className="fixed bottom-0 inset-x-0 h-14 bg-white border-t border-slate-100 flex justify-around items-center z-40 md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${activeTab === 'overview' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4.5 h-4.5 shrink-0 fill-current" />
          <span className="text-[8px] font-extrabold uppercase leading-none">Dash</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${activeTab === 'orders' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <ShoppingBag className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold uppercase leading-none">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${activeTab === 'customers' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <Users className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold uppercase leading-none">Users</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl cursor-pointer ${activeTab === 'services' ? 'text-[#16A34A] font-bold' : 'text-slate-400'}`}
        >
          <Wrench className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold uppercase leading-none">Rates</span>
        </button>

        <button
          onClick={onGoToCustomerApp}
          className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-slate-400 hover:text-slate-600"
        >
          <ArrowLeft className="w-4.5 h-4.5 shrink-0" />
          <span className="text-[8px] font-extrabold uppercase leading-none">App</span>
        </button>
      </nav>

    </div>
  );
}
