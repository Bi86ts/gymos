import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const roles = [
  {
    id: 'member',
    icon: 'fitness_center',
    title: 'Member',
    desc: 'Track workouts, follow plans, and reach your fitness goals.',
    color: 'from-primary/20 to-primary/5',
    border: 'border-primary/30',
    path: '/onboarding',
  },
  {
    id: 'trainer',
    icon: 'sports',
    title: 'Trainer',
    desc: 'Manage your clients, create plans, and track their progress.',
    color: 'from-cyan-400/20 to-cyan-400/5',
    border: 'border-cyan-400/30',
    path: '/trainer',
  },
  {
    id: 'owner',
    icon: 'domain',
    title: 'Owner',
    desc: 'Monitor revenue, retention, and run your gym analytics.',
    color: 'from-amber-400/20 to-amber-400/5',
    border: 'border-amber-400/30',
    path: '/owner',
  },
]

export default function RoleSelector() {
  const { user, profile, updateRole } = useAuth()
  const navigate = useNavigate()
  const [selecting, setSelecting] = useState(null)

  const handleSelect = async (role) => {
    setSelecting(role.id)
    try {
      await updateRole(role.id)
      // Members need onboarding, others go straight to dashboard
      navigate(role.path, { replace: true })
    } catch (e) {
      console.error('Role selection error:', e)
      setSelecting(null)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md text-center mb-10">
        <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tight mb-2">
          GYMOS<span className="text-primary">.</span>
        </h1>
        {user && (
          <div className="flex items-center justify-center gap-3 mb-6">
            {user.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full border border-primary/30" />
            )}
            <p className="text-on-surface-variant text-sm">
              Welcome, <span className="text-on-surface font-bold">{user.user_metadata?.full_name || user.email}</span>
            </p>
          </div>
        )}
        <h2 className="font-headline text-xl font-bold text-on-surface uppercase tracking-wide">Choose Your Role</h2>
        <p className="text-on-surface-variant text-sm mt-1">How will you use GymOS?</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => handleSelect(role)}
            disabled={selecting !== null}
            className={`w-full bg-gradient-to-r ${role.color} p-6 rounded-2xl border ${role.border} text-left transition-all active:scale-[0.98] hover:shadow-lg disabled:opacity-50 group relative overflow-hidden`}
          >
            {selecting === role.id && (
              <div className="absolute inset-0 bg-surface/80 flex items-center justify-center rounded-2xl">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface/50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-primary">{role.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-black text-lg text-on-surface uppercase">{role.title}</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">{role.desc}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
