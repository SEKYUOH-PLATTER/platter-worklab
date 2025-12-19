import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
  id: number;
  title: string;
  category: string;
  thumbnail_url: string;
  content: string;
  view_count: number;
  created_at: string;
}

export interface Contact {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}
