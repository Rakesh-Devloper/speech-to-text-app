import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gcrvjssokjxxujlkzomj.supabase.co";

const supabaseAnonKey = "sb_publishable_8-qqq6LzXLmMR0HKeTsJsw_pHr-eiN3";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);