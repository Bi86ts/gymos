import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * Auth callback page — handles the redirect from Google OAuth.
 * Supabase automatically exchanges the code for a session.
 * We just need to wait and redirect to the right place.
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          // Check if user has a role set
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role) {
            // Existing user — go to their dashboard
            navigate(`/${profile.role}`, { replace: true })
          } else {
            // New user — needs to pick a role
            navigate('/select-role', { replace: true })
          }
        } else {
          navigate('/', { replace: true })
        }
      } catch (e) {
        console.error('Auth callback error:', e)
        navigate('/', { replace: true })
      }
    }

    // Small delay for Supabase to process the token exchange
    const timer = setTimeout(handleCallback, 500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-on-surface-variant font-medium">Signing you in...</p>
      </div>
    </div>
  )
}
