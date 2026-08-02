import { create } from 'zustand';
import { syncOrderToSupabase } from '@/lib/supabaseClient';

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  walletBalance: number;
  referralCode: string;
  rewardsPoints: number;
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
  type: string; // e.g. 'pdf' or 'image'
  uploadDate: string;
  previewUrl?: string; // Data URL or object URL
}

export interface PrintConfig {
  copies: number;
  paperSize: 'A4' | 'A3' | 'A5' | 'Letter';
  gsm: 75 | 85 | 100 | 120;
  printType: 'black-white' | 'color';
  binding: 'none' | 'spiral' | 'hard-binding' | 'soft-binding';
  lamination: boolean;
  doubleSided: boolean;
  pageRange: string; // 'all' or '1-5' etc.
  deliverySpeed: 'standard' | 'express' | 'super-express';
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
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  total: number;
  status: 'Received' | 'Printing' | 'Binding' | 'Packaging' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'wallet' | 'card' | 'upi';
  address: string;
  currentPrinterId?: string;
  printProgress?: number; // 0 to 100
}

export interface Printer {
  id: string;
  name: string;
  status: 'idle' | 'printing' | 'offline';
  activeJobId?: string;
  progress?: number;
  type: 'inkjet' | 'laser' | 'plotter';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

interface AppState {
  // Auth
  user: UserProfile | null;
  setUserRole: (role: 'customer' | 'admin') => void;
  updateProfile: (name: string, email: string) => void;
  
  // Wallet
  transactions: WalletTransaction[];
  topUpWallet: (amount: number) => void;
  
  // Saved Files
  savedFiles: SavedFile[];
  addSavedFile: (file: Omit<SavedFile, 'id' | 'uploadDate'>) => string;
  deleteSavedFile: (id: string) => void;
  
  // Cart & Configurations
  cart: CartItem[];
  addToCart: (fileId: string, fileName: string, pages: number, config: PrintConfig) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  
  // Pricing Constants (controlled by admin)
  basePageRates: {
    'black-white': number;
    'color': number;
  };
  paperSizeMultipliers: Record<string, number>;
  gsmRates: Record<number, number>;
  bindingRates: Record<string, number>;
  laminationRate: number;
  deliveryRates: {
    'standard': number;
    'express': number;
    'super-express': number;
  };
  updatePricing: (rates: Partial<AppState['basePageRates'] & { bindingRates: any, deliveryRates: any }>) => void;
  
  // Coupons list
  availableCoupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: 'wallet' | 'card' | 'upi', address: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Printers
  printers: Printer[];
  togglePrinterOnline: (printerId: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  
  // Admin analytics and logs
  adminLogs: string[];
  addAdminLog: (log: string) => void;
  
  // Background printing tick simulator
  tickPrinters: () => void;
}

// Initial Mock Data
const INITIAL_USER: UserProfile = {
  id: 'usr_1',
  name: 'Kaushav',
  email: 'kaushav@printnest.com',
  role: 'customer',
  walletBalance: 1250,
  referralCode: 'PRINT-KSH99',
  rewardsPoints: 320,
};

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  { id: 'tx_1', type: 'credit', amount: 1500, description: 'Wallet loaded via Razorpay', date: '2026-07-28T14:30:00Z' },
  { id: 'tx_2', type: 'debit', amount: 250, description: 'Payment for Order #PRN-6582', date: '2026-07-28T15:00:00Z' },
];

const INITIAL_FILES: SavedFile[] = [
  { id: 'file_1', name: 'Resume_Engineering_2026.pdf', size: '245 KB', pages: 2, type: 'pdf', uploadDate: '2026-07-29T10:15:00Z' },
  { id: 'file_2', name: 'Marketing_Flyer_Final.png', size: '1.8 MB', pages: 1, type: 'image', uploadDate: '2026-07-30T12:00:00Z' },
  { id: 'file_3', name: 'Thesis_Draft_V4.pdf', size: '4.2 MB', pages: 48, type: 'pdf', uploadDate: '2026-07-31T09:45:00Z' },
];

const INITIAL_PRINTERS: Printer[] = [
  { id: 'prn_1', name: 'FastLaser Alpha (A4 Heavy Duty)', status: 'idle', type: 'laser' },
  { id: 'prn_2', name: 'InkJet Pro Color Studio', status: 'idle', type: 'inkjet' },
  { id: 'prn_3', name: 'Plotter Max (Flex & Posters)', status: 'idle', type: 'plotter' },
];

const INITIAL_COUPONS: Coupon[] = [
  { code: 'PRINTFIRST', discountPercent: 20, description: '20% off on your first order' },
  { code: 'SUPERBIND', discountPercent: 15, description: '15% off binding and laminations' },
  { code: 'FREESHIP', discountPercent: 10, description: '10% off shipping and print orders' },
];

export const useAppStore = create<AppState>((set, get) => ({
  user: INITIAL_USER,
  transactions: INITIAL_TRANSACTIONS,
  savedFiles: INITIAL_FILES,
  cart: [],
  appliedCoupon: null,
  orders: [
    {
      id: 'PRT00054',
      date: '2024-05-12T10:00:00Z', // 12 May 2024
      items: [
        {
          id: 'cart_item_mock',
          fileId: 'file_1',
          fileName: 'Document.pdf',
          pages: 12,
          config: {
            copies: 2,
            paperSize: 'A4',
            gsm: 75,
            printType: 'black-white',
            binding: 'spiral',
            lamination: false,
            doubleSided: true,
            pageRange: 'all',
            deliverySpeed: 'standard',
            cost: 216,
          }
        }
      ],
      subtotal: 176,
      discount: 0,
      deliveryCost: 40,
      total: 216,
      status: 'Printing',
      paymentMethod: 'card',
      address: '123 SaaS Street, Tech Hub, Bangalore',
    }
  ],
  printers: INITIAL_PRINTERS,
  availableCoupons: INITIAL_COUPONS,
  chatMessages: [
    { id: 'msg_1', sender: 'bot', text: 'Hi! I am your AI Printing Assistant. How can I help you today? You can ask me about binder sizes, print costs, or upload a resume to write a cover letter!', timestamp: new Date().toISOString() },
  ],
  adminLogs: [
    'System initialized.',
    'Laser Printer FastLaser Alpha online.',
    'InkJet Pro Color Studio ready.'
  ],
  
  // Pricing Constants
  basePageRates: {
    'black-white': 2, // 2 Rs per page
    'color': 8, // 8 Rs per page
  },
  paperSizeMultipliers: {
    'A4': 1.0,
    'A3': 2.0,
    'A5': 0.8,
    'Letter': 1.1,
  },
  gsmRates: {
    75: 0,
    85: 0.5,
    100: 1.5,
    120: 3.0,
  },
  bindingRates: {
    'none': 0,
    'spiral': 40,
    'hard-binding': 150,
    'soft-binding': 90,
  },
  laminationRate: 20,
  deliveryRates: {
    'standard': 40,
    'express': 90,
    'super-express': 180,
  },

  // Auth Operations
  setUserRole: (role) => set((state) => {
    if (!state.user) return {};
    return { user: { ...state.user, role } };
  }),
  
  updateProfile: (name, email) => set((state) => {
    if (!state.user) return {};
    return { user: { ...state.user, name, email } };
  }),

  // Wallet
  topUpWallet: (amount) => set((state) => {
    if (!state.user) return {};
    const newTx: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type: 'credit',
      amount,
      description: 'Wallet top-up approved (Razorpay Simulation)',
      date: new Date().toISOString(),
    };
    return {
      user: { ...state.user, walletBalance: state.user.walletBalance + amount },
      transactions: [newTx, ...state.transactions],
    };
  }),

  // Files
  addSavedFile: (fileData) => {
    const id = `file_${Math.random().toString(36).substr(2, 9)}`;
    const newFile: SavedFile = {
      ...fileData,
      id,
      uploadDate: new Date().toISOString(),
    };
    set((state) => ({ savedFiles: [newFile, ...state.savedFiles] }));
    return id;
  },
  
  deleteSavedFile: (id) => set((state) => ({
    savedFiles: state.savedFiles.filter(f => f.id !== id)
  })),

  // Cart
  addToCart: (fileId, fileName, pages, config) => set((state) => {
    const newItem: CartItem = {
      id: `cart_${Math.random().toString(36).substr(2, 9)}`,
      fileId,
      fileName,
      pages,
      config,
    };
    return { cart: [...state.cart, newItem] };
  }),
  
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== itemId)
  })),
  
  clearCart: () => set({ cart: [], appliedCoupon: null }),
  
  applyCoupon: (code) => {
    const coupon = get().availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      set({ appliedCoupon: coupon });
      return true;
    }
    return false;
  },
  
  removeCoupon: () => set({ appliedCoupon: null }),

  // Pricing edits
  updatePricing: (rates) => set((state) => ({
    basePageRates: { ...state.basePageRates, ...rates },
    bindingRates: { ...state.bindingRates, ...rates.bindingRates },
    deliveryRates: { ...state.deliveryRates, ...rates.deliveryRates }
  })),

  // Coupon manager
  addCoupon: (coupon) => set((state) => ({
    availableCoupons: [coupon, ...state.availableCoupons]
  })),

  // Orders Checkout
  placeOrder: (paymentMethod, address) => {
    const { cart, appliedCoupon, user, transactions, deliveryRates } = get();
    if (cart.length === 0 || !user) return null;

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.config.cost, 0);
    const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) : 0;
    
    // Delivery cost is determined by the highest selected speed in the cart items
    let maxSpeed: PrintConfig['deliverySpeed'] = 'standard';
    cart.forEach(item => {
      if (item.config.deliverySpeed === 'super-express') maxSpeed = 'super-express';
      else if (item.config.deliverySpeed === 'express' && maxSpeed === 'standard') maxSpeed = 'express';
    });
    
    const deliveryCost = deliveryRates[maxSpeed];
    const total = subtotal - discount + deliveryCost;

    // Wallet check
    if (paymentMethod === 'wallet' && user.walletBalance < total) {
      return null; // Insufficient funds
    }

    // Deduct wallet balance if payment is wallet
    if (paymentMethod === 'wallet') {
      const walletTx: WalletTransaction = {
        id: `tx_${Math.random().toString(36).substr(2, 9)}`,
        type: 'debit',
        amount: total,
        description: `Payment for Order #PRN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
      };
      set({
        user: { ...user, walletBalance: user.walletBalance - total, rewardsPoints: user.rewardsPoints + Math.round(total / 10) },
        transactions: [walletTx, ...transactions]
      });
    } else {
      // Direct card/upi adds rewards points too
      set({
        user: { ...user, rewardsPoints: user.rewardsPoints + Math.round(total / 10) }
      });
    }

    const orderId = `PRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount,
      deliveryCost,
      total,
      status: 'Received',
      paymentMethod,
      address,
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
      appliedCoupon: null,
      adminLogs: [`New Order #${orderId} received. Total: Rs. ${total}. (Synced to Supabase)`, ...state.adminLogs]
    }));

    // Async sync to Supabase project https://pmacffojqzhajirdqnyy.supabase.co
    syncOrderToSupabase(newOrder);

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => set((state) => {
    const updatedOrders = state.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    return {
      orders: updatedOrders,
      adminLogs: [`Order #${orderId} status changed to ${status}.`, ...state.adminLogs]
    };
  }),

  togglePrinterOnline: (printerId) => set((state) => {
    const printers = state.printers.map(p => 
      p.id === printerId 
        ? { ...p, status: p.status === 'offline' ? 'idle' as const : 'offline' as const, progress: undefined, activeJobId: undefined } 
        : p
    );
    const target = printers.find(p => p.id === printerId);
    const log = `Printer ${target?.name} is now ${target?.status}.`;
    return { printers, adminLogs: [log, ...state.adminLogs] };
  }),

  // Chat
  sendChatMessage: (text) => set((state) => {
    const userMsg: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    // Simple automated assistant responder
    let botReply = "I'm processing that question. Can you specify if you need details on single/double-sided sizing, document binding options (spiral vs. hard-bind), or help configuring a print job?";
    const cleanText = text.toLowerCase();
    
    if (cleanText.includes('price') || cleanText.includes('cost') || cleanText.includes('rate')) {
      botReply = "Our pricing is transparent: Black & White prints are Rs. 2/page. Color prints are Rs. 8/page. Spiral binding is Rs. 40, soft binding is Rs. 90, and hard binding is Rs. 150. Lamination is Rs. 20 per doc. We calculate pricing in real time during upload configuration!";
    } else if (cleanText.includes('paper') || cleanText.includes('gsm') || cleanText.includes('size')) {
      botReply = "We support A4, A3, A5, and Letter paper sizes. For page weight, we offer standard 75 GSM (best for text documents), 85 GSM, 100 GSM (great for proposals), and premium 120 GSM (best for brochures, photos, and presentations).";
    } else if (cleanText.includes('binding') || cleanText.includes('spiral')) {
      botReply = "We offer Spiral Binding (comb layout), Soft Binding (perfect book bound), and Hard Binding (heavy premium leatherette cover, popular for college theses and final reports). You can select binding in the order configurator.";
    } else if (cleanText.includes('resume') || cleanText.includes('cv')) {
      botReply = "I see you are interested in resumes! We have a built-in AI Resume Builder tool in the menu sidebar. Fill in your work experience and download a print-ready PDF instantly!";
    } else if (cleanText.includes('wallet') || cleanText.includes('pay') || cleanText.includes('razorpay')) {
      botReply = "You can add money to your wallet via our simulation of Razorpay, which supports mock cards and UPI. Ordering via wallet grants you 10% cash-back rewards points!";
    } else if (cleanText.includes('hello') || cleanText.includes('hi')) {
      botReply = "Hello! I am your Printing SaaS AI concierge. How can I help you print or manage files today?";
    } else if (cleanText.includes('admin')) {
      botReply = "To test admin controls, simply switch the role dropdown in the header to 'Admin'. You can monitor printers, adjust pricing rates, and track orders in real time!";
    }
    
    const botMsg: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'bot',
      text: botReply,
      timestamp: new Date(Date.now() + 500).toISOString()
    };
    
    return {
      chatMessages: [...state.chatMessages, userMsg, botMsg]
    };
  }),

  addAdminLog: (log) => set((state) => ({ adminLogs: [log, ...state.adminLogs] })),

  // Printer Queue Simulation Tick
  tickPrinters: () => set((state) => {
    // 1. Find orders that are "Received" or "Printing"
    // 2. Allocate printer if order is "Received" and printer is "idle"
    let updatedOrders = [...state.orders];
    let updatedPrinters = [...state.printers];
    let updatedLogs = [...state.adminLogs];

    // Allocate idle printers to "Received" orders
    const receivedOrders = updatedOrders.filter(o => o.status === 'Received');
    const idlePrinters = updatedPrinters.filter(p => p.status === 'idle');

    for (let i = 0; i < Math.min(receivedOrders.length, idlePrinters.length); i++) {
      const order = receivedOrders[i];
      const printer = idlePrinters[i];

      order.status = 'Printing';
      order.currentPrinterId = printer.id;
      order.printProgress = 0;

      printer.status = 'printing';
      printer.activeJobId = order.id;
      printer.progress = 0;
      
      updatedLogs = [`Printer ${printer.name} started printing Order #${order.id}.`, ...updatedLogs];
    }

    // Tick active printing progress
    updatedPrinters = updatedPrinters.map(p => {
      if (p.status === 'printing' && p.activeJobId) {
        const orderIndex = updatedOrders.findIndex(o => o.id === p.activeJobId);
        if (orderIndex !== -1) {
          const order = updatedOrders[orderIndex];
          const newProgress = (p.progress || 0) + Math.floor(Math.random() * 20) + 10; // increase progress by 10-30%
          
          if (newProgress >= 100) {
            // Done printing!
            order.printProgress = 100;
            const requiresBinding = order.items.some(item => item.config.binding !== 'none');
            order.status = requiresBinding ? 'Binding' : 'Packaging';
            order.currentPrinterId = undefined;

            p.status = 'idle';
            p.activeJobId = undefined;
            p.progress = undefined;

            updatedLogs = [`Printer ${p.name} completed printing Order #${order.id}.`, ...updatedLogs];
          } else {
            p.progress = newProgress;
            order.printProgress = newProgress;
            updatedOrders[orderIndex] = { ...order, printProgress: newProgress };
          }
        }
      }
      return p;
    });

    // Advance orders in "Binding" and "Packaging" to "Out for Delivery" and "Delivered"
    updatedOrders = updatedOrders.map(order => {
      if (order.status === 'Binding') {
        // 10% chance to finish binding and move to packaging
        if (Math.random() < 0.3) {
          order.status = 'Packaging';
          updatedLogs = [`Order #${order.id} binding completed. Packaging...`, ...updatedLogs];
        }
      } else if (order.status === 'Packaging') {
        // Move to Out for Delivery
        if (Math.random() < 0.2) {
          order.status = 'Out for Delivery';
          updatedLogs = [`Order #${order.id} packaged and handed to delivery partner.`, ...updatedLogs];
        }
      } else if (order.status === 'Out for Delivery') {
        // Move to Delivered
        if (Math.random() < 0.15) {
          order.status = 'Delivered';
          updatedLogs = [`Order #${order.id} has been successfully delivered.`, ...updatedLogs];
        }
      }
      return order;
    });

    return {
      orders: updatedOrders,
      printers: updatedPrinters,
      adminLogs: updatedLogs
    };
  })
}));
