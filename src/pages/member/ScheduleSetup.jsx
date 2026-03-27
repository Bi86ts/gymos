import { useState } from 'react'
import { Link } from 'react-router-dom'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const timeSlots = ['Morning (6-9 AM)', 'Mid-Morning (9-12 PM)', 'Afternoon (12-3 PM)', 'Evening (5-8 PM)', 'Night (8-10 PM)']

export default function ScheduleSetup() {
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Wed', 'Fri'])
  const [selectedTime, setSelectedTime] = useState('Evening (5-8 PM)')

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-surface">
        <Link to="/member/onboarding/fitness" className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</Link>
        <h1 className="font-headline font-bold tracking-tight text-xl uppercase text-primary">GymOS</h1>
        <div className="w-6"></div>
      </header>
      <div className="fixed top-[60px] left-0 bg-surface-container-low h-1.5 w-full z-40"></div>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <p className="font-label text-primary text-xs font-bold uppercase tracking-widest">Step 03 <span className="text-on-surface-variant font-medium">/ 04</span></p>
            <p className="font-headline text-on-surface-variant text-sm font-medium">Schedule Setup</p>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"></div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">When do you <span className="text-primary italic">train?</span></h2>
          <p className="text-on-surface-variant text-lg">Pick your preferred days and time. We'll build your weekly plan around this.</p>
        </section>

        {/* Day Selector */}
        <div className="mb-10">
          <h3 className="font-headline text-lg font-bold mb-4">Training Days</h3>
          <div className="flex gap-3 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-14 h-14 rounded-xl font-headline font-bold text-sm flex items-center justify-center transition-all active:scale-95 ${
                  selectedDays.includes(day)
                    ? 'bg-primary text-on-primary-fixed shadow-lg shadow-primary/20'
                    : 'bg-surface-container border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant mt-3">{selectedDays.length} days selected — {selectedDays.length >= 4 ? 'Intense' : selectedDays.length >= 3 ? 'Balanced' : 'Light'} schedule</p>
        </div>

        {/* Time Preference */}
        <div className="mb-10">
          <h3 className="font-headline text-lg font-bold mb-4">Preferred Time</h3>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`w-full p-4 rounded-xl text-left font-body text-sm transition-all active:scale-[0.99] flex items-center justify-between ${
                  selectedTime === slot
                    ? 'bg-surface-container-highest border border-primary/30 ring-2 ring-primary/20'
                    : 'bg-surface-container border border-outline-variant/10 hover:bg-surface-container-highest'
                }`}
              >
                <span>{slot}</span>
                {selectedTime === slot && (
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 p-6 flex items-center justify-center bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl w-full">
          <Link
            to="/member/onboarding/complete"
            className="w-full py-5 px-8 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_24px_rgba(243,255,202,0.2)]"
          >
            Continue
            <span className="material-symbols-outlined">trending_flat</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
