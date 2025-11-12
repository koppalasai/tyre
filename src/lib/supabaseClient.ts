// Supabase client setup for Vite + React
// Production notes:
// - Keep your anon key in client only; never expose service roles.
// - Enable Row Level Security (RLS) and create policies for every table.
// - Customize email templates in Supabase Auth > Email templates.
// - Handle existing-email errors (e.g., "User already registered") in signup UI.
// - Configure allowed redirect URLs in Supabase Auth > URL Configuration.
//   Add your local dev URL (e.g., http://localhost:5173) and production domain.
//
// Optionally set email redirect URL:
// - When calling signUp, you can pass options.emailRedirectTo to control the link
//   users receive in the confirmation email. Commonly use `window.location.origin`
//   with a route like `/auth/callback`.

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const missingEnvMessage =
  'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (see .env.example).'

type Client = ReturnType<typeof createClient<Database>>

function createStubClient(): Client {
  const error = new Error(missingEnvMessage)
  const stub = {
    auth: {
      async signUp() {
        return { data: { user: null, session: null }, error }
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error }
      },
      async signOut() {
        return { error }
      },
      async getSession() {
        return { data: { session: null }, error }
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe() {} } } }
      },
    },
  }
  return stub as unknown as Client
}

let supabase: Client

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(missingEnvMessage)
    supabase = createStubClient()
  } else {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
} catch (e) {
  console.error('Supabase client initialization failed:', e)
  supabase = createStubClient()
}

export { supabase }