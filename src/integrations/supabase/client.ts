import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// المفتاح الصحيح (JWT Anon Key) الذي يتعرف عليه خادم Supabase بشكل مباشر
// مفاتيح sb_publishable لا تعمل مع الروابط المباشرة .supabase.co للطلبات العامة
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});