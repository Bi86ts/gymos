import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navItems = [
  { path: '/member', icon: 'fitness_center', label: 'Training', exact: true },
  { path: '/member/plan', icon: 'calendar_month', label: 'Plan' },
  { path: '/member/chat', icon: 'forum', label: 'Chat', badge: true },
  { path: '/member/profile', icon: 'person', label: 'Profile' },
]

export default function MemberLayout() {
  const location = useLocation()
  const [firstName, setFirstName] = useState('Alex')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_member')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.name) {
          setFirstName(data.name.split(' ')[0])
        }
      }
    } catch (e) {}
  }, [])

  return (
    <div className="min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant font-label">MEMBER</span>
            <span className="text-on-surface font-headline font-bold leading-none mb-0.5">Welcome, {firstName}</span>
            <span className="text-primary-dim text-[10px] font-bold tracking-wide italic">Your trainer: Coach Sarah</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-headline font-bold tracking-tight text-2xl font-black tracking-tighter text-primary uppercase italic">GYMOS</div>
          <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl border-t border-primary/10 bg-surface/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex justify-around items-center pt-3 pb-8 px-4 w-full">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-xl active:scale-90 duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-on-surface-variant opacity-50 hover:text-primary transition-colors'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-1 right-3 w-2 h-2 bg-error rounded-full border border-surface"></span>
                )}
                <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
