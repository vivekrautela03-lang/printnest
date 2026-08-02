'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Wrench, BarChart3, Truck, Ticket, CreditCard, 
  Package, Settings, Search, Bell, Plus, CheckCircle2, XCircle, RefreshCw, Download, 
  ShieldCheck, Lock, Eye, Edit3, Trash2, Check, AlertTriangle, ArrowUpRight, ArrowDownRight, UserCheck, DollarSign, LogOut, ArrowLeft
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

  // Orders Tab Filter & Selected Order Modal
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');

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
  const [newCouponMin, setNewCouponMin] = useState('30');

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 48250);
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="min-h-screen bg-[#071109] text-slate-100 flex font-sans select-none">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900/90 border-r border-emerald-500/15 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
        <div className="space-y-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
              P
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1 font-sans">
                Print<span className="text-[#16A34A]">Nest</span>
              </h2>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider block mt-0.5">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'orders', label: `Orders (${pendingOrdersCount})`, icon: ShoppingBag },
              { id: 'customers', label: 'Customer Directory', icon: Users },
              { id: 'services', label: 'Services & Pricing', icon: Wrench },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
              { id: 'delivery', label: 'Delivery Dispatch', icon: Truck },
              { id: 'coupons', label: 'Coupons & Promos', icon: Ticket },
              { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
              { id: 'inventory', label: 'Inventory & Stock', icon: Package },
              { id: 'settings', label: 'Platform Settings', icon: Settings },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all cursor-pointer ${activeTab === nav.id ? 'bg-[#16A34A] text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
              >
                <nav.icon className="w-4 h-4 shrink-0" />
                <span>{nav.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={onGoToCustomerApp}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2"><ArrowLeft className="w-3.5 h-3.5" /> Customer App</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold transition-all cursor-pointer border border-rose-500/20"
          >
            <span className="flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP APP BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base md:text-lg font-extrabold text-white capitalize font-sans">
              {activeTab.replace('_', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 pl-3 pr-4 bg-slate-800/80 rounded-full border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white font-extrabold flex items-center justify-center text-xs">
                M
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-extrabold text-white block">Master Admin</span>
                <span className="text-[9px] text-emerald-400 font-bold">Online</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 text-left">
          
          {/* ========================================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ========================================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#16A34A]" />
                  </div>
                  <span className="text-2xl font-extrabold text-white font-mono block">₹{totalRevenue.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full inline-block">+18.4% this month</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white font-mono block">{orders.length + 140}</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full inline-block">+12 new today</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Pending Dispatch</span>
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-amber-400 font-mono block">{pendingOrdersCount}</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full inline-block">Requires Action</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2 shadow-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Registered Users</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white font-mono block">1,280</span>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full inline-block">Active Platform Users</span>
                </div>
              </div>

              {/* Revenue Chart Visual */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Revenue & Orders Performance</h3>
                    <p className="text-xs text-slate-400">Gross revenue trends across current fiscal quarter</p>
                  </div>
                  <button onClick={() => alert('GST Invoice PDF Export generated!')} className="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md">
                    <Download className="w-3.5 h-3.5" /> Export PDF Report
                  </button>
                </div>

                <div className="h-44 w-full pt-4">
                  <svg viewBox="0 0 500 120" className="w-full h-full">
                    <path d="M0,100 Q100,20 200,60 T400,30 T500,70 L500,120 L0,120 Z" fill="rgba(22, 163, 74, 0.2)" />
                    <path d="M0,100 Q100,20 200,60 T400,30 T500,70" fill="none" stroke="#16A34A" strokeWidth="3" />
                    <circle cx="400" cy="30" r="5" fill="#16A34A" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 2: ORDERS MANAGEMENT */}
          {/* ========================================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Received', 'Printing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${orderStatusFilter === st ? 'bg-[#16A34A] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders
                      .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono font-extrabold text-white">{ord.orderCode}</td>
                          <td className="p-3">
                            <span className="font-bold text-white block">{ord.customerName}</span>
                            <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                          </td>
                          <td className="p-3 text-slate-400">{ord.date}</td>
                          <td className="p-3 font-mono font-extrabold text-[#16A34A]">₹{ord.total}.00</td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">{ord.paymentMethod}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Manage Order
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Order Manage Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 text-left relative">
                    <button onClick={() => setSelectedOrder(null)} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>

                    <div>
                      <span className="text-[10px] font-extrabold text-[#16A34A] uppercase">ORDER MANAGEMENT CONSOLE</span>
                      <h3 className="text-lg font-extrabold text-white">Order #{selectedOrder.orderCode}</h3>
                      <p className="text-xs text-slate-400">{selectedOrder.customerName} • {selectedOrder.customerPhone}</p>
                    </div>

                    <div className="p-4 bg-slate-800/60 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300"><span>Address:</span><span className="font-bold">{selectedOrder.address}</span></div>
                      <div className="flex justify-between text-slate-300"><span>Total Paid:</span><span className="font-mono font-extrabold text-[#16A34A]">₹{selectedOrder.total}.00</span></div>
                      <div className="flex justify-between text-slate-300"><span>Current Status:</span><span className="font-bold text-emerald-400">{selectedOrder.status}</span></div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 block">Real-Time Status Action Buttons</label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                        <button 
                          onClick={() => { updateOrderStatus(selectedOrder.id, 'Printing'); setSelectedOrder(null); }}
                          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                          ⚙️ Start Printing
                        </button>
                        <button 
                          onClick={() => { updateOrderStatus(selectedOrder.id, 'Binding'); setSelectedOrder(null); }}
                          className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                        >
                          📚 Mark Binding Done
                        </button>
                        <button 
                          onClick={() => { updateOrderStatus(selectedOrder.id, 'Out for Delivery'); setSelectedOrder(null); }}
                          className="p-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                        >
                          🚚 Out for Delivery
                        </button>
                        <button 
                          onClick={() => { updateOrderStatus(selectedOrder.id, 'Delivered'); setSelectedOrder(null); }}
                          className="p-3 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          ✅ Mark Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 3: CUSTOMERS DIRECTORY */}
          {/* ========================================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Email & Phone</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3">Spent Revenue</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {customersList.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-extrabold text-white">{cust.name}</td>
                        <td className="p-3 text-slate-400">
                          <span className="block text-white">{cust.email}</span>
                          <span className="text-[10px]">{cust.phone}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-300">{cust.totalOrders} Orders</td>
                        <td className="p-3 font-mono font-extrabold text-[#16A34A]">₹{cust.spentRevenue}.00</td>
                        <td className="p-3">
                          {cust.isBlocked ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/30">Blocked</span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => toggleBlockCustomer(cust.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${cust.isBlocked ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
                          >
                            {cust.isBlocked ? 'Unblock' : 'Block User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 4: SERVICES & PRICING CRUD */}
          {/* ========================================================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-white">Services & Dynamic Pricing Engine</h3>
                <button 
                  onClick={() => setIsAddServiceOpen(true)}
                  className="bg-[#16A34A] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{srv.category}</span>
                        <h4 className="text-sm font-extrabold text-white mt-1">{srv.title}</h4>
                      </div>
                      <button 
                        onClick={() => toggleServiceStatus(srv.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer ${srv.isEnabled ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                      >
                        {srv.isEnabled ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-800/60 rounded-2xl space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between text-slate-400"><span>B&W Rate:</span><span className="font-mono text-white">₹{srv.pricePerPage}/page</span></div>
                      <div className="flex justify-between text-slate-400"><span>Color Rate:</span><span className="font-mono text-white">₹{srv.colorPrice}/page</span></div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => deleteService(srv.id)} className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/20 cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Service Modal */}
              {isAddServiceOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left relative">
                    <button onClick={() => setIsAddServiceOpen(false)} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>
                    <h3 className="text-base font-extrabold text-white">Add New Service</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      addService({
                        title: newServiceTitle,
                        category: newServiceCategory,
                        pricePerPage: parseFloat(newServiceBwPrice),
                        colorPrice: parseFloat(newServiceColorPrice),
                        isEnabled: true,
                        paperSizes: ['A4', 'A3']
                      });
                      setIsAddServiceOpen(false);
                    }} className="space-y-3 text-xs font-semibold">
                      <input type="text" placeholder="Service Title" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} className="w-full p-3 bg-slate-800 rounded-xl text-white font-bold" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="B&W Rate" value={newServiceBwPrice} onChange={(e) => setNewServiceBwPrice(e.target.value)} className="p-3 bg-slate-800 rounded-xl text-white font-mono" required />
                        <input type="number" placeholder="Color Rate" value={newServiceColorPrice} onChange={(e) => setNewServiceColorPrice(e.target.value)} className="p-3 bg-slate-800 rounded-xl text-white font-mono" required />
                      </div>
                      <button type="submit" className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-extrabold text-xs">Save Service</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 5: REPORTS & EXPORTS */}
          {/* ========================================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-base font-extrabold text-white">Financial & Tax Reports</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => alert('Exporting Sales CSV...')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-extrabold text-emerald-400 border border-emerald-500/20 text-center cursor-pointer">
                    📊 Download Daily Sales CSV
                  </button>
                  <button onClick={() => alert('Exporting Tax PDF...')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-extrabold text-blue-400 border border-blue-500/20 text-center cursor-pointer">
                    📄 Export Monthly GST Tax PDF
                  </button>
                  <button onClick={() => alert('Exporting Top Customers...')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-extrabold text-purple-400 border border-purple-500/20 text-center cursor-pointer">
                    👥 Export Top Customers List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 6: DELIVERY DISPATCH */}
          {/* ========================================================================================= */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-base font-extrabold text-white">Delivery Partner Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryPartners.map((dp) => (
                  <div key={dp.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-extrabold text-white">{dp.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dp.status === 'Online' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{dp.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{dp.phone}</p>
                    <button 
                      onClick={() => updatePartnerStatus(dp.id, dp.status === 'Online' ? 'Offline' : 'Online')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Toggle Status ({dp.status})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 7: COUPONS & PROMOS */}
          {/* ========================================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-white">Coupons & Offers Engine</h3>
                <button onClick={() => setIsAddCouponOpen(true)} className="bg-[#16A34A] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer">
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {couponsList.map((cp) => (
                  <div key={cp.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex justify-between items-center">
                    <div>
                      <span className="font-mono text-base font-extrabold text-[#16A34A] block">{cp.code}</span>
                      <span className="text-xs text-slate-400">Discount: {cp.discountType === 'flat' ? `₹${cp.discountValue} Off` : `${cp.discountValue}% Off`}</span>
                    </div>
                    <button onClick={() => deleteCoupon(cp.code)} className="text-rose-400 hover:underline text-xs font-bold cursor-pointer">Delete</button>
                  </div>
                ))}
              </div>

              {isAddCouponOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left relative">
                    <button onClick={() => setIsAddCouponOpen(false)} className="absolute right-5 top-5 text-slate-400 font-bold text-sm">✕</button>
                    <h3 className="text-base font-extrabold text-white">Create Promo Coupon</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      addCoupon({
                        code: newCouponCode.toUpperCase(),
                        discountType: newCouponType,
                        discountValue: parseFloat(newCouponValue),
                        minOrderValue: parseFloat(newCouponMin),
                        isActive: true,
                        expiryDate: '2026-12-31'
                      });
                      setIsAddCouponOpen(false);
                    }} className="space-y-3 text-xs font-semibold">
                      <input type="text" placeholder="COUPON CODE" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} className="w-full p-3 bg-slate-800 rounded-xl text-white font-mono uppercase font-bold" required />
                      <input type="number" placeholder="Discount Amount" value={newCouponValue} onChange={(e) => setNewCouponValue(e.target.value)} className="w-full p-3 bg-slate-800 rounded-xl text-white font-mono" required />
                      <button type="submit" className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-extrabold text-xs">Create Coupon</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 8: PAYMENTS & REFUNDS */}
          {/* ========================================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-base font-extrabold text-white">Razorpay & UPI Transaction Logs</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-slate-800/60 rounded-xl flex justify-between">
                    <span>TXN99823410 • Razorpay UPI</span>
                    <span className="text-[#16A34A]">₹216.00 SUCCESS</span>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl flex justify-between">
                    <span>TXN99823409 • HDFC Card</span>
                    <span className="text-[#16A34A]">₹128.00 SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 9: INVENTORY & STOCK */}
          {/* ========================================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-base font-extrabold text-white">Paper, Ink & Binding Stock Levels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inventoryItems.map((inv) => (
                  <div key={inv.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">{inv.category}</span>
                        <h4 className="text-xs font-extrabold text-white">{inv.name}</h4>
                      </div>
                      <span className="text-base font-extrabold text-[#16A34A] font-mono">{inv.stockQuantity} {inv.unit}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => updateInventoryStock(inv.id, inv.stockQuantity + 50)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                        + Restock +50
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================================= */}
          {/* TAB 10: SETTINGS */}
          {/* ========================================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl">
                <h3 className="text-base font-extrabold text-white">Business & Tax Settings</h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Business Registered Name</label>
                    <input type="text" defaultValue="PrintNest Tech Pvt Ltd" className="w-full p-3 bg-slate-800 rounded-xl text-white font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">GSTIN Number</label>
                    <input type="text" defaultValue="05AAAAA0000A1Z5" className="w-full p-3 bg-slate-800 rounded-xl text-white font-mono font-bold" />
                  </div>
                  <button onClick={() => alert('Settings saved!')} className="w-full bg-[#16A34A] text-white py-3 rounded-xl font-extrabold text-xs cursor-pointer">Save Settings</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
