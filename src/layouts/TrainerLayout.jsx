import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTrainerProfile } from '../services/trainerService'

const navItems = [
  { path: '/trainer', icon: 'dashboard', label: 'Dashboard', exact: true },
  { path: '/trainer/members', icon: 'groups', label: 'Members' },
  { path: '/trainer/schedule', icon: 'calendar_month', label: 'Schedule' },
  { path: '/trainer/messages', icon: 'chat', label: 'Chat' },
  { path: '/trainer/profile', icon: 'person', label: 'Profile' },
]

export default function TrainerLayout() {
  const location = useLocation()
  const [trainer, setTrainer] = useState({ name: 'Coach' })
  const [trainerPhoto, setTrainerPhoto] = useState(null)

  useEffect(() => {
    setTrainer(getTrainerProfile())
    const photo = localStorage.getItem('gymos_trainer_photo')
    if (photo) setTrainerPhoto(photo)
  }, [])

  const firstName = trainer.name?.split(' ').pop() || 'Coach'

  return (
    <div className="min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center px-6 h-16 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30">
            {trainerPhoto ? (
              <img src={trainerPhoto} alt="Trainer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">sports</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">TRAINER</span>
            <span className="text-on-surface font-headline font-bold leading-none">{firstName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-headline font-bold text-xl tracking-tight text-white uppercase">GYMOS<span className="text-primary">.</span></h1>
          <button className="text-on-surface hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-20 px-4 max-w-2xl mx-auto">
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
              <NavLink key={item.path} to={item.path}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl outline-none">
                {isActive && (
                  <motion.div layoutId="trainer-nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <div className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined transition-transform duration-300 active:scale-75 text-xl" style={isActive ? {fontVariationSettings: "'FILL' 1", transform: 'scale(1.1)'} : {}}>{item.icon}</span>
                  <span className="font-label text-[9px] font-semibold mt-0.5 tracking-wide">{item.label}</span>
                </div>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
