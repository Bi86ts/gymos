import { Outlet, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/owner', icon: 'dashboard', label: 'Dashboard', exact: true },
  { path: '/owner/churn', icon: 'analytics', label: 'Churn' },
  { path: '/owner/renewals', icon: 'sync_saved_locally', label: 'Renewals' },
  { path: '/owner/revenue', icon: 'payments', label: 'Revenue' },
]

export default function OwnerLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black italic tracking-tighter text-primary font-headline">GYMOS</h1>
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
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden">
            <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
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
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-surface-bright/60 backdrop-blur-xl z-50 rounded-t-xl border-t border-primary/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] md:hidden">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10 scale-110'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
              <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
