import { createClient } from "@supabase/supabase-js";

const supabaseUrl = __api.env.SUPABASE_URL
const superbaseAnonKey = __api.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, superbaseAnonKey)
