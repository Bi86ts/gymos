export default function GoalBreakdown() {
  const milestones = [
    { title: 'Week 1-2', desc: 'Foundation & Form', status: 'complete', icon: 'check_circle' },
    { title: 'Week 3-4', desc: 'Volume Ramp', status: 'complete', icon: 'check_circle' },
    { title: 'Week 5-8', desc: 'Strength Phase', status: 'active', icon: 'trending_up' },
    { title: 'Week 9-12', desc: 'Hypertrophy Peak', status: 'upcoming', icon: 'lock' },
    { title: 'Week 13+', desc: 'Deload & Assess', status: 'upcoming', icon: 'lock' },
  ]

  return (
    <div className="space-y-8 pb-8">
      {/* Goal Header */}
      <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Active Goal</span>
          <h2 className="font-headline text-3xl font-black tracking-tight mb-2">Build Muscle</h2>
          <p className="text-on-surface-variant text-sm">Hypertrophy-focused program · Started 6 weeks ago</p>
        </div>
      </div>

      {/* Progress Ring + Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-6 rounded-xl flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-3">
            <svg className="performance-ring w-full h-full" viewBox="0 0 100 100">
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="100.5" strokeLinecap="round" strokeWidth="10"></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-headline font-black text-primary">60%</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Goal Progress</p>
        </div>
        <div className="space-y-3">
          <div className="bg-surface-container p-4 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sessions Done</p>
            <p className="font-headline font-bold text-2xl">24 <span className="text-sm text-on-surface-variant font-normal">/ 40</span></p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Volume</p>
            <p className="font-headline font-bold text-2xl">312k <span className="text-sm text-on-surface-variant font-normal">lbs</span></p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Consistency', value: '88%', color: 'border-primary' },
          { label: 'Avg Duration', value: '72 min', color: 'border-secondary' },
          { label: 'Recovery', value: 'Good', color: 'border-primary-dim' },
        ].map((m) => (
          <div key={m.label} className={`bg-surface-container-low p-4 rounded-xl border-l-2 ${m.color}`}>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{m.label}</p>
            <p className="font-headline font-bold text-lg">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Milestones Timeline */}
      <div>
        <h3 className="font-headline text-lg font-bold mb-4">Program Milestones</h3>
        <div className="space-y-0">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  m.status === 'complete' ? 'bg-primary/20' : m.status === 'active' ? 'bg-primary' : 'bg-surface-container-highest'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    m.status === 'complete' ? 'text-primary' : m.status === 'active' ? 'text-on-primary-fixed' : 'text-on-surface-variant'
                  }`} style={{fontVariationSettings: m.status === 'complete' ? "'FILL' 1" : ''}}>{m.icon}</span>
                </div>
                {i < milestones.length - 1 && <div className={`w-0.5 h-12 ${m.status === 'complete' ? 'bg-primary/30' : 'bg-surface-container-highest'}`}></div>}
              </div>
              <div className="pb-8">
                <p className={`font-headline font-bold text-sm ${m.status === 'active' ? 'text-primary' : ''}`}>{m.title}</p>
                <p className="text-xs text-on-surface-variant">{m.desc}</p>
                {m.status === 'active' && <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">Current Phase</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
