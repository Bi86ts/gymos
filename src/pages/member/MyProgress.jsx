import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Animated Counter ──
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0, startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setDisplay(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <>{display}</>
}

// ── Circular Progress Ring ──
function ProgressRing({ value, max, color, size = 80, strokeWidth = 7, children }) {
  const radius = (size - strokeWidth) / 2
  const circum = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const offset = circum * (1 - pct)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circum} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">{children}</div>
    </div>
  )
}

// ── Mini Bar Chart ──
function MiniBarChart({ data, color, height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1.5 justify-between" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-md transition-all duration-700 ease-out relative group"
            style={{ height: `${Math.max((d.value / max) * 100, 8)}%`, backgroundColor: d.value > 0 ? color : 'rgba(255,255,255,0.06)', minHeight: 4 }}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[9px] px-1.5 py-0.5 rounded font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {d.value}
            </div>
          </div>
          <span className="text-[8px] text-on-surface-variant font-semibold">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Attendance Heatmap ──
function AttendanceHeatmap({ data }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {['M','T','W','T','F','S','S'].map(d => (
        <div key={d} className="text-center text-[8px] text-on-surface-variant/60 font-bold pb-1">{d}</div>
      ))}
      {data.map((val, i) => {
        const intensity = val === 0 ? 'bg-white/[0.03]' : val === 1 ? 'bg-[#00FFAA]/20' : val === 2 ? 'bg-[#00FFAA]/50' : 'bg-[#00FFAA]'
        return (
          <div key={i} className={`aspect-square rounded-[4px] ${intensity} transition-colors hover:ring-1 hover:ring-[#00FFAA]/40 cursor-default`}
            title={val > 0 ? `${val} session${val > 1 ? 's' : ''}` : 'Rest day'}
          />
        )
      })}
    </div>
  )
}

export default function MyProgress() {
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_member')
      if (saved) setMember(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const firstName = member?.name?.split(' ')[0] || 'Member'

  // ── Simulated Progress Data ──
  const stats = useMemo(() => ({
    consistency: 78,
    streak: 6,
    totalSessions: 47,
    thisMonth: 14,
    personalBests: 3,
    goalsHit: 2,
    avgDuration: 52,
    caloriesBurned: 12400,
  }), [])

  // Weekly sessions data (last 8 weeks)
  const weeklyData = [
    { label: 'W1', value: 3 }, { label: 'W2', value: 4 }, { label: 'W3', value: 2 },
    { label: 'W4', value: 5 }, { label: 'W5', value: 3 }, { label: 'W6', value: 4 },
    { label: 'W7', value: 5 }, { label: 'W8', value: 4 },
  ]

  // Monthly sessions (last 6 months)
  const monthlyData = [
    { label: 'Sep', value: 10 }, { label: 'Oct', value: 14 }, { label: 'Nov', value: 8 },
    { label: 'Dec', value: 12 }, { label: 'Jan', value: 16 }, { label: 'Feb', value: 14 },
  ]

  // Heatmap: 35 days (5 weeks)
  const heatmapData = [
    1,2,0,1,1,0,0, 0,1,1,0,2,0,0, 1,1,0,1,1,1,0,
    0,1,2,0,1,0,0, 1,1,0,1,1,0,0,
  ]

  // Goal progress
  const goals = [
    { id: 1, label: 'Weight Goal', icon: 'monitor_weight', current: member?.weight || 78, target: member?.targetWeight || 72, unit: 'kg', color: '#FF2D55', direction: (member?.targetWeight || 72) < (member?.weight || 78) ? 'decrease' : 'increase' },
    { id: 2, label: 'Consistency', icon: 'event_available', current: stats.consistency, target: 90, unit: '%', color: '#00FFAA', direction: 'increase' },
    { id: 3, label: 'Sessions/Week', icon: 'fitness_center', current: 4, target: member?.workoutDays?.length || 5, unit: 'days', color: '#3A82F6', direction: 'increase' },
    { id: 4, label: 'Session Duration', icon: 'timer', current: stats.avgDuration, target: Number(member?.sessionLength) || 60, unit: 'min', color: '#FF9500', direction: 'increase' },
  ]

  // Personal records
  const personalRecords = [
    { exercise: 'Bench Press', value: '80 kg', date: '2 weeks ago', icon: 'fitness_center', color: '#FF2D55' },
    { exercise: 'Squats', value: '100 kg', date: '1 week ago', icon: 'exercise', color: '#3A82F6' },
    { exercise: 'Deadlift', value: '120 kg', date: '3 days ago', icon: 'iron', color: '#FF9500' },
    { exercise: 'Running', value: '5K in 24:30', date: 'Today', icon: 'directions_run', color: '#00FFAA' },
  ]

  // Body composition timeline
  const bodyTimeline = [
    { month: 'Oct', weight: 82, fat: 22 },
    { month: 'Nov', weight: 80, fat: 20 },
    { month: 'Dec', weight: 79, fat: 19 },
    { month: 'Jan', weight: 78, fat: 18 },
    { month: 'Feb', weight: member?.weight || 77, fat: member?.bodyFat || 17 },
  ]

  // Achievements
  const achievements = [
    { icon: '🔥', label: 'Week Warrior', desc: '5 sessions in a week', unlocked: true },
    { icon: '💪', label: 'Iron Will', desc: '30 day streak', unlocked: false },
    { icon: '🏆', label: 'First PR', desc: 'Beat a personal record', unlocked: true },
    { icon: '⚡', label: 'Early Bird', desc: '10 morning sessions', unlocked: true },
    { icon: '🎯', label: 'Goal Crusher', desc: 'Hit target weight', unlocked: false },
    { icon: '🦾', label: 'Century Club', desc: '100 total sessions', unlocked: false },
  ]

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span>
        <h2 className="text-xl font-headline font-bold text-on-surface">No Progress Data</h2>
        <p className="text-on-surface-variant text-sm">Complete onboarding to start tracking your progress.</p>
        <a href="/onboarding" className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-sm mt-2">Start Onboarding</a>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-500">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1A12] via-[#111316] to-[#0F1A24] p-6 border border-[#00FFAA]/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FFAA]/8 rounded-full blur-[100px] -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3A82F6]/8 rounded-full blur-[80px] -ml-12 -mb-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-[#00FFAA] transition-colors">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <h1 className="text-2xl font-black font-headline text-white uppercase tracking-tight">
              {firstName}'s Progress
            </h1>
          </div>

          {/* Big Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { val: stats.consistency, label: 'Consistency', unit: '%', color: '#00FFAA', icon: 'trending_up' },
              { val: stats.streak, label: 'Streak', unit: 'days', color: '#FF9500', icon: 'local_fire_department' },
              { val: stats.thisMonth, label: 'This Month', unit: 'sessions', color: '#3A82F6', icon: 'event_available' },
              { val: stats.personalBests, label: 'PRs Hit', unit: 'records', color: '#FF2D55', icon: 'emoji_events' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: s.color + '15' }}>
                  <span className="material-symbols-outlined text-lg" style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <div className="text-xl font-headline font-black text-white leading-none">
                  <AnimatedNumber value={s.val} />
                </div>
                <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1.5 bg-[#111316] rounded-2xl p-1.5 border border-outline-variant/5">
        {[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'body', label: 'Body', icon: 'monitor_weight' },
          { id: 'records', label: 'Records', icon: 'emoji_events' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#00FFAA]/15 text-[#00FFAA] shadow-md'
                : 'text-on-surface-variant hover:text-white'
            }`}>
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-300">

          {/* Goal Progress Cards */}
          <section>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
              <span className="material-symbols-outlined text-[#00FFAA] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>flag</span>
              Goal Progress
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(g => {
                const pct = g.direction === 'decrease'
                  ? Math.max(0, Math.min(100, ((g.current - g.target) / (g.current - (g.target - (g.current - g.target)))) * 100)) || 50
                  : Math.min(100, (g.current / g.target) * 100)
                return (
                  <div key={g.id} className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: g.color }} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: g.color + '20' }}>
                          <span className="material-symbols-outlined text-base" style={{ color: g.color, fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: g.color }}>{Math.round(pct)}%</span>
                      </div>
                      <h4 className="text-[11px] text-on-surface-variant font-medium mb-1">{g.label}</h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-headline font-black text-white">{g.current}</span>
                        <span className="text-[10px] text-on-surface-variant">/ {g.target} {g.unit}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Weekly Activity */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3A82F6] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>bar_chart</span>
                Weekly Sessions
              </h3>
              <div className="flex items-center gap-1 bg-[#3A82F6]/10 px-2 py-1 rounded-lg">
                <span className="material-symbols-outlined text-[#3A82F6] text-xs">trending_up</span>
                <span className="text-[10px] font-bold text-[#3A82F6]">+12% vs last month</span>
              </div>
            </div>
            <MiniBarChart data={weeklyData} color="#3A82F6" height={90} />
          </section>

          {/* Attendance Heatmap */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00FFAA] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
                Attendance — Last 5 Weeks
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.03]" />
                  <span className="text-[8px] text-on-surface-variant">None</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#00FFAA]/50" />
                  <span className="text-[8px] text-on-surface-variant">1-2</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#00FFAA]" />
                  <span className="text-[8px] text-on-surface-variant">3+</span>
                </div>
              </div>
            </div>
            <AttendanceHeatmap data={heatmapData} />
          </section>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
              <div className="w-9 h-9 rounded-lg bg-[#FF9500]/15 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[#FF9500] text-lg" style={{fontVariationSettings: "'FILL' 1"}}>timer</span>
              </div>
              <div className="text-lg font-headline font-black text-white"><AnimatedNumber value={stats.avgDuration} /></div>
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Avg Duration</p>
              <p className="text-[9px] text-on-surface-variant/60">minutes</p>
            </div>
            <div className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
              <div className="w-9 h-9 rounded-lg bg-[#FF2D55]/15 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[#FF2D55] text-lg" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
              </div>
              <div className="text-lg font-headline font-black text-white"><AnimatedNumber value={stats.caloriesBurned} duration={1200} /></div>
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Calories</p>
              <p className="text-[9px] text-on-surface-variant/60">burned total</p>
            </div>
            <div className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md text-center">
              <div className="w-9 h-9 rounded-lg bg-[#C8FF00]/15 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[#C8FF00] text-lg" style={{fontVariationSettings: "'FILL' 1"}}>fitness_center</span>
              </div>
              <div className="text-lg font-headline font-black text-white"><AnimatedNumber value={stats.totalSessions} /></div>
              <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Total</p>
              <p className="text-[9px] text-on-surface-variant/60">sessions</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BODY TAB ═══ */}
      {activeTab === 'body' && (
        <div className="space-y-5 animate-in fade-in duration-300">

          {/* Body Metrics */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2D55]/5 rounded-full blur-[80px] -mr-16 -mt-16" />
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-5 relative z-10">
              <span className="material-symbols-outlined text-[#FF2D55] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>monitor_weight</span>
              Current Metrics
            </h3>
            <div className="flex items-center justify-around relative z-10">
              <ProgressRing value={member.weight || 78} max={100} color="#FF2D55" size={90}>
                <span className="text-xl font-headline font-black text-white">{member.weight || 78}</span>
                <span className="text-[8px] text-on-surface-variant font-bold">KG</span>
              </ProgressRing>
              <div className="h-16 w-px bg-outline-variant/10" />
              <ProgressRing value={member.bodyFat || 17} max={35} color="#FF9500" size={90}>
                <span className="text-xl font-headline font-black text-white">{member.bodyFat || 17}</span>
                <span className="text-[8px] text-on-surface-variant font-bold">% FAT</span>
              </ProgressRing>
              <div className="h-16 w-px bg-outline-variant/10" />
              <ProgressRing value={member.height ? (member.weight / ((member.height/100) ** 2)) : 24.5} max={35} color="#3A82F6" size={90}>
                <span className="text-xl font-headline font-black text-white">{member.height ? (member.weight / ((member.height/100) ** 2)).toFixed(1) : '24.5'}</span>
                <span className="text-[8px] text-on-surface-variant font-bold">BMI</span>
              </ProgressRing>
            </div>
          </section>

          {/* Weight Journey */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#C8FF00] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>show_chart</span>
              Body Transformation
            </h3>

            {/* Timeline Cards */}
            <div className="space-y-2">
              {bodyTimeline.map((entry, i) => {
                const prevWeight = i > 0 ? bodyTimeline[i-1].weight : entry.weight
                const delta = entry.weight - prevWeight
                return (
                  <div key={entry.month} className={`flex items-center gap-4 p-3 rounded-xl ${i === bodyTimeline.length - 1 ? 'bg-[#00FFAA]/5 border border-[#00FFAA]/15' : 'bg-surface-container-highest/30'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === bodyTimeline.length - 1 ? 'bg-[#00FFAA]/15' : 'bg-surface-container-highest'}`}>
                      <span className={`text-xs font-black ${i === bodyTimeline.length - 1 ? 'text-[#00FFAA]' : 'text-on-surface-variant'}`}>{entry.month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-headline font-black text-white">{entry.weight} kg</span>
                        {delta !== 0 && (
                          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${delta < 0 ? 'text-[#00FFAA]' : 'text-[#FF2D55]'}`}>
                            <span className="material-symbols-outlined text-xs">{delta < 0 ? 'arrow_downward' : 'arrow_upward'}</span>
                            {Math.abs(delta)} kg
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Body fat: {entry.fat}%</p>
                    </div>
                    {/* Visual weight bar */}
                    <div className="w-24 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((entry.weight - 70) / 15) * 100}%`, backgroundColor: i === bodyTimeline.length - 1 ? '#00FFAA' : '#3A82F6' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Target Badge */}
            <div className="mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-[#00FFAA]/5 to-[#3A82F6]/5 rounded-xl p-3 border border-[#00FFAA]/10">
              <span className="material-symbols-outlined text-[#00FFAA]" style={{fontVariationSettings: "'FILL' 1"}}>flag</span>
              <div>
                <p className="text-xs font-bold text-white">Target: {member.targetWeight || 72} kg</p>
                <p className="text-[10px] text-on-surface-variant">{Math.abs((member.weight || 78) - (member.targetWeight || 72))} kg remaining</p>
              </div>
              <div className="ml-auto text-lg font-headline font-black text-[#00FFAA]">
                {Math.round(((82 - (member.weight || 78)) / (82 - (member.targetWeight || 72))) * 100)}%
              </div>
            </div>
          </section>

          {/* Monthly Volume */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#FF9500] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>insights</span>
              Monthly Sessions
            </h3>
            <MiniBarChart data={monthlyData} color="#FF9500" height={80} />
          </section>
        </div>
      )}

      {/* ═══ RECORDS TAB ═══ */}
      {activeTab === 'records' && (
        <div className="space-y-5 animate-in fade-in duration-300">

          {/* Personal Records */}
          <section>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
              <span className="material-symbols-outlined text-[#FFE600] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
              Personal Records
            </h3>
            <div className="space-y-2.5">
              {personalRecords.map((pr, i) => (
                <div key={i} className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 shadow-md flex items-center gap-4 group hover:border-white/10 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pr.color + '15' }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: pr.color, fontVariationSettings: "'FILL' 1" }}>{pr.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white">{pr.exercise}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">{pr.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-headline font-black" style={{ color: pr.color }}>{pr.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3 px-1">
              <span className="material-symbols-outlined text-[#C8FF00] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>military_tech</span>
              Achievements
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {achievements.map((a, i) => (
                <div key={i} className={`rounded-2xl p-4 border text-center transition-all ${
                  a.unlocked
                    ? 'bg-[#111316] border-[#00FFAA]/15 shadow-md'
                    : 'bg-[#111316]/50 border-outline-variant/5 opacity-50 grayscale'
                }`}>
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <h4 className="text-[10px] font-bold text-white mb-0.5 leading-tight">{a.label}</h4>
                  <p className="text-[8px] text-on-surface-variant leading-tight">{a.desc}</p>
                  {a.unlocked && (
                    <div className="mt-2 flex items-center justify-center gap-0.5">
                      <span className="material-symbols-outlined text-[#00FFAA] text-xs" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      <span className="text-[8px] font-bold text-[#00FFAA]">Unlocked</span>
                    </div>
                  )}
                  {!a.unlocked && (
                    <div className="mt-2 flex items-center justify-center gap-0.5">
                      <span className="material-symbols-outlined text-on-surface-variant/50 text-xs">lock</span>
                      <span className="text-[8px] font-bold text-on-surface-variant/50">Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Muscle Group Focus Distribution */}
          <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#3A82F6] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>pie_chart</span>
              Muscle Focus Distribution
            </h3>
            <div className="space-y-3">
              {[
                { group: 'Chest', pct: 22, color: '#FF2D55' },
                { group: 'Back', pct: 20, color: '#3A82F6' },
                { group: 'Legs', pct: 18, color: '#00FFAA' },
                { group: 'Shoulders', pct: 15, color: '#FF9500' },
                { group: 'Arms', pct: 14, color: '#C8FF00' },
                { group: 'Core', pct: 11, color: '#FFE600' },
              ].map(mg => (
                <div key={mg.group} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-on-surface-variant w-16 text-right">{mg.group}</span>
                  <div className="flex-1 h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${mg.pct}%`, backgroundColor: mg.color }} />
                  </div>
                  <span className="text-[10px] font-bold w-8" style={{ color: mg.color }}>{mg.pct}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
