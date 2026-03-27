import { useState } from 'react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const todayIdx = 0

const schedule = {
  Mon: [
    { time: '6:00 AM', member: 'Alex Turner', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '8:00 AM', member: 'Jordan Blake', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '10:00 AM', member: 'Group Class', type: 'HIIT Blast', duration: '45 min', status: 'confirmed' },
    { time: '4:00 PM', member: 'Riley Kim', type: 'PT Session', duration: '60 min', status: 'pending' },
    { time: '6:00 PM', member: 'Sam Patel', type: 'Assessment', duration: '30 min', status: 'confirmed' },
  ],
  Tue: [
    { time: '7:00 AM', member: 'Morgan Lee', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '9:00 AM', member: 'Group Class', type: 'Strength Foundations', duration: '50 min', status: 'confirmed' },
    { time: '5:00 PM', member: 'Priya Sharma', type: 'Comeback Session', duration: '45 min', status: 'pending' },
  ],
  Wed: [
    { time: '6:00 AM', member: 'Alex Turner', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '10:00 AM', member: 'Group Class', type: 'Mobility Flow', duration: '40 min', status: 'confirmed' },
    { time: '3:00 PM', member: 'David Chen', type: 'Plan Review', duration: '30 min', status: 'pending' },
  ],
  Thu: [
    { time: '7:00 AM', member: 'Jordan Blake', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '5:00 PM', member: 'Riley Kim', type: 'PT Session', duration: '60 min', status: 'confirmed' },
  ],
  Fri: [
    { time: '6:00 AM', member: 'Alex Turner', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '8:00 AM', member: 'Morgan Lee', type: 'PT Session', duration: '60 min', status: 'confirmed' },
    { time: '10:00 AM', member: 'Group Class', type: 'HIIT Blast', duration: '45 min', status: 'confirmed' },
  ],
  Sat: [
    { time: '9:00 AM', member: 'Group Class', type: 'Weekend Warrior', duration: '60 min', status: 'confirmed' },
  ],
}

export default function TrainerSchedule() {
  const [selectedDay, setSelectedDay] = useState(days[todayIdx])
  const sessions = schedule[selectedDay] || []

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-headline text-2xl font-bold mb-1">Schedule</h2>
        <p className="text-on-surface-variant text-sm">Week of March 24 – 29</p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {days.map((day, i) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[60px] py-3 rounded-xl font-headline font-bold text-sm flex flex-col items-center gap-1 transition-all ${
              selectedDay === day
                ? 'bg-primary text-on-primary-fixed shadow-lg shadow-primary/20'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <span>{day}</span>
            {i === todayIdx && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low p-3 rounded-xl text-center border-l-2 border-primary">
          <p className="font-headline font-bold text-xl">{sessions.length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Sessions</p>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl text-center border-l-2 border-secondary">
          <p className="font-headline font-bold text-xl">{sessions.filter(s => s.status === 'confirmed').length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Confirmed</p>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl text-center border-l-2 border-error">
          <p className="font-headline font-bold text-xl">{sessions.filter(s => s.status === 'pending').length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Pending</p>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {sessions.map((session, i) => (
          <div key={i} className="bg-surface-container p-4 rounded-xl flex items-center gap-4 hover:bg-surface-container-high transition-all group">
            <div className="text-center min-w-[60px]">
              <p className="font-headline font-bold text-sm">{session.time}</p>
              <p className="text-[8px] text-on-surface-variant">{session.duration}</p>
            </div>
            <div className="w-px h-10 bg-outline-variant/20"></div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm">{session.member}</p>
              <p className="text-[10px] text-on-surface-variant">{session.type}</p>
            </div>
            <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
              session.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
            }`}>{session.status}</span>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">event_available</span>
          <p className="text-sm">No sessions scheduled</p>
        </div>
      )}
    </div>
  )
}
