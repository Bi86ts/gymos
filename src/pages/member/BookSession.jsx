import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const TRAINERS = [
  {
    id: 'aakash', name: 'Trainer Aakash', initials: 'AK',
    specialty: 'Strength & Conditioning', rating: 4.9, sessions: 340,
    color: '#3A82F6', gradientFrom: '#3A82F6', gradientTo: '#1A5CCC',
    bio: 'NSCA certified. 6+ years in powerlifting coaching. Specializes in compound movements.',
    availability: {
      Mon: ['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM', '7:00 PM'],
      Tue: ['6:00 AM', '7:00 AM', '9:00 AM', '10:00 AM', '5:00 PM', '6:00 PM'],
      Wed: ['7:00 AM', '8:00 AM', '9:00 AM', '6:00 PM', '7:00 PM'],
      Thu: ['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM', '7:00 PM'],
      Fri: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '5:00 PM'],
      Sat: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
      Sun: [],
    }
  },
  {
    id: 'sarah', name: 'Coach Sarah', initials: 'SK',
    specialty: 'Functional Training & HIIT', rating: 4.8, sessions: 280,
    color: '#FF2D55', gradientFrom: '#FF2D55', gradientTo: '#CC1A3E',
    bio: 'ACE certified personal trainer. Expert in fat loss and metabolic conditioning.',
    availability: {
      Mon: ['7:00 AM', '8:00 AM', '9:00 AM', '4:00 PM', '5:00 PM', '6:00 PM'],
      Tue: ['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM'],
      Wed: ['8:00 AM', '9:00 AM', '10:00 AM', '5:00 PM', '6:00 PM', '7:00 PM'],
      Thu: ['7:00 AM', '8:00 AM', '4:00 PM', '5:00 PM', '6:00 PM'],
      Fri: ['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM'],
      Sat: ['9:00 AM', '10:00 AM', '11:00 AM'],
      Sun: ['10:00 AM', '11:00 AM'],
    }
  },
  {
    id: 'ravi', name: 'Coach Ravi', initials: 'RJ',
    specialty: 'Yoga & Mobility', rating: 4.7, sessions: 190,
    color: '#00FFAA', gradientFrom: '#00FFAA', gradientTo: '#00CC88',
    bio: 'RYT 500 certified yoga instructor. Specializes in flexibility, recovery and injury prevention.',
    availability: {
      Mon: ['6:00 AM', '7:00 AM', '6:00 PM', '7:00 PM'],
      Tue: ['6:00 AM', '7:00 AM', '8:00 AM', '6:00 PM', '7:00 PM'],
      Wed: ['7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM'],
      Thu: ['6:00 AM', '7:00 AM', '6:00 PM', '7:00 PM'],
      Fri: ['7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM'],
      Sat: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM'],
      Sun: ['8:00 AM', '9:00 AM', '10:00 AM'],
    }
  },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dayOfWeek + i)
    dates.push(d)
  }
  return dates
}

export default function BookSession() {
  const navigate = useNavigate()
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingState, setBookingState] = useState('idle') // idle | confirming | booked
  const [bookedSessions, setBookedSessions] = useState([])

  const weekDates = useMemo(() => getWeekDates(), [])
  const todayIdx = useMemo(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  }, [])

  // Load saved bookings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_bookings')
      if (saved) setBookedSessions(JSON.parse(saved))
    } catch (e) {}
  }, [])

  // Set default selected day to today
  useEffect(() => {
    setSelectedDay(DAYS[todayIdx])
  }, [todayIdx])

  const trainer = TRAINERS.find(t => t.id === selectedTrainer)
  const daySlots = trainer && selectedDay ? (trainer.availability[selectedDay] || []) : []

  // Check if slot is already booked
  const isSlotBooked = (trainerId, day, slot) => {
    return bookedSessions.some(b => b.trainerId === trainerId && b.day === day && b.slot === slot)
  }

  // Check if slot is in the past
  const isSlotPast = (day, slot) => {
    const dayIdx = DAYS.indexOf(day)
    if (dayIdx < todayIdx) return true
    if (dayIdx > todayIdx) return false
    // Same day — check time
    const now = new Date()
    const [time, period] = slot.split(' ')
    let [hours] = time.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return now.getHours() >= hours
  }

  const handleBook = () => {
    if (!trainer || !selectedDay || !selectedSlot) return
    setBookingState('confirming')
    setTimeout(() => {
      const booking = {
        id: Date.now(),
        trainerId: trainer.id,
        trainerName: trainer.name,
        day: selectedDay,
        slot: selectedSlot,
        date: weekDates[DAYS.indexOf(selectedDay)].toISOString(),
        bookedAt: new Date().toISOString(),
      }
      const updated = [...bookedSessions, booking]
      setBookedSessions(updated)
      localStorage.setItem('gymos_bookings', JSON.stringify(updated))
      setBookingState('booked')
    }, 1500)
  }

  const resetBooking = () => {
    setSelectedSlot(null)
    setBookingState('idle')
  }

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-[#00FFAA] transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-black font-headline text-white uppercase tracking-tight">Book Session</h1>
          <p className="text-xs text-on-surface-variant">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ── Step 1: Pick Trainer ── */}
      <section>
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
          <span className="material-symbols-outlined text-[#C8FF00] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>person_search</span>
          Choose Your Trainer
        </h3>
        <div className="space-y-3">
          {TRAINERS.map(t => {
            const isSelected = selectedTrainer === t.id
            const todaySlots = (t.availability[DAYS[todayIdx]] || []).length
            return (
              <button key={t.id} onClick={() => { setSelectedTrainer(t.id); setSelectedSlot(null); setBookingState('idle') }}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-white/20 bg-[#111316] shadow-xl'
                    : 'border-outline-variant/5 bg-[#111316] hover:border-white/10'
                }`}>
                {/* Glow */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-15 -mr-16 -mt-16"
                    style={{ backgroundColor: t.color }} />
                )}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white font-headline font-black text-lg"
                    style={{ background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})`, boxShadow: isSelected ? `0 8px 24px ${t.color}30` : 'none' }}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white leading-none mb-1">{t.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium mb-1.5">{t.specialty}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#FFE600] text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        <span className="text-[10px] font-bold text-white">{t.rating}</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant">{t.sessions} sessions</span>
                      <span className="text-[10px] font-bold" style={{ color: t.color }}>{todaySlots} slots today</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'border-[#00FFAA] bg-[#00FFAA]/15' : 'border-outline-variant/20'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-[#00FFAA] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check</span>}
                  </div>
                </div>

                {/* Expanded Bio */}
                {isSelected && (
                  <div className="relative z-10 mt-3 pt-3 border-t border-outline-variant/10">
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.bio}</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Step 2: Pick Day & Slot ── */}
      {selectedTrainer && (
        <section className="animate-in slide-in-from-bottom-4 duration-400">
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-[#3A82F6] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
            Pick Day & Time
          </h3>

          {/* Day Selector */}
          <div className="flex gap-1.5 mb-4">
            {DAYS.map((day, i) => {
              const date = weekDates[i]
              const slotsCount = (trainer?.availability[day] || []).length
              const isPast = i < todayIdx
              const isToday = i === todayIdx
              const isActive = selectedDay === day
              return (
                <button key={day} onClick={() => { if (!isPast) { setSelectedDay(day); setSelectedSlot(null); setBookingState('idle') } }}
                  disabled={isPast}
                  className={`flex-1 py-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
                    isPast ? 'opacity-30 cursor-not-allowed' :
                    isActive ? 'bg-[#3A82F6] text-white shadow-lg shadow-[#3A82F6]/25' :
                    'bg-[#111316] text-on-surface-variant hover:bg-[#16191E] border border-outline-variant/5'
                  }`}>
                  <span className="text-[9px] font-bold uppercase">{day}</span>
                  <span className={`text-sm font-headline font-black ${isActive ? 'text-white' : 'text-on-surface'}`}>
                    {date.getDate()}
                  </span>
                  {!isPast && (
                    <span className={`text-[8px] font-bold ${isActive ? 'text-white/70' : slotsCount > 0 ? 'text-[#00FFAA]' : 'text-on-surface-variant/40'}`}>
                      {slotsCount > 0 ? `${slotsCount}` : '—'}
                    </span>
                  )}
                  {isToday && <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-[#3A82F6]'}`} />}
                </button>
              )
            })}
          </div>

          {/* Time Slots Grid */}
          {selectedDay && (
            <div className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md">
              {daySlots.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Available Slots — {selectedDay}
                    </p>
                    <span className="text-[10px] font-bold text-[#00FFAA]">{daySlots.length} open</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {daySlots.map(slot => {
                      const booked = isSlotBooked(trainer.id, selectedDay, slot)
                      const past = isSlotPast(selectedDay, slot)
                      const isActive = selectedSlot === slot && !booked && !past
                      const isMorning = slot.includes('AM')
                      return (
                        <button key={slot}
                          onClick={() => { if (!booked && !past) { setSelectedSlot(slot); setBookingState('idle') } }}
                          disabled={booked || past}
                          className={`relative py-3 px-2 rounded-xl text-center transition-all ${
                            booked ? 'bg-surface-container-highest/30 border border-outline-variant/5 cursor-not-allowed' :
                            past ? 'bg-surface-container-highest/20 border border-outline-variant/5 cursor-not-allowed opacity-40' :
                            isActive ? 'border-2 shadow-lg' :
                            'bg-[#0D0F12] border border-outline-variant/10 hover:border-white/15'
                          }`}
                          style={isActive ? { borderColor: trainer.color, backgroundColor: trainer.color + '10', boxShadow: `0 4px 20px ${trainer.color}20` } : {}}>
                          {booked && (
                            <div className="absolute top-1.5 right-1.5">
                              <span className="material-symbols-outlined text-[#00FFAA] text-xs" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                            </div>
                          )}
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <span className={`material-symbols-outlined text-xs ${
                              booked ? 'text-[#00FFAA]' : isActive ? '' : 'text-on-surface-variant/50'
                            }`} style={isActive ? { color: trainer.color, fontVariationSettings: "'FILL' 1" } : {fontVariationSettings: "'FILL' 1"}}>
                              {isMorning ? 'light_mode' : 'dark_mode'}
                            </span>
                          </div>
                          <span className={`text-xs font-bold ${
                            booked ? 'text-on-surface-variant/50 line-through' :
                            isActive ? 'text-white' : 'text-on-surface'
                          }`}>{slot}</span>
                          {booked && <p className="text-[8px] text-[#00FFAA] font-bold mt-0.5">Booked</p>}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-2">event_busy</span>
                  <p className="text-sm text-on-surface-variant font-medium">No slots available</p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">{trainer.name} doesn't have sessions on {selectedDay}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Booking Summary & CTA ── */}
      {selectedSlot && trainer && bookingState !== 'booked' && (
        <div className="bg-gradient-to-br from-[#111316] to-[#0D0F12] rounded-2xl p-5 border border-outline-variant/10 shadow-xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10 -mr-12 -mt-12"
            style={{ backgroundColor: trainer.color }} />
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#FFE600] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>summarize</span>
              Booking Summary
            </h3>
            <div className="space-y-2.5 mb-5">
              {[
                { icon: 'person', label: 'Trainer', value: trainer.name, color: trainer.color },
                { icon: 'calendar_today', label: 'Day', value: `${selectedDay}, ${weekDates[DAYS.indexOf(selectedDay)].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: '#3A82F6' },
                { icon: 'schedule', label: 'Time', value: selectedSlot, color: '#FF9500' },
                { icon: 'timer', label: 'Duration', value: '60 minutes', color: '#00FFAA' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" style={{ color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{r.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleBook} disabled={bookingState === 'confirming'}
              className="w-full py-4 rounded-2xl font-headline font-black text-base uppercase tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${trainer.gradientFrom}, ${trainer.gradientTo})`,
                boxShadow: `0 8px 30px ${trainer.color}30`,
                color: trainer.color === '#00FFAA' ? '#06060B' : '#fff',
              }}>
              {bookingState === 'confirming' ? (
                <><span className="material-symbols-outlined animate-spin text-lg">sync</span> Booking...</>
              ) : (
                <><span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span> Confirm Booking</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Success State ── */}
      {bookingState === 'booked' && trainer && (
        <div className="bg-[#111316] rounded-3xl p-8 border border-[#00FFAA]/20 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="absolute inset-0 bg-[#00FFAA]/3" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00FFAA]/10 rounded-full blur-[100px] -mt-32" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#00FFAA]/15 rounded-full flex items-center justify-center mx-auto mb-5 relative">
              <div className="absolute inset-0 bg-[#00FFAA]/10 rounded-full animate-ping" />
              <span className="material-symbols-outlined text-4xl text-[#00FFAA]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight mb-2">Session Booked!</h2>
            <p className="text-on-surface-variant text-sm mb-1">
              {trainer.name} · {selectedDay}, {weekDates[DAYS.indexOf(selectedDay)].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-[#00FFAA] font-bold text-lg mb-6">{selectedSlot}</p>

            <div className="flex gap-3">
              <button onClick={resetBooking}
                className="flex-1 py-3.5 rounded-xl bg-surface-container border border-outline-variant/10 text-on-surface font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                Book Another
              </button>
              <button onClick={() => navigate('/member')}
                className="flex-1 py-3.5 rounded-xl bg-[#00FFAA]/15 border border-[#00FFAA]/25 text-[#00FFAA] font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">home</span>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upcoming Bookings ── */}
      {bookedSessions.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-[#FF9500] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>event_note</span>
            Your Upcoming Sessions
          </h3>
          <div className="space-y-2">
            {bookedSessions.slice().reverse().slice(0, 5).map(b => {
              const t = TRAINERS.find(tr => tr.id === b.trainerId)
              return (
                <div key={b.id} className="bg-[#111316] rounded-xl p-4 border border-outline-variant/5 shadow-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-xs"
                    style={{ background: t ? `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` : '#333' }}>
                    {t?.initials || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{b.trainerName}</p>
                    <p className="text-[10px] text-on-surface-variant">{b.day} · {b.slot}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#00FFAA]/10 px-2 py-1 rounded-lg shrink-0">
                    <span className="material-symbols-outlined text-[#00FFAA] text-xs" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                    <span className="text-[9px] font-bold text-[#00FFAA]">Confirmed</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
