/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other VITE_ vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}