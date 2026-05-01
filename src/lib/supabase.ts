import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./constants";

const hasSupabase = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

export const supabase = hasSupabase
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = hasSupabase;
