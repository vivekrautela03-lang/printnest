import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmacffojqzhajirdqnyy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Id352az1eRAVnltTTtewDQ_w440PNDt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to sync orders with Supabase
export async function syncOrderToSupabase(orderData: any) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.warn('Supabase sync notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase offline fallback active:', err.message);
    return { success: false, error: err.message };
  }
}

// Helper function to sync user profiles
export async function syncProfileToSupabase(profile: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profile])
      .select();

    if (error) {
      console.warn('Supabase profile sync notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase fallback active:', err.message);
    return { success: false, error: err.message };
  }
}
