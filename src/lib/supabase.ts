import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured =
  !!supabaseUrl &&
  supabaseUrl !== 'your_supabase_project_url' &&
  !!supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!_supabase) {
    _supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return _supabase
}

export function getTodaySessionId(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
