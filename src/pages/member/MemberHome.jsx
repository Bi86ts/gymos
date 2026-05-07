import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { detectSchedule, getNextDayDate, saveReminder } from '../../utils/scheduleDetector'

const trainerMessage = "You skipped legs twice. Let's fix that Friday 💪"
const scheduleInfo = detectSchedule(trainerMessage)

// Reusable SVG Arc component for Consistency
const ConsistencyArc = ({ score }) => {
  // Map score to color and messaging
  const getScoreData = (s) => {
    if (s >= 85) return { color: '#C8FF00', title: 'Elite Status', text: 'You are an absolute machine. Consistency is paying out massive dividends.', pill: '▲ +Top 5%' };
    if (s >= 70) return { color: '#00FFAA', title: 'Solid Grind', text: 'You\'ve shown up 9 of the last 12 sessions. Keep this up and you hit Streak Elite next week.', pill: '▲ +4 this week' };
    if (s >= 50) return { color: '#FFE600', title: 'Building Habit', text: 'You\'re getting there. Still skipping a few days, let\'s lock in the routine.', pill: '◆ Neutral' };
    return { color: '#FF3B30', title: 'Slipping', text: 'We missed a lot of sessions recently. Time to get back to the iron.', pill: '▼ -2 this week' };
  }

  const { color, title, text, pill } = getScoreData(score)

  // Arc math (Semi-circle: dasharray ~ 188.5)
  const radius = 40
  const circum = 2 * Math.PI * radius
  const arcLength = circum * 0.75 // 270 degree arc
  const offset = arcLength - (arcLength * score) / 100

  return (
    <div className="bg-[#111316] rounded-3xl p-6 border border-outline-variant/5 shadow-lg relative overflow-hidden flex flex-col gap-6">
      {/* Dynamic background glow based on score */}
      <div 
        className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 blur-[80px] rounded-full opacity-[0.15] transition-colors duration-500 ease-in-out" 
        style={{ backgroundColor: color }} 
      />

      <h3 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest relative z-10">
        Consistency Score
      </h3>

      <div className="flex items-start gap-6 relative z-10">
        <div className="relative shrink-0 w-24 h-24">
          <svg className="w-full h-full -rotate-[135deg] drop-shadow-lg" viewBox="0 0 100 100">
            {/* Track arc */}
            <circle 
              cx="50" cy="50" r={radius} 
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"
              strokeDasharray={circum} strokeDashoffset={circum - arcLength}
              strokeLinecap="round" 
            />
            {/* Progress arc */}
            <circle 
              cx="50" cy="50" r={radius} 
              fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={circum} strokeDashoffset={circum - arcLength + offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pt-1">
            <span className="text-3xl font-headline font-black text-white">{score}</span>
          </div>
        </div>

        <div className="flex-1 pt-1">
          <h2 className="text-lg font-bold text-white leading-tight mb-1">{title}</h2>
          <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3 pr-2">{text}</p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A3320] border border-[#234A2D]">
            <span className="text-[#00FFAA] text-[10px] font-bold tracking-wide">{pill}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-2 pb-1">
        <input 
          type="range" min="0" max="100" value={score} readOnly
          className="w-full absolute opacity-0 cursor-pointer inset-x-0 h-6 z-20"
        />
        <div className="w-full h-1 bg-outline-variant/20 rounded-full relative overflow-visible">
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-outline-variant/60 bg-surface shadow-sm cursor-grab active:cursor-grabbing transition-all hover:scale-110" style={{ left: `calc(${score}% - 8px)` }} />
        </div>
        <p className="text-center text-[10px] text-on-surface-variant/50 font-medium tracking-wide mt-3 lowercase">
          drag to explore score states
        </p>
      </div>
    </div>
  )
}

export default function MemberHome() {
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [interactiveScore, setInteractiveScore] = useState(75)
  const [reminderSet, setReminderSet] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_member')
      if (saved) setMember(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const firstName = member?.name?.split(' ')[0] || 'Rajan'
  const initials = member?.name?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() || 'RK'
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]

  const handleDrag = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left
    x = Math.max(0, Math.min(x, rect.width))
    setInteractiveScore(Math.round((x / rect.width) * 100))
  }

  const handleSetReminder = () => {
    if (!scheduleInfo.isSchedule || reminderSet) return
    const targetDate = scheduleInfo.day ? getNextDayDate(scheduleInfo.day) : new Date()
    saveReminder({
      text: scheduleInfo.reminderText,
      activity: scheduleInfo.activity,
      day: scheduleInfo.day,
      date: targetDate.toISOString(),
      source: 'trainer_message',
      trainerName: 'Trainer Aakash',
    })
    setReminderSet(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pl-1">
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">
            Hey, <span className="text-[#00FFAA]">{firstName}</span> 👋
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {todayName} • Let's move today
          </p>
        </div>
        <div className="w-11 h-11 rounded-full bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center">
          <span className="text-sm font-bold text-on-surface-variant">{initials}</span>
        </div>
      </header>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (Score & Stats) */}
        <div className="md:col-span-12 lg:col-span-7 space-y-5">
          {/* Consistency Card (Interactive wrapper) */}
          <div 
            className="cursor-ew-resize touch-pan-y relative"
            onPointerMove={(e) => { if (e.buttons === 1) handleDrag(e) }}
            onPointerDown={handleDrag}
          >
            <ConsistencyArc score={interactiveScore} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
              <div className="w-9 h-9 rounded-[10px] bg-[#2A1E1E] flex items-center justify-center mb-5">
                <span className="text-[17px]">🔥</span>
              </div>
              <h4 className="text-[11px] text-on-surface-variant font-medium mb-1">Current streak</h4>
              <div className="text-2xl font-headline font-bold text-[#FF9500] leading-none mb-1.5">6</div>
              <p className="text-[10px] text-on-surface-variant/70">days in a row</p>
            </div>
            
            <div className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-md">
              <div className="w-9 h-9 rounded-[10px] bg-[#231E2A] flex items-center justify-center mb-5">
                <span className="text-[17px]">📈</span>
              </div>
              <h4 className="text-[11px] text-on-surface-variant font-medium mb-1">This month</h4>
              <div className="text-2xl font-headline font-bold text-[#FF2D55] leading-none mb-1.5">14</div>
              <p className="text-[10px] text-on-surface-variant/70">sessions logged</p>
            </div>
          </div>
        </div>

        {/* Right Column (Weekly Tracker, Trainer, Quick Access) */}
        <div className="md:col-span-12 lg:col-span-5 space-y-5">
          {/* This Week */}
          <div className="bg-[#111316] rounded-2xl p-6 border border-outline-variant/5 shadow-md">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">This Week</h3>
              <div className="text-on-surface-variant text-[11px] font-medium">
                <span className="text-lg font-headline font-bold text-white mr-1.5">2</span>/ 3 sessions
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5">
                  <span className="text-[9px] text-on-surface-variant/70 font-semibold">{day}</span>
                  <div className={`w-8 h-8 rounded-[11px] flex items-center justify-center ${
                    i < 2 ? 'bg-[#00FFAA] shadow-[0_4px_12px_rgba(0,255,170,0.25)]' : 
                    i === 4 ? 'border-[1.5px] border-[#3A82F6]' : 
                    'bg-surface-container-highest border border-outline-variant/5'
                  }`}>
                    {i < 2 ? (
                      <span className="material-symbols-outlined text-[#06060B] text-sm font-bold" style={{fontVariationSettings: "'wght' 600"}}>check</span>
                    ) : i === 4 ? (
                      <div className="w-[5px] h-[5px] rounded-full bg-[#3A82F6]" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer Card */}
          <div className="bg-[#111316] rounded-2xl border border-outline-variant/5 shadow-md overflow-hidden">
            <div className="p-4 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#1A2633] text-[#3A82F6] font-bold font-headline flex items-center justify-center">
                  AK
                </div>
                <div className="absolute bottom-0.5 right-0.5 w-[10px] h-[10px] bg-[#00FFAA] border-2 border-[#111316] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white leading-none mb-1.5">Trainer Aakash</h4>
                <p className="text-[11px] text-on-surface-variant leading-tight truncate">
                  "{trainerMessage}"
                </p>
              </div>
              <button 
                onClick={() => navigate('/member/chat/trainer', { state: { trainerMessage, trainerName: 'Trainer Aakash' } })}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#00FFAA]/15 to-[#3A82F6]/15 border border-[#00FFAA]/25 hover:border-[#00FFAA]/50 hover:from-[#00FFAA]/25 hover:to-[#3A82F6]/25 transition-all px-4 py-2 rounded-xl text-[#00FFAA] text-xs font-bold shrink-0 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>reply</span>
                Reply
              </button>
            </div>

            {/* Schedule-detected Reminder Banner */}
            {scheduleInfo.isSchedule && (
              <div className="border-t border-outline-variant/10 px-4 py-3 bg-gradient-to-r from-[#FF9500]/5 to-[#FFE600]/5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FF9500]/15 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#FF9500] text-base" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#FF9500] font-bold uppercase tracking-widest">Schedule Detected</p>
                      <p className="text-[11px] text-on-surface-variant font-medium truncate">
                        {scheduleInfo.reminderText}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSetReminder}
                    disabled={reminderSet}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
                      reminderSet
                        ? 'bg-[#00FFAA]/15 text-[#00FFAA] border border-[#00FFAA]/25 cursor-default'
                        : 'bg-gradient-to-r from-[#FF9500]/20 to-[#FFE600]/20 border border-[#FF9500]/30 text-[#FFE600] hover:border-[#FF9500]/60 hover:from-[#FF9500]/30 hover:to-[#FFE600]/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
                      {reminderSet ? 'check_circle' : 'alarm_add'}
                    </span>
                    {reminderSet ? 'Reminder Set' : 'Remind Me'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Access List */}
          <div>
            <h3 className="text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-4 mt-6">Quick Access</h3>
            <div className="grid grid-cols-3 gap-3">
              <Link to="/member/progress" className="bg-[#111316] hover:bg-[#16191E] transition-colors rounded-xl p-4 border border-outline-variant/5 shadow-sm flex flex-col items-center justify-center gap-3 h-24">
                <div className="w-8 h-8 rounded-lg bg-[#24353B]/50 flex items-center justify-center drop-shadow-md">
                  <span className="text-[17px] text-current font-emoji">📊</span>
                </div>
                <span className="text-[9px] text-on-surface-variant font-medium text-center">My Progress</span>
              </Link>
              
              <Link to="/member/book-session" className="bg-[#111316] hover:bg-[#16191E] transition-colors rounded-xl p-4 border border-outline-variant/5 shadow-sm flex flex-col items-center justify-center gap-3 h-24">
                <div className="w-8 h-8 rounded-lg bg-[#2A3141]/50 flex items-center justify-center drop-shadow-md">
                  <span className="text-[17px] text-current font-emoji">🗓️</span>
                </div>
                <span className="text-[9px] text-on-surface-variant font-medium text-center">Book Session</span>
              </Link>
              
              <Link to="/member/achievements" className="bg-[#111316] hover:bg-[#16191E] transition-colors rounded-xl p-4 border border-outline-variant/5 shadow-sm flex flex-col items-center justify-center gap-3 h-24">
                <div className="w-8 h-8 rounded-lg bg-[#3C2E1F]/50 flex items-center justify-center drop-shadow-md">
                  <span className="text-[17px] text-current font-emoji">🏅</span>
                </div>
                <span className="text-[9px] text-on-surface-variant font-medium text-center">Milestones</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
