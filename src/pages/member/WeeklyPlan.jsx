import { useState } from 'react'

const weekPlan = [
  { day: 'Monday', type: 'Push Day - Hypertrophy', focus: 'Chest / Shoulders / Triceps', duration: '75 min', exercises: [
    { name: 'Barbell Bench Press', sets: '4×8', weight: '185 lbs', icon: 'fitness_center' },
    { name: 'Incline Dumbbell Press', sets: '3×10', weight: '65 lbs', icon: 'fitness_center' },
    { name: 'Cable Flyes', sets: '3×12', weight: '30 lbs', icon: 'fitness_center' },
    { name: 'OHP (Seated)', sets: '4×8', weight: '115 lbs', icon: 'fitness_center' },
    { name: 'Lateral Raises', sets: '3×15', weight: '20 lbs', icon: 'fitness_center' },
    { name: 'Tricep Pushdown', sets: '3×12', weight: '50 lbs', icon: 'fitness_center' },
  ]},
  { day: 'Tuesday', type: 'Rest Day', focus: 'Active Recovery', duration: '30 min', exercises: [
    { name: 'Light Stretching', sets: '15 min', weight: '-', icon: 'self_improvement' },
    { name: 'Foam Rolling', sets: '15 min', weight: '-', icon: 'self_improvement' },
  ]},
  { day: 'Wednesday', type: 'Pull Day - Strength', focus: 'Back / Biceps', duration: '70 min', exercises: [
    { name: 'Deadlift', sets: '4×5', weight: '315 lbs', icon: 'fitness_center' },
    { name: 'Barbell Rows', sets: '4×8', weight: '185 lbs', icon: 'fitness_center' },
    { name: 'Lat Pulldown', sets: '3×10', weight: '140 lbs', icon: 'fitness_center' },
    { name: 'Face Pulls', sets: '3×15', weight: '35 lbs', icon: 'fitness_center' },
    { name: 'Barbell Curls', sets: '3×10', weight: '65 lbs', icon: 'fitness_center' },
  ]},
  { day: 'Thursday', type: 'Rest Day', focus: 'Recovery', duration: '-', exercises: [] },
  { day: 'Friday', type: 'Legs - Power', focus: 'Quads / Hamstrings / Glutes', duration: '80 min', exercises: [
    { name: 'Barbell Squat', sets: '5×5', weight: '275 lbs', icon: 'fitness_center' },
    { name: 'Romanian Deadlift', sets: '4×8', weight: '225 lbs', icon: 'fitness_center' },
    { name: 'Leg Press', sets: '3×12', weight: '450 lbs', icon: 'fitness_center' },
    { name: 'Walking Lunges', sets: '3×10 ea', weight: '50 lbs', icon: 'fitness_center' },
    { name: 'Calf Raises', sets: '4×15', weight: '200 lbs', icon: 'fitness_center' },
  ]},
  { day: 'Saturday', type: 'Upper Body - Volume', focus: 'Full Upper', duration: '65 min', exercises: [
    { name: 'Dumbbell Press', sets: '3×12', weight: '70 lbs', icon: 'fitness_center' },
    { name: 'Pull-ups', sets: '3×max', weight: 'BW', icon: 'fitness_center' },
    { name: 'Arnold Press', sets: '3×10', weight: '45 lbs', icon: 'fitness_center' },
    { name: 'Cable Rows', sets: '3×12', weight: '120 lbs', icon: 'fitness_center' },
  ]},
  { day: 'Sunday', type: 'Rest Day', focus: 'Full Recovery', duration: '-', exercises: [] },
]

const todayIndex = 0 // Monday for demo

export default function WeeklyPlan() {
  const [expanded, setExpanded] = useState(todayIndex)

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold">Weekly Plan</h2>
          <p className="text-on-surface-variant text-sm">Week of March 24 – 30</p>
        </div>
        <span className="bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">Week 12</span>
      </div>

      <div className="space-y-3">
        {weekPlan.map((day, i) => {
          const isToday = i === todayIndex
          const isRest = day.type.includes('Rest')
          const isExpanded = expanded === i

          return (
            <div key={day.day} className={`rounded-xl overflow-hidden transition-all duration-300 ${isToday ? 'ring-2 ring-primary/20' : ''}`}>
              <button
                onClick={() => setExpanded(isExpanded ? -1 : i)}
                className={`w-full p-4 flex items-center justify-between text-left transition-all ${
                  isExpanded ? 'bg-surface-container-highest' : 'bg-surface-container hover:bg-surface-container-high'
                } ${isRest ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isToday ? 'bg-primary text-on-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className="font-headline font-bold text-sm">{day.day.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline font-bold text-sm">{day.day}</h4>
                      {isToday && <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">Today</span>}
                    </div>
                    <p className="text-xs text-on-surface-variant">{day.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isRest && <span className="text-xs text-on-surface-variant">{day.duration}</span>}
                  <span className="material-symbols-outlined text-on-surface-variant text-sm transition-transform duration-300" style={{transform: isExpanded ? 'rotate(180deg)' : ''}}>expand_more</span>
                </div>
              </button>

              {isExpanded && day.exercises.length > 0 && (
                <div className="bg-surface-container-low p-4 space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{day.focus}</p>
                  {day.exercises.map((ex, j) => (
                    <div key={j} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-sm">{ex.icon}</span>
                        <span className="text-sm font-medium">{ex.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-on-surface-variant">{ex.sets}</span>
                        <span className="text-xs font-bold text-primary">{ex.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
