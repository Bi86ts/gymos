import { useState, useEffect, useRef } from 'react'
import { Reorder } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DEFAULT_PLAN = {
  Mon: {
    focus: 'Chest & Triceps',
    icon: 'exercise',
    exercises: [
      { name: 'Incline DB Press', sets: '4 sets', reps: '8-10 reps', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop' },
      { name: 'Flat Barbell Bench', sets: '4 sets', reps: '6-8 reps', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop' },
      { name: 'Pec Deck Fly', sets: '3 sets', reps: '12-15 reps', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Tricep Pushdowns', sets: '4 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=200&auto=format&fit=crop' },
      { name: 'Overhead Tricep Extension', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Tue: {
    focus: 'Back & Biceps',
    icon: 'sports_martial_arts',
    exercises: [
      { name: 'Deadlifts', sets: '4 sets', reps: '5-6 reps', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Lat Pulldowns', sets: '4 sets', reps: '8-10 reps', img: 'https://images.unsplash.com/photo-1598971639058-a069ba91e41e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Seated Cable Rows', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?q=80&w=200&auto=format&fit=crop' },
      { name: 'Barbell Curls', sets: '3 sets', reps: '8-10 reps', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Hammer Curls', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Wed: {
    focus: 'Active Recovery / Yoga',
    icon: 'self_improvement',
    rest: true,
    exercises: [
      { name: 'Foam Rolling (Full Body)', sets: '1 set', reps: '15 min', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop' },
      { name: 'Yoga Flow Sequence', sets: '1 set', reps: '20 min', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop' },
      { name: 'Light Stretching', sets: '1 set', reps: '10 min', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=200&auto=format&fit=crop' },
      { name: 'Mobility Drills', sets: '1 set', reps: '10 min', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Thu: {
    focus: 'Abs & Calves',
    icon: 'accessibility_new',
    exercises: [
      { name: 'Hanging Leg Raises', sets: '4 sets', reps: '12-15 reps', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop' },
      { name: 'Cable Crunches', sets: '3 sets', reps: '15-20 reps', img: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?q=80&w=200&auto=format&fit=crop' },
      { name: 'Plank Hold', sets: '3 sets', reps: '45-60 sec', img: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=200&auto=format&fit=crop' },
      { name: 'Standing Calf Raises', sets: '4 sets', reps: '15-20 reps', img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Seated Calf Raises', sets: '3 sets', reps: '12-15 reps', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Fri: {
    focus: 'Shoulders & Arms',
    icon: 'fitness_center',
    exercises: [
      { name: 'Overhead Press', sets: '4 sets', reps: '6-8 reps', img: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=200&auto=format&fit=crop' },
      { name: 'Lateral Raises', sets: '4 sets', reps: '12-15 reps', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop' },
      { name: 'Face Pulls', sets: '3 sets', reps: '15-20 reps', img: 'https://images.unsplash.com/photo-1598971639058-a069ba91e41e?q=80&w=200&auto=format&fit=crop' },
      { name: 'EZ Bar Curls', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Skull Crushers', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Sat: {
    focus: 'Legs',
    icon: 'directions_run',
    exercises: [
      { name: 'Barbell Squats', sets: '4 sets', reps: '6-8 reps', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop' },
      { name: 'Romanian Deadlifts', sets: '4 sets', reps: '8-10 reps', img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Leg Press', sets: '3 sets', reps: '10-12 reps', img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Leg Curls', sets: '3 sets', reps: '12-15 reps', img: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?q=80&w=200&auto=format&fit=crop' },
      { name: 'Walking Lunges', sets: '3 sets', reps: '12 each leg', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=200&auto=format&fit=crop' },
    ],
  },
  Sun: {
    focus: 'Rest',
    icon: 'hotel',
    rest: true,
    fullRest: true,
    exercises: [],
  },
}

function getCurrentDayKey() {
  const jsDay = new Date().getDay() // 0=Sun, 1=Mon...
  return DAY_KEYS[jsDay === 0 ? 6 : jsDay - 1]
}

export default function WeeklyPlan() {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState(getCurrentDayKey())
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [customOrder, setCustomOrder] = useState([...DAY_KEYS])
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [completedExercises, setCompletedExercises] = useState([])
  const timerRef = useRef(null)

  // Session timer
  useEffect(() => {
    if (sessionActive) {
      timerRef.current = setInterval(() => setSessionSeconds(s => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [sessionActive])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const startSession = () => {
    setSessionActive(true)
    setSessionSeconds(0)
    setCompletedExercises([])
  }

  const toggleExercise = (idx) => {
    setCompletedExercises(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const finishSession = () => {
    setSessionActive(false)
    // Save to localStorage
    try {
      const log = JSON.parse(localStorage.getItem('gymos_workout_log') || '[]')
      log.push({
        day: selectedDay,
        focus: dayData.focus,
        duration: sessionSeconds,
        completedCount: completedExercises.length,
        totalExercises: dayData.exercises.length,
        date: new Date().toISOString(),
      })
      localStorage.setItem('gymos_workout_log', JSON.stringify(log))
    } catch (e) {}
    navigate('/member/checkin')
  }

  const saveCustomization = () => {
    const originalFocuses = customOrder.map(day => plan[day])
    const newPlan = {}
    DAY_KEYS.forEach((day, i) => {
      newPlan[day] = originalFocuses[i]
    })
    setPlan(newPlan)
    setCustomOrder([...DAY_KEYS])
    setIsCustomizing(false)
  }

  const cancelCustomization = () => {
    setCustomOrder([...DAY_KEYS])
    setIsCustomizing(false)
  }

  const dayData = plan[selectedDay]

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-black font-headline text-white uppercase italic tracking-tight">Protocol</h1>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">Elite Training Matrix</p>
        </div>
        <button
          onClick={() => isCustomizing ? cancelCustomization() : setIsCustomizing(true)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
            isCustomizing 
              ? 'bg-error text-white shadow-lg shadow-error/20' 
              : 'bg-[#111316] text-on-surface-variant border border-outline-variant/10 hover:border-primary/50'
          }`}
          title="Customize Plan"
        >
          <span className="material-symbols-outlined text-2xl">{isCustomizing ? 'close' : 'settings_input_component'}</span>
        </button>
      </div>

      {/* Customize Mode */}
      {isCustomizing ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-[#111316] rounded-[32px] p-6 border border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>tune</span>
              Optimize Split Sequence
            </p>
            <Reorder.Group axis="y" values={customOrder} onReorder={setCustomOrder} className="space-y-3">
              {customOrder.map((dayKey, index) => (
                <Reorder.Item
                  key={dayKey}
                  value={dayKey}
                  className="flex items-center gap-4 bg-white/[0.03] rounded-2xl p-4 border border-outline-variant/5 cursor-grab active:cursor-grabbing relative select-none group hover:border-primary/30 transition-colors"
                  whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="flex items-center justify-center text-on-surface-variant/20 shrink-0 touch-none group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">drag_indicator</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0 border border-outline-variant/10">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">
                      {DAY_KEYS[index]}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>{plan[dayKey].icon}</span>
                    <span className="text-sm font-black text-white uppercase italic tracking-tight truncate">{plan[dayKey].focus}</span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={cancelCustomization}
                className="py-5 rounded-2xl bg-white/[0.03] border border-outline-variant/10 text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.06] transition-all active:scale-95"
              >
                Abort
              </button>
              <button
                onClick={saveCustomization}
                className="py-5 rounded-2xl bg-primary text-[#06060B] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                Deploy Split
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Day Tabs */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 hide-scrollbar snap-x px-1">
            {DAY_KEYS.map((d, i) => {
              const status = i < 2 ? 'completed' : i === 2 ? 'missed' : i === 3 ? 'today' : 'upcoming'
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`flex-shrink-0 snap-center flex flex-col items-center gap-2 px-7 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all relative ${
                    selectedDay === d
                      ? 'bg-primary text-[#06060B] shadow-xl shadow-primary/20 scale-105 z-10'
                      : 'bg-[#111316] text-on-surface-variant border border-outline-variant/10 hover:border-white/10'
                  }`}
                >
                  <span className="relative z-10">{d}</span>
                  <div className={`w-1.5 h-1.5 rounded-full z-10 ${
                    status === 'completed' 
                      ? selectedDay === d ? 'bg-[#06060B]' : 'bg-[#00FFAA] shadow-[0_0_10px_#00FFAA]'
                    : status === 'missed'
                      ? selectedDay === d ? 'bg-[#06060B]' : 'bg-[#FF2D55] shadow-[0_0_10px_#FF2D55]'
                    : status === 'today'
                      ? selectedDay === d ? 'bg-[#06060B]' : 'bg-[#3A82F6] animate-pulse'
                    : 'bg-white/10'
                  }`}></div>
                  {selectedDay === d && (
                    <div className="absolute inset-x-4 bottom-1 h-0.5 bg-[#06060B]/20 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Full Rest Day (Sunday) */}
          {dayData.fullRest ? (
            <div className="bg-[#111316] rounded-[40px] p-10 border border-outline-variant/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-16 -mt-16" />
              <div className="relative z-10 flex flex-col items-center gap-8 py-10">
                <div className="w-24 h-24 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-outline-variant/10 rotate-3">
                  <span className="material-symbols-outlined text-6xl text-primary/40" style={{fontVariationSettings: "'FILL' 1"}}>hotel</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black font-headline text-white uppercase italic tracking-tighter mb-3">System Recovery</h2>
                  <p className="text-on-surface-variant text-sm max-w-[280px] mx-auto leading-relaxed border-t border-outline-variant/10 pt-4 opacity-80">
                    Neural adaptation and tissue repair in progress. Growth is optimized during periods of complete stasis.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-primary/10 text-primary px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-lg shadow-primary/5">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                  No Training Required
                </div>
              </div>
            </div>
          ) : (
            /* Active Day Card */
            <div className="bg-[#111316] rounded-[40px] p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20 group-hover:opacity-10 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3A82F6]/5 rounded-full blur-[100px] -ml-20 -mb-20" />

              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">
                      PHASE 0{DAY_KEYS.indexOf(selectedDay) + 1}
                    </span>
                    <div className="h-px w-8 bg-primary/20" />
                  </div>
                  <h2 className="text-4xl font-black font-headline text-white leading-tight uppercase italic tracking-tighter">
                    {dayData.focus.includes(' & ') ? (
                      <>
                        {dayData.focus.split(' & ')[0]}<br/>
                        <span className="text-[#3A82F6]">& {dayData.focus.split(' & ')[1]}</span>
                      </>
                    ) : dayData.focus.includes(' / ') ? (
                      <>
                        {dayData.focus.split(' / ')[0]}<br/>
                        <span className="text-[#3A82F6]">{dayData.focus.split(' / ')[1]}</span>
                      </>
                    ) : (
                      dayData.focus
                    )}
                  </h2>
                </div>
                <div className="bg-white/[0.03] p-4 rounded-2xl border border-outline-variant/10 text-center min-w-[80px]">
                  <span className="block text-2xl font-black font-headline text-white tabular-nums">
                    {dayData.rest ? '30' : '75'}
                  </span>
                  <span className="block text-[8px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Minutes</span>
                </div>
              </div>

              {/* Exercise List with Thumbnails */}
              <div className="space-y-3 relative z-10">
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-4 opacity-50 px-2">Operation Checklist</p>
                {dayData.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-white/[0.03] p-4 rounded-3xl flex items-center gap-5 border border-outline-variant/5 hover:border-white/10 transition-all hover:bg-white/[0.05] group/item cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-[#06060B] overflow-hidden relative shrink-0 border border-outline-variant/10 grayscale group-hover/item:grayscale-0 transition-all">
                      <img
                        src={ex.img}
                        alt={ex.name}
                        className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/item:bg-transparent transition-colors">
                        <span
                          className="material-symbols-outlined text-white text-xl"
                          style={{fontVariationSettings: "'FILL' 1"}}
                        >play_arrow</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-[13px] uppercase tracking-tight italic group-hover/item:text-primary transition-colors">{ex.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">{ex.sets}</span>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{ex.reps}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-outline-variant/10 flex items-center justify-center text-on-surface-variant group-hover/item:text-primary group-hover/item:border-primary/20 transition-all shadow-lg active:scale-90">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>

              {!dayData.rest && !sessionActive && (
                <div className="mt-8 space-y-4 relative z-10">
                  <button
                    onClick={startSession}
                    className="w-full bg-gradient-to-r from-[#00FFAA] to-[#3A82F6] text-[#06060B] font-black py-5 rounded-2xl text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-[#00FFAA]/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined font-black" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                    Initialize Session
                  </button>
                  <button
                    onClick={() => navigate(`/member/workout-plan?muscle=${encodeURIComponent(dayData.focus.split(' & ')[0].split(' / ')[0])}`)}
                    className="w-full bg-white/[0.03] text-on-surface-variant font-black py-4.5 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3 hover:text-white border border-outline-variant/10"
                  >
                    <span className="material-symbols-outlined text-sm font-black text-primary">psychology</span>
                    Optimize with AI Core
                  </button>
                </div>
              )}
              {sessionActive && (
                <div className="mt-8 space-y-6 relative z-10">
                  {/* Live Timer */}
                  <div className="bg-[#00FFAA]/5 border border-[#00FFAA]/20 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-[#00FFAA]/5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-error rounded-full animate-ping opacity-20 absolute" />
                        <div className="w-4 h-4 bg-error rounded-full relative" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#00FFAA] uppercase tracking-widest block">Live Uplink</span>
                        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Recording Metrics</span>
                      </div>
                    </div>
                    <span className="font-headline text-4xl font-black text-[#00FFAA] tabular-nums tracking-tighter shadow-[#00FFAA]/20 drop-shadow-xl">{formatTime(sessionSeconds)}</span>
                  </div>

                  {/* Exercise Checklist */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-50 px-2">Completion Log</p>
                    {dayData.exercises.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleExercise(idx)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                          completedExercises.includes(idx)
                            ? 'bg-[#00FFAA]/5 border-[#00FFAA]/20 opacity-60'
                            : 'bg-white/[0.03] border-outline-variant/5 hover:border-white/10'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                          completedExercises.includes(idx) 
                            ? 'bg-[#00FFAA] border-[#00FFAA] shadow-lg shadow-[#00FFAA]/20' 
                            : 'border-on-surface-variant/20 group-hover:border-primary/40'
                        }`}>
                          {completedExercises.includes(idx) && (
                            <span className="material-symbols-outlined text-[#06060B] text-lg font-black">check</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[13px] font-bold block transition-all ${completedExercises.includes(idx) ? 'line-through text-on-surface-variant' : 'text-white'}`}>{ex.name}</span>
                          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-50">{ex.sets} • {ex.reps}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Progress + Finish */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Efficiency</span>
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">{completedExercises.length}/{dayData.exercises.length} Tasks</span>
                    </div>
                    <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-[#3A82F6] h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${(completedExercises.length / dayData.exercises.length) * 100}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={finishSession}
                    className="w-full bg-[#00FFAA] text-[#06060B] font-black py-5 rounded-2xl text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-[#00FFAA]/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined font-black" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    Terminate Session Protocol
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
