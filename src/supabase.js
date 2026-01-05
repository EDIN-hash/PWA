import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://YOUR_URL.supabase.co",
    "YOUR_PUBLIC_ANON_KEY"
);
