import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const reasons = [
  { id: 'unwell', icon: 'sick', label: 'Feeling Unwell', color: 'text-error' },
  { id: 'busy', icon: 'work', label: 'Too Busy Today', color: 'text-secondary' },
  { id: 'travel', icon: 'flight', label: 'Travelling', color: 'text-tertiary' },
  { id: 'sore', icon: 'healing', label: 'Too Sore / Recovery', color: 'text-primary-dim' },
  { id: 'personal', icon: 'person_off', label: 'Personal Reasons', color: 'text-on-surface-variant' },
  { id: 'other', icon: 'more_horiz', label: 'Other', color: 'text-on-surface-variant' },
]

export default function SkipSession() {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (selected) {
      setSubmitted(true)
      setTimeout(() => navigate('/member'), 2000)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>thumb_up</span>
        </div>
        <h2 className="font-headline text-2xl font-bold mb-2">Got It, Alex.</h2>
        <p className="text-on-surface-variant">No worries — rest smart, come back stronger. Your streak is safe for today.</p>
        <div className="mt-6 flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-sm">local_fire_department</span>
          <span className="text-sm font-bold">Streak protection activated</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="font-headline text-2xl font-bold mb-2">Skip Today's Session</h2>
        <p className="text-on-surface-variant">No judgment. Just pick a reason so we can adjust your plan.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reasons.map((reason) => (
          <button
            key={reason.id}
            onClick={() => setSelected(reason.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all active:scale-95 gap-3 ${
              selected === reason.id
                ? 'bg-surface-container-highest border-2 border-primary/30'
                : 'bg-surface-container border border-outline-variant/10 hover:bg-surface-container-highest'
            }`}
          >
            <span className={`material-symbols-outlined text-3xl ${reason.color}`} style={{fontVariationSettings: "'FILL' 1"}}>{reason.icon}</span>
            <span className="text-sm font-medium text-center">{reason.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-4 rounded-full font-headline font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
          selected
            ? 'bg-surface-container-highest text-on-surface border border-outline-variant/20'
            : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
        }`}
      >
        Log & Skip
        <span className="material-symbols-outlined">check</span>
      </button>

      <p className="text-xs text-on-surface-variant text-center">Your trainer will be notified. Recovery plan may be suggested if needed.</p>
    </div>
  )
}
