import { Link } from 'react-router-dom'

export default function RoleSelector() {
  const roles = [
    {
      title: 'Member',
      subtitle: 'Your personal fitness command center',
      icon: 'fitness_center',
      path: '/member',
      desc: 'Track workouts, check in, monitor consistency score and streaks. Your gym experience, optimized.'
    },
    {
      title: 'Trainer',
      subtitle: 'Retention-driven coaching tools',
      icon: 'monitoring',
      path: '/trainer',
      desc: 'Action queue with at-risk members, 1-tap outreach, member directory, and schedule management.'
    },
    {
      title: 'Owner',
      subtitle: 'Business intelligence dashboard',
      icon: 'analytics',
      path: '/owner',
      desc: 'Retention metrics, churn risk lists, renewal pipeline, and revenue dashboards — all in real time.'
    }
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Logo & Heading */}
      <div className="text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter text-primary uppercase italic">GYMOS</h1>
        </div>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto">A gym retention and operating system. Not another fitness tracker — a behavior change engine.</p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant font-label">Predict</span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant font-label">Intervene</span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant font-label">Retain</span>
          <span className="w-1 h-1 rounded-full bg-primary"></span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant font-label">Renew</span>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10">
        {roles.map((role) => (
          <Link
            key={role.title}
            to={role.path}
            className="group relative flex flex-col p-8 bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-xl border border-outline-variant/10 hover:border-primary/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary-fixed text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{role.icon}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-label mb-2">{role.subtitle}</span>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-3">{role.title}</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed flex-1">{role.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <span>Enter</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer tagline */}
      <p className="text-on-surface-variant/50 text-xs mt-16 font-label uppercase tracking-widest">Kinetic Forge — v0.1 MVP</p>
    </div>
  )
}
