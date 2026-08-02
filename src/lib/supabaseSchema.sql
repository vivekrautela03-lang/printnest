-- PrintNest Complete Supabase PostgreSQL DDL Schema
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/pmacffojqzhajirdqnyy/sql)

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff', 'delivery_partner')),
    is_blocked BOOLEAN DEFAULT FALSE,
    wallet_balance NUMERIC(10, 2) DEFAULT 1250.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id),
    title TEXT NOT NULL,
    description TEXT,
    price_per_page NUMERIC(10, 2) NOT NULL DEFAULT 2.00,
    color_price NUMERIC(10, 2) DEFAULT 8.00,
    paper_sizes TEXT[] DEFAULT ARRAY['A4', 'A3', 'Legal'],
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Printing', 'Binding', 'Packaging', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    delivery_charge NUMERIC(10, 2) DEFAULT 10.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'Paid',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf',
    pages INT NOT NULL DEFAULT 1,
    copies INT NOT NULL DEFAULT 1,
    print_type TEXT NOT NULL DEFAULT 'bw',
    paper_size TEXT NOT NULL DEFAULT 'A4',
    binding_style TEXT DEFAULT 'spiral',
    item_cost NUMERIC(10, 2) NOT NULL
);

-- 7. Delivery Partners Table
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'Online' CHECK (status IN ('Online', 'Offline', 'Busy')),
    active_orders_count INT DEFAULT 0
);

-- 8. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00,
    usage_limit INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE
);

-- 9. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Paper', 'Ink', 'Binding'
    stock_quantity INT NOT NULL DEFAULT 100,
    low_stock_threshold INT NOT NULL DEFAULT 20,
    unit TEXT DEFAULT 'packs'
);

-- 10. Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 11. Sample Seed Data
INSERT INTO public.categories (name, slug, icon_name) VALUES
('Document Printing', 'doc-printing', 'FileText'),
('Colour Printing', 'colour-printing', 'Palette'),
('Black & White', 'bw-printing', 'Printer'),
('Photo Printing', 'photo-printing', 'Image'),
('Lamination', 'lamination', 'Layers'),
('Spiral Binding', 'spiral-binding', 'BookOpen'),
('Hard Binding', 'hard-binding', 'Book'),
('ID Cards', 'id-cards', 'CreditCard'),
('Visiting Cards', 'visiting-cards', 'Briefcase'),
('Posters', 'posters', 'Maximize'),
('Banners', 'banners', 'Flag'),
('Thesis Printing', 'thesis-printing', 'Award')
ON CONFLICT (slug) DO NOTHING;
