import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/owner', icon: 'dashboard', label: 'Dashboard', exact: true },
  { path: '/owner/offers', icon: 'local_offer', label: 'Offers' },
  { path: '/owner/churn', icon: 'analytics', label: 'Churn' },
  { path: '/owner/renewals', icon: 'sync_saved_locally', label: 'Renewals' },
  { path: '/owner/revenue', icon: 'payments', label: 'Revenue' },
]

export default function OwnerLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-black/60 backdrop-blur-2xl flex justify-between items-center px-6 py-4 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-white font-headline uppercase">GYMOS<span className="text-primary">.</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 mr-6">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`font-label text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
          <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden">
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-4 space-y-12">
        <Outlet />
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center px-2 pb-8 pt-2 bg-black/60 backdrop-blur-3xl z-50 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:hidden">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="owner-nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative z-10 flex flex-col items-center justify-center transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-white'}`}>
                <span className="material-symbols-outlined transition-transform duration-300 active:scale-75" style={isActive ? {fontVariationSettings: "'FILL' 1", transform: 'scale(1.15)'} : {}}>{item.icon}</span>
                <span className="font-label text-[9px] font-semibold mt-1 tracking-wide">{item.label}</span>
              </div>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
