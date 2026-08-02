import { create } from 'zustand';
import { syncOrderToSupabase } from '@/lib/supabaseClient';

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'staff' | 'delivery_partner';
  walletBalance: number;
  referralCode: string;
  rewardsPoints: number;
  phone?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface SavedFile {
  id: string;
  name: string;
  size: string;
  pages: number;
  type: string;
  uploadDate: string;
  previewUrl?: string;
}

export interface PrintConfig {
  copies: number;
  paperSize: 'A4' | 'A3' | 'Legal' | 'Letter';
  gsm: 75 | 85 | 100 | 120;
  printType: 'bw' | 'color';
  binding: 'none' | 'spiral' | 'hard' | 'soft' | 'staple';
  lamination: boolean;
  doubleSided: boolean;
  pageRange: string;
  deliverySpeed: 'standard' | 'express';
  cost: number;
}

export interface CartItem {
  id: string;
  fileId: string;
  fileName: string;
  pages: number;
  config: PrintConfig;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  total: number;
  status: 'Received' | 'Printing' | 'Binding' | 'Packaging' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'wallet' | 'card' | 'upi' | 'cash';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  address: string;
  assignedDeliveryPartner?: string;
  printProgress?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  pricePerPage: number;
  colorPrice: number;
  isEnabled: boolean;
  paperSizes: string[];
}

export interface ManagedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  spentRevenue: number;
  isBlocked: boolean;
  joinDate: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  status: 'Online' | 'Offline' | 'Busy';
  assignedOrderCount: number;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  isActive: boolean;
  expiryDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Paper' | 'Ink' | 'Binding Materials';
  stockQuantity: number;
  lowStockThreshold: number;
  unit: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
}

interface AppState {
  // Auth
  user: UserProfile | null;
  setUserRole: (role: 'customer' | 'admin' | 'staff' | 'delivery_partner') => void;
  updateProfile: (name: string, email: string) => void;
  
  // Wallet
  transactions: WalletTransaction[];
  topUpWallet: (amount: number) => void;
  
  // File Management
  files: SavedFile[];
  addFile: (file: SavedFile) => void;
  deleteFile: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: 'wallet' | 'card' | 'upi', address: string) => string;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;

  // Admin Managed Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updatedData: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  // Admin Customer Directory
  customersList: ManagedCustomer[];
  toggleBlockCustomer: (customerId: string) => void;

  // Admin Delivery Partners
  deliveryPartners: DeliveryPartner[];
  updatePartnerStatus: (partnerId: string, status: DeliveryPartner['status']) => void;
  assignOrderToPartner: (orderId: string, partnerId: string) => void;

  // Admin Coupons
  couponsList: CouponItem[];
  addCoupon: (coupon: Omit<CouponItem, 'id' | 'usageCount'>) => void;
  deleteCoupon: (code: string) => void;

  // Admin Inventory
  inventoryItems: InventoryItem[];
  updateInventoryStock: (itemId: string, newQuantity: number) => void;

  // Real-time Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead'>) => void;
  markNotificationsRead: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Default User State
  user: {
    id: 'usr-101',
    name: 'Kaushav Sharma',
    email: 'kaushav@example.com',
    role: 'customer',
    walletBalance: 1250.00,
    referralCode: 'PRINTNEST100',
    rewardsPoints: 450,
    phone: '+91 98765 43210'
  },

  setUserRole: (role) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null
    }));
  },

  updateProfile: (name, email) => {
    set((state) => ({
      user: state.user ? { ...state.user, name, email } : {
        id: 'usr-101',
        name,
        email,
        role: 'customer',
        walletBalance: 1250,
        referralCode: 'PRINTNEST100',
        rewardsPoints: 450
      }
    }));
  },

  // Wallet
  transactions: [
    { id: 'tx-1', type: 'credit', amount: 500, description: 'Wallet Top-Up via Razorpay UPI', date: '10 May 2024' },
    { id: 'tx-2', type: 'debit', amount: 216, description: 'Paid for Order #PRT00054', date: '12 May 2024' }
  ],

  topUpWallet: (amount) => {
    set((state) => {
      if (!state.user) return state;
      const updatedBalance = state.user.walletBalance + amount;
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'credit',
        amount,
        description: 'Wallet Credit Top-Up',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      return {
        user: { ...state.user, walletBalance: updatedBalance },
        transactions: [newTx, ...state.transactions]
      };
    });
  },

  // Files
  files: [
    { id: 'f-1', name: 'Notes_Document.pdf', size: '2.4 MB', pages: 12, type: 'pdf', uploadDate: '12 May 2024' }
  ],

  addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
  deleteFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),

  // Cart
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  clearCart: () => set({ cart: [] }),

  // Initial Sample Orders
  orders: [
    {
      id: 'ord-101',
      orderCode: 'PRT00054',
      customerName: 'Kaushav Sharma',
      customerEmail: 'kaushav@example.com',
      customerPhone: '+91 98765 43210',
      date: '12 May 2024',
      items: [
        {
          id: 'item-1',
          fileId: 'f-1',
          fileName: 'Notes_Document.pdf',
          pages: 12,
          config: {
            copies: 1,
            paperSize: 'A4',
            gsm: 75,
            printType: 'bw',
            binding: 'spiral',
            lamination: false,
            doubleSided: true,
            pageRange: 'all',
            deliverySpeed: 'standard',
            cost: 216
          }
        }
      ],
      subtotal: 206,
      discount: 0,
      deliveryCost: 10,
      total: 216,
      status: 'Printing',
      paymentMethod: 'upi',
      paymentStatus: 'Paid',
      address: '248, Rajpur Road, Dehradun, Uttarakhand - 248001'
    },
    {
      id: 'ord-102',
      orderCode: 'PRT00053',
      customerName: 'Aarav Mehta',
      customerEmail: 'aarav@example.com',
      customerPhone: '+91 98123 45678',
      date: '10 May 2024',
      items: [],
      subtotal: 128,
      discount: 10,
      deliveryCost: 10,
      total: 128,
      status: 'Delivered',
      paymentMethod: 'card',
      paymentStatus: 'Paid',
      address: 'Campus Hostel Block B, UPES Dehradun'
    }
  ],

  placeOrder: (paymentMethod, address) => {
    const { cart, user } = get();
    const orderId = `PRT${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = cart.reduce((acc, i) => acc + i.config.cost, 100);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode: orderId,
      customerName: user?.name || 'Kaushav Sharma',
      customerEmail: user?.email || 'kaushav@example.com',
      customerPhone: user?.phone || '+91 98765 43210',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal,
      discount: 0,
      deliveryCost: 10,
      total: subtotal + 10,
      status: 'Received',
      paymentMethod,
      paymentStatus: 'Paid',
      address
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: []
    }));

    // Trigger Supabase Cloud Sync
    syncOrderToSupabase(newOrder);

    return orderId;
  },

  // Real-Time Admin Order Status Updater
  updateOrderStatus: (orderId, newStatus) => {
    set((state) => {
      const updatedOrders = state.orders.map((ord) => 
        ord.id === orderId || ord.orderCode === orderId ? { ...ord, status: newStatus } : ord
      );

      // Also trigger a real-time notification
      const targetOrder = state.orders.find(o => o.id === orderId || o.orderCode === orderId);
      const code = targetOrder ? targetOrder.orderCode : orderId;

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `⚙️ Status Update: Order #${code}`,
        message: `Your order status has been updated to "${newStatus}" by PrintNest Studio.`,
        time: 'Just now',
        type: 'order',
        isRead: false
      };

      return {
        orders: updatedOrders,
        notifications: [newNotif, ...state.notifications]
      };
    });
  },

  // Admin Services List
  services: [
    { id: 'srv-1', title: 'Document Printing', category: 'Printing', pricePerPage: 2.00, colorPrice: 8.00, isEnabled: true, paperSizes: ['A4', 'A3', 'Legal'] },
    { id: 'srv-2', title: 'Colour Printing', category: 'Printing', pricePerPage: 8.00, colorPrice: 8.00, isEnabled: true, paperSizes: ['A4', 'A3'] },
    { id: 'srv-3', title: 'Spiral Binding', category: 'Binding', pricePerPage: 40.00, colorPrice: 40.00, isEnabled: true, paperSizes: ['A4'] },
    { id: 'srv-4', title: 'Hard Thesis Binding', category: 'Binding', pricePerPage: 150.00, colorPrice: 150.00, isEnabled: true, paperSizes: ['A4'] },
    { id: 'srv-5', title: 'ID Cards & Badges', category: 'Specialty', pricePerPage: 50.00, colorPrice: 50.00, isEnabled: true, paperSizes: ['Standard'] },
    { id: 'srv-6', title: 'Visiting Cards', category: 'Specialty', pricePerPage: 120.00, colorPrice: 120.00, isEnabled: true, paperSizes: ['Standard'] }
  ],

  addService: (service) => set((state) => ({
    services: [...state.services, { ...service, id: `srv-${Date.now()}` }]
  })),

  updateService: (id, updatedData) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, ...updatedData } : s)
  })),

  deleteService: (id) => set((state) => ({
    services: state.services.filter(s => s.id !== id)
  })),

  toggleServiceStatus: (id) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)
  })),

  // Admin Customer Directory
  customersList: [
    { id: 'c-1', name: 'Kaushav Sharma', email: 'kaushav@example.com', phone: '+91 98765 43210', totalOrders: 24, spentRevenue: 4850, isBlocked: false, joinDate: 'Jan 2024' },
    { id: 'c-2', name: 'Aarav Mehta', email: 'aarav@example.com', phone: '+91 98123 45678', totalOrders: 12, spentRevenue: 2400, isBlocked: false, joinDate: 'Feb 2024' },
    { id: 'c-3', name: 'Riya Verma', email: 'riya@example.com', phone: '+91 97654 32109', totalOrders: 5, spentRevenue: 890, isBlocked: false, joinDate: 'Mar 2024' }
  ],

  toggleBlockCustomer: (customerId) => set((state) => ({
    customersList: state.customersList.map(c => c.id === customerId ? { ...c, isBlocked: !c.isBlocked } : c)
  })),

  // Admin Delivery Partners
  deliveryPartners: [
    { id: 'dp-1', name: 'Rahul Verma (Express Delivery)', phone: '+91 98989 12345', status: 'Online', assignedOrderCount: 3 },
    { id: 'dp-2', name: 'Vikram Singh (Campus Dispatch)', phone: '+91 98787 54321', status: 'Online', assignedOrderCount: 1 },
    { id: 'dp-3', name: 'Amit Kumar', phone: '+91 98111 22233', status: 'Offline', assignedOrderCount: 0 }
  ],

  updatePartnerStatus: (partnerId, status) => set((state) => ({
    deliveryPartners: state.deliveryPartners.map(dp => dp.id === partnerId ? { ...dp, status } : dp)
  })),

  assignOrderToPartner: (orderId, partnerId) => set((state) => {
    const partner = state.deliveryPartners.find(dp => dp.id === partnerId);
    return {
      orders: state.orders.map(o => o.id === orderId || o.orderCode === orderId ? { ...o, assignedDeliveryPartner: partner?.name || partnerId, status: 'Out for Delivery' } : o)
    };
  }),

  // Admin Coupons
  couponsList: [
    { id: 'cp-1', code: 'PRINTFIRST', discountType: 'flat', discountValue: 10, minOrderValue: 30, usageCount: 142, isActive: true, expiryDate: '2026-12-31' },
    { id: 'cp-2', code: 'PRINTNEST', discountType: 'percentage', discountValue: 15, minOrderValue: 100, usageCount: 88, isActive: true, expiryDate: '2026-12-31' }
  ],

  addCoupon: (coupon) => set((state) => ({
    couponsList: [...state.couponsList, { ...coupon, id: `cp-${Date.now()}`, usageCount: 0 }]
  })),

  deleteCoupon: (code) => set((state) => ({
    couponsList: state.couponsList.filter(c => c.code !== code)
  })),

  // Admin Inventory
  inventoryItems: [
    { id: 'inv-1', name: 'A4 75GSM Printing Paper', category: 'Paper', stockQuantity: 450, lowStockThreshold: 50, unit: 'reams' },
    { id: 'inv-[#inv-2]', name: 'A3 100GSM Glossy Paper', category: 'Paper', stockQuantity: 80, lowStockThreshold: 20, unit: 'reams' },
    { id: 'inv-3', name: 'HP LaserJet Cyan Ink Cartridge', category: 'Ink', stockQuantity: 12, lowStockThreshold: 5, unit: 'units' },
    { id: 'inv-4', name: 'Spiral Comb Binding Coils (12mm)', category: 'Binding Materials', stockQuantity: 300, lowStockThreshold: 40, unit: 'coils' }
  ],

  updateInventoryStock: (itemId, newQuantity) => set((state) => ({
    inventoryItems: state.inventoryItems.map(item => item.id === itemId ? { ...item, stockQuantity: newQuantity } : item)
  })),

  // App Notifications
  notifications: [
    { id: 'n-1', title: '🎉 Order Delivered!', message: 'Order #PRN-6582 has been delivered to 248, Rajpur Road.', time: '10 mins ago', type: 'order', isRead: true },
    { id: 'n-2', title: '⚙️ Printing Started', message: 'Order #PRT00054 is currently printing at InkJet Pro Studio line #3.', time: '1 hour ago', type: 'order', isRead: false },
    { id: 'n-3', title: '🏷️ ₹10 Cashback Coupon Added!', message: 'Use promo code PRINTFIRST on your next print order.', time: '3 hours ago', type: 'promo', isRead: false }
  ],

  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: `n-${Date.now()}`, isRead: false }, ...state.notifications]
  })),

  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  }))
}));
