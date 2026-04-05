import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMembers, syncCurrentMember, GOAL_LABELS, GOAL_COLORS, EQUIP_LABELS, daysSince, memberStatus } from '../../services/trainerService'

export default function ActionQueue() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])

  useEffect(() => {
    const synced = syncCurrentMember()
    setMembers(synced)
  }, [])

  // Categorize members
  const newMembers = useMemo(() => members.filter(m => memberStatus(m) === 'new'), [members])
  const atRisk = useMemo(() => members.filter(m => memberStatus(m) === 'at-risk'), [members])
  const watching = useMemo(() => members.filter(m => memberStatus(m) === 'watch'), [members])
  const active = useMemo(() => members.filter(m => memberStatus(m) === 'active'), [members])

  const todaysSessions = useMemo(() => {
    const today = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()]
    return members.filter(m => m.workoutDays?.includes(today))
  }, [members])

  const dismissNew = (id) => {
    const updated = members.map(m => m.id === id ? { ...m, isNew: false } : m)
    setMembers(updated)
    localStorage.setItem('gymos_trainer_members', JSON.stringify(updated))
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">

      {/* ── Stats Row ── */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
          <p className="text-3xl font-headline font-black text-on-surface">{members.length}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Members</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
          <p className="text-3xl font-headline font-black text-primary">{todaysSessions.length}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Today</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
          <p className="text-3xl font-headline font-black text-error">{atRisk.length}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">At Risk</p>
        </div>
      </section>

      {/* ── New Member Alerts ── */}
      {newMembers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary animate-pulse">person_add</span>
            <h2 className="font-headline text-lg font-black text-on-surface uppercase tracking-tight">New Members</h2>
            <span className="bg-primary text-on-primary text-[10px] font-black px-2 py-0.5 rounded-full">{newMembers.length}</span>
          </div>
          <div className="space-y-4">
            {newMembers.map(m => (
              <div key={m.id} className="bg-gradient-to-br from-primary/5 to-surface-container rounded-2xl p-5 border border-primary/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-primary/15 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">fiber_new</span>New
                  </span>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-lg text-on-surface">{m.name}</h3>
                    <p className="text-on-surface-variant text-xs">
                      {m.gender && <span className="capitalize">{m.gender} · </span>}
                      Age {m.age} · {m.experience}
                    </p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-surface/60 rounded-xl p-2 text-center">
                    <p className="text-sm font-headline font-black text-on-surface">{m.weight}<span className="text-[9px] text-on-surface-variant"> kg</span></p>
                    <p className="text-[8px] text-on-surface-variant uppercase font-bold">Weight</p>
                  </div>
                  <div className="bg-surface/60 rounded-xl p-2 text-center">
                    <p className="text-sm font-headline font-black text-on-surface">{m.targetWeight}<span className="text-[9px] text-on-surface-variant"> kg</span></p>
                    <p className="text-[8px] text-on-surface-variant uppercase font-bold">Target</p>
                  </div>
                  <div className="bg-surface/60 rounded-xl p-2 text-center">
                    <p className={`text-sm font-headline font-black ${GOAL_COLORS[m.objective] || 'text-primary'}`}>{(GOAL_LABELS[m.objective] || 'Fitness').substring(0,6)}</p>
                    <p className="text-[8px] text-on-surface-variant uppercase font-bold">Goal</p>
                  </div>
                  <div className="bg-surface/60 rounded-xl p-2 text-center">
                    <p className="text-sm font-headline font-black text-on-surface">{m.workoutDays?.length || 0}x</p>
                    <p className="text-[8px] text-on-surface-variant uppercase font-bold">/ Week</p>
                  </div>
                </div>

                {/* Conditions & Limitations */}
                {((m.conditions?.length > 0 && !m.conditions.includes('None')) || (m.limitations?.length > 0 && !m.limitations.includes('None — all good'))) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.conditions?.filter(c => c !== 'None').map(c => (
                      <span key={c} className="text-[9px] font-bold px-2 py-1 bg-error/10 text-error rounded-lg border border-error/20 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">warning</span>{c}
                      </span>
                    ))}
                    {m.limitations?.filter(l => l !== 'None — all good').map(l => (
                      <span key={l} className="text-[9px] font-bold px-2 py-1 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20">{l}</span>
                    ))}
                  </div>
                )}

                {/* Motivation */}
                {m.motivation && (
                  <div className="bg-surface/40 rounded-xl px-3 py-2 mb-4 border border-outline-variant/5">
                    <p className="text-xs text-on-surface italic">"{m.motivation}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/trainer/member/${m.id}`} className="flex-1 bg-primary text-on-primary font-black py-3 rounded-xl text-xs uppercase tracking-widest text-center active:scale-95 transition-all">
                    View Profile
                  </Link>
                  <button onClick={() => dismissNew(m.id)} className="bg-surface-container-highest text-on-surface-variant px-4 py-3 rounded-xl active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── At Risk ── */}
      {atRisk.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-6 bg-error rounded-full" />
            <h2 className="font-headline text-sm font-black text-on-surface uppercase tracking-widest">Needs Attention</h2>
            <span className="text-error text-[10px] font-bold">{atRisk.length}</span>
          </div>
          <div className="space-y-3">
            {atRisk.map(m => (
              <Link key={m.id} to={`/trainer/member/${m.id}`}
                className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-error/10 hover:border-error/30 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-sm truncate group-hover:text-primary transition-colors">{m.name}</h4>
                  <p className="text-[10px] text-error font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Inactive {daysSince(m.lastActive || m.onboardedAt)} days
                  </p>
                </div>
                <span className="bg-error/10 text-error text-[9px] font-black px-2 py-1 rounded uppercase">Risk</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Today's Sessions ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-sm">today</span>
          <h2 className="font-headline text-sm font-black text-on-surface uppercase tracking-widest">Today's Roster</h2>
          <span className="text-primary text-[10px] font-bold">{todaysSessions.length}</span>
        </div>
        {todaysSessions.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {todaysSessions.map(m => (
              <Link key={m.id} to={`/trainer/member/${m.id}`}
                className="flex-shrink-0 w-36 bg-surface-container rounded-2xl p-4 border border-outline-variant/5 hover:border-primary/30 transition-all text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                </div>
                <p className="text-xs font-bold text-on-surface truncate mb-0.5">{m.name}</p>
                <p className={`text-[9px] font-bold uppercase ${GOAL_COLORS[m.objective] || 'text-primary'}`}>{GOAL_LABELS[m.objective] || 'Fitness'}</p>
                <p className="text-[9px] text-on-surface-variant mt-1">{m.sessionLength || 60} min</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl p-6 text-center border border-dashed border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2">event_available</span>
            <p className="text-sm text-on-surface-variant">No sessions scheduled today</p>
          </div>
        )}
      </section>

      {/* ── Full Roster Quick View ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">groups</span>
            <h2 className="font-headline text-sm font-black text-on-surface uppercase tracking-widest">All Members</h2>
          </div>
          <Link to="/trainer/members" className="text-primary text-xs font-bold uppercase tracking-wide">See All →</Link>
        </div>
        <div className="space-y-2">
          {members.slice(0, 5).map(m => {
            const status = memberStatus(m)
            const statusStyle = status === 'at-risk' ? 'text-error bg-error/10' : status === 'watch' ? 'text-amber-400 bg-amber-400/10' : status === 'new' ? 'text-cyan-400 bg-cyan-400/10' : 'text-primary bg-primary/10'
            return (
              <Link key={m.id} to={`/trainer/member/${m.id}`}
                className="flex items-center gap-3 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all">
                <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{m.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{GOAL_LABELS[m.objective] || 'Fitness'} · {m.experience}</p>
                </div>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${statusStyle}`}>{status}</span>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
