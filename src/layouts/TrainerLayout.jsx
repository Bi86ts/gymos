import { Outlet, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/trainer', icon: 'checklist', label: 'Queue', exact: true },
  { path: '/trainer/members', icon: 'groups', label: 'Members' },
  { path: '/trainer/schedule', icon: 'calendar_today', label: 'Schedule' },
  { path: '/trainer/profile', icon: 'person', label: 'Profile' },
]

export default function TrainerLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">monitoring</span>
          <h1 className="font-headline font-bold tracking-tight text-xl font-black tracking-tighter text-primary uppercase">GYMOS</h1>
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container">
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-20 px-4 max-w-2xl mx-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)] border-t border-primary/10">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-90 duration-150 ${
                isActive
                  ? 'bg-primary text-surface scale-110'
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
