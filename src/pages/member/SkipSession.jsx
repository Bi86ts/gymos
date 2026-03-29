import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function SkipSession() {
  const navigate = useNavigate()
  const [selectedReason, setSelectedReason] = useState(null)

  const reasons = [
    { id: 'tired', icon: 'battery_1_bar', label: 'Too Tired / Sore' },
    { id: 'busy', icon: 'schedule', label: 'Schedule Conflict' },
    { id: 'sick', icon: 'sick', label: 'Illness / Injury' },
    { id: 'travel', icon: 'flight', label: 'Traveling' },
    { id: 'weather', icon: 'thunderstorm', label: 'Bad Weather' },
  ]

  const handleSkip = (reasonId = null) => {
    // API Call to register skip
    navigate('/member/recovery')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 max-w-lg mx-auto pb-16 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="text-center space-y-4 mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 blur-2xl -z-10">
          <span className="material-symbols-outlined text-[200px] text-error">close</span>
        </div>
        <span className="material-symbols-outlined text-6xl text-on-surface-variant font-light mb-2">event_busy</span>
        <h1 className="text-3xl font-black font-headline text-on-surface uppercase tracking-tight">Skipping Today?</h1>
        <p className="text-on-surface-variant text-sm px-4">Help us adjust your protocol by telling us why. Your trainer will be notified.</p>
      </div>

      <div className="space-y-3 mb-12">
        {reasons.map((r) => (
          <button
            key={r.id}
            onClick={() => { setSelectedReason(r.id); handleSkip(r.id) }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-95 ${
              selectedReason === r.id 
                ? 'border-error text-error bg-error/10' 
                : 'border-outline-variant/10 bg-surface-container hover:border-on-surface-variant/30 text-on-surface'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl">{r.icon}</span>
              <span className="font-bold text-sm tracking-wide">{r.label}</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => handleSkip()}
          className="w-full border-2 border-surface-container-highest bg-surface-container-low text-on-surface-variant py-4 rounded-full font-black text-xs tracking-[0.2em] active:scale-95 hover:bg-surface-container transition-all uppercase"
        >
          Skip Without Reason
        </button>
        <button
          onClick={() => navigate('/member')}
          className="w-full bg-primary text-on-primary-fixed py-4 rounded-full font-black text-xs tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all text-center uppercase"
        >
          Nevermind, I'm going
        </button>
      </div>
      
    </div>
  )
}
