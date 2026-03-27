export default function RenewalDashboard() {
  const pipeline = [
    { label: 'Expiring in 7 Days', count: 42, color: 'border-error', icon: 'warning' },
    { label: 'Expiring in 15 Days', count: 78, color: 'border-secondary', icon: 'schedule' },
    { label: 'Expiring in 30 Days', count: 124, color: 'border-primary', icon: 'event' },
  ]

  const expiringMembers = [
    { name: 'Sarah Mitchell', plan: 'Premium Monthly', expiry: 'Tomorrow', status: 'No Action', risk: 'high' },
    { name: 'James Wilson', plan: 'Standard Monthly', expiry: 'Mar 28', status: 'Reminded', risk: 'medium' },
    { name: 'Elena Rodriguez', plan: 'Premium Quarterly', expiry: 'Mar 30', status: 'No Action', risk: 'high' },
    { name: 'Marcus Chen', plan: 'Standard Monthly', expiry: 'Mar 31', status: 'Renewed', risk: 'low' },
    { name: 'Priya Kapoor', plan: 'Premium Monthly', expiry: 'Apr 1', status: 'Reminded', risk: 'medium' },
    { name: 'David Foster', plan: 'Annual', expiry: 'Apr 3', status: 'No Action', risk: 'medium' },
    { name: 'Lisa Chang', plan: 'Premium Monthly', expiry: 'Apr 5', status: 'No Action', risk: 'low' },
    { name: 'Tom Bradley', plan: 'Standard Monthly', expiry: 'Apr 7', status: 'Renewed', risk: 'low' },
  ]

  const statusColor = { 'No Action': 'text-error bg-error/10', 'Reminded': 'text-secondary bg-secondary/10', 'Renewed': 'text-primary bg-primary/10' }

  return (
    <div className="space-y-10 pb-12">
      <div>
        <span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Renewal Intelligence</span>
        <h2 className="font-headline text-4xl font-bold tracking-tight">Renewal <span className="text-primary italic">Pipeline</span></h2>
      </div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pipeline.map((p) => (
          <div key={p.label} className={`bg-surface-container-low p-8 rounded-xl border-l-4 ${p.color}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-on-surface-variant">{p.icon}</span>
              <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest">{p.label}</p>
            </div>
            <span className="font-headline text-5xl font-bold">{p.count}</span>
            <p className="text-xs text-on-surface-variant mt-2">members</p>
          </div>
        ))}
      </div>

      {/* Renewal Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Renewal Rate (MTD)', value: '88%', trend: '+3%', positive: true },
          { label: 'Auto-Renewed', value: '156', trend: '', positive: true },
          { label: 'Pending Action', value: '42', trend: '-8', positive: true },
          { label: 'Churned (MTD)', value: '12', trend: '+2', positive: false },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container p-5 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold">{s.value}</span>
              {s.trend && <span className={`text-xs font-bold ${s.positive ? 'text-primary' : 'text-error'}`}>{s.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Expiring Members Table */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold">Expiring Members</h3>
          <p className="text-on-surface-variant text-sm">Next 7 days — requires attention</p>
        </div>
        <div className="divide-y divide-outline-variant/5">
          {expiringMembers.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{m.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{m.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-on-surface-variant">{m.expiry}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${statusColor[m.status]}`}>{m.status}</span>
                <button className="material-symbols-outlined text-primary-dim text-xl hover:text-primary transition-colors">contact_mail</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
