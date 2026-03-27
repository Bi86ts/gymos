import { Link } from 'react-router-dom'

export default function RetentionDashboard() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="relative">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Performance Overview</span>
            <h2 className="font-headline text-5xl font-bold tracking-tight text-on-surface">Retention <span className="text-primary italic">Engine</span></h2>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-highest px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> Export Report
            </button>
            <Link to="/owner/churn" className="kinetic-gradient px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest text-on-primary-fixed hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(243,255,202,0.3)]">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span> View Churn Risk List
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">Active Members</p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">1,240</span>
            <span className="text-primary font-bold flex items-center text-sm">
              <span className="material-symbols-outlined text-base">arrow_drop_up</span> +2%
            </span>
          </div>
          <div className="mt-6 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%]"></div>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">At-Risk Members</p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">84</span>
            <span className="text-error font-bold flex items-center text-sm">
              <span className="material-symbols-outlined text-base">arrow_drop_down</span> -5%
            </span>
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-xs text-error">priority_high</span>
            </div>
            <p className="text-on-surface-variant text-[10px] leading-tight flex items-center">Requires immediate retention action for 12 members.</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">Monthly Churn Rate</p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">3.2%</span>
            <span className="text-secondary font-bold flex items-center text-sm italic">Target: &lt; 3.0%</span>
          </div>
          <div className="mt-6 flex items-end gap-1 h-8">
            {[40, 60, 30, 50, 80, 45].map((h, i) => (
              <div key={i} className={`flex-1 rounded-sm ${i >= 4 ? 'bg-primary' : 'bg-surface-container-highest'}`} style={{height: `${h}%`}}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention Trend */}
        <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="font-headline text-2xl font-bold">Retention Trend</h3>
              <p className="text-on-surface-variant text-sm">6-month member lifecycle stability</p>
            </div>
            <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">6 Months</span>
          </div>
          <div className="relative h-64 w-full flex items-end gap-4 px-4">
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5">
              {[...Array(6)].map((_, i) => <div key={i} className="w-px h-full bg-white"></div>)}
            </div>
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d="M 0 180 Q 100 120 200 160 T 400 60 T 600 100 T 800 40" fill="none" stroke="#f3ffca" strokeLinecap="round" strokeWidth="4" className="drop-shadow-[0_0_8px_rgba(243,255,202,0.5)]"></path>
              <path d="M 0 180 Q 100 120 200 160 T 400 60 T 600 100 T 800 40 V 256 H 0 Z" fill="url(#chartGrad)" className="opacity-20"></path>
              <defs><linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f3ffca"></stop><stop offset="100%" stopColor="#f3ffca" stopOpacity="0"></stop></linearGradient></defs>
            </svg>
            <div className="absolute -bottom-8 w-full flex justify-between text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
              {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Risk Profile */}
        <div className="bg-surface-container-low p-8 rounded-xl space-y-8">
          <div>
            <h3 className="font-headline text-2xl font-bold">Risk Profile</h3>
            <p className="text-on-surface-variant text-sm">Segmentation by engagement</p>
          </div>
          <div className="space-y-6">
            {[
              { label: 'High Risk', pct: 12, color: 'error' },
              { label: 'Medium Risk', pct: 28, color: 'tertiary' },
              { label: 'Healthy / Low Risk', pct: 60, color: 'primary' },
            ].map(r => (
              <div key={r.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className={`font-label text-xs font-bold uppercase tracking-widest text-${r.color}`}>{r.label}</span>
                  <span className="font-headline text-lg font-bold text-on-surface">{r.pct}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full bg-${r.color}`} style={{width: `${r.pct}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant italic leading-relaxed">Most medium-risk members haven't visited in 14 days. Suggest personalized re-engagement.</p>
          </div>
        </div>
      </section>

      {/* Renewal Preview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container p-8 rounded-xl flex flex-col items-center justify-center relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" fill="transparent" stroke="#23262a" strokeWidth="8"></circle>
              <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f3ffca" strokeDasharray="364.4" strokeDashoffset="43.7" strokeLinecap="round" strokeWidth="12" className="drop-shadow-[0_0_12px_rgba(243,255,202,0.4)]"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline text-3xl font-bold text-primary">88%</span>
            </div>
          </div>
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface">Overall Renewal Rate</p>
        </div>
        <div className="md:col-span-2 bg-surface-container p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">event_repeat</span> Upcoming Renewals (7 Days)
            </h3>
            <Link to="/owner/renewals" className="font-label text-[10px] bg-secondary-container/20 text-secondary px-3 py-1 rounded-full font-bold hover:bg-secondary-container/40 transition-colors">42 TOTAL →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Sarah Mitchell', 'James Wilson', 'Elena Rodriguez', 'Marcus Chen'].map((name, i) => (
              <div key={name} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">Expires: {['Tomorrow', 'Mar 28', 'Mar 30', 'Mar 31'][i]}</p>
                </div>
                <span className="ml-auto material-symbols-outlined text-primary-dim text-xl">contact_mail</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
