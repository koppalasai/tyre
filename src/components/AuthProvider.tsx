import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import { Navigate } from 'react-router-dom'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      mounted = false
      subscription?.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ session, user, loading }), [session, user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Route protection helper: wraps protected pages
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!session) return <Navigate to="/signin" replace />
  return <>{children}</>
}

// NOTE: In Supabase dashboard (Auth > URL Configuration), set allowed redirect URLs
// like `http://localhost:5173` and your production domain to ensure email links work.