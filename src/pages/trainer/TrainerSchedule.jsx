import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getMembers, syncCurrentMember, GOAL_LABELS, GOAL_COLORS } from '../../services/trainerService'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIME_SLOTS = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM']

export default function TrainerSchedule() {
  const [members, setMembers] = useState([])
  const todayIdx = useMemo(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1 // Mon=0 ... Sun=6
  }, [])
  const [selectedDay, setSelectedDay] = useState(DAY_NAMES[todayIdx])

  useEffect(() => {
    setMembers(syncCurrentMember())
  }, [])

  // Members training on selected day
  const dayMembers = useMemo(() => {
    return members.filter(m => m.workoutDays?.includes(selectedDay))
  }, [members, selectedDay])

  // Group by time preference
  const grouped = useMemo(() => {
    const morning = dayMembers.filter(m => m.workoutTime === 'morning' || !m.workoutTime)
    const afternoon = dayMembers.filter(m => m.workoutTime === 'afternoon')
    const evening = dayMembers.filter(m => m.workoutTime === 'evening')
    return { morning, afternoon, evening }
  }, [dayMembers])

  // Week summary
  const weekSummary = useMemo(() => {
    return DAY_NAMES.map(day => ({
      day,
      count: members.filter(m => m.workoutDays?.includes(day)).length
    }))
  }, [members])

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tight">Schedule</h2>
        <p className="text-on-surface-variant text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DAY_NAMES.map((day, i) => {
          const count = weekSummary[i]?.count || 0
          return (
            <button key={day} onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[50px] py-3 rounded-xl font-headline font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                selectedDay === day
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'
              }`}>
              <span>{day}</span>
              <span className={`text-[9px] ${selectedDay === day ? 'opacity-80' : 'opacity-50'}`}>{count}</span>
              {i === todayIdx && <div className={`w-1 h-1 rounded-full ${selectedDay === day ? 'bg-on-primary' : 'bg-primary'}`} />}
            </button>
          )
        })}
      </div>

      {/* Day Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-xl text-on-surface">{dayMembers.length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Members</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-xl text-primary">{grouped.morning.length + grouped.afternoon.length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Day Sessions</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-xl text-on-surface">{grouped.evening.length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase">Evening</p>
        </div>
      </div>

      {/* Grouped Session List */}
      {[
        { key: 'morning', label: 'Morning', icon: 'wb_sunny', time: '6:00 – 11:00 AM', members: grouped.morning },
        { key: 'afternoon', label: 'Afternoon', icon: 'wb_twilight', time: '12:00 – 4:00 PM', members: grouped.afternoon },
        { key: 'evening', label: 'Evening', icon: 'dark_mode', time: '5:00 – 8:00 PM', members: grouped.evening },
      ].map(slot => (
        <section key={slot.key}>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">{slot.icon}</span>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{slot.label}</h3>
            <span className="text-[10px] text-on-surface-variant/50">{slot.time}</span>
            <span className="text-[10px] font-bold text-primary ml-auto">{slot.members.length}</span>
          </div>

          {slot.members.length > 0 ? (
            <div className="space-y-2">
              {slot.members.map(m => (
                <Link key={m.id} to={`/trainer/member/${m.id}`}
                  className="flex items-center gap-4 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all group border border-outline-variant/5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm truncate group-hover:text-primary transition-colors">{m.name}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      <span className={`font-bold ${GOAL_COLORS[m.objective] || 'text-primary'}`}>{GOAL_LABELS[m.objective] || 'Fitness'}</span>
                      {' · '}{m.sessionLength || 60} min · {m.experience}
                    </p>
                  </div>
                  {m.conditions?.some(c => c !== 'None') && (
                    <span className="material-symbols-outlined text-error text-sm" title="Has medical conditions">warning</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-4 text-center border border-dashed border-outline-variant/10">
              <p className="text-xs text-on-surface-variant/50">No {slot.label.toLowerCase()} sessions</p>
            </div>
          )}
        </section>
      ))}

      {dayMembers.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-30">event_available</span>
          <p className="text-sm font-medium">Rest day — no members scheduled</p>
          <p className="text-xs opacity-60 mt-1">No one has {selectedDay} in their workout plan</p>
        </div>
      )}
    </div>
  )
}
