import { useState } from 'react'
import { Reorder } from 'framer-motion'

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
  const [selectedDay, setSelectedDay] = useState(getCurrentDayKey())
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [plan, setPlan] = useState(DEFAULT_PLAN)
  const [customOrder, setCustomOrder] = useState([...DAY_KEYS])

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

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-black font-headline text-on-surface uppercase italic">Protocol</h1>
        <button
          onClick={() => isCustomizing ? cancelCustomization() : setIsCustomizing(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
          title="Customize Plan"
        >
          <span className="material-symbols-outlined text-xl">{isCustomizing ? 'close' : 'settings'}</span>
        </button>
      </div>

      {/* Customize Mode */}
      {isCustomizing ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-surface-container rounded-2xl p-5 border border-primary/20 shadow-lg">
            <p className="text-xs text-primary font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">tune</span>
              Reorder Your Weekly Split
            </p>
            <Reorder.Group axis="y" values={customOrder} onReorder={setCustomOrder} className="space-y-2">
              {customOrder.map((dayKey, index) => (
                <Reorder.Item
                  key={dayKey}
                  value={dayKey}
                  className="flex items-center gap-3 bg-surface-container-highest rounded-xl p-3 border border-outline-variant/10 cursor-grab active:cursor-grabbing relative select-none"
                  whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="flex items-center justify-center text-on-surface-variant/40 shrink-0 touch-none">
                    <span className="material-symbols-outlined text-xl">drag_indicator</span>
                  </div>
                  <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest w-10 shrink-0">
                    {DAY_KEYS[index]}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">{plan[dayKey].icon}</span>
                    <span className="text-sm font-bold text-on-surface truncate">{plan[dayKey].focus}</span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={cancelCustomization}
              className="py-4 rounded-xl border-2 border-surface-container-highest text-on-surface-variant font-black text-xs uppercase tracking-widest hover:border-outline-variant/50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={saveCustomization}
              className="py-4 rounded-xl bg-primary text-on-primary-fixed font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Save Split
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Day Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {DAY_KEYS.map((d, i) => {
              // Mock attendance status footprint: Mon/Tue completed, Wed missed, Thu current, Fri+ upcoming.
              const status = i < 2 ? 'completed' : i === 2 ? 'missed' : i === 3 ? 'today' : 'upcoming'
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`flex-shrink-0 snap-center flex flex-col items-center gap-1.5 px-6 pt-3 pb-2 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                    selectedDay === d
                      ? 'bg-primary text-on-primary-fixed shadow-lg shadow-primary/20 focus:outline-none'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest focus:outline-none'
                  }`}
                >
                  <span className="mb-0.5">{d}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    status === 'completed' 
                      ? selectedDay === d ? 'bg-on-primary-fixed' : 'bg-primary shadow-[0_0_5px_rgba(205,255,24,0.5)]'
                    : status === 'missed'
                      ? selectedDay === d ? 'bg-error' : 'bg-error shadow-[0_0_5px_rgba(255,80,80,0.5)]'
                    : 'bg-surface-container-highest border border-outline-variant/30'
                  }`}></div>
                </button>
              )
            })}
          </div>

          {/* Full Rest Day (Sunday) */}
          {dayData.fullRest ? (
            <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-dim/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10 flex flex-col items-center gap-6 py-8">
                <span className="material-symbols-outlined text-7xl text-primary-dim" style={{fontVariationSettings: "'FILL' 1"}}>hotel</span>
                <div>
                  <h2 className="text-3xl font-black font-headline text-on-surface uppercase italic mb-2">Full Rest Day</h2>
                  <p className="text-on-surface-variant text-sm max-w-[260px] mx-auto leading-relaxed">
                    Recovery is where growth happens. Sleep well, eat clean, and let your body rebuild stronger.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  No Training Required
                </div>
              </div>
            </div>
          ) : (
            /* Active Day Card */
            <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-20"></div>

              <div className="relative z-10 flex justify-between items-end mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">
                    DAY {DAY_KEYS.indexOf(selectedDay) + 1}
                  </span>
                  <h2 className="text-3xl font-black font-headline text-on-surface leading-tight mt-1">
                    {dayData.focus.includes(' & ') ? (
                      <>
                        {dayData.focus.split(' & ')[0]}<br/>
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">& {dayData.focus.split(' & ')[1]}</span>
                      </>
                    ) : dayData.focus.includes(' / ') ? (
                      <>
                        {dayData.focus.split(' / ')[0]}<br/>
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">{dayData.focus.split(' / ')[1]}</span>
                      </>
                    ) : (
                      dayData.focus
                    )}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black font-headline flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-xl">timer</span>
                    {dayData.rest ? '30m' : '75m'}
                  </span>
                </div>
              </div>

              {/* Exercise List with Thumbnails */}
              <div className="space-y-3 relative z-10">
                {dayData.exercises.map((ex, idx) => (
                  <div key={idx} className="bg-surface-container-highest p-3 rounded-2xl flex items-center gap-4 hover:bg-outline-variant/20 transition-colors group cursor-pointer">
                    {/* Exercise Demo Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-surface overflow-hidden relative shrink-0 border border-outline-variant/10">
                      <img
                        src={ex.img}
                        alt={ex.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-surface/30 group-hover:bg-transparent transition-colors">
                        <span
                          className="material-symbols-outlined text-on-surface text-lg border border-on-surface/20 rounded-full p-0.5 bg-surface/60 backdrop-blur-sm shadow-md"
                          style={{fontVariationSettings: "'FILL' 1"}}
                        >play_arrow</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-on-surface text-sm">{ex.name}</h4>
                      <p className="text-xs text-on-surface-variant font-medium tracking-wide mt-0.5">{ex.sets} • {ex.reps}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant group-hover:border-primary group-hover:text-primary transition-colors shrink-0">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>

              {!dayData.rest && (
                <button className="w-full mt-6 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-5 rounded-2xl text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_circle</span>
                  START SESSION
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
