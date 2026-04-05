import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/member', icon: 'fitness_center', label: 'Training', exact: true },
  { path: '/member/muscle-select', icon: 'explore', label: 'Explore' },
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center px-6 h-16 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30">
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">MEMBER</span>
            <span className="text-on-surface font-headline font-bold leading-none mb-0.5">Welcome, {firstName}</span>
            <span className="text-primary text-[10px] font-semibold tracking-wide">Coach Sarah</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-headline font-bold text-xl tracking-tight text-white">GYMOS<span className="text-primary">.</span></div>
          <button className="text-on-surface hover:text-primary transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-3xl border-t border-white/10 pt-2 pb-8 px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="member-nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-on-surface'}`}>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-black"></span>
                  )}
                  <span className="material-symbols-outlined transition-transform duration-300 active:scale-75" style={isActive ? {fontVariationSettings: "'FILL' 1", transform: 'scale(1.15)'} : {}}>{item.icon}</span>
                  <span className="font-label text-[10px] font-semibold mt-1 tracking-wide">{item.label}</span>
                </div>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
