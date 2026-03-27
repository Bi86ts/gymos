export default function RevenueDashboard() {
  const revenueCards = [
    { label: 'MRR', value: '₹12.4L', trend: '+8%', positive: true, color: 'border-primary', icon: 'trending_up' },
    { label: 'Renewals Collected', value: '₹8.2L', trend: '+12%', positive: true, color: 'border-secondary', icon: 'payments' },
    { label: 'PT Revenue', value: '₹3.8L', trend: '+5%', positive: true, color: 'border-primary-dim', icon: 'fitness_center' },
    { label: 'Outstanding Dues', value: '₹1.6L', trend: '-3%', positive: true, color: 'border-error', icon: 'warning' },
  ]

  const planBreakdown = [
    { plan: 'Premium Monthly', members: 320, revenue: '₹4.8L', pct: 39, color: 'bg-primary' },
    { plan: 'Standard Monthly', members: 480, revenue: '₹3.6L', pct: 29, color: 'bg-secondary' },
    { plan: 'Premium Quarterly', members: 180, revenue: '₹2.7L', pct: 22, color: 'bg-primary-dim' },
    { plan: 'Annual', members: 85, revenue: '₹1.3L', pct: 10, color: 'bg-tertiary-dim' },
  ]

  const monthlyData = [
    { month: 'Oct', value: 68 },
    { month: 'Nov', value: 72 },
    { month: 'Dec', value: 85 },
    { month: 'Jan', value: 78 },
    { month: 'Feb', value: 82 },
    { month: 'Mar', value: 95 },
  ]

  return (
    <div className="space-y-10 pb-12">
      <div>
        <span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Financial Overview</span>
        <h2 className="font-headline text-4xl font-bold tracking-tight">Revenue <span className="text-primary italic">Dashboard</span></h2>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueCards.map((card) => (
          <div key={card.label} className={`bg-surface-container-low p-6 rounded-xl border-l-4 ${card.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">{card.icon}</span>
              <p className="font-label text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{card.label}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold">{card.value}</span>
              <span className={`text-xs font-bold ${card.positive ? 'text-primary' : 'text-error'}`}>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-surface-container-low p-8 rounded-xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="font-headline text-2xl font-bold">Revenue Trend</h3>
            <p className="text-on-surface-variant text-sm">Monthly recurring revenue — 6 months</p>
          </div>
          <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">6 Months</span>
        </div>
        <div className="flex items-end gap-4 h-48">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-on-surface">{d.value}%</span>
              <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{
                height: `${d.value * 1.6}px`,
                background: i === monthlyData.length - 1 ? 'linear-gradient(135deg, #f3ffca 0%, #cafd00 100%)' : '#23262a'
              }}></div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl">
          <h3 className="font-headline text-xl font-bold mb-6">Plan Breakdown</h3>
          <div className="space-y-4">
            {planBreakdown.map((p) => (
              <div key={p.plan} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{p.plan}</span>
                  <span className="font-headline font-bold text-sm">{p.revenue}</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{width: `${p.pct}%`}}></div>
                </div>
                <p className="text-[10px] text-on-surface-variant">{p.members} members · {p.pct}% of revenue</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-surface-container-low p-8 rounded-xl">
          <h3 className="font-headline text-xl font-bold mb-6">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Avg Revenue / Member', value: '₹1,000', icon: 'person' },
              { label: 'Collection Rate', value: '94%', icon: 'account_balance' },
              { label: 'PT Conversion', value: '18%', icon: 'trending_up' },
              { label: 'Revenue Growth', value: '+8%', icon: 'show_chart' },
              { label: 'Renewal Revenue', value: '₹8.2L', icon: 'autorenew' },
              { label: 'New Member Rev', value: '₹2.1L', icon: 'person_add' },
            ].map((m) => (
              <div key={m.label} className="bg-surface-container p-4 rounded-xl">
                <span className="material-symbols-outlined text-primary text-sm mb-2 block">{m.icon}</span>
                <p className="font-headline font-bold text-lg">{m.value}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
