import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, getProfile, upsertProfile } from '../lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)          // Supabase auth user
  const [profile, setProfile] = useState(null)     // profiles table row
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Bootstrap: check existing session ──
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          setUser(session.user)
          const p = await getProfile(session.user.id)
          if (p && mounted) setProfile(p)
        }
      } catch (e) {
        console.error('Auth init error:', e)
        if (mounted) setError(e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setLoading(true)
          try {
            let p = await getProfile(session.user.id)
            // Profile might not exist yet (trigger may have slight delay)
            if (!p) {
              p = await upsertProfile({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
              })
            }
            setProfile(p)
          } catch (e) {
            console.error('Profile fetch error:', e)
          } finally {
            setLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  // ── Sign in with Google ──
  const signInWithGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })
    if (error) setError(error.message)
  }

  // ── Sign out ──
  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) setError(error.message)
  }

  // ── Update role ──
  const updateRole = async (role) => {
    if (!user) return
    try {
      const updated = await upsertProfile({ id: user.id, role })
      setProfile(prev => ({ ...prev, ...updated }))
    } catch (e) {
      setError(e.message)
    }
  }

  // ── Update profile ──
  const updateProfile = async (data) => {
    if (!user) return
    try {
      const updated = await upsertProfile({ id: user.id, ...data })
      setProfile(prev => ({ ...prev, ...updated }))
      return updated
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    role: profile?.role || null,
    signInWithGoogle,
    signOut,
    updateRole,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
