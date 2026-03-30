import { useState } from 'react'
import { Link } from 'react-router-dom'

const monthlyData = [
  { month: 'Oct', label: 'October', members: 1180, retained: 1090, pct: 92, newJoined: 40, left: 30 },
  { month: 'Nov', label: 'November', members: 1200, retained: 1080, pct: 90, newJoined: 50, left: 70 },
  { month: 'Dec', label: 'December', members: 1150, retained: 1020, pct: 89, newJoined: 30, left: 80 },
  { month: 'Jan', label: 'January', members: 1210, retained: 1100, pct: 91, newJoined: 90, left: 50 },
  { month: 'Feb', label: 'February', members: 1230, retained: 1130, pct: 92, newJoined: 60, left: 40 },
  { month: 'Mar', label: 'March', members: 1240, retained: 1160, pct: 94, newJoined: 45, left: 25 },
]

function getChangeLabel(current, prev) {
  if (!prev) return { text: '—', emoji: '', color: 'text-on-surface-variant' }
  const diff = current - prev
  if (diff > 2) return { text: `+${diff}% up!`, emoji: '📈', color: 'text-primary' }
  if (diff > 0) return { text: `+${diff}% better`, emoji: '👍', color: 'text-primary' }
  if (diff === 0) return { text: 'Same as before', emoji: '➡️', color: 'text-secondary' }
  if (diff > -3) return { text: `${diff}% slight dip`, emoji: '⚡', color: 'text-secondary' }
  return { text: `${diff}% dropped`, emoji: '⚠️', color: 'text-error' }
}

function getOverallSummary(data) {
  const first = data[0].pct
  const last = data[data.length - 1].pct
  const diff = last - first
  if (diff > 3) return { text: 'Your gym is doing great! Members are staying and happy 💪🎉', color: 'text-primary' }
  if (diff >= 0) return { text: 'Your gym is steady. Members are sticking around 👍', color: 'text-primary' }
  if (diff >= -3) return { text: 'Slight dip noticed. Consider launching a special offer to bring members back ⚡', color: 'text-secondary' }
  return { text: 'Members are leaving. Take action now — launch an offer or talk to your trainers! 🚨', color: 'text-error' }
}

function HelpTooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block ml-1 cursor-pointer" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      <span className="material-symbols-outlined text-on-surface-variant text-xs align-middle" style={{ fontSize: '14px' }}>info</span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-surface-bright text-on-surface text-[11px] leading-relaxed p-3 rounded-xl shadow-xl border border-outline-variant/20 z-50 text-center font-normal normal-case tracking-normal">
          {text}
        </span>
      )}
    </span>
  )
}

export default function RetentionDashboard() {
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(monthlyData.length - 1)
  const summary = getOverallSummary(monthlyData)
  const activeIdx = hoveredMonth !== null ? hoveredMonth : selectedMonth
  const activeData = monthlyData[activeIdx]
  const change = getChangeLabel(activeData.pct, activeIdx > 0 ? monthlyData[activeIdx - 1].pct : null)

  return (
    <div className="space-y-10 pb-12">
      {/* Hero */}
      <section className="relative">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2 block">Your Gym at a Glance</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Gym <span className="text-primary italic">Dashboard</span></h2>
            <p className="text-on-surface-variant text-sm mt-2">Everything you need to know about your gym — simple & clear</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/owner/offers" className="kinetic-gradient px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest text-on-primary-fixed hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(243,255,202,0.3)]">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>local_offer</span> Launch Offers
            </Link>
            <button className="bg-surface-container-highest px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span> Export Report
            </button>
            <Link to="/owner/churn" className="bg-surface-container-highest px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-bright transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">analytics</span> Churn Risk
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Grid — simplified language */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">
            Total Active Members
            <HelpTooltip text="Members who currently have a valid gym subscription and visited at least once in the last 30 days." />
          </p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">1,240</span>
            <span className="text-primary font-bold flex items-center text-sm">
              <span className="material-symbols-outlined text-base">arrow_drop_up</span> +2% from last month
            </span>
          </div>
          <p className="text-on-surface-variant text-xs mt-3">Your gym has 1,240 members right now 👊</p>
          <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{width: '85%'}}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">85% capacity used</p>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">
            Members Who May Leave
            <HelpTooltip text="Members who haven't visited in a while or are showing signs of losing interest. Reach out to them!" />
          </p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">84</span>
            <span className="text-error font-bold flex items-center text-sm">
              <span className="material-symbols-outlined text-base">arrow_drop_down</span> -5% from last month
            </span>
          </div>
          <p className="text-on-surface-variant text-xs mt-3">Good news — fewer risky members than before 🙌</p>
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-8 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-xs text-error">priority_high</span>
            </div>
            <p className="text-on-surface-variant text-[10px] leading-tight flex items-center">12 members need your attention right away!</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <p className="font-label text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">
            Members Leaving Rate
            <HelpTooltip text="Out of 100 members, how many are quitting every month. Lower is better! Below 3% is great." />
          </p>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-5xl font-bold">3.2%</span>
            <span className="text-secondary font-bold flex items-center text-sm italic">Target: below 3%</span>
          </div>
          <p className="text-on-surface-variant text-xs mt-3">Almost at your target — keep it up! 💪</p>
          <div className="mt-4 flex items-end gap-1 h-8">
            {[40, 60, 30, 50, 80, 45].map((h, i) => (
              <div key={i} className={`flex-1 rounded-sm transition-all ${i >= 4 ? 'bg-primary' : 'bg-surface-container-highest'}`} style={{height: `${h}%`}}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Retention Trend */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-low p-6 md:p-8 rounded-xl flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span>
                Are Members Staying?
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">See how many members stayed each month — tap any bar to see details</p>
            </div>
            <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface">Last 6 Months</span>
          </div>

          {/* Dynamic summary */}
          <div className={`${summary.color} text-sm font-medium mb-6 px-4 py-3 rounded-xl bg-surface-container flex items-center gap-2`}>
            <span className="text-lg">📊</span>
            <span>{summary.text}</span>
          </div>

          {/* Interactive Chart */}
          <div className="flex-1 flex flex-col">
            {/* Tooltip area */}
            <div className="h-20 mb-2 flex items-center justify-center">
              <div className="bg-surface-container-highest rounded-xl px-6 py-3 text-center transition-all duration-300" style={{ minWidth: '280px' }}>
                <p className="font-headline font-bold text-lg text-on-surface">{activeData.label} — <span className="text-primary">{activeData.pct}%</span> members stayed</p>
                <div className="flex justify-center gap-4 mt-1">
                  <span className="text-[11px] text-on-surface-variant">👥 {activeData.members} total</span>
                  <span className="text-[11px] text-primary">+{activeData.newJoined} joined</span>
                  <span className="text-[11px] text-error">-{activeData.left} left</span>
                </div>
                <p className={`text-xs font-bold mt-1 ${change.color}`}>{change.emoji} {change.text}</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-3 md:gap-5 h-48 px-2">
              {monthlyData.map((d, i) => {
                const isActive = i === activeIdx
                const barHeight = ((d.pct - 80) / 20) * 100 // normalize 80-100 to 0-100
                return (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    onClick={() => setSelectedMonth(i)}
                  >
                    <span className={`text-xs font-bold transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {d.pct}%
                    </span>
                    <div className="w-full relative">
                      <div
                        className={`w-full rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'shadow-[0_0_20px_rgba(243,255,202,0.3)]'
                            : 'group-hover:opacity-80'
                        }`}
                        style={{
                          height: `${Math.max(barHeight, 15)}%`,
                          minHeight: '30px',
                          maxHeight: '160px',
                          height: `${barHeight * 1.6}px`,
                          background: isActive
                            ? 'linear-gradient(180deg, #f3ffca 0%, #cafd00 100%)'
                            : '#23262a',
                          transform: isActive ? 'scaleY(1.05)' : 'scaleY(1)',
                          transformOrigin: 'bottom',
                        }}
                      ></div>
                      {/* Dot indicator */}
                      {isActive && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(243,255,202,0.6)] animate-pulse"></div>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{d.month}</span>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary inline-block"></span> Selected Month</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-surface-container-highest inline-block"></span> Other Months</span>
            </div>
          </div>
        </div>

        {/* Member Health Check (Risk Profile) */}
        <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
          <div>
            <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>health_and_safety</span>
              Member Health Check
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">How healthy is your member base?</p>
          </div>
          <div className="space-y-5">
            {[
              { label: '🔴 Danger Zone', desc: 'May leave any day', pct: 12, color: 'bg-error', textColor: 'text-error', count: 149 },
              { label: '🟡 Need Attention', desc: 'Getting inactive slowly', pct: 28, color: 'bg-secondary', textColor: 'text-secondary', count: 347 },
              { label: '🟢 Happy & Active', desc: 'Regular visitors', pct: 60, color: 'bg-primary', textColor: 'text-primary', count: 744 },
            ].map(r => (
              <div key={r.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className={`font-label text-xs font-bold ${r.textColor}`}>{r.label}</span>
                    <p className="text-[10px] text-on-surface-variant">{r.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-lg font-bold text-on-surface">{r.pct}%</span>
                    <p className="text-[10px] text-on-surface-variant">{r.count} members</p>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full transition-all duration-700`} style={{width: `${r.pct}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-outline-variant/10">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              💡 <strong>Tip:</strong> Members in the "Need Attention" group haven't visited in 14 days. Send them a personal message or launch a special offer to bring them back!
            </p>
            <Link to="/owner/offers" className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline">
              <span className="material-symbols-outlined text-sm">local_offer</span> Launch a Comeback Offer →
            </Link>
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
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface text-center">Renewal Rate</p>
          <p className="text-[10px] text-on-surface-variant mt-1 text-center">88 out of 100 members renew their plan 👏</p>
        </div>
        <div className="md:col-span-2 bg-surface-container p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">event_repeat</span> Renewals Coming Up (7 Days)
              <HelpTooltip text="Members whose plan is expiring in the next 7 days. Contact them to renew!" />
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
