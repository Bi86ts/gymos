import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { getMemberById, getNotes, addNote, GOAL_LABELS, GOAL_COLORS, EQUIP_LABELS, daysSince, memberStatus, syncCurrentMember } from '../../services/trainerService'

const DIET_LABELS = { no_pref: 'No Preference', vegetarian: 'Vegetarian', vegan: 'Vegan', keto: 'Keto', high_protein: 'High Protein', flexible: 'Flexible' }

export default function MemberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [noteText, setNoteText] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [notes, setNotes] = useState([])
  const [member, setMember] = useState(null)

  useEffect(() => {
    syncCurrentMember()
    const m = getMemberById(id)
    setMember(m)
    setNotes(getNotes(id))
  }, [id])

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    addNote(id, noteText.trim())
    setNotes(getNotes(id))
    setNoteText('')
    setShowNoteInput(false)
  }

  const status = member ? memberStatus(member) : 'active'
  const inactive = member ? daysSince(member.lastActive || member.onboardedAt) : 0
  const bmi = member?.weight && member?.height ? (member.weight / ((member.height/100)**2)).toFixed(1) : null
  const weightDelta = member?.weight && member?.targetWeight ? member.targetWeight - member.weight : null

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">person_off</span>
        <p className="text-on-surface-variant">Member not found</p>
        <Link to="/trainer/members" className="text-primary font-bold text-sm">← Back to Members</Link>
      </div>
    )
  }

  const statusBg = status === 'at-risk' ? 'bg-error/10 text-error border-error/20' : status === 'watch' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : status === 'new' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' : 'bg-primary/10 text-primary border-primary/20'

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-500">
      {/* Back */}
      <Link to="/trainer/members" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">
        <span className="material-symbols-outlined text-sm">arrow_back</span>Back
      </Link>

      {/* ── Profile Header ── */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center shrink-0 border border-outline-variant/10">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-headline text-2xl font-black truncate">{member.name}</h2>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${statusBg}`}>{status}</span>
            </div>
            <p className="text-on-surface-variant text-sm">
              {member.gender && <span className="capitalize">{member.gender} · </span>}
              Age {member.age} · {member.experience}
            </p>
            {member.motivation && (
              <p className="text-on-surface italic text-sm mt-2">"{member.motivation}"</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${GOAL_COLORS[member.objective] || 'text-primary'} bg-current/10`}
                style={{backgroundColor: undefined}}>
                <span className={GOAL_COLORS[member.objective] || 'text-primary'}>{GOAL_LABELS[member.objective] || 'Fitness'}</span>
              </span>
              {member.equipment && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant">{EQUIP_LABELS[member.equipment] || member.equipment}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Biometrics Grid ── */}
      <section className="grid grid-cols-4 gap-2">
        {[
          { val: member.weight, unit: 'kg', label: 'Weight', icon: 'monitor_weight' },
          { val: member.height, unit: 'cm', label: 'Height', icon: 'height' },
          { val: bmi, unit: 'BMI', label: 'BMI', icon: 'speed' },
          { val: member.targetWeight, unit: 'kg', label: 'Target', icon: 'flag' },
        ].map(m => (
          <div key={m.label} className="bg-surface-container rounded-2xl p-3 border border-outline-variant/5 text-center shadow-md">
            <span className="material-symbols-outlined text-primary text-sm mb-0.5">{m.icon}</span>
            <p className="text-lg font-headline font-black text-on-surface">{m.val || '—'}</p>
            <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">{m.unit}</p>
          </div>
        ))}
      </section>

      {/* Weight delta */}
      {weightDelta !== null && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${weightDelta < 0 ? 'bg-error/5 border border-error/15' : weightDelta > 0 ? 'bg-primary/5 border border-primary/15' : 'bg-surface-container-high border border-outline-variant/10'}`}>
          <span className={`material-symbols-outlined text-sm ${weightDelta < 0 ? 'text-error' : 'text-primary'}`}>
            {weightDelta < 0 ? 'trending_down' : weightDelta > 0 ? 'trending_up' : 'check_circle'}
          </span>
          <p className="text-xs text-on-surface font-medium">
            {weightDelta === 0 ? 'At target weight' : `${Math.abs(weightDelta)} kg to ${weightDelta < 0 ? 'lose' : 'gain'}`}
          </p>
        </div>
      )}

      {/* ── Training Schedule ── */}
      <section className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-md">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
          Training Schedule
        </h3>
        <div className="flex gap-1.5 mb-3">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
            const active = member.workoutDays?.includes(day)
            return (
              <div key={day} className={`flex-1 py-2 rounded-lg text-center text-[10px] font-bold ${active ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/50'}`}>{day}</div>
            )
          })}
        </div>
        <div className="flex gap-3 text-xs text-on-surface-variant">
          {member.workoutTime && (
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">schedule</span><span className="capitalize">{member.workoutTime}</span></span>
          )}
          {member.sessionLength && (
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">timer</span>{member.sessionLength} min</span>
          )}
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">event</span>{member.workoutDays?.length || 0} days/wk</span>
        </div>
      </section>

      {/* ── Health & Lifestyle ── */}
      <section className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-md">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
          Health & Lifestyle
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {member.diet && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Diet</p>
              <p className="text-sm font-bold text-on-surface">{DIET_LABELS[member.diet] || member.diet}</p>
            </div>
          )}
          {member.sleepHours && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Sleep</p>
              <p className="text-sm font-bold text-on-surface">{member.sleepHours} hrs/night</p>
            </div>
          )}
          {member.waterIntake && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Water</p>
              <p className="text-sm font-bold text-on-surface capitalize">{member.waterIntake === 'low' ? '< 2L' : member.waterIntake === 'medium' ? '2-3L' : '3L+'}</p>
            </div>
          )}
          {member.focusAreas?.length > 0 && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Focus</p>
              <p className="text-sm font-bold text-on-surface">{member.focusAreas.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Medical flags */}
        {(member.conditions?.length > 0 && !member.conditions.includes('None')) && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10">
            <p className="text-[9px] font-bold text-error uppercase tracking-widest mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">warning</span>Medical Conditions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {member.conditions.filter(c => c !== 'None').map(c => (
                <span key={c} className="text-[10px] font-bold px-2 py-1 bg-error/10 text-error rounded-lg border border-error/20">{c}</span>
              ))}
            </div>
          </div>
        )}
        {(member.limitations?.length > 0 && !member.limitations.includes('None — all good')) && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10">
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>Limitations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {member.limitations.filter(l => l !== 'None — all good').map(l => (
                <span key={l} className="text-[10px] font-bold px-2 py-1 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20">{l}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Activity Stats ── */}
      <section className="grid grid-cols-3 gap-2">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className="text-2xl font-headline font-black text-on-surface">{member.streak || 0}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Streak</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className="text-2xl font-headline font-black text-on-surface">{member.totalSessions || 0}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Sessions</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className={`text-2xl font-headline font-black ${inactive > 7 ? 'text-error' : 'text-on-surface'}`}>{inactive}d</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Inactive</p>
        </div>
      </section>

      {/* ── Action Buttons ── */}
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => navigate(`/trainer/messages/${id}`)}
          className="bg-primary text-on-primary font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-sm">send</span>Message
        </button>
        <button onClick={() => setShowNoteInput(!showNoteInput)}
          className="bg-surface-container-highest text-on-surface font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 border border-outline-variant/10">
          <span className="material-symbols-outlined text-sm">edit_note</span>Add Note
        </button>
      </div>

      {/* Note Input */}
      {showNoteInput && (
        <div className="bg-surface-container-low p-4 rounded-2xl space-y-3 border border-outline-variant/10 animate-in slide-in-from-top-2 duration-300">
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
            placeholder="Write a note about this member..."
            className="w-full bg-surface-container border border-outline-variant/10 rounded-xl p-3 text-sm text-on-surface resize-none h-24 focus:outline-none focus:border-primary/30 placeholder-on-surface-variant/50" />
          <div className="flex gap-2">
            <button onClick={handleSaveNote} disabled={!noteText.trim()}
              className="bg-primary text-on-primary font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30">Save</button>
            <button onClick={() => { setShowNoteInput(false); setNoteText('') }}
              className="text-on-surface-variant font-bold py-2 px-4 rounded-xl text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Trainer Notes ── */}
      {notes.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">note</span>
            Your Notes ({notes.length})
          </h3>
          <div className="space-y-2">
            {notes.map((n, i) => (
              <div key={i} className="bg-surface-container rounded-xl p-3 border border-outline-variant/5">
                <p className="text-sm text-on-surface">{n.text}</p>
                <p className="text-[9px] text-on-surface-variant mt-1.5">{new Date(n.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
