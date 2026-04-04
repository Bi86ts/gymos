import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/trainer', icon: 'checklist', label: 'Queue', exact: true },
  { path: '/trainer/members', icon: 'groups', label: 'Members' },
  { path: '/trainer/messages', icon: 'chat', label: 'Chat' },
  { path: '/trainer/profile', icon: 'person', label: 'Profile' },
]

export default function TrainerLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 flex justify-between items-center px-6 h-16 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">monitoring</span>
          <h1 className="font-headline font-bold text-xl tracking-tight text-white uppercase">GYMOS<span className="text-primary">.</span></h1>
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/30">
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
          </div>
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
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="trainer-nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-on-surface'}`}>
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
