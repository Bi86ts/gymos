import { useState } from 'react'
import { Link } from 'react-router-dom'

const urgentMembers = [
  { id: '1', name: 'Sienna Williams', issue: '80% attendance decay (21 days)', risk: 'High Risk', action: 'Send Message' },
  { id: '2', name: 'Marcus Thorne', issue: '3 missed PT sessions in a row', risk: 'High Risk', action: 'Assign Recovery Plan' },
]

const mediumMembers = [
  { id: '3', name: 'Elena Rodriguez', issue: 'Low intensity detected last 3 workouts', risk: 'Medium Risk' },
  { id: '4', name: 'David Chen', issue: 'Subscription expiring in 48 hours', risk: 'Medium Risk' },
  { id: '5', name: 'Priya Sharma', issue: 'Skipped 2 sessions this week', risk: 'Medium Risk' },
]

const quickActions = [
  { icon: 'waving_hand', label: 'Missed you!' },
  { icon: 'bolt', label: 'New PR Plan' },
  { icon: 'calendar_month', label: 'Reschedule' },
  { icon: 'favorite', label: 'Great work!' },
]

export default function ActionQueue() {
  const [sentMessages, setSentMessages] = useState({})

  const handleSend = (id) => {
    setSentMessages(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="space-y-10 pb-8">
      {/* Performance Metrics */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-error shadow-lg">
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Active Interventions</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-on-surface">12</span>
              <span className="text-error text-xs font-bold">+3 since 8AM</span>
            </div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-primary shadow-lg">
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">Re-engagements</p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-on-surface">08</span>
              <span className="text-primary text-xs font-bold">85% Goal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Responses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-sm font-bold text-primary uppercase tracking-wider">Quick Responses</h3>
          <span className="text-xs text-on-surface-variant">Edit Templates</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {quickActions.map((a) => (
            <button key={a.label} className="flex-shrink-0 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors text-xs font-medium text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* Urgent Interventions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1.5 w-8 bg-error rounded-full"></div>
          <h2 className="font-headline text-xl font-bold text-on-surface italic">URGENT INTERVENTIONS</h2>
        </div>
        <div className="space-y-4">
          {urgentMembers.map((member) => (
            <div key={member.id} className="bg-surface-container p-4 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-all">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-error/10 text-error text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">{member.risk}</span>
              </div>
              <div className="flex gap-4 items-start mb-4">
                <div className="h-12 w-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">person</span>
                </div>
                <div>
                  <Link to={`/trainer/member/${member.id}`} className="font-headline text-lg font-bold text-on-surface hover:text-primary transition-colors">{member.name}</Link>
                  <p className="font-body text-xs text-error font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {member.issue}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSend(member.id)}
                  className={`flex-1 font-bold py-3 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-all ${
                    sentMessages[member.id]
                      ? 'bg-surface-container-highest text-primary'
                      : 'kinetic-gradient text-on-primary-fixed'
                  }`}
                >
                  {sentMessages[member.id] ? '✓ Sent' : member.action}
                </button>
                <button className="bg-surface-container-highest text-on-surface p-3 rounded-xl active:scale-95 transition-all">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Medium Risk - Upcoming Outreach */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1.5 w-8 bg-secondary rounded-full"></div>
          <h2 className="font-headline text-xl font-bold text-on-surface italic">UPCOMING OUTREACH</h2>
        </div>
        <div className="space-y-4 opacity-80">
          {mediumMembers.map((member) => (
            <div key={member.id} className="bg-surface-container-low p-4 rounded-xl relative border border-outline-variant/10 hover:border-secondary/30 transition-all group">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-secondary/10 text-secondary text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">{member.risk}</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                </div>
                <div className="flex-1">
                  <Link to={`/trainer/member/${member.id}`} className="font-headline text-md font-bold text-on-surface hover:text-primary transition-colors">{member.name}</Link>
                  <p className="font-body text-[10px] text-on-surface-variant">{member.issue}</p>
                </div>
                <button onClick={() => handleSend(member.id)} className="text-secondary p-2 rounded-full hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined">{sentMessages[member.id] ? 'check_circle' : 'send'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Low Risk */}
      <section className="opacity-60">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1.5 w-8 bg-on-surface-variant/30 rounded-full"></div>
          <h2 className="font-headline text-xl font-bold text-on-surface-variant italic uppercase">Maintenance Queue</h2>
        </div>
        <div className="bg-surface-container-lowest border border-dashed border-outline-variant p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline-variant text-4xl mb-3">check_circle</span>
          <p className="font-body text-sm text-on-surface-variant">All Low-Risk members are currently hitting their performance targets. No intervention required.</p>
        </div>
      </section>
    </div>
  )
}
