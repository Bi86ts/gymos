import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'

const memberData = {
  '1': { name: 'Sienna Williams', risk: 'high', consistency: 22, goal: 'Weight Loss', joined: 'Jan 15, 2025', lastVisit: '21 days ago', streak: 0, sessions: 8, missedDays: 21 },
  '2': { name: 'Marcus Thorne', risk: 'high', consistency: 35, goal: 'Build Muscle', joined: 'Nov 3, 2024', lastVisit: '14 days ago', streak: 0, sessions: 24, missedDays: 14 },
  '3': { name: 'Elena Rodriguez', risk: 'medium', consistency: 58, goal: 'General Health', joined: 'Dec 20, 2024', lastVisit: '5 days ago', streak: 2, sessions: 18, missedDays: 5 },
  '4': { name: 'David Chen', risk: 'medium', consistency: 62, goal: 'Build Muscle', joined: 'Feb 1, 2025', lastVisit: '3 days ago', streak: 3, sessions: 12, missedDays: 3 },
  '5': { name: 'Priya Sharma', risk: 'medium', consistency: 65, goal: 'Stamina', joined: 'Jan 10, 2025', lastVisit: '4 days ago', streak: 1, sessions: 15, missedDays: 4 },
}

const timeline = [
  { date: 'Today', type: 'system', text: 'Risk score elevated to HIGH. 21 days without check-in.' },
  { date: '3 days ago', type: 'trainer', text: 'Sent check-in message: "Hey, we miss you at the gym!"' },
  { date: '7 days ago', type: 'system', text: 'Risk score moved to MEDIUM. Attendance dropping.' },
  { date: '14 days ago', type: 'member', text: 'Skipped session — Reason: Too Busy' },
  { date: '15 days ago', type: 'member', text: 'Checked in. Completed Pull Day workout.' },
  { date: '21 days ago', type: 'trainer', text: 'Assigned new workout plan: Weight Loss Focus.' },
]

export default function MemberDetail() {
  const { id } = useParams()
  const [noteText, setNoteText] = useState('')
  const [showNote, setShowNote] = useState(false)
  const member = memberData[id] || { name: 'Unknown Member', risk: 'low', consistency: 0, goal: '-', joined: '-', lastVisit: '-', streak: 0, sessions: 0, missedDays: 0 }

  const riskColors = { high: 'text-error bg-error/10 border-error/20', medium: 'text-secondary bg-secondary/10 border-secondary/20', low: 'text-primary bg-primary/10 border-primary/20' }

  return (
    <div className="space-y-6 pb-8">
      {/* Back */}
      <Link to="/trainer/members" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Members
      </Link>

      {/* Profile Header */}
      <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-headline text-2xl font-bold">{member.name}</h2>
              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${riskColors[member.risk]}`}>{member.risk} Risk</span>
            </div>
            <p className="text-on-surface-variant text-sm">{member.goal} · Joined {member.joined}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-surface-container p-3 rounded-xl text-center">
          <p className="font-headline font-bold text-xl">{member.consistency}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Score</p>
        </div>
        <div className="bg-surface-container p-3 rounded-xl text-center">
          <p className="font-headline font-bold text-xl">{member.streak}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Streak</p>
        </div>
        <div className="bg-surface-container p-3 rounded-xl text-center">
          <p className="font-headline font-bold text-xl">{member.sessions}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Sessions</p>
        </div>
        <div className="bg-surface-container p-3 rounded-xl text-center">
          <p className="font-headline font-bold text-xl text-error">{member.missedDays}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Missed</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="kinetic-gradient text-on-primary-fixed font-bold py-3 rounded-xl text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">send</span>
          Send Message
        </button>
        <button className="bg-surface-container-highest text-on-surface font-bold py-3 rounded-xl text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Comeback Plan
        </button>
      </div>
      <button onClick={() => setShowNote(!showNote)} className="w-full bg-surface-container text-on-surface-variant font-bold py-3 rounded-xl text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 border border-outline-variant/10">
        <span className="material-symbols-outlined text-sm">edit_note</span>
        Log Note
      </button>

      {showNote && (
        <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this member..."
            className="w-full bg-surface-container border border-outline-variant/10 rounded-lg p-3 text-sm text-on-surface resize-none h-24 focus:outline-none focus:border-primary/30"
          />
          <button className="bg-primary text-on-primary-fixed font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-widest active:scale-95 transition-all">Save Note</button>
        </div>
      )}

      {/* Engagement Timeline */}
      <div>
        <h3 className="font-headline text-lg font-bold mb-4">Engagement History</h3>
        <div className="space-y-0">
          {timeline.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.type === 'system' ? 'bg-error/10' : event.type === 'trainer' ? 'bg-primary/10' : 'bg-surface-container-highest'
                }`}>
                  <span className={`material-symbols-outlined text-xs ${
                    event.type === 'system' ? 'text-error' : event.type === 'trainer' ? 'text-primary' : 'text-on-surface-variant'
                  }`}>
                    {event.type === 'system' ? 'warning' : event.type === 'trainer' ? 'send' : 'person'}
                  </span>
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 h-10 bg-surface-container-highest"></div>}
              </div>
              <div className="pb-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{event.date}</p>
                <p className="text-sm text-on-surface">{event.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
