import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMembers, syncCurrentMember, GOAL_LABELS, GOAL_COLORS, EQUIP_LABELS, daysSince, memberStatus } from '../../services/trainerService'

// ── Intervention message generators ──
function generateReengagementMessage(member) {
  const firstName = member.name?.split(' ')[0] || 'there'
  const inactiveDays = daysSince(member.lastActive || member.onboardedAt)
  const status = memberStatus(member)

  if (status === 'at-risk') {
    const templates = [
      `Hey ${firstName}, I've noticed you haven't been in for ${inactiveDays} days. I really don't want you to lose the progress you've built. Can we find 30 minutes this week to get you back on track?`,
      `${firstName}, just checking in — it's been ${inactiveDays} days since your last session. Your goals are still within reach. Let's chat about adjusting your plan to make it work for you.`,
      `Hey ${firstName}, I miss seeing you in the gym! It's been ${inactiveDays} days. No pressure — even a light session counts. When can you come by?`,
    ]
    return templates[Math.floor(member.id.charCodeAt(member.id.length - 1) % templates.length)]
  }

  // Watch status
  const templates = [
    `Hey ${firstName}, just a friendly nudge — it's been ${inactiveDays} days since your last workout. Let's not break the momentum! Drop by when you can 💪`,
    `${firstName}, checking in! Haven't seen you in ${inactiveDays} days. Everything okay? Let me know if you need to adjust your schedule.`,
  ]
  return templates[Math.floor(member.id.charCodeAt(member.id.length - 1) % templates.length)]
}

function generateAppreciationMessage(member) {
  const firstName = member.name?.split(' ')[0] || 'there'
  const streak = member.streak || 0
  const total = member.totalSessions || 0

  // Milestone check
  if (total > 0 && total % 10 === 0) {
    return `🎉 ${firstName}, you just hit ${total} total sessions! That's incredible dedication. You should be really proud of yourself. Keep crushing it!`
  }
  if (streak >= 10) {
    return `🔥 ${firstName}, a ${streak}-day streak?! You're on FIRE. This is exactly the consistency that transforms bodies. Proud of you — let's keep this engine running!`
  }
  if (streak >= 5) {
    return `Hey ${firstName}, ${streak} sessions in a row — you're building an unstoppable habit! Your dedication is inspiring. Keep showing up 💪`
  }
  return `Great work ${firstName}! Your consistency has been amazing recently. I can already see the progress paying off. Keep up this energy!`
}

function getInterventionType(member) {
  const status = memberStatus(member)
  const inactiveDays = daysSince(member.lastActive || member.onboardedAt)
  const streak = member.streak || 0
  const total = member.totalSessions || 0

  if (status === 'at-risk') return { type: 'reengage', priority: 1, reason: `Inactive ${inactiveDays} days`, icon: 'emergency', color: 'error' }
  if (status === 'watch') return { type: 'reengage', priority: 2, reason: `Absent ${inactiveDays} days`, icon: 'schedule', color: 'amber-400' }
  if (total > 0 && total % 10 === 0) return { type: 'appreciate', priority: 3, reason: `${total} session milestone!`, icon: 'emoji_events', color: 'primary' }
  if (streak >= 5) return { type: 'appreciate', priority: 3, reason: `${streak}-day streak 🔥`, icon: 'local_fire_department', color: 'primary' }
  return null
}

export default function ActionQueue() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [dismissedInterventions, setDismissedInterventions] = useState(() => {
    try {
      const today = new Date().toDateString()
      const saved = JSON.parse(localStorage.getItem('gymos_dismissed_interventions') || '{}')
      // Reset dismissals daily
      if (saved._date !== today) return { _date: today }
      return saved
    } catch { return { _date: new Date().toDateString() } }
  })

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

  // ── Urgent Interventions ──
  const interventions = useMemo(() => {
    return members
      .map(m => {
        const intervention = getInterventionType(m)
        if (!intervention) return null
        if (dismissedInterventions[m.id]) return null
        const message = intervention.type === 'reengage'
          ? generateReengagementMessage(m)
          : generateAppreciationMessage(m)
        return { member: m, ...intervention, message }
      })
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority)
  }, [members, dismissedInterventions])

  const dismissNew = (id) => {
    const updated = members.map(m => m.id === id ? { ...m, isNew: false } : m)
    setMembers(updated)
    localStorage.setItem('gymos_trainer_members', JSON.stringify(updated))
  }

  const dismissIntervention = (memberId) => {
    const updated = { ...dismissedInterventions, [memberId]: true }
    setDismissedInterventions(updated)
    localStorage.setItem('gymos_dismissed_interventions', JSON.stringify(updated))
  }

  const handleSendInterventionMessage = (memberId, message) => {
    navigate(`/trainer/messages/${memberId}?prefill=${encodeURIComponent(message)}`)
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

      {/* ── Urgent Interventions ── */}
      {interventions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <span className="material-symbols-outlined text-amber-400 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full" />
            </div>
            <h2 className="font-headline text-lg font-black text-on-surface uppercase tracking-tight">Urgent Today</h2>
            <span className="bg-amber-400/15 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/20">{interventions.length}</span>
          </div>
          <p className="text-on-surface-variant text-xs mb-4 -mt-2">People you should reach out to today</p>

          <div className="space-y-4">
            {interventions.map(({ member: m, type, reason, icon, color, message }) => (
              <div key={m.id}
                className={`bg-surface-container/60 rounded-xl border ${type === 'reengage' ? 'border-error/20 bg-gradient-to-r from-error/5' : 'border-primary/20 bg-gradient-to-r from-primary/5'} overflow-hidden shadow-sm`}>

                <div className="p-3.5 flex flex-col gap-3">
                  {/* Top Bar: Icon, Info, and Small Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg ${type === 'reengage' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'} border border-current/10 flex items-center justify-center shrink-0`}>
                        <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link to={`/trainer/member/${m.id}`} className="font-headline font-black text-sm text-on-surface hover:text-primary transition-colors truncate">
                            {m.name}
                          </Link>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${type === 'reengage' ? 'bg-error text-white shadow-sm shadow-error/20' : 'bg-primary text-on-primary shadow-sm shadow-primary/20'}`}>
                            {type === 'reengage' ? 'Re-engage' : 'Appreciation'}
                          </span>
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-tight mt-0.5 truncate ${type === 'reengage' ? 'text-error/80' : 'text-primary/80'}`}>
                          {reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => dismissIntervention(m.id)}
                        className="w-7 h-7 rounded-lg bg-surface-container-highest text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high transition-all flex items-center justify-center active:scale-90">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>

                  {/* Message Preview: Sleeker and More Integrated */}
                  <div className="bg-surface-container-highest/40 rounded-lg p-2.5 border border-outline-variant/5">
                    <p className="text-[11px] text-on-surface-variant leading-relaxed italic line-clamp-2">
                       "{message}"
                    </p>
                  </div>

                  {/* Footer: Context Pills and Main Action */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-surface-container-high px-1.5 py-0.5 rounded-md border border-outline-variant/10 shrink-0">
                        <span className="text-[9px] font-black text-on-surface-variant/70 uppercase">{GOAL_LABELS[m.objective]?.substring(0,4) || 'FIT'}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[10px] text-on-surface-variant/40">history</span>
                        <span className="text-[9px] font-bold text-on-surface-variant/60">{m.totalSessions || 0} sess</span>
                      </div>
                      {(m.streak || 0) > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-xs">🔥</span>
                          <span className="text-[9px] font-bold text-on-surface-variant/60">{m.streak}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSendInterventionMessage(m.id, message)}
                      className={`flex items-center gap-2 ${type === 'reengage' ? 'bg-error text-white' : 'bg-primary text-on-primary'} font-black px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md ${type === 'reengage' ? 'shadow-error/10 hover:shadow-error/20' : 'shadow-primary/10 hover:shadow-primary/20'} hover:-translate-y-0.5`}>
                      <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
